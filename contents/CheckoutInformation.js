/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {View} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {Box, Button, LessPureComponent, Form, Text, TextInput, TwoPane, ValidationContainer} from '../components';
import Content from './Content';
import routes from './routes';
import Cart from './partials/Cart';
import ShippingForm from './partials/ShippingForm';
import {appHelpers, emptyString, lang} from '../common';
import styles from '../styles';
import {email, required, strlen} from 'react-native-form-input-validator/rules';


class LoginForm extends LessPureComponent {
    state = {
        loginEmail: emptyString,
        loginPassword: emptyString,
    }
    render() {
        const state = this.state;
        let form;
        return <Form ref={frm => form = frm}>
            <ValidationContainer>
                <Text para8>{lang('Existing customer')}</Text>
                <TextInput placeholder={lang('Email address')} value={state.loginEmail}
                    onChangeText={loginEmail => this.setState({loginEmail})}
                    keyboardType="email-address" fixHeight para8 validation={[required, email, strlen(5)]} />
                <TextInput placeholder={lang('Password')} value={state.loginPassword}
                    onChangeText={loginPassword => this.setState({loginPassword})}
                    secureTextEntry={true} fixHeight para8 validation={required} />
                <View style={[styles.para8, {flexDirection:'row', justifyContent:'space-between'}]}>
                    <Button title={lang('Forgotten')} onPress={() => appHelpers.loadContent(routes.forgotten)} />
                    <Button title={lang('Login')}
                        onPress={() => {
                            form.submitData('/customer/login_action', state)
                            .valid(() => {
                                appHelpers.login(state.loginEmail, state.loginPassword);
                                appHelpers.refreshContent();
                            });
                        }}
                    />
                </View>
            </ValidationContainer>
        </Form>
    }
}

export default class CheckoutInformation extends Content {
    static defaultParams = {
        headerBar: routes.checkoutInformation.headerBar,
        title: lang('Checkout - Information'),
        url: routes.checkoutInformation.url,
    };

    state = Object.assign(this.state, {
        createAccount: false,
        password: emptyString,
    });
    
    render() {
        const state = this.state;
        const refs = {
            pwdInput: null,
            shipping: null,
        }
        return <TwoPane
            left={<Box>
                <ShippingForm ref={comp => refs.shipping = comp}
                    data={this.data}
                    header={appHelpers.isLoggedIn
                        ? <Button title={lang('Change customer')} onPress={appHelpers.doLogout} style={[styles.para8, {alignSelf:'flex-end'}]} />
                        : <LoginForm />
                    }
                    footer={<>
                        {!appHelpers.isLoggedIn && <>
                            <Text gray para4>{lang('Enter a password to create an account for next time')}</Text>
                            <View style={[styles.para8, {flexDirection:'row'}]}>
                                <TextInput
                                    ref={inp => refs.pwdInput = inp}
                                    placeholder={lang('Password')}
                                    value={state.password}
                                    onChangeText={password => this.setState({password})}
                                    secureTextEntry={true}
                                    style={{flex:1}} fixHeight
                                    validation={required.if(() => this.state.createAccount)}
                                />
                                <View style={[styles.ml4, {flex:1, flexDirection:'row'}]}>
                                    <CheckBox 
                                        boxType="square"
                                        value={state.createAccount}
                                        onValueChange={createAccount => {
                                            this.setState({createAccount});
                                            if (!createAccount) refs.pwdInput.clearValidation();
                                        }}
                                        tintColors={{false:styles.box.borderColor}} tintColor={styles.box.borderColor}
                                        onCheckColor={styles.button.color} onFillColor={styles.button.backgroundColor}
                                        style={{height: styles.textInputHeight.height}}
                                    />
                                    <Text style={{alignSelf:'center', lineHeight:styles.text.fontSize}}>{lang('Create an account')}</Text>
                                </View>
                            </View>
                        </>}
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <Button title={lang('Return to cart')}
                                onPress={() => appHelpers.loadContent(routes.checkoutCart)}
                            />
                            <Button title={lang('Continue to shipping')}
                                onPress={() => {
                                    refs.shipping.submit(
                                        !appHelpers.isLoggedIn && state.createAccount ? '/customer/create' : '/customer/save',
                                        {password: state.password}
                                    )
                                    .valid(() => appHelpers.loadContent(routes.checkoutShipping));
                                }}
                            />
                        </View>
                    </>}
                />
            </Box>}

            right={<Cart showCheckoutButton={false} data={this.data} />}
        />;
    }
}