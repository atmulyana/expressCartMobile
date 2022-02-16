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
 import {Button, Notification, Text} from '../../../components';
 import {appHelpers, lang} from '../../../common';
 import styles from '../../../styles';

 export default class Instore extends PaymentComponent {
    render() {
        const {pageSubmit, paymentConfig} = this.props;
        return <>
            <Text para4>{paymentConfig.instore.description}</Text>
            <Button
                style={[styles.buttonOutlineSuccess, {alignSelf:'flex-start'}]}
                pressedStyle={styles.buttonOutlineSuccessPressed}
                title={paymentConfig.instore.buttonText}
                onPress={() => {
                    pageSubmit('/instore/checkout_action')
                    .then(data => {
                        appHelpers.replaceContent(routes.payment(data.paymentId));
                    })
                    .catch(err => {
                        err.handled = true;
                        if (err?.data?.paymentId)
                            appHelpers.replaceContent(routes.payment(err.data.paymentId));
                        else {
                            Notification.error(lang("Your payment has failed. Please try again or contact us."));
                        }
                    });
                }}
            />
        </>;
    }
}