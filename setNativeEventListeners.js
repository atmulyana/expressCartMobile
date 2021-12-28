/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */

function noop() {
}

module.exports = nativeModuleName => {
    /** This function exists in order to avoid warning message:
     *      `new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.
     *      `new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.
     * The message shows when importing a module containing declaration of 'new NativeEventEmitter(nativeModule)'
     * The message seems to appear in RN version 0.65+, not in version before
     */
    let nativeModule = require('react-native').NativeModules[nativeModuleName];
    if (typeof(nativeModule.addListener) != 'function') nativeModule.addListener = noop;
    if (typeof(nativeModule.removeListeners) != 'function') nativeModule.removeListeners = noop;
}