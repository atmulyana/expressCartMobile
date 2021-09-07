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
import {buttonOutlinePrimary, green} from '../styles';

export default class PaymentCompleteBlockonomics extends Content {
    render() {
        const {result} = this.data;
        return <>
            <Text bold center large para4 style={{color: green}}>{lang('Thank you. Order have been received')}.</Text>
            <Text bold center para4>{lang('Order will be be processed upon confirmation by the bitcoin network. Please keep below order details for reference')}.</Text>
            <Text center><Text bold>{lang('Order ID')}:</Text> {result._id}</Text>
            <Text center para4><Text bold>{lang('Payment ID')}:</Text> {result.orderPaymentId}</Text>
            <Button style={[buttonOutlinePrimary, {alignSelf:'center'}]} title={lang('Home')}
                onPress={() => appHelpers.goHome()}
            />
        </>;
    }
}