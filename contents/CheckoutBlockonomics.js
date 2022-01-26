/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Box, LessPureComponent, Notification, Text, TwoPane} from '../components';
import Content from './Content';
import routes from './routes';
import {CartContent} from './partials/Cart';
import {appHelpers, currencySymbol, formatAmount, lang} from '../common';
import styles from '../styles';

//It seems to need more memories on emulator for Clipboard operation 
require('../setNativeEventListeners')('RNCClipboard'); //'require' must be ended by ';' if not an error happens
//must be using 'require', not 'import', to make the above line works
const Clipboard = require('@react-native-clipboard/clipboard').default;

const {rowBoxStyle, timerBoxStyle} = StyleSheet.create({
    rowBoxStyle: {
        flexDirection: 'row',
        marginHorizontal: 0,
    },
    timerBoxStyle: {
        alignItems: 'center',
        marginHorizontal: 0,
    },
});

class Timer extends LessPureComponent {
    static propTypes = {
        onTimeout: PropTypes.func,
        running: PropTypes.bool,
        timeout: PropTypes.number,
    };
    static defaultProps = {
        running: true,
        timeout: 10, //minutes
    };

    state = {
        timestamp: 0
    };
    
    #endTimestamp;
    #timerId = null;

    constructor(props) {
        super(props);
        this.#setEndTimestamp(props.timeout);
    }

    #run() {
        if (this.#timerId !== null) return;
        this.#timerId = setInterval(() => {
            const currentTime = new Date().getTime();
            if (currentTime > this.#endTimestamp) {
                this.#stop();
                typeof(this.props.onTimeout) == 'function' && this.props.onTimeout();
            }
            else {
                this.setState({timestamp: currentTime});
            }
        }, 1000);
    }

    #stop() {
        if (this.#timerId !== null) {
            clearInterval(this.#timerId);
            this.#timerId = null;
        }
    }

    #setEndTimestamp(minutes) {
        this.#endTimestamp = new Date().getTime() + 1000 * 60 * minutes;
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.running) this.#run();
    }

    shouldComponentUpdate(nextProps, nextState) {
        const result = super.shouldComponentUpdate(nextProps, nextState);
        if (this.props.running != nextProps.running) {
            nextProps.running ? this.#run() : this.#stop();
        }
        if (this.props.timeout != nextProps.timeout) this.#setEndTimestamp(nextProps.timeout); //reset
        return result;
    }

    render() {
        let distance = this.#endTimestamp - this.state.timestamp;
        if (distance < 0) distance = 0;
        let oneMinute = 60 * 1000;
        let minuteFractions = distance % oneMinute;
        let seconds = Math.floor(minuteFractions / 1000);
        let minutes = (distance - minuteFractions) / oneMinute;
        return <Text>{minutes}m {seconds}s</Text>;
    }
}

class PaymentPanel extends LessPureComponent {
    state = {
        status: 0, //0: waiting payment, 1: payment detected, 2: payment timeout
        isTimerRunning: true,
    }

    #blSocket;

    componentDidMount() {
        super.componentDidMount();

        const {address, timestamp, pendingOrderId: orderid} = this.props.data.session.blockonomicsParams;
        if (!this.#blSocket) {
            this.#blSocket = new WebSocket(
                this.props.data.paymentConfig.blockonomics.hostUrl.replace(/^https:/, 'wss:') + '/payment/' + address + '?timestamp=' + timestamp);
            this.#blSocket.onmessage = (msg) => {
                if (this.state.status == 2) return;
                let data = JSON.parse(msg.data);
                if(data.status === 0 || data.status === 1 || data.status === 2) {
                    this.setState({isTimerRunning: false, status: 1});
                    Notification.success(lang('Payment detected'));
                    this.#blSocket?.close(); this.#blSocket = null;
                    
                    this.props.pageSubmit('/product/emptycart')
                    .then(() => {
                        appHelpers.replaceContent(routes.paymentBlockonomics(orderid));
                    });
                }
            };
        }
    }

    render() {
        const {config, session, paymentMessage} = this.props.data,
              {address, expectedBtc, pendingOrderId: orderid} = session.blockonomicsParams,
              state = this.state;
        return <>
                {paymentMessage && <Text center red para4>{paymentMessage}</Text>}
                <Text large bold para4>{lang('Blockonomics payment details')}</Text>
                
                <Box style={rowBoxStyle}>
                    <Text style={{flex:1}}>{session.customerFirstname} {session.customerLastname} - {session.customerEmail}</Text>
                </Box>
                
                {session.totalCartShipping > 0 &&
                <Box style={rowBoxStyle}>
                    <Text style={{flex:3}}>{session.shippingMessage}</Text>
                    <Text bold style={{flex:3}}>{currencySymbol(config.currencySymbol)}{formatAmount(session.totalCartShipping)}</Text>
                </Box>}

                <Box style={rowBoxStyle}>
                    <Text style={{flex:3}}>{lang('Send BTC amount')}</Text>
                    <Text bold style={{flex:2}}>{expectedBtc}</Text>
                    <Text right link style={{flex:1}} onPress={() => {
                        Clipboard.setString(expectedBtc+'');
                        Notification.success(lang('Amount copied to clipboard'));
                    }}>{lang('Copy')}</Text>
                </Box>
                
                <Box style={[rowBoxStyle, {flexDirection: 'column'}]}>
                    <Text>{lang('Address')}:</Text>
                    <Text bold>{address}</Text>
                    <Text right link style={{alignSelf:'stretch'}} onPress={() => {
                        Clipboard.setString(address);
                        Notification.success(lang('Address copied to clipboard'));
                    }}>{lang('Copy')}</Text>
                </Box>

                <Box style={timerBoxStyle}>{
                    state.status == 1 ? <>
                        <Text>{' '}</Text>
                        <Text>{lang('View')}{' '}
                            <Text bold link onPress={() => appHelpers.replaceContent(routes.paymentBlockonomics(orderid))}>{lang('Order')}</Text>
                        </Text>
                    </> :

                    state.status == 2 ? <>
                        <Text bold>{lang('Payment expired')}</Text>
                        <Text>{' '}</Text>
                        <Text>
                            <Text bold link onPress={() => appHelpers.replaceContent(routes.checkoutPayment)}>{lang('Click here')}</Text>
                            {' '}{lang('to try again')}.
                        </Text>
                        <Text>{' '}</Text>
                        <Text>{lang('If you already paid, your order will be processed automatically')}.</Text>
                    </> :
                    
                    <>
                        <Text>{lang('Waiting for payment')}</Text>
                        <Text>
                            <Timer running={state.isTimerRunning} onTimeout={() => {
                                if (state.status == 1) return;
                                Notification.error(lang('Payment expired'));
                                this.#blSocket?.close(); this.#blSocket = null;
                                this.setState({status: 2});
                            }} />{' '}
                            left
                        </Text>
                        <ActivityIndicator size="large" color="#00ff00" />
                    </>
                }</Box>
        </>;
    }
}

export default class CheckoutBlockonomics extends Content {
    static defaultParams = {
        headerBar: routes.checkoutBlockonomics.headerBar,
        url: routes.checkoutBlockonomics.url,
    };

    render() {
        return <TwoPane
            left={<Box style={styles.mr4}>
                <PaymentPanel data={this.data} pageSubmit={this.submitData} />
            </Box>}
            right={<Box style={styles.ml4}>
                <CartContent data={this.data} />
            </Box>}
        />;
    }
}