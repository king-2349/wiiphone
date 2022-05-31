# Wii Phone
This app allows you to use your phone as a wii remote on Dolphin. This includes all the buttons of a normal wii remote and motions controls.
I have tested this on wii sports and mario kart wii, and it seems to work correctly. 

## Server Setup Instructions
1. Install node
2. Download the repository and extract the zip file to wherever you want (Click the Code button and "Download ZIP" on the repo page)
3. Once node is installed, open a command prompt in the folder you extracted the project to and run "npm install"
4. Once npm install is done, run the command "npm run start" to start the server
5. You can then go to https://10.0.0.141:3000 on your phone to open the wii remote ui. You will see a warning since the https certificate is self signed. Your browser will allow you to bypass this (Ex. For chrome, click on Advanced -> Proceed to 10.0.0.141)
6. Press the "Give Motion Control Permission" button to get motion controls to work. The UI will say "Motion Enabled: true" when the motion controls are working
6. If everything is working correctly the command prompt should say a remote has been connected and the ui will say "Connected: true"

## Dolphin Setup Instructions
1. Open Dolphin and go to the controller settings. Make sure emulate the wii's bluetooth adapter is checked
2. Set any wii remote slot you are going to use with the app to "Emulated Wii Remote" and click Configure
3. Set the Extension to "None" on the General and Options tab since this app does not support extensions like a Nunchuck
3. Go to the Motion Input tab and open Alternate Input Sources. Check "Enable" and click Add
4. The IP Address will be 127.0.0.1 and the port will be 26760. You can set the description to whatever you want
5. If this server is running and there is a connected "wii remote" you should see a DSUClient/{SlotNumber}/{InputSourceDescription} in the device drop down
6. Select the DSUClient whose SlotNumber corresponds to the Controller Slot on the UI
7. You should now be able to set the buttons by clicking the button you want to set on Dolphin and tapping a button on the UI on your phone (The button names on the UI will not match to the same name on Dolphin. Behind the scenes, each button on the UI is mapped to a Playstation controller button)
