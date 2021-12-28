/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import {
    Dimensions,
    Image,
    //LogBox,
    Platform,
    StatusBar,
    Text,
    View,
} from 'react-native';
import {SafeAreaInsetsContext, SafeAreaProvider} from 'react-native-safe-area-context';

import { MenuProvider } from 'react-native-popup-menu';
import EncryptedStorage from 'react-native-encrypted-storage';

import { NavigationContainer, StackActions, DrawerActions } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

import styles from './styles';
import { appHelpers, lang, noop } from './common';
//import lang from './lang';

import * as Contents from './contents';
import routes from './contents/routes';
import {SideBarCart} from './contents/partials/Cart';
import HeaderBar from './components/HeaderBar';

const routeNames = Object.keys(Contents).filter(name => name != 'default');

/*** We do really need VirtualizedList (FlatList) inside ScrollView */
//LogBox.ignoreLogs(['VirtualizedLists should never be nested']); //NOT working
const _logError = console.error.bind(console);
console.error = (message, ...optinalParams) => {
    if (typeof(message) == 'string' && message.startsWith('VirtualizedLists should never be nested')) return; 
    _logError(message, ...optinalParams);
};

export default function() {
    let navigation = null;
    let cart = null;

    class App extends React.Component {
        #removeDimensionListener;
        #refreshTimer = null;
        state = {
            cartTitle: 'Online Shop',
            headerBar: 'search',
        };

        constructor(props) {
            super(props);

            for (let m of ['setCartTitle', 'loadContent', 'replaceContent', 'isAtHome', 'goto', 'goHome', 'setHeaderBar',
                        'openCart', 'closeCart', 'setLang', 'login', 'logout', 'relogin'])
            {
                this[m] = this[m].bind(this);
                appHelpers[m] = this[m];
            }
        }

        setCartTitle(title) {
            this.setState({cartTitle: title});
        }

        isOnRoute(route) {
            const currentRoute = navigation?.getCurrentRoute();
            let header1 = currentRoute?.params?.headerBar, header2 = route?.headerBar;
            if (header1 === undefined) header1 = routes.home.headerBar;
            if (header2 === undefined) header2 = routes.home.headerBar;
            return currentRoute?.name == route?.name
                && currentRoute?.params?.url == route?.url
                && header1 == header2;
        }

        loadContent(name, url, headerBar = 'search', isReplace = false) {
            var data;
            if (typeof(name) == 'object')
                var {name, url, headerBar = 'search', data} = name;

            if (navigation) {
                if (this.isOnRoute({name, url, headerBar}))
                    appHelpers.refreshContent();
                else {
                    let params = {headerBar, data};
                    if (url) params.url = url;
                    navigation.dispatch(StackActions[isReplace ? 'replace' : 'push'](name, params));
                    this.setHeaderBar(headerBar);
                }
            }
        }

        replaceContent(name, url, headerBar = 'search') {
            this.loadContent(name, url, headerBar, true);
        }

        isAtHome() {
            return this.isOnRoute(routes.home);
        }

        goto(route) {
            navigation.navigate(route.name, {url: route.url ?? route.$url});
        }

        goHome() {
            //this.loadContent(routes.home);
            this.goto(routes.home);
        }

        setHeaderBar(headerBar = 'search') {
            this.setState({headerBar});
        }

        openCart() {
            navigation?.dispatch(DrawerActions.openDrawer());
            cart?.loadData();
        }

        closeCart() {
            navigation?.dispatch(DrawerActions.closeDrawer());
        }

        forceUpdateContent() {
            //appHelpers.refreshContent();
            navigation?.setParams({timestamp: new Date().getTime()}); //to refresh content without reloading data (timestamp param is not used)
        }

        setLang(code) {
            lang.set(code).then(() => {
                this.forceUpdate();
                this.forceUpdateContent();
            });
        }

        onLangChange = () => {
            this.setLang();
        }

        login(email, password) {
            if (email && password) {
                EncryptedStorage.setItem("email", email).catch(noop); //Ignores errors
                EncryptedStorage.setItem("password", password).catch(noop); //Ignores errors
            }
            appHelpers.isLoggedIn = true;
            this.forceUpdate();
        }

        logout(isLoginCleared = true) {
            if (isLoginCleared) {
                EncryptedStorage.removeItem("email").catch(noop); //Ignores errors
                EncryptedStorage.removeItem("password").catch(noop); //Ignores errors
            }
            appHelpers.isLoggedIn = false;
            this.forceUpdate();
        }

        async relogin(data) {
            if (!(data instanceof Object)) data = {};
            try {
                let loginEmail = await EncryptedStorage.getItem('email'),
                    loginPassword = await EncryptedStorage.getItem('password');
                if (loginEmail && loginPassword) {
                    let response = await appHelpers.submitData(
                        '/customer/login_action',
                        {loginEmail, loginPassword},
                        undefined,
                        lang('Relogin')
                    );
                    this.login();
                    data.session = response.session;
                    return true;
                }
            }
            catch {
            }

            this.logout(false); //don't clear the saved login data because we can try to relogin later
            return false;
        }

        componentDidMount() {
            this.setLang();
            lang.addChangeListeners(this.onLangChange);
            
            this.#removeDimensionListener = Dimensions.addEventListener('change', //specially for rotating event. Some contents need to reposition/resize because they depend to window width
                () => {
                    //use setTimeout to give time for SafeAreaInsetsContext to update all four side insets
                    if (this.#refreshTimer !== null) clearTimeout(this.#refreshTimer);
                    this.#refreshTimer = setTimeout(
                        () => {
                            this.#refreshTimer = null;
                            this.forceUpdateContent();
                        },
                        100
                    )
                }
            );
        }

        componentWillUnmount() {
            lang.removeChangeListeners(this.onLangChange);
            typeof(this.#removeDimensionListener) == 'function' && this.#removeDimensionListener();
            this.#removeDimensionListener = null;
        }

        render() {
            return (
                <>
                    <HeaderBar name={this.state.headerBar} />
                    
                    <Stack.Navigator initialRouteName={Contents.default} screenOptions={{
                        animationEnabled: Platform.OS == 'android', //On iOS, animation keeps issueing warning log
                        headerBackTitleVisible: false,
                        headerStatusBarHeight: 0,
                        headerStyle: styles.navHeader,
                        headerTitleAlign: 'center',
                        headerTitleStyle: styles.navHeaderTitle,
                        title: '',
                    }}>
                        {routeNames.map((name, idx) =>
                            <Stack.Screen
                                key={idx}
                                name={name}
                                component={Contents[name]}
                                getId={({params}) => params.url ?? params.$url}
                                initialParams={Contents[name].defaultParams}
                            />
                        )}
                    </Stack.Navigator>

                    <View style={styles.stickyBar}>
                        <Text style={styles.cartTitle}>{this.state.cartTitle}</Text>
                        <View style={styles.appName}>
                            <Image source={require('./images/logo.png')} style={styles.appNameLogo} />
                            <Text style={styles.appNameText}>Mobile</Text>
                        </View>
                    </View>
                </>
            );
        }
    }

    return <SafeAreaProvider><SafeAreaInsetsContext.Consumer>
    {insets => {
        appHelpers.winInsets = insets;
        return <View
            style={{
                flex: 1,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
                paddingTop: insets.top,
            }}
        >
            <MenuProvider>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                <NavigationContainer ref={nav => navigation = nav}>
                    <Drawer.Navigator
                        drawerContent={() => <SideBarCart ref={elm => cart = elm} />}
                        screenOptions={{
                            drawerPosition: 'right',
                            drawerStyle: {
                                backgroundColor: 'white',
                                width: '100%',
                            },
                            drawerType: 'front',
                            headerShown: false,
                            title: ''
                        }}
                    >
                        <Drawer.Screen name="root" component={App}
                            options={{swipeEnabled: false}}
                            // listeners={{
                            //     drawerOpen: () => {
                            //         cart?.loadData();
                            //     },
                            // }}
                        />
                    </Drawer.Navigator>
                </NavigationContainer>
            </MenuProvider>
        </View>;
    }}
    </SafeAreaInsetsContext.Consumer></SafeAreaProvider>;
};
