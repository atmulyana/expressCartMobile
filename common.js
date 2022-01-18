/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import {Alert, Dimensions} from 'react-native';
import numeral from 'numeral';
import moment from 'moment';

import * as server from './server';
export const {callServer, serverUrl} = server;

import noop from './noop';
export {noop};

export const appHelpers = {
    contentCanGoBack: false,
    doLogout: () => {
        server.callServer('/customer/logout', {})
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

export const contentPadding = 8;
export const contentWidth = () => {
    const {winInsets} = appHelpers;
    return Dimensions.get('window').width - 2 * contentPadding - winInsets.left - winInsets.right;
};
export const correctWidth = width => {
    const maxWidth = contentWidth();
    return width > maxWidth ? maxWidth : width;
}

import lang from './lang';
export {lang};
export {availableLanguages, currentLanguage} from './lang';

export const confirmModal = callback => {
    Alert.alert(
        lang('Confirm'),
        lang('Are you sure you want to proceed?'),
        [
            {
                text: lang('Close'),
                style: 'cancel'
            },
            {
                text: lang('Confirm'),
                onPress: callback
            }
        ],
    { cancelable: false }
    );
};


export const formatAmount = amt => amt ? numeral(amt).format('0.00') : '0.00';
export const currencySymbol = symbol => symbol || '$';
export const formatDate = (date, format) => moment(date).format(format);
export const timeAgo = date => moment(date).fromNow();
export const digitCount = number => { /** number is non-negative integer */
    if (isNaN(number = parseInt(number))) return;
    let tens = 10, count = 1;
    for (;;) {
        if (number < tens) return count;
        else {
            tens *= 10;
            count++;
        }
    }
};


export const updateSubtreeElements = (children, map, dontUpdate) => {
    let children2 = [], children3 = children, isUpdated = false;
    if (!Array.isArray(children)) children3 = [children];
    
    const mapChild = child => {
        if (child?.props?.children && typeof(child.props.children) != 'string') {
            const grandChildren = updateSubtreeElements(child.props.children, map);
            if (grandChildren !== child.props.children) {
                const props = {...child.props, children: grandChildren};
                child = {...child, props}; //escape the freezed object (props)
                isUpdated = true;
            }
        }
        let child2 = map(child);
        if (child2 !== child) isUpdated = true;
        return child2;
    }
    
    for (let child of children3) {
        let child2;
        if (dontUpdate && dontUpdate(child)) {
            child2 = child;
        }
        else {
            if (Array.isArray(child)) {
                for (let i = 0; i < child.length; i++) {
                    child[i] = mapChild(child[i]);
                }
                child2 = child;
            }
            else {
                child2 = mapChild(child);
            }
        }
        children2.push(child2);
    }
    return isUpdated ? children2 : children;
};

export const str = (strTemplate, ...params) => (strTemplate+'').replace(/\$(\d+)/g, function(_, p1) {
    p1 = parseInt(p1) - 1;
    return params[p1] ?? '';
});

export const joinRefHandler = (requiredHandler, currentHandler) => currentHandler
    ? comp => {
        requiredHandler(comp);
        if (typeof(currentHandler) == 'function') currentHandler(comp);
        else currentHandler.current = comp;
    }
    : requiredHandler;