/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { Notification } from '@/components';
import { SideCart } from '@/components/partials/Cart';
import { useColors, useIsDarkMode, useMount } from '@/hooks';
import { FormProvider } from '@/hooks/contexts/form';
import { setInsets, watchDimensionChange } from '@/hooks/dimension';
import { watchSysLangChange } from '@/libs/lang';
import { initApp } from '@/libs/setting';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Drawer, type DrawerNavigationOptions } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { emptyString } from 'javascript-common';
import React from 'react';
import { View } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { type EdgeInsets, SafeAreaInsetsContext, SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    useMount(() => {
        initApp().finally(() => {
            SplashScreen.hide();
        });

        const removeDimensionListener = watchDimensionChange();
        const removeSysLangListener = watchSysLangChange();
        return () => {
            removeDimensionListener();
            removeSysLangListener();
        };
    });

    return <SafeAreaProvider><SafeAreaInsetsContext.Consumer>
        {insets => <App {...insets} />}
    </SafeAreaInsetsContext.Consumer></SafeAreaProvider>;
}

function App({
    bottom = 0,
    left = 0,
    right = 0,
    top = 0,
}: Partial<EdgeInsets>) {
    const isDarkMode = useIsDarkMode();
    const colors = useColors();

    React.useEffect(() => {
        setInsets({left, right});
    }, [left, right]);

    const containerStyle = React.useMemo(() => {
        return {
            backgroundColor: colors.bg,
            flex: 1,
            paddingBottom: bottom,
            paddingLeft: left,
            paddingRight: right,
            paddingTop: top,
        };
    }, [bottom, colors, left, top, right]);

    const screenOptions: DrawerNavigationOptions = React.useMemo(() => {
        return {
            drawerPosition: 'right',
            drawerStyle: {
                backgroundColor: colors.bg,
                width: '100%',
            },
            drawerType: 'front',
            headerShown: false,
            title: emptyString,
        };
    }, [colors]);

    return <View style={containerStyle}>
        <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
        <MenuProvider>
            <StatusBar style={isDarkMode ? "dark" : "light"} />

            <FormProvider>
            <Drawer
                drawerContent={SideCart}
                screenOptions={screenOptions}
            >
                <Drawer.Screen
                    name="(contents)"
                    options={drawerScreenOptions}
                />
            </Drawer>
            </FormProvider>
            
            <Notification />
        </MenuProvider>
        </ThemeProvider>
    </View>;
}

const drawerScreenOptions = {
    swipeEnabled: false,
};
