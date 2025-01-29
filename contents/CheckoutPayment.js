/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Box, Button, Icon, Partial, Text, TextInput, TwoPane} from '../components';
import Content from './Content';
import routes from './routes';
import {CartContent} from './partials/Cart';
import * as payments from './partials/payments';
import {appHelpers, currencySymbol, emptyString, formatAmount, lang} from '../common';
import styles from '../styles';
import {required} from 'react-native-form-input-validator/rules';

const {rowBoxStyle} = StyleSheet.create({
    rowBoxStyle: {
        flexDirection: 'row',
        marginHorizontal: 0,
    },
});

class PaymentPanel extends Partial {
    state = Object.assign(this.state, {
        discountCode: emptyString,
    });

    async onDataReady(silent, data) {
        await super.onDataReady(silent, data);
        this.setState({discountCode: this.data.session.discountCode})
    }

    render() {
        const {config, session} = this.data;
        let discountInput = null;
        return <>
                {this.data.paymentMessage && <Text center red para4>{this.data.paymentMessage}</Text>}
                <Text large bold para4>{lang('Customer details')}</Text>
                
                <Box style={rowBoxStyle}>
                    <Text style={{flex:1}}>{session.customerFirstname} {session.customerLastname} - {session.customerEmail}</Text>
                    <Text right link style={{flex:0}} onPress={() => appHelpers.loadContent(routes.checkoutInformation)}>{lang('Change')}</Text>
                </Box>
                
                <Box style={rowBoxStyle}>
                    <Text style={{flex:2}}>{session.shippingMessage}</Text>
                    {session.totalCartShipping > 0 &&
                        <Text style={{flex:1}}>{currencySymbol(config.currencySymbol)}{formatAmount(session.totalCartShipping)}</Text>}
                    <Text right link style={{flex:0}} onPress={() => appHelpers.loadContent(routes.checkoutShipping)}>{lang('Change')}</Text>
                </Box>
                
                {config.modules.loaded.discount &&
                <View style={{flexDirection:'row'}}>
                    <TextInput ref={inp => discountInput = inp} placeholder={lang('Discount code')}
                        value={this.state.discountCode} onChangeText={discountCode => this.setState({discountCode})}
                        fixHeight style={{flex: 1, alignSelf:'flex-start', borderRightWidth:0, borderTopRightRadius:0, borderBottomRightRadius:0}}
                        validation={required} />
                    <Button style={[
                            styles.buttonOutlineSuccess,
                            styles.textInputHeight,
                            {flex:0, alignSelf:'flex-start', borderRadius:0, borderRightWidth:0}
                        ]}
                        pressedStyle={styles.buttonOutlineSuccessPressed}
                        title={lang('Apply')}
                        onPress={() => {
                            if (!discountInput.validate()) return;
                            this.submitData('/checkout/adddiscountcode', {discountCode: this.state.discountCode})
                                .then(() => {
                                    appHelpers.refreshContent();
                                });
                        }} />
                    <Button style={[
                            styles.buttonOutlineDanger,
                            styles.textInputHeight,
                            {flex:0, alignSelf:'flex-start', borderTopLeftRadius:0, borderBottomLeftRadius:0}
                        ]}
                        pressedStyle={styles.buttonOutlineDangerPressed}
                        onPress={() => {
                            discountInput.clearValidation();
                            this.submitData('/checkout/removediscountcode')
                                .then(() => {
                                    //this.setState({discountCode: emptyString})
                                    appHelpers.refreshContent();
                                });
                        }}
                    >{style =>
                        <Icon icon="X" stroke={style.color} height={styles.text.lineHeight} width={styles.text.lineHeight} />
                    }</Button>
                </View>
                }

                {session.customerPresent && config.paymentGateway.map((item, idx) => {
                    const PaymentComponent = payments[item];
                    if (!PaymentComponent) return null;
                    return <Box key={idx} style={{marginHorizontal:0}}>
                        <PaymentComponent
                            config={this.data.config}
                            paymentConfig={this.data.paymentConfig}
                            submitData={this.submitData}
                            pageSubmit={this.props.pageSubmit}
                        />
                    </Box>;
                })}
        </>;
    }
}

export default class CheckoutPayment extends Content {
    static defaultParams = {
        headerBar: routes.checkoutPayment.headerBar,
        url: routes.checkoutPayment.url,
    };

    render() {
        return <TwoPane
            left={<Box>
                <PaymentPanel data={this.data} pageSubmit={this.submitData} />
            </Box>}
            right={<Box>
                <CartContent data={this.data} />
            </Box>}
        />;
    }
}