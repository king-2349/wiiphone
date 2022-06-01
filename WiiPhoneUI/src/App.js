import React, { useEffect, useState } from "react";
import ControllerButton from "./ControllerButton";
import "./style.css";

export default function App() {
    const [motionEvent, setMotionEvent] = useState({
        acceleration: { x: 0, y: 0, z: 0 },
        rotation: { alpha: 0, beta: 0, gamma: 0 }
    });
    const [controllerData, setControllerData] = useState({
        timestamp: Date.now(),
        Recenter: 0,
        A: 0,
        B: 0,
        One: 0,
        Two: 0,
        Minus: 0,
        Plus: 0,
        Home: 0,
        Up: 0,
        Down: 0,
        Left: 0,
        Right: 0,
        acceleration: { x: 0, y: 0, z: 0 },
        rotation: { alpha: 0, beta: 0, gamma: 0 }
    });
    const [connected, setConnected] = useState(false);
    const [webSocket, setWebSocket] = useState(null);
    const [motionEnabled, setMotionEnabled] = useState(false);
    const [controllerId, setControllerId] = useState("N/A");
    const motionWeight = 1;
    const rotationWeight = 1;

    const askForPermission = () => {
        if (DeviceMotionEvent != null) {
            const permission = DeviceMotionEvent.requestPermission != null && typeof DeviceMotionEvent.requestPermission === "function" ?
                DeviceMotionEvent.requestPermission() :
                new Promise(res => res("granted"));
            permission.then(permissionState => {
                if (permissionState === "granted") {
                    setMotionEnabled(true);
                    window.addEventListener("devicemotion", event => {
                        setMotionEvent((currentMotionEvent) => {
                            return {
                                acceleration: { 
                                    x: ((1 - motionWeight) * currentMotionEvent.acceleration.x + motionWeight * event.accelerationIncludingGravity.x) / 9.8, 
                                    y: ((1 - motionWeight) * currentMotionEvent.acceleration.z + motionWeight * event.accelerationIncludingGravity.z) / 9.8, 
                                    z: -((1 - motionWeight) * currentMotionEvent.acceleration.y + motionWeight * event.accelerationIncludingGravity.y) / 9.8
                                },
                                rotation: {
                                    alpha: ((1-rotationWeight) * currentMotionEvent.rotation.alpha + rotationWeight * event.rotationRate.alpha),
                                    beta: -((1-rotationWeight) * currentMotionEvent.rotation.gamma + rotationWeight * event.rotationRate.gamma),
                                    gamma: ((1-rotationWeight) * currentMotionEvent.rotation.beta + rotationWeight * event.rotationRate.beta)
                                }
                            }
                        });
                    })
                }
            });
        }
    }

    useEffect(() => {
        document.body.style.overflow = "hidden";

        const bar = window.location.href;
        const wsAddress = `wss://${bar.match(/^https?:\/\/([^:]+).+$/)[1]}:1338`;
        const newWebSocket = new WebSocket(wsAddress);
        setWebSocket(newWebSocket);
        newWebSocket.onopen = function (ws_evnt) {
            setConnected(true);
        }
        newWebSocket.onmessage = function (ws_evnt) {
            setControllerId(ws_evnt.data);
        }
    }, [])

    useEffect(() => {
        setControllerData((currentControllerData) => {
            currentControllerData.timestamp = Date.now();
            currentControllerData.acceleration = motionEvent.acceleration;
            currentControllerData.rotation = motionEvent.rotation;
            if (connected) {
                webSocket.send(JSON.stringify(currentControllerData));
            }
            return { ...currentControllerData }
        });
    }, [motionEvent, webSocket, connected])

    const setButtonData = (key, value) => {
        controllerData[key] = value;
        setControllerData({ ...controllerData });
    }

    return (
        <div className="App">
            <div className="infoWrapper">
                <div>Connected: {connected.toString()}, Motion Enabled: {motionEnabled.toString()}</div>
                <div>Controller Slot: {controllerId.toString()}</div>
                <button onClick={askForPermission}>Give Motion Control Permission</button>
            </div>
            <div className="controllerWrapper">
                <div className="controllerRowWrapper">
                    <ControllerButton buttonDisplay="Center" pressed={controllerData.Recenter === 1} buttonPressed={() => { setButtonData("Recenter", 1) }} buttonReleased={() => { setButtonData("Recenter", 0) }} />
                </div>
                <div className="controllerRowWrapper">
                    <ControllerButton buttonDisplay="^" pressed={controllerData.Up === 1} buttonPressed={() => { setButtonData("Up", 1) }} buttonReleased={() => { setButtonData("Up", 0) }} />
                </div>
                <div className="controllerRowWrapper">
                    <ControllerButton buttonDisplay="<" pressed={controllerData.Left === 1} buttonPressed={() => { setButtonData("Left", 1) }} buttonReleased={() => { setButtonData("Left", 0) }} />
                    <ControllerButton buttonDisplay=">" pressed={controllerData.Right === 1} buttonPressed={() => { setButtonData("Right", 1) }} buttonReleased={() => { setButtonData("Right", 0) }} />
                </div>
                <div className="controllerRowWrapper">
                    <ControllerButton buttonDisplay="v" pressed={controllerData.Down === 1} buttonPressed={() => { setButtonData("Down", 1) }} buttonReleased={() => { setButtonData("Down", 0) }} />
                </div>
                <div className="controllerRowWrapper">
                    <ControllerButton round buttonDisplay="A" pressed={controllerData.A === 1} buttonPressed={() => { setButtonData("A", 1) }} buttonReleased={() => { setButtonData("A", 0) }} />
                    <ControllerButton buttonDisplay="B" pressed={controllerData.B === 1} buttonPressed={() => { setButtonData("B", 1) }} buttonReleased={() => { setButtonData("B", 0) }} />
                </div>
                <div className="controllerRowWrapper">
                    <ControllerButton round buttonDisplay="-" pressed={controllerData.Minus === 1} buttonPressed={() => { setButtonData("Minus", 1) }} buttonReleased={() => { setButtonData("Minus", 0) }} />
                    <ControllerButton round buttonDisplay="Home" pressed={controllerData.Home === 1} buttonPressed={() => { setButtonData("Home", 1) }} buttonReleased={() => { setButtonData("Home", 0) }} />
                    <ControllerButton round buttonDisplay="+" pressed={controllerData.Plus === 1} buttonPressed={() => { setButtonData("Plus", 1) }} buttonReleased={() => { setButtonData("Plus", 0) }} />
                </div>
                <div className="controllerRowWrapper">
                    <ControllerButton round buttonDisplay="1" pressed={controllerData.One === 1} buttonPressed={() => { setButtonData("One", 1) }} buttonReleased={() => { setButtonData("One", 0) }} />
                </div>
                <div className="controllerRowWrapper">
                    <ControllerButton round buttonDisplay="2" pressed={controllerData.Two === 1} buttonPressed={() => { setButtonData("Two", 1) }} buttonReleased={() => { setButtonData("Two", 0) }} />
                </div>
            </div>
        </div>
    );
}
