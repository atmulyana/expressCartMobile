/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import {Alert} from 'react-native'
import {URL} from 'react-native-url-polyfill'
import lang from './lang'

const SERVER = 'http://192.168.56.1:1111'

export const serverUrl = url => SERVER + url.replaceAll('\\', '/')

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

