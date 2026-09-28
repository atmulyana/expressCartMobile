/**
 * https://github.com/atmulyana/expressCartMobile
 */
import type { HttpReject, HttpUrl, UrlPath } from '@/types';
import CookieManager from '@preeternal/react-native-cookie-manager';
import { emptyObject, isPlainObject } from 'javascript-common';
import { Alert } from 'react-native';
import lang from './lang';

const SERVER: HttpUrl = 'http://192.168.56.1:3000';

export const serverUrl = (url: UrlPath) => SERVER + url.replaceAll('\\', '/') as HttpUrl;

export async function callServer(
    url: UrlPath | HttpUrl,
    data: any = null,
    headers: {[name: string]: string} = emptyObject
) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = serverUrl(url as UrlPath);

    const xhr = new XMLHttpRequest();
    const isJson = () =>
        xhr.getResponseHeader('Content-Type')?.toLowerCase().indexOf('application/json') === 0;
    
    const getResponse = () => {
        let data = isJson() ? JSON.parse(xhr.responseText) : {message: xhr.responseText};
        data.responseURL = xhr.responseURL ? new URL(xhr.responseURL) : null;
        data.responseRedirected = xhr.responseURL != url
            && url?.startsWith(SERVER); //don't care if it's URL of outside
        return data;
    };
    
    const error = (reject: HttpReject, message: string) => {
        let err = {
            status: xhr.status,
            data: getResponse(),
            handled: false,
        };
        reject(err);
        //using setTimeout is to make sure that err.handled is already updated
        setTimeout(() => {
            if (!err.handled) Alert.alert(message)
        }, 10);
    };

    let isProcessing = true;
    let promise: Promise<any> | {abort: () => Promise<any>} = Object.assign(
        new Promise<any>((resolve, reject) => {
            xhr.open(
                data ? 'POST' : 'GET',
                url
            );

            xhr.onload = () => {
                if (isProcessing) {
                    if (xhr.status == 404) {
                        error(reject, lang("What you're looking for is not found"));
                    }
                    else if (xhr.status < 200 || xhr.status > 299) {
                        error(reject, lang("Server can't process your request"));
                    }
                    else {
                        resolve(getResponse());
                    }
                }
                isProcessing = false;
            }

            xhr.ontimeout = xhr.onerror = () => {
                if (isProcessing)
                    error(reject, lang("Can't connect to server"));
                isProcessing = false;
            }
            
            xhr.setRequestHeader('X-Requested-With', 'expressCartMobile');
            if (typeof(headers) == 'object' && headers) {
                for (let headerName in headers) {
                    xhr.setRequestHeader(headerName, headers[headerName]);
                }
            }
            if (data) {
                if ((data instanceof FormData)) {
                    let isUpload = false; //data.values().some(value => value instanceof Blob)
                    data.forEach(v => {
                        if (v instanceof Blob) isUpload = true;
                    });
                    if (isUpload)
                        xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                    else
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                }
                else if (data instanceof URLSearchParams) {
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    data = data.toString();
                }
                else if (typeof(data) == 'object') {
                    data = JSON.stringify(data);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                }
                xhr.send(data);
            }
            else {
                xhr.send();
            }
        }),
        {
            abort() {
                if (!isProcessing) {
                    isProcessing = false;
                    try { xhr.abort(); } catch {}
                }
                return promise;
            }
        }
    );

    return promise;
}

export async function setCookie(name: string, value: string) {
    return await CookieManager.set(SERVER, {name, value});
}

export function decomposeData(data: any) {
    if (isPlainObject(data)) {
        const {
            cart,
            config,
            
            /* Menu displayed under "Languges" and "Dark Mode" */
            menu,

            /* Notification message */
            message,
            messageType,

            /* Config for payment module */
            paymentConfig,

            session,

            /* For response-redirection check */
            responseRedirected,
            responseURL,

            ...$data
        } = data;

        if (typeof(cart?.totalCartItems) == 'number') cart.cartItemCount = cart.totalCartItems;

        const {
            /* Customer/Session info */
            blockonomicsParams,
            customerAddress1,
            customerAddress2,
            customerCompany,
            customerCountry,
            customerEmail,
            customerFirstname,
            customerLastname,
            customerPhone,
            customerPostcode,
            customerPresent,
            customerState,

            /* Cart */
            cart: items,
            cartItemCount,
            discountCode,
            orderComment,
            shippingMessage,
            shippingOptions,
            totalCartAmount,
            totalCartDiscount,
            totalCartShipping,
        } = session ?? emptyObject;

        return {
            cart: cart === null || cart ? cart : items && {
                items,
                cartItemCount,
                discountCode,
                orderComment,
                shippingMessage,
                shippingOptions,
                totalCartAmount,
                totalCartDiscount,
                totalCartShipping,
            },

            config,
            data: $data,
            menu,
            message,
            messageType,
            newUrl: responseRedirected && responseURL?.pathname,
            paymentConfig,

            session: {
                blockonomicsParams,
                customerAddress1,
                customerAddress2,
                customerCompany,
                customerCountry,
                customerEmail,
                customerFirstname,
                customerLastname,
                customerPhone,
                customerPostcode,
                customerPresent,
                customerState,
            },
        }
    }
    return false;
}

export function isUrlPath(url: any) {
    return typeof(url) == 'string' && url.startsWith('/') && !url.startsWith('//');
}