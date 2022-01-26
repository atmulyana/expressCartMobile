/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import {callServer} from './server';
import noop from './noop';

const appHelpers = {
    contentCanGoBack: false,
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
    winInsets: {left: 0, right: 0}
};
export default appHelpers;