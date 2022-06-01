import https from "https";
import fs from "fs";
import { WebSocketServer } from "ws";
import dgram from "dgram";
import crc from "crc";
import os from "os";

//https://v1993.github.io/cemuhook-protocol/

const serverID = 0 + Math.floor(Math.random() * 4294967295);
console.log(`Server Started`);

const interfaces = os.networkInterfaces();
let localIPAddress = "Unknown.Sorry";
for(let interfaceType in interfaces) {
    interfaces[interfaceType].forEach(address => {
        if(address.family === "IPv4" && address.address !== "127.0.0.1") {
            localIPAddress = address.address;
        }
    })
}
console.log(`Go to https://${localIPAddress}:3000 to access the Wiimote UI`);

let packetNumber = 0;

const connectionData = {};
const availableControllerIds = [0x00,0x01,0x02,0x03];

const maxProtocolVer = 1001;
const MessageType = {
    DSUC_VersionReq: 0x100000,
    DSUS_VersionRsp: 0x100000,
    DSUC_ListPorts: 0x100001,
    DSUS_PortInfo: 0x100001,
    DSUC_PadDataReq: 0x100002,
    DSUS_PadDataRsp: 0x100002
}

function BeginPacket(data) {
    let index = 0;
    data[index++] = 'D'.charCodeAt(0);
    data[index++] = 'S'.charCodeAt(0);
    data[index++] = 'U'.charCodeAt(0);
    data[index++] = 'S'.charCodeAt(0);

    data.writeUInt16LE(maxProtocolVer, index, true);
    index += 2;

    data.writeUInt16LE(data.length - 16, index, true);
    index += 2;

    data.writeUInt32LE(0, index, true);
    index += 4;

    data.writeUInt32LE(serverID, index, true);
    index += 4;

    return index;
}

function FinishPacket(data) {
    data.writeUInt32LE(crc.crc32(data), 8, true);
}

function SendPacket(data, client) {
    let buffer = Buffer.alloc(data.length + 16);
    let index = BeginPacket(buffer);
    buffer.fill(data, index);
    FinishPacket(buffer);
    udpServer.send(buffer, client.port, client.address, (error, bytes) => {
        if (error) {
            console.log("Send packet error");
            console.log(error.message);
        }
        else if (bytes !== buffer.length) {
            console.log(`failed to completely send all of buffer. Sent: ${bytes}. Buffer length: ${buffer.length}`);
        }
    });
}

const udpServer = dgram.createSocket("udp4");

udpServer.on("error", (error) => {
    console.log("UDP Server Error:\n" + error.stack);
});

udpServer.on("message", (data, rinfo) => {
    if (!(data[0] === 'D'.charCodeAt(0) && data[1] === 'S'.charCodeAt(0) && data[2] === 'U'.charCodeAt(0) && data[3] === 'C'.charCodeAt(0))) return;
    let index = 4;

    let protocolVer = data.readUInt16LE(index); index += 2;
    let packetSize = data.readUInt16LE(index); index += 2;

    let receivedCrc = data.readUInt32LE(index);
    data[index++] = 0; data[index++] = 0;
    data[index++] = 0; data[index++] = 0;

    let computedCrc = crc.crc32(data);

    let clientId = data.readUInt32LE(index); index += 4;
    let msgType = data.readUInt32LE(index); index += 4;

    if (msgType == MessageType.DSUC_ListPorts) {
        let numOfPadRequests = data.readInt32LE(index); index += 4;
        for (let i = 0; i < numOfPadRequests; i++) {
            let requestIndex = data[index + i];
            if (availableControllerIds.includes(requestIndex)) continue;
            let outBuffer = Buffer.alloc(16);
            outBuffer.writeUInt32LE(MessageType.DSUS_PortInfo, 0, true);
            let outIndex = 4;
            outBuffer[outIndex++] = requestIndex; // pad id
            outBuffer[outIndex++] = 0x02; // state (connected)
            outBuffer[outIndex++] = 0x02; // model (generic)
            outBuffer[outIndex++] = 0x01; // connection type (usb)
            for (let j = 0; j < 5; j++) {
                outBuffer[outIndex++] = 0;
            } outBuffer[outIndex++] = 0x00; // 00:00:00:00:00:00
            outBuffer[outIndex++] = 0xEF; // battery (charged)
            SendPacket(outBuffer,rinfo);
        }
    } else if (msgType == MessageType.DSUC_PadDataReq) {
        index++;
        connectionData[data[index]] = rinfo;
    }
});

udpServer.bind(26760);


const options = {
    key: fs.readFileSync("./cert/key.pem"),
    cert: fs.readFileSync("./cert/cert.pem")
}

const wsServer = https.createServer(options).listen(1338);
const wss = new WebSocketServer({ server: wsServer });

