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
                     postData.append('card[number]', ccData.number);
                     postData.append('card[exp_month]', ccData.expired.month);
                     postData.append('card[exp_year]', ccData.expired.year);
                     postData.append('card[cvc]', ccData.cvc);
                     postData.append('card[address_zip]', ccData.zip ? ccData.zip : null);
                     
                     submitData(
                         `https://api.stripe.com/v1/tokens`, 
                         postData,
                         { Authorization: `Bearer ${paymentConfig.stripe.publicKey}` }
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
                             ccErrMessage = err.data && err.data.error && err.data.error.message || lang('Invalid Credit Card');
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