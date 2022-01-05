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
import {URL} from 'react-native-url-polyfill';

const SERVER = 'http://192.168.56.1:1111';

export const noop = () => {};
export const appHelpers = {
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

export const contentPadding = 8;
export const contentWidth = () => {
    const {winInsets} = appHelpers;
    return Dimensions.get('window').width - 2 * contentPadding - winInsets.left - winInsets.right;
};
export const correctWidth = width => {
    const maxWidth = contentWidth();
    return width > maxWidth ? maxWidth : width;
}

import lang, {availableLanguages, currentLanguage} from './lang';
export {lang, availableLanguages, currentLanguage};
// export const lang = text => text;
// export const availableLanguages = () => [{code: 'en', name: 'English'}];
// export const currentLanguage = () => 'en';
// lang.set = () => Promise.resolve();
// lang.addChangeListeners = noop;
// lang.removeChangeListeners = noop;

export const serverUrl = url => SERVER + url.replaceAll('\\', '/');

export const callServer = async (url, data, headers={}) => {
    //'fetch' function seems more elegant but  https://reactnative.dev/docs/network#known-issues-with-fetch-and-cookie-based-authentication
    
    if (!/^https?:\/\//.test(url)) url = serverUrl(url)
    const xhr = new XMLHttpRequest()
    const isJson = () => xhr.getResponseHeader('Content-Type')?.toLowerCase().indexOf('application/json') === 0
    const getResponse = () => {
        let data = isJson() ? JSON.parse(xhr.responseText) : {message: xhr.responseText}
        data.responseURL = xhr.responseURL ? new URL(xhr.responseURL) : null
        data.responseRedirected = xhr.responseURL != url
            && url?.startsWith(SERVER) //don't care if it's URL of outside
        return data
    }
    const error = (reject, message) => {
        let err = {
            status: xhr.status,
            data: getResponse(),
            handled: false,
        }
        reject(err)
        //using setTimeout is to make sure that err.handled is already updated
        setTimeout(() => {
            if (!err.handled) Alert.alert(message)
        }, 10)
    }

    let isProcessing = true
    let promise = new Promise((resolve, reject) => {
        xhr.open(
            data ? 'POST' : 'GET',
            url
        )

        xhr.onload = () => {
            if (isProcessing) {
                if (xhr.status == 404) {
                    error(reject, lang("What you're looking for is not found"))
                }
                else if (xhr.status < 200 || xhr.status > 299) {
                    error(reject, lang("Server can't process your request"))
                }
                else {
                    resolve(getResponse())
                }
            }
            isProcessing = false
        }

        xhr.ontimeout = xhr.onerror = err => {
            if (isProcessing)
                error(reject, lang("Can't connect to server"), err)
            isProcessing = false
        }
        
        xhr.setRequestHeader('X-Requested-With', 'expressCartMobile');
        if (typeof(headers) == 'object' && headers) {
            for (let headerName in headers) {
                xhr.setRequestHeader(headerName, headers[headerName])
            }
        }
        if (data) {
            if (data instanceof URLSearchParams) {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
                data = data.toString()
            }
            else if (data instanceof FormData ) {
                xhr.setRequestHeader('Content-Type', 'multipart/form-data')
            }
            else if (typeof(data) == 'object') {
                data = JSON.stringify(data)
                xhr.setRequestHeader('Content-Type', 'application/json')
            }
            xhr.send(data) 
        }
        else {
            xhr.send()
        }
    });

    promise.abort = () => {
        if (!isProcessing) {
            isProcessing = false
            try { xhr.abort() } catch {}
        }
        return promise
    }

    return promise
}

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