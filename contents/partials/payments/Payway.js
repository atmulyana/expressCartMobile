/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {Buffer} from 'buffer';
import CreditCardPayment from './CreditCardPayment';
import PaymentComponent from './PaymentComponent';
import {Notification} from '../../../components';
import {lang} from '../../../common';
 

/* NOTE: In server (web) app, in the file 'lib/payments/payway.js', please remove `customerIpAddress`, it shouldn't be sent to payment gateway */
export default class Payway extends PaymentComponent {
    render() {
        return <CreditCardPayment {...this.props}
            ccProps={{showCardHolder: true}}
            onSubmit={({cc, pageSubmit, paymentConfig, submitData}) => {
                const ccData = cc.input.value, postData = new URLSearchParams();
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
                    { Authorization: `Basic ${Buffer.from(`${paymentConfig.publishableApiKey}:`).toString('base64')}` }
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
                        cc.errMessage = lang('Invalid Credit Card');
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
                            cc.errMessage = `${field} ${err.data.data[0]?.message}`;
                        }
                        cc.validator?.validate();
                    }
                    else {
                        Notification.error(lang('Failed to complete transaction'));
                    }
                });
            }}
            paymentConfig={this.props.paymentConfig.payway}
        />;
    }
}