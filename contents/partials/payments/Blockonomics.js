/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
 import React from 'react';
 import PaymentComponent from './PaymentComponent';
 import {Button, Notification, Text} from '../../../components';
 import {lang} from '../../../common';
 import styles from '../../../styles';

 export default class Blockonomics extends PaymentComponent {
    render() {
        const {pageSubmit, paymentConfig} = this.props;
        return <>
            <Text para4>{paymentConfig.blockonomics.description}</Text>
            <Button
                style={[styles.buttonOutlineSuccess, {alignSelf:'flex-start'}]}
                pressedStyle={styles.buttonOutlineSuccessPressed}
                title={lang('Pay with Bitcoin')}
                onPress={() => {
                    pageSubmit('/blockonomics/checkout_action')
                    .catch(err => {
                        err.handled = true;
                        Notification.error(lang("Your payment has failed. Please try again or contact us."));
                    });
                }}
            />
        </>;
    }
}