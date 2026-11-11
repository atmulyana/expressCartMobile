/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { Button, Content, Text, TextInput } from '@/components';
import { useCorrectWidth, useForm, useLang, useSession, useStyles } from '@/hooks';
import type { Rules } from '@react-input-validator/native';
import { email, required } from '@react-input-validator/rules';
import { Redirect } from 'expo-router';

const rules: Rules = [email, required];

export default function CustomerForgotten() {
    const formWidth = useCorrectWidth(300);
    const [Form, submit] = useForm();
    const lang = useLang();
    const session = useSession();
    const styles = useStyles();

    if (session.customerPresent) {
        return <Redirect href="/customer/account" />;
    }

    return <Content
        contentContainerStyle={styles.array('contentCentered', 'flex1')}
        noData
        title={lang('Forgottenn')}
    >   
        <Form style={{width: formWidth}}>
            <Text style={styles.array('textLarge', 'para8')}>{lang("Please enter your email address")}</Text>
            <TextInput
                autoComplete="off"
                autoCorrect={false} 
                keyboardType="email-address"
                name="email"
                placeholder={lang("Email address")}
                spellCheck={false} 
                returnKeyType="done"
                rules={rules}
                style={styles.para8}
                underlineColorAndroid="transparent"
            />
            <Button
                style={styles.array('btn-outline-neutral', 'stretch', 'textCenter')}
                pressedStyle={styles.get('btn-neutral')}
                onPress={() => {
                    submit('/customer/forgotten_action');
                }}
            >{lang("Reset")}</Button>
        </Form>
    </Content>;
}
