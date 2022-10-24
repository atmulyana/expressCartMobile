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
import {appHelpers, lang} from '../../../common';

export default class Stripe extends PaymentComponent {
    render() {
        return <CreditCardPayment {...this.props}
            ccProps={{showPostalCode: true}}
            onSubmit={({cc, pageSubmit, paymentConfig, submitData}) => {
                const ccData = cc.input.value, postData = new URLSearchParams();
                postData.append('card[number]', ccData.number);
                postData.append('card[exp_month]', ccData.expired.month);
                postData.append('card[exp_year]', ccData.expired.year);
                postData.append('card[cvc]', ccData.cvc);
                postData.append('card[address_zip]', ccData.zip ? ccData.zip : null);
                
                submitData(
                    `https://api.stripe.com/v1/tokens`, 
                    postData,
                    { Authorization: `Bearer ${paymentConfig.publicKey}` }
                )
                .then(token => {
                    //console.log(JSON.stringify(token, null, '\t'))
                    pageSubmit(
                        '/stripe/checkout_action',
                        {token: token.id}
                    )
                    .then(data => {
                        appHelpers.replaceContent(routes.payment(data.paymentId));
                    });
                })
                .catch(err => {
                    //console.log(JSON.stringify(err, null, '\t'))
                    err.handled = true;
                    if (err.status == 401) {
                        Notification.error(lang('Wrong public key'));
                    }
                    else if (err.status == 402) {
                        cc.errMessage = err.data && err.data.error && err.data.error.message || lang('Invalid Credit Card');
                        cc.validator?.validate();
                    }
                    else {
                        Notification.error(lang('Failed to complete transaction'));
                    }
                });
            }}
            paymentConfig={this.props.paymentConfig.stripe}
        />;
    }
}