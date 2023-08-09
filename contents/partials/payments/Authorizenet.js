/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import CreditCardPayment from './CreditCardPayment';
import PaymentComponent from './PaymentComponent';
import routes from '../../routes';
import {Notification} from '../../../components';
import {appHelpers, emptyString, lang} from '../../../common';

/***
 * This function is taken from https://jstest.authorize.net/v1/AcceptCore.js
 */
function newGuid() {
    var a = (new Date).getTime();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(b) {
        var c = (a + 16 * Math.random()) % 16 | 0;
        return a = Math.floor(a / 16),
        ("x" === b ? c : 7 & c | 8).toString(16)
    })
}

export default class Authorizenet extends PaymentComponent {
    render() {
        return <CreditCardPayment {...this.props}
            onSubmit={({cc, pageSubmit, paymentConfig, submitData}) => {
                const ccData = cc.input.value, lastTwoDigits = /\d{2}$/,
                    data = {
                        securePaymentContainerRequest: {
                            merchantAuthentication: {
                                name: paymentConfig.loginId,
                                clientKey: paymentConfig.clientKey,
                            },
                            data: {
                                type: "TOKEN",
                                id: newGuid(),
                                token: {
                                    cardNumber: ccData.number.replace(/ /g, emptyString),
                                    expirationDate: `00${ccData.expired.month || emptyString}`.match(lastTwoDigits)[0]
                                        + `00${ccData.expired.year || emptyString}`.match(lastTwoDigits)[0],
                                    cardCode: ccData.cvc,
                                },
                            },
                        }
                    };
                
                submitData(
                    paymentConfig.mode == 'test'
                        ? 'https://apitest.authorize.net/xml/v1/request.api'
                        : 'https://api.authorize.net/xml/v1/request.api', 
                    data
                )
                .then(token => {
                    //console.log(JSON.stringify(token, null, '\t'))
                    
                    if (token.messages.resultCode != 'Ok') {
                        cc.errMessage = Array.isArray(token.messages.message) && token.messages.message[0]?.text || lang('Invalid Credit Card');
                        cc.validator?.validate();
                        return;
                    }
                    
                    pageSubmit(
                        '/authorizenet/checkout_action',
                        {opaqueData: token.opaqueData}
                    )
                    .then(data => {
                        appHelpers.replaceContent(routes.payment(data.orderId));
                    })
                    .catch(err => {
                        err.handled = true;
                        if (err.data?.orderId) {
                            appHelpers.replaceContent(routes.payment(err.data.orderId));
                        }
                        else {
                            Notification.error(lang('Failed to complete transaction'));
                        }
                    });
                })
                .catch(err => {
                    //console.log(JSON.stringify(err, null, '\t'))
                    err.handled = true;
                    Notification.error(lang('Failed to complete transaction'));
                });
            }}
            paymentConfig={this.props.paymentConfig.authorizenet}
        />;
    }
}