# expressCartMobile

It's a mobile app for shopping cart which is developed using React Native.

#### Brief guide how to run this project

1. Download and install the server application (a web app) from [here](https://github.com/atmulyana/expressCart).
   Follow the [documentation](https://github.com/mrvautin/expressCart/wiki) for installation.

2. You should have set up the React Native development environment as described [here](https://reactnative.dev/docs/environment-setup).
   Follow "React Native CLI Quickstart".   
   NOTE for android: I use jdk14 to run this project. I found error when tried to use jdk17 (the last version at that time).

3. Download/clone this project.

4. Edit common.js file in this project. Find the line

        const SERVER = 'http://192.168.56.1:1111';
   
   This is the root URL of the web application you just installed in step 1. Change the IP/Host to the one of your own. Don't use
   `localhost` for it because `localhost` means the web application runs on device (HP) emulator. Use one of your LAN/WAN IPs.

5. Install the required modules for this project   
   Open Terminal/Command console then make the project directory is the active directory of the console

        cd <path_to_project_directory>

   Then execute

        npm install

   For iOS, the above command must be followed by

        cd ios && pod install && cd ..

6. Ready to run project    
   Start Metro server by issueing command

        npx react-native start

   Open another Terminal/Command console and go to the project directory too as the before one. At new console, type
   the following command

   6.1. For Android     

        npx react-native run-android

   6.2. For iOS   

        npx react-native run-ios
