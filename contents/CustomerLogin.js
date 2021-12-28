/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {Button, Form, Text, TextInput, ValidationContainer} from '../components';
import Content from './Content';
import routes from './routes';
import {appHelpers, correctWidth, lang} from '../common';
import styles from '../styles';
import {email, required} from '../validations';

export default class CustomerLogin extends Content {
    static defaultParams = {
        headerBar: routes.customerLogin.headerBar,
        title: lang('Customer login'),
    };
    
    constructor(props) {
        super(props);
        Object.assign(this.state, {
            email: '',
            password: '',
        });
    }

    getScroller() {
        const scroller = super.getScroller();
        scroller.props.contentContainerStyle = [styles.contentCentered, {flex:1}];
        return scroller;
    }

    render() {
        const state = this.state;
        let form;
        return <Form ref={f => form = f} style={{width:correctWidth(300)}}>
            <ValidationContainer>
                <Text large para4>{lang("Please sign in")}</Text>
                <TextInput fixHeight para8 placeholder={lang("Email address")}
                    underlineColorAndroid="transparent" returnKeyType="done" keyboardType="email-address"
                    autoCorrect={false} spellCheck={false} autoCompleteType="off"
                    value={state.email} onChangeText={email => this.setState({email})}
                    validation={[required, email]}
                />
                <TextInput fixHeight para8 placeholder={lang("Password")}
                    underlineColorAndroid="transparent" returnKeyType="done" secureTextEntry
                    autoCorrect={false} spellCheck={false} autoCompleteType="off"
                    value={state.password} onChangeText={password => this.setState({password})}
                    validation={required}
                />
                <Button title={lang("Sign in")} style={styles.buttonOutlinePrimary}
                    onPress={() => {
                        form.submitData('/customer/login_action', {
                            loginEmail: state.email,
                            loginPassword: state.password,
                        })
                        .valid(() => {
                            appHelpers.login(state.email, state.password);
                            appHelpers.replaceContent(routes.customerAccount);
                        });
                    }}
                />
            </ValidationContainer>
        </Form>;
    }
}