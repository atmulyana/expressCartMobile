/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
 import React from 'react';
 import {Button, Text} from '../components';
 import Content from './Content';
 import {appHelpers, lang} from '../common';
 import {buttonOutlinePrimary, green, yellow, red} from '../styles';

 export default class PaymentComplete extends Content {
    render() {
        const {config, result} = this.data, status = result.orderStatus;
        let message = '', color = green;
        switch(status) {
            case 'Paid':
                message = lang('Your payment has been successfully processed');
                break;
            case 'Pending':
                if((config.paymentGateway === 'instore' || Array.isArray(config.paymentGateway) && config.paymentGateway.includes('instore'))
                    && appHelpers.paymentConfig && appHelpers.paymentConfig.instore) {
                    message = appHelpers.paymentConfig.instore.resultMessage;
                }
                else {
                    message = lang('The payment for this order is pending. We will be in contact shortly.');
                }
                color = yellow;
                break;
            default:
                message = lang('Your payment has failed. Please try again or contact us.');
                color = red;
        }
        return <>
            <Text center large para4 style={{color}}>{message}</Text>
            <Text center><Text bold>{lang('Order ID')}:</Text> {result._id}</Text>
            <Text center para4><Text bold>{lang('Payment ID')}:</Text> {result.orderPaymentId}</Text>
            {(status == 'Paid' || status == 'Pending') &&
                <Text center para4 bold yellow>{lang('Please retain the details above as a reference of payment')}</Text>}
            <Button style={[buttonOutlinePrimary, {alignSelf:'center'}]} title={lang('Home')}
                onPress={() => appHelpers.goHome()}
            />
        </>;
    }
}