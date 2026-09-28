/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { usePathname, useStyles } from '@/hooks';
import React from 'react';
import { View } from "react-native";
import AccountBar from './AccountBar';
import CheckoutBar from './CheckoutBar';
//import GenericBar from './GenericBar';
import LoginBar from './LoginBar';
import SearchBar from './SearchBar';

const HeaderBar = React.memo(function HeaderBar() {
    const path = usePathname();
    const styles = useStyles();

    return <View style={styles.stickyBar}>{
        path == '/customer/login' ? <LoginBar /> :
        
        path.startsWith('/customer/') ? <AccountBar /> :
        
        path.startsWith('/checkout/') || path.startsWith('/payment/')
            //@ts-expect-error
            || path == '/blockonomics_payment' ? <CheckoutBar /> :
        
        path == '/' || path.startsWith('/category/') || path.startsWith('/product/')
            || path.startsWith('/search/') ? <SearchBar /> :
        
        <AccountBar />
    }</View>;
});
export default HeaderBar;