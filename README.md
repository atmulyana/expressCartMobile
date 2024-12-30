# expressCartMobile

It's a mobile app for shopping cart which is developed using React Native.

#### Brief guide how to run this project

1. Download and install the server application (a web app) from [here](https://github.com/atmulyana/expressCart).
   Follow the [documentation](https://github.com/mrvautin/expressCart/wiki) for installation.  
    
   It's better to set session has no expiration. It's because the cart content is saved in the session storage. So, if the session expires
   then what have been chosen to buy will be gone. Therefore, the payment must be made before the session ends. In some situations, it's
   not comfortable for users.  

   But the question is what happens if the session has no expiration. If we open the application via browser, the session will end when
   the browser is closed. If we use the mobile app, the session will never expire. You decide whether it's acceptable or not for you.  

   To make the session without expiration, open `app.js` file at the root of project, then go to about line 380, you'll find the block of code

        app.use(session({
            resave: true,
            saveUninitialized: true,
            secret: config.secretSession,
            cookie: {
                path: '/',
                httpOnly: true,
                maxAge: 900000
            },
            store: store
        }));

   Change the value of `maxAge` to `null`.

2. You should have set up the React Native development environment as described [here](https://reactnative.dev/docs/set-up-your-environment).
   Follow "React Native CLI Quickstart".    
   Note for Android: you should install SDK (compile) and NDK version written in `android/build.gradle` and also install CMake version 3.22.1

3. Download/clone this project.

4. Edit `common/server.js` file. Find the line

        const SERVER = 'http://192.168.56.1:1111';
   
   This is the root URL of the web application you just installed in step 1. Change the IP/Host to the one of your own. Don't use
   `localhost` for it because `localhost` means the web application runs on device (HP) emulator. Use one of your LAN/WAN IPs.

5. Install the required modules for this project   
   Open Terminal/Command console then make the project directory is the active directory of the console

        cd <path_to_project_directory>

   Then execute

        npm install

   For iOS, if not yet, you may need to install a [Ruby Version Manager](https://reactnative.dev/docs/environment-setup#ruby) and
   update the Ruby version. After `npm install`, execute the following command

        cd ios
        bundle install
        bundle exec pod install
        cd ..

6. Ready to run project    
   Start Metro server by issueing command

        npx react-native start

   Open another Terminal/Command console and go to the project directory too as the before one. At new console, type
   the following command

   6.1. For Android     

        npx react-native run-android

   6.2. For iOS   

        npx react-native run-ios

     If you fail to run the app for iOS, please try rebuilding with XCode by opening **ios/expressCartMobile.xcworkspace**.
     After succeeding building, (you may close XCode and) please try to re-execute `npx react-native run-ios`