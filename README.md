# expressCartMobile

It's a mobile app for shopping cart which is developed using React Native.

#### Brief guide how to run this project

1. Download and install the server application (a web app) from [here](https://github.com/atmulyana/expressCart).
   Follow the [documentation](https://github.com/mrvautin/expressCart/wiki) for installation.

2. You should have set up the React Native development environment as described [here](https://reactnative.dev/docs/environment-setup).
   Follow "React Native CLI Quickstart".

3. Download/clone this project.

4. Edit common.js file in this project. Find the line

        const SERVER = 'http://192.168.56.1:1111';
   
   This is the root URL of the web application you just installed in step 1. Change the IP/Host to the one of your own. Don't use
   `localhost` for it because `localhost` means the web application runs on device (HP) emulator. Use one of your LAN/WAP IPs.

5. Install the required modules for this project   

   5.1. For Android        
        Open command console and go to the directory where yo downloaded this project in step 3. Under this directory, type the command

        npm install
        npm audit fix
    
   5.2. For iOS     
        I have not tested it yet on iOS. So, to avoid misdirection, I won't write this step here. You can find it easily out there.

6. Ready to run project    

   6.1. For Android     
        Under the project directory, type the command

        npx react-native run-android

   6.2. For iOS   
        I have not tested it yet but if everything ok, similar to Android, type the command

        npx react-native run-ios
