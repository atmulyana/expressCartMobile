/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import Content from './Content';
import routes from './routes';
import Cart from './partials/Cart';


export default class CheckoutCart extends Content {
    static defaultParams = {
        headerBar: routes.checkoutCart.headerBar,
        url: routes.checkoutCart.url,
    };
    
    render() {
        return <Cart showCloseButton={false} data={this.data} />;
    }
}