const reportControllerData = (controllerData, controllerId) => {
    if(connectionData[controllerId] == null) return;

    let outBuffer = Buffer.alloc(84);
    let outIndex = 0;
    outBuffer.writeUInt32LE(MessageType.DSUS_PadDataRsp, outIndex, true);
    outIndex += 4;

    outBuffer[outIndex++] = controllerId; // pad id
    outBuffer[outIndex++] = 0x02; // state (connected)
    outBuffer[outIndex++] = 0x02; // model (generic)
    outBuffer[outIndex++] = 0x01; // connection type (usb)

    // mac address
    for (let i = 0; i < 5; i++) {
        outBuffer[outIndex++] = 0x00;
    } outBuffer[outIndex++] = 0x00; // 00:00:00:00:00:FF

    outBuffer[outIndex++] = 0xEF; // battery (charged)
    outBuffer[outIndex++] = 0x01; // is active (true)

    outBuffer.writeUInt32LE(packetNumber++, outIndex, true);
    outIndex += 4;

    const button1Mask = 
        (controllerData.Left !== 0 ? 0x01 : 0x00) << 7 |
        (controllerData.Down !== 0 ? 0x01 : 0x00) << 6 |
        (controllerData.Right !== 0 ? 0x01 : 0x00) << 5 |
        (controllerData.Up !== 0 ? 0x01 : 0x00) << 4 |
        (controllerData.Plus !== 0 ? 0x01 : 0x00) << 3 |
        (controllerData.Minus !== 0 ? 0x01 : 0x00);

    const button2Mask =
        (controllerData.One !== 0 ? 0x01 : 0x00) << 7 |
        (controllerData.Two !== 0 ? 0x01 : 0x00) << 6 |
        (controllerData.A !== 0 ? 0x01 : 0x00) << 5 |
        (controllerData.B !== 0 ? 0x01 : 0x00) << 4;

    outBuffer.writeUInt8(button1Mask, outIndex);
    outBuffer.writeUInt8(button2Mask, ++outIndex);
    outBuffer[++outIndex] = controllerData.Home !== 0 ? 0x01 : 0x00; // PS
    outBuffer[++outIndex] = 0x00; // Touch

    outBuffer[++outIndex] = 0x80; // position left x
    outBuffer[++outIndex] = 0x80; // position left y
    outBuffer[++outIndex] = 0x80; // position right x
    outBuffer[++outIndex] = 0x80; // position right y

    outBuffer[++outIndex] = controllerData.Left !== 0 ? 0xFF : 0x00; // dpad left
    outBuffer[++outIndex] = controllerData.Down !== 0 ? 0xFF : 0x00; // dpad down
    outBuffer[++outIndex] = controllerData.Right !== 0 ? 0xFF : 0x00; // dpad right
    outBuffer[++outIndex] = controllerData.Up !== 0 ? 0xFF : 0x00; // dpad up

    outBuffer[++outIndex] = controllerData.B !== 0 ? 0xFF : 0x00; // square
    outBuffer[++outIndex] = controllerData.A !== 0 ? 0xFF : 0x00; //cross
    outBuffer[++outIndex] = controllerData.Two !== 0 ? 0xFF : 0x00; // circle
    outBuffer[++outIndex] = controllerData.One !== 0 ? 0xFF : 0x00; // triange

    outBuffer[++outIndex] = controllerData.Recenter !== 0 ? 0xFF : 0x00; // r1
    outBuffer[++outIndex] = 0x00; // l1

    outBuffer[++outIndex] = 0x00; // r2
    outBuffer[++outIndex] = 0x00; // l2

    outIndex++;

    outBuffer[outIndex++] = 0x00; // track pad first is active (false)
    outBuffer[outIndex++] = 0x00; // track pad first id
    outBuffer.writeUInt16LE(0x0000, outIndex, true); // trackpad first x
    outIndex += 2;
    outBuffer.writeUInt16LE(0x0000, outIndex, true); // trackpad first y
    outIndex += 2;

    outBuffer[outIndex++] = 0x00; // track pad second is active (false)
    outBuffer[outIndex++] = 0x00; // track pad second id
    outBuffer.writeUInt16LE(0x0000, outIndex, true); // trackpad second x
    outIndex += 2;
    outBuffer.writeUInt16LE(0x0000, outIndex, true); // trackpad second y
    outIndex += 2;

    const timestamp = BigInt(controllerData.timestamp);
    outBuffer.writeBigUInt64LE(timestamp, outIndex, true);
    outIndex += 8;

    outBuffer.writeFloatLE(controllerData.acceleration.x, 
        outIndex, true);
    outIndex += 4;
    outBuffer.writeFloatLE(controllerData.acceleration.y, 
        outIndex, true);
    outIndex += 4;
    outBuffer.writeFloatLE(controllerData.acceleration.z,
         outIndex, true);
    outIndex += 4;

    outBuffer.writeFloatLE(controllerData.rotation.alpha, outIndex, true);
    outIndex += 4;
    outBuffer.writeFloatLE(controllerData.rotation.beta, outIndex, true);
    outIndex += 4;
    outBuffer.writeFloatLE(controllerData.rotation.gamma, outIndex, true);
    outIndex += 4;

    SendPacket(outBuffer, connectionData[controllerId]);
}

wss.on("connection", function connection(ws) {
    if(availableControllerIds.length === 0) {
        console.log("4 Wiimotes already connected");
        return;
    }
    const controllerId = availableControllerIds.shift();
    console.log(`Wiimote ${controllerId}: Connected`);
    ws.send(controllerId);
    ws.on("message", function incoming(message) {
        const data = JSON.parse(message);
        reportControllerData(data,controllerId);
    });
    ws.on("error", () => {
        console.log(`Wiimote ${controllerId}: ERROR`);
    });
    ws.on("close", () => {
        availableControllerIds.push(controllerId);
        availableControllerIds.sort();
        console.log(`Wiimote ${controllerId}: Disconnected`);
    });
});



const websiteServer = https.createServer(options).listen(3000);
websiteServer.on("request", (req, res) => {
    const url = req.url;
    var filePath = `./WiiPhoneUI/build${url === "/" ? "/index.html" : url}`;
    var stats = fs.statSync(filePath);

    res.writeHead(200, {
        "Content-Length": stats.size
    });

    var readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
});