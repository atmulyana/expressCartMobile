/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import PaymentComponent from './PaymentComponent';
import routes from '../../routes';
import {Button, CreditCard, Notification, Text, Validation} from '../../../components';
import {appHelpers, lang} from '../../../common';
import styles from '../../../styles';
import {rule} from '../../../validations';

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
        const {paymentConfig:{authorizenet}, submitData, pageSubmit} = this.props;
        let cc = null, ccValidator, ccErrMessage;
        return <>
            <Text para4>{authorizenet.description}</Text>
            <CreditCard ref={comp => cc = comp} style={styles.para4} validator={() => ccValidator} />
            <Validation ref={comp => ccValidator = comp}
                input={() => cc}
                rule={rule(() => {
                    if (!cc?.isValid) return false;
                    if (!ccErrMessage) return true;
                    return ccErrMessage;
                })}
            />
            <Button style={[styles.buttonOutlineSuccess, {alignSelf:'flex-start'}]} pressedStyle={styles.buttonOutlineSuccessPressed}
                title={lang('Process Payment')}
                onPress={() => {
                    ccErrMessage = null;
                    if (!ccValidator?.validate()) return;

                    const ccData = cc.value, lastTwoDigits = /\d{2}$/,
                        data = {
                            securePaymentContainerRequest: {
                                merchantAuthentication: {
                                    name: authorizenet.loginId,
                                    clientKey: authorizenet.clientKey,
                                },
                                data: {
                                    type: "TOKEN",
                                    id: newGuid(),
                                    token: {
                                        cardNumber: ccData.number.replace(/ /g, ''),
                                        expirationDate: `00${ccData.expired.month||''}`.match(lastTwoDigits)[0]
                                            + `00${ccData.expired.year||''}`.match(lastTwoDigits)[0],
                                        cardCode: ccData.cvc,
                                    },
                                },
                            }
                        };
                    
                    submitData(
                        authorizenet.mode == 'test'
                            ? 'https://apitest.authorize.net/xml/v1/request.api'
                            : 'https://api.authorize.net/xml/v1/request.api', 
                        data
                    )
                    .then(token => {
                        //console.log(JSON.stringify(token, null, '\t'))
                        
                        if (token.messages.resultCode != 'Ok') {
                            ccErrMessage = Array.isArray(token.messages.message) && token.messages.message[0]?.text || lang('Invalid Credit Card');
                            ccValidator?.validate();
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
            />
        </>;
    }
}