/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {Button, Form, Notification, Text, TextInput, ValidationContainer} from '../components';
import Content from './Content';
import routes from './routes';
import {correctWidth, emptyString, lang} from '../common';
import styles from '../styles';
import {required, email} from 'react-native-form-input-validator/rules';

export default class Forgotten extends Content {
    static defaultParams = {
        url: routes.forgotten.url,
        headerBar: routes.forgotten.headerBar,
        title: lang('Forgottenn'),
    };

    constructor(props) {
        super(props);
        Object.assign(this.state, {
            email: emptyString,
        });
    }

    getScroller() {
        const scroller = super.getScroller();
        scroller.props.contentContainerStyle = [styles.contentCentered, {flex:1}];
        return scroller;
    }

    render() {
        let form;
        return <Form ref={f => form = f} style={{width: correctWidth(300)}}>
            <ValidationContainer>
                <Text large para8>{lang("Please enter your email address")}</Text>
                <TextInput fixHeight para8 placeholder={lang("Email address")}
                    underlineColorAndroid="transparent" returnKeyType="done" keyboardType="email-address"
                    autoCorrect={false} spellCheck={false} autoCompleteType="off"
                    value={this.state.email} onChangeText={email => this.setState({email})}
                    validation={[required, email]}
                />
                <Button title={lang("Reset")} style={styles.buttonOutlinePrimary}
                    onPress={() => {
                        form.submitData('/customer/forgotten_action', {
                            email: this.state.email,
                        });
                    }}
                />
            </ValidationContainer>
        </Form>;
    }
}