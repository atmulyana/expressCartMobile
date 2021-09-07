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
    Image,
    //LogBox,
    SafeAreaView,
    StatusBar,
    Text,
    View,
} from 'react-native';

import { MenuProvider } from 'react-native-popup-menu';
import { addEventListener, removeEventListener } from 'react-native-localize';

import { NavigationContainer, StackActions, DrawerActions } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

import styles from './styles';
import { appHelpers, setLang } from './common';

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
        state = {
            cartTitle: 'Online Shop',
            headerBar: 'search',
        };

        constructor(props) {
            super(props);

            for (let m of ['setCartTitle', 'loadContent', 'replaceContent', 'isAtHome', 'goto', 'goHome', 'setHeaderBar',
                        'openCart', 'closeCart', 'setLang', 'login', 'logout'])
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
            navigation.navigate(route.name, {url: route.url});
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

        setLang(code) {
            setLang(code);
            this.forceUpdate();
            //appHelpers.refreshContent();
            navigation?.setParams({timestamp: new Date().getTime()}); //to refresh content without reloading data (timestamp param is not used)
        }

        onLangChange = () => {
            this.setLang();
        }

        login() {
            appHelpers.isLoggedIn = true;
            this.forceUpdate();
        }

        logout() {
            appHelpers.isLoggedIn = false;
            this.forceUpdate();
        }

        componentDidMount() {
            addEventListener('change', this.onLangChange);
        }

        componentWillUnmount() {
            removeEventListener('change', this.onLangChange);
        }

        render() {
            return (
                <SafeAreaView style={{flex:1}}>
                    <HeaderBar name={this.state.headerBar} />
                    
                    <Stack.Navigator initialRouteName={Contents.default} screenOptions={{
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
                </SafeAreaView>
            );
        }
    }

    return <MenuProvider>
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
    </MenuProvider>;
};
