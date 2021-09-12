/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Box, Button, Icon, Notification, Partial, Text, TextInput, TwoPane, ValidationContainer} from '../components';
import Content from './Content';
import routes from './routes';
import {CartContent} from './partials/Cart';
import * as payments from './partials/payments';
import {appHelpers, currencySymbol, formatAmount, lang} from '../common';
import styles from '../styles';
import {required} from '../validations';

const {rowBoxStyle} = StyleSheet.create({
    rowBoxStyle: {
        flexDirection: 'row',
        marginHorizontal: 0,
    },
});

class PaymentPanel extends Partial {
    state = Object.assign(this.state, {
        discountCode: '',
    });

    async onDataReady(silent, data) {
        await super.onDataReady(silent, data);
        this.setState({discountCode: this.data.session.discountCode})
    }

    render() {
        const {config, session} = this.data;
        let discountInput = null;
        return <ValidationContainer>
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
                <View style={[styles.textInputHeight, {flexDirection:'row'}]}>
                    <TextInput ref={inp => discountInput = inp} placeholder={lang('Discount code')}
                        value={this.state.discountCode} onChangeText={discountCode => this.setState({discountCode})}
                        style={{flex:1, borderRightWidth:0, borderTopRightRadius:0, borderBottomRightRadius:0}}
                        validation={required} />
                    <Button style={[styles.buttonOutlineSuccess, {alignSelf: 'stretch', flex:0, borderRadius:0, borderRightWidth:0}]}
                        title={lang('Apply')}
                        onPress={() => {
                            if (!discountInput.validator?.validate()) return;
                            this.submitData('/checkout/adddiscountcode', {discountCode: this.state.discountCode})
                                .then(data => {
                                    Notification.success(data.message);
                                    appHelpers.refreshContent();
                                })
                                .catch(Notification.errorHandler);
                        }} />
                    <Button style={[styles.buttonOutlineDanger, {alignSelf: 'stretch', flex:0, borderTopLeftRadius:0, borderBottomLeftRadius:0}]}
                        onPress={() => {
                            discountInput.validator?.clearValidation();
                            this.submitData('/checkout/removediscountcode')
                                .then(data => {
                                    //this.setState({discountCode:''})
                                    Notification.success(data.message);
                                    appHelpers.refreshContent();
                                })
                                .catch(Notification.errorHandler);
                        }}
                    >
                        <Icon icon="X" stroke={styles.buttonOutlineDanger.color} height={styles.text.lineHeight} width={styles.text.lineHeight} />
                    </Button>
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
        </ValidationContainer>;
    }
}

export default class CheckoutPayment extends Content {
    static defaultParams = {
        headerBar: routes.checkoutPayment.headerBar,
        url: routes.checkoutPayment.url,
    };

    render() {
        return <TwoPane
            left={<Box style={styles.mr4}>
                <PaymentPanel data={this.data} pageSubmit={this.submitData} />
            </Box>}
            right={<Box style={styles.ml4}>
                <CartContent data={this.data} />
            </Box>}
        />;
    }
}