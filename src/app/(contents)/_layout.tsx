/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { Icon, Text } from '@/components';
import HeaderBar from '@/components/partials/HeaderBar';
import { useConfig, useStyles } from '@/hooks';
import { DataProvider } from '@/hooks/contexts/data';
import styles from '@/styles';
import { type NativeStackHeaderProps, type NativeStackNavigationOptions, Stack } from "expo-router";
import React from 'react';
import { Image, Platform, View } from "react-native";

export default function ContentLayout() {
   return <> 
        <HeaderBar />
        <Stack screenLayout={screenLayout} screenOptions={screenOptions} />
        <FooterBar />
    </>;
}

const screenLayout: NonNullable<React.ComponentProps<typeof Stack>['screenLayout']> = ({children}) => {
    return <DataProvider>
        {children}
    </DataProvider>;
};

const screenOptions: NativeStackNavigationOptions = {
    header: ScreenHeader,
    animation: Platform.OS == 'ios' ? 'none' : 'default', //On iOS, animation raises an error
    headerBackButtonDisplayMode: 'minimal',
    orientation: 'all',
};

function ScreenHeader({navigation, options}: NativeStackHeaderProps) {
    return <View style={styles.navHeader}>
        {navigation.canGoBack()
            && <Icon name="chevron-left" onPress={() => navigation.goBack()} />}
        <Text style={styles.navHeaderTitle}>{options.title}</Text>
    </View>;
}

const FooterBar = React.memo(function FooterBar() {
    const config = useConfig();
    const styles = useStyles();

    return <View style={styles.stickyBar}>
        <Text style={styles.cartTitle}>{config.cartTitle}</Text>
        <View style={styles.appName}>
            <Image source={require('@/assets/images/logo.png')} style={styles.appNameLogo} />
            <Text style={styles.appNameText}>Mobile</Text>
        </View>
    </View>;
});