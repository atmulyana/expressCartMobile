/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
export default (requiredHandler, currentHandler) => currentHandler
    ? comp => {
        requiredHandler(comp);
        if (typeof(currentHandler) == 'function') currentHandler(comp);
        else currentHandler.current = comp;
    }
    : requiredHandler;