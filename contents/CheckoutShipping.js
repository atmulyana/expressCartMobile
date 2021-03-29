/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {View} from 'react-native';
import {Box, Button, Text, TwoPane} from '../components';
import Content from './Content';
import routes from './routes';
import Cart from './partials/Cart';
import {appHelpers, currencySymbol, formatAmount, lang} from '../common';
import styles from '../styles';

export default class CheckoutShipping extends Content {
    static defaultParams = {
        headerBar: routes.checkoutShipping.headerBar,
        url: routes.checkoutShipping.url,
    };
    render() {
        const {config, session} = this.data;
        return <TwoPane
            left={<>
                <Box>
                    <Text larger bold>{lang('Shipping options')}</Text>
                    {session.shippingOptions && session.shippingOptions.length > 0
                        ? null
                        : <Box>
                                {session.totalCartShipping > 0
                                    ? <View style={{flexDirection:'row'}}>
                                        <Text style={{flex:1}}>{session.shippingMessage}</Text>
                                        <Text bold right style={{flex:1}}>{currencySymbol(config.currencySymbol)}{formatAmount(session.totalCartShipping)}</Text>
                                      </View>
                                    : <Text>{session.shippingMessage}</Text>
                                }
                          </Box>
                    }
                </Box>
                <View style={[styles.ph8, {flexDirection:'row', justifyContent:'space-between'}]}>
                    <Button title={lang('Return to information')} onPress={() => appHelpers.loadContent(routes.checkoutInformation)} />
                    <Button title={lang('Proceed to payment')} onPress={() => appHelpers.loadContent(routes.checkoutPayment)} />
                </View>
            </>}

            right={<Cart showCheckoutButton={false} data={this.data} />}
        />;
    }
}