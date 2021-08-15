/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {Buffer} from 'buffer';
import PaymentComponent from './PaymentComponent';
import {Button, CreditCard, Notification, Text, Validation} from '../../../components';
import {lang} from '../../../common';
import styles from '../../../styles';
import {rule} from '../../../validations';
 
export default class Payway extends PaymentComponent {
    render() {
        const {paymentConfig, submitData, pageSubmit} = this.props;
        let cc = null, ccValidator, ccErrMessage;
        return <>
            <Text para4>{paymentConfig.payway.description}</Text>
            <CreditCard ref={comp => cc = comp} showCardHolder style={styles.para4} validator={() => ccValidator} />
            <Validation ref={comp => ccValidator = comp}
                input={() => cc}
                rule={rule(() => {
                    if (!cc?.isValid) return false;
                    if (!ccErrMessage) return true;
                    return ccErrMessage;
                })}
            />
            <Button style={[styles.buttonOutlineSuccess, {alignSelf:'flex-start'}]} title={lang('Process Payment')}
                onPress={() => {
                    ccErrMessage = null;
                    if (!ccValidator?.validate()) return;

                    const ccData = cc.value, postData = new URLSearchParams();
                    let expiryMonth = '00' + ccData.expired.month;
                    postData.append('paymentMethod', 'creditCard');
                    postData.append('cardNumber', ccData.number);
                    postData.append('expiryDateMonth', expiryMonth.substring(expiryMonth.length - 2));
                    postData.append('expiryDateYear', ccData.expired.year);
                    postData.append('cvn', ccData.cvc);
                    postData.append('cardholderName', ccData.cardHolder);
                    
                    submitData(
                        `https://api.payway.com.au/rest/v1/single-use-tokens`, 
                        postData,
                        { Authorization: `Basic ${Buffer.from(`${paymentConfig.payway.publishableApiKey}:`).toString('base64')}` }
                    )
                    .then(data => {
                        //console.log(JSON.stringify(data, null, '\t'))
                        pageSubmit(
                            '/payway/checkout_action',
                            data
                        );
                    })
                    .catch(err => {
                        //console.log(JSON.stringify(err, null, '\t'))
                        err.handled = true;
                        if (err.status == 401) {
                            Notification.error(lang('Wrong public key'));
                        }
                        else if (err.status == 422) {
                            ccErrMessage = lang('Invalid Credit Card');
                            if (err.data && Array.isArray(err.data.data) && err.data.data[0]?.message) {
                                let field = '';
                                switch (err.data.data[0]?.fieldName) {
                                    case 'cardNumber': field = lang('Card number'); break;
                                    case 'cvn': field = 'CVC'; break;
                                    case 'expiryDateMonth':
                                    case 'expiryDateYear':
                                        field = lang('Expiry date'); break;
                                    case 'cardholderName': field = lang('Card holder name'); break;
                                }
                                if (field) field = `${field}:`;
                                ccErrMessage = `${field} ${err.data.data[0]?.message}`;
                            }
                            ccValidator?.validate();
                        }
                        else {
                            Notification.error(lang('Failed to complete transaction'));
                        }
                    });
                }}
            />
        </>;
    }
}