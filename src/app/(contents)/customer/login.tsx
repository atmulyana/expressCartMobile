/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { Button, Content, Text, TextInput } from '@/components';
import { useCorrectWidth, useForm, useLang, useSession, useStyles } from '@/hooks';
import { login } from '@/libs/session';
import { email, required } from '@react-input-validator/rules';
import { Redirect } from 'expo-router';
import { emptyString } from 'javascript-common';
import React from 'react';

export default function CustomerLogin() {
    const [loginEmail, setLoginEmail] = React.useState(emptyString);
    const [password, setPassword] = React.useState(emptyString);
   
    const formWidth = useCorrectWidth(300);
    const [Form, submit] = useForm(async () => {
        await login(loginEmail, password);
    });
    const lang = useLang();
    const session = useSession();
    const styles = useStyles();

    if (session.customerPresent) {
        return <Redirect href="/customer/account" />;
    }

    return <Content
        contentContainerStyle={styles.array('contentCentered', 'flex1')}
        noData
        title={lang('Customer login')}
    >   
        <Form style={{width: formWidth}}>
            <Text style={styles.array('textLarge', 'para4')}>{lang("Please sign in")}</Text>
            <TextInput
                autoComplete="off"
                autoCorrect={false} 
                keyboardType="email-address"
                name="loginEmail"
                onValueChange={email => setLoginEmail(email)}
                placeholder={lang("Email address")}
                spellCheck={false} 
                returnKeyType="done"
                rules={[email, required]}
                style={styles.array('textInputHeight', 'para8')}
                underlineColorAndroid="transparent"
                value={loginEmail}
            />
            <TextInput
                autoComplete="off"
                autoCorrect={false}
                name="loginPassword"
                onValueChange={pwd => setPassword(pwd)}
                placeholder={lang("Password")}
                returnKeyType="done"
                rules={required}
                secureTextEntry
                spellCheck={false}
                style={styles.array('textInputHeight', 'para8')}
                underlineColorAndroid="transparent"
                value={password}
            />
            <Button
                style={styles.array('btn-outline-neutral', 'stretch', 'textCenter')}
                pressedStyle={styles.get('btn-neutral')}
                onPress={() => {
                    submit({
                        url: '/customer/login_action',
                        message: lang('Logging in') + '...',
                    });
                }}
            >{lang("Sign in")}</Button>
        </Form>
    </Content>;
}
