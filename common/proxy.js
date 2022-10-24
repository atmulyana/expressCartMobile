/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
export function proxyObject(target, getProxy) {
    return new Proxy(target, {
        get: function(target, prop, receiver) {
            const proxy = getProxy(target);
            if (proxy && proxy[prop] !== undefined && target[prop] === undefined) {
                let value = proxy[prop];
                if (typeof(value) == 'function') value = value.bind(proxy);
                return value;
            }
            return Reflect.get(target, prop, receiver);
        }
    });
}

export function proxyClass(Target, getProxy) {
    return new Proxy(Target, {
        construct(Target, args) {
            const target = new Target(...args);
            return proxyObject(target, getProxy);
        }
    });
}