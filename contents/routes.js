/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
const routes = {
    category: (cat, pageNum) => {
        let url = `/category/${cat}`;
        if (pageNum) url = `${url}/${pageNum}`;
        return {
            name: 'ProductList',
            url,
            headerBar: 'search',
        };
    },
    checkoutCart: {
        name: 'CheckoutCart',
        url: '/checkout/cart',
        headerBar: 'checkout',
    },
    checkoutInformation: {
        name: 'CheckoutInformation',
        url: '/checkout/information',
        headerBar: 'checkout',
    },
    checkoutPayment: {
        name: 'CheckoutPayment',
        url: '/checkout/payment',
        headerBar: 'checkout',
    },
    checkoutBlockonomics: {
        name: 'CheckoutBlockonomics',
        url: '/blockonomics_payment',
        headerBar: 'checkout',
    },
    checkoutShipping: {
        name: 'CheckoutShipping',
        url: '/checkout/shipping',
        headerBar: 'checkout',
    },
    customerLogin: {
        name: 'CustomerLogin',
        $url: '/customer/login',
        headerBar: 'login',
    },
    customerAccount: {
        name: 'CustomerAccount',
        url: '/customer/account',
        headerBar: 'account',
    },
    error: {
        name: 'Error',
        headerBar: 'account',
    },
    forgotten: {
        name: 'Forgotten',
        $url: '/customer/forgotten',
        headerBar: 'account',
    },
    home: {
        name: 'ProductList',
        url: '/',
        headerBar: 'search',
    },
    payment: orderId => ({
        name: 'PaymentComplete',
        url: `/payment/${orderId}`,
        headerBar: 'checkout',
    }),
    paymentBlockonomics: orderId => ({
        name: 'PaymentCompleteBlockonomics',
        url: `/payment/${orderId}`,
        headerBar: 'checkout',
    }),
    productInfo: productId => ({
        name: 'Product',
        url: `/product/${productId}`,
        headerBar: 'search',
    }),
    search: (searchTerm, pageNum) => {
        let url = `/search/${searchTerm}`;
        if (pageNum) url = `${url}/${pageNum}`;
        return {
            name: 'ProductList',
            url,
            headerBar: 'search',
        };
    },
    web: url => ({
        name: 'WebPage',
        url
    }),
};

const getRouteByUrl = url => {
    for (let routeKey in routes) {
        let route = routes[routeKey];
        if (typeof(route) == 'function') {
            const segments = url.split('/');
            for (let i = segments.length - 1; i > 0; i--) {
                const route2 = route.apply(null, segments.slice(i));
                if (route2.url == url) return route2;
            }
        }
        else if (route.url == url || route.$url == url)
            return route;
    }
    return null;
};

module.exports = {
    ...routes,
    getRouteByUrl,
}