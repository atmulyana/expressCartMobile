/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import noop from 'javascript-common';
import {callServer} from './server';

const appHelpers = {
    contentCanGoBack: false,
    contentFlag: -1 >>> 1,
    doLogout: () => {
        callServer('/customer/logout', {})
        .then(() => {
            appHelpers.logout();
            appHelpers.refreshContent();
        });
    },
    isLoggedIn: false,
    paymentConfig: null,
    refreshContent: noop,
    setCartCount: noop,
    setMenu: noop,
};
export default appHelpers;