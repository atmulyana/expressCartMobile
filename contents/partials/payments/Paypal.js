/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {Alert, Modal} from 'react-native';
import WebView from 'react-native-webview';
import PaymentComponent from './PaymentComponent';
import routes from '../../routes';
import {Button, Icon, SubmittingIndicator, Text} from '../../../components';
import {appHelpers, lang, serverUrl} from '../../../common';
import styles from '../../../styles';

const PaymenStatus = {
    Success: 0,
    Cancelled: 1,
    Error: 2,
    EmptyCart:3,
};

export default class Paypal extends PaymentComponent {
    state = {
        inProcess: false,
        isLoading: false,
        paypalVisible: false,
    };

    async _paymentStatus(code, url) {
        this.setState({paypalVisible: false});
        switch (code) {
            case PaymenStatus.Success:
                let queryIdx = url.indexOf('?');
                let query = queryIdx >= 0 ? url.substr(queryIdx) : ''; 
                this.props.pageSubmit(`/paypal/checkout_return${query}`, null);
                break;
            case PaymenStatus.Cancelled:
                //It's better to delete order from database (should be done in '/paypal/checkout_cancel' route handler in server app)
                Alert.alert(lang("Payment Status"), lang("The payment was cancelled"));
                break;
            case PaymenStatus.Error:
                appHelpers.replaceContent(routes.checkoutPayment);
                break;
            case PaymenStatus.EmptyCart:
                appHelpers.replaceContent(routes.home);
                break;
        }
    }

    render() {
        const {config, paymentConfig} = this.props;
        const {winInsets: insets} = appHelpers;
        const rootUrl = serverUrl('');
        return <>
            <Text para4>{paymentConfig.paypal.description}</Text>
            <Button
                style={[styles.buttonOutlineSuccess, {alignSelf:'flex-start'}]}
                title={lang('Pay with PayPal')}
                onPress={() => this.setState({isLoading: true, paypalVisible: true})}
            />
            <Modal
                onDismiss={() => this.setState({inProcess: false})}
                onShow={() => this.setState({inProcess: true})}
                visible={this.state.paypalVisible}
            >
                <WebView
                    cacheMode="LOAD_NO_CACHE"
                    onNavigationStateChange={(navState) => {
                        if (navState.url?.includes('paypal.com') && !navState.loading) this.setState({isLoading: false});
                    }}
                    onShouldStartLoadWithRequest={(request) => {
                        if (request.url == `${rootUrl}/checkout/payment`) {
                            this._paymentStatus(PaymenStatus.Error);
                            return false;
                        }
                        else if (request.url == `${rootUrl}/` || request.url == rootUrl) {
                            this._paymentStatus(PaymenStatus.EmptyCart);
                            return false;
                        }
                        else if (request.url?.startsWith(`${config.baseUrl}/paypal/checkout_cancel`)) {
                            this._paymentStatus(PaymenStatus.Cancelled);
                            return false;
                        }
                        else if (request.url?.startsWith(`${config.baseUrl}/paypal/checkout_return`)) {
                            this._paymentStatus(PaymenStatus.Success, request.url);
                            return false;
                        }
                        return true;
                    }}
                    sharedCookiesEnabled={true}
                    source={this.state.inProcess ? {uri: `${rootUrl}/paypal/checkout_action`, method: 'POST'} : {uri: null}}
                    // startInLoadingState={true}
                    // renderLoading={() => <SubmittingIndicator visible={true} />}
                    style={[{position: 'absolute'}, insets]}
                    thirdPartyCookiesEnabled={true}
                />
                <SubmittingIndicator visible={this.state.isLoading} />
                <Icon icon="X" strokeWidth={4} height={16} width={16}
                    style={{opacity: 0.3, position:'absolute', right: insets.right + 2, top: insets.top + 2}}
                    onPress={() => {
                        this.setState({paypalVisible: false});
                        this._paymentStatus(PaymenStatus.Cancelled);
                    }}
                />
            </Modal>
        </>;
    }
}