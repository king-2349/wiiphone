# Wii Phone
This app allows you to use your phone as a wii remote on Dolphin. This includes all the buttons of a normal wii remote and motions controls (including motion plus).
I have tested this on wii sports and mario kart wii with and iPhone, and it seems to work correctly. You should be able to connect up to 4 controllers through this service.

![wiiphonescreenshot](https://user-images.githubusercontent.com/38045031/171536497-67937fbd-ddcb-4d9e-aa70-b06466f69abb.jpg)

## Server Setup Instructions
1. Install node (https://nodejs.org/en/download/)
2. Download the repository and extract the zip file to wherever you want (https://github.com/king-2349/wiiphone/archive/refs/heads/main.zip)
3. Once node is installed, open a command prompt in the folder you extracted the project to and run "npm install"
4. Once npm install is done, run the command "npm run start" to start the server
5. You can then go to https://{Your computer's local ip address}:3000 (The server should tell you what address to use) on your phone to open the wii remote ui. You will see a warning since the https certificate is self signed. Your browser will allow you to bypass this (Ex. For chrome, click on Advanced -> Proceed to {Your computer's local ip address})
6. Press the "Give Motion Control Permission" button to get motion controls to work (At this moment you actually need to give permission for any of it to work. I will post a fix for this later in case someone wants to use it just for the buttons). The UI will say "Motion Enabled: true" when the motion controls are working
6. If everything is working correctly the command prompt should say a remote has been connected and the ui will say "Connected: true" (u/NightWingMistHawk discovered that you may need to allow Node connections in your firewall settings in order to connect from your phone)

## Dolphin Setup Instructions
1. Open Dolphin and go to the controller settings. Make sure emulate the wii's bluetooth adapter is checked
2. Set any wii remote slot you are going to use with the app to "Emulated Wii Remote" and click Configure
3. Set the Extension to "None" on the General and Options tab since this app does not support extensions like a Nunchuck
3. Go to the Motion Input tab and open Alternate Input Sources. Check "Enable" and click Add
4. The IP Address will be 127.0.0.1 and the port will be 26760. You can set the description to whatever you want
5. If this server is running and there is a connected "wii remote" you should see a DSUClient/{SlotNumber}/{InputSourceDescription} in the device drop down
6. Select the DSUClient whose SlotNumber corresponds to the Controller Slot on the UI
7. You should now be able to set the buttons by clicking the button you want to set on Dolphin and tapping a button on the UI on your phone (The button names on the UI will not match to the same name on Dolphin. Behind the scenes, each button on the UI is mapped to a Playstation controller button. Also the "Center" button on the ui is an extra button that can be used for the Recenter action on the Motion Input tab)

## Credit
I used this project as a reference when creating this one: https://github.com/hjmmc/WebGyroForCemuhook