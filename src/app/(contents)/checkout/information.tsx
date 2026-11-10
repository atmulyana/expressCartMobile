/**
 * https://github.com/atmulyana/expressCartMobile
 */
import {
    Box,
    Button,
    CheckBox,
    Content,
    Text,
    TextInput,
    TwoPane,
} from "@/components";
import Cart from "@/components/partials/Cart";
import ShippingForm from "@/components/partials/ShippingForm";
import {
    useCart,
    useData,
    useForm,
    useLang,
    useNavHelpers,
    useSession,
    useStyles
} from "@/hooks";
import { setSession } from "@/hooks/session";
import { login, logout } from "@/libs/session";
import baseStyles, { arrayStyle } from "@/styles";
import type { Customer, SubmitFunction, ValidationValueRef } from '@/types';
import { email, required } from '@react-input-validator/rules';
import { emptyArray, emptyString } from "javascript-common";
import React from 'react';
import {
    TextInput as RNTextInput,
    View,
} from "react-native";

export default function CheckoutInformation() {
    const [{countryList}] = useData({
        countryList: emptyArray as string[],
    });
    const [Form, submit] = useForm();
    const lang = useLang();

    return <Content title={`${lang('Checkout', 1)} - ${lang('Information')}`}>
        <TwoPane reverse
            left={<Box style={baseStyles.m0}>
                <Form>
                    <ShippingForm
                        countryList={countryList}
                        footer={<FormFooter submit={submit} />}
                        header={<FormHeader submit={submit} />}
                    />
                </Form>
            </Box>}
            right={<View style={baseStyles.m_8}>
                <Cart homeAfterClear showCheckoutButton={false} />
            </View>}
        />
    </Content>;
}

function FormFooter({
    submit,
}: {
    submit: SubmitFunction,
}) {
    const cart = useCart();
    const [createAccount, setCreateAccount] = React.useState(false);
    const lang = useLang();
    const nav = useNavHelpers();
    const pwdRef = React.useRef<ValidationValueRef<RNTextInput>>(null);
    const session = useSession();
    const styles = useStyles();

    return <>
        <TextInput
            loadingAware
            multiline
            name="orderComment"
            numberOfLines={3}
            placeholder={lang("Order comment")}
            style={baseStyles.para8}
            value={cart.orderComment}
        />
        {!session.customerPresent && <>
            <Text style={styles.array('txt-disabled', 'para4')}>{lang('Enter a password to create an account for next time')}</Text>
            <View style={arrayStyle('flexRow', 'para8')}>
                <TextInput
                    loadingAware
                    name="password"
                    placeholder={lang('Password')}
                    ref={pwdRef}
                    secureTextEntry
                    style={baseStyles.flex1}
                    rules={required.if(() => createAccount)}
                />
                <View style={arrayStyle('flex1', 'flexRow', 'ml4')}>
                    <CheckBox
                        loadingAware
                        onValueChange={createAccount => {
                            setCreateAccount(createAccount ?? false);
                            if (!createAccount && pwdRef.current) pwdRef.current.clearValidation();
                        }}
                        value={createAccount}
                    />
                    <Text style={arrayStyle('center', 'lineSlim', 'ml4')}>{lang('Create an account')}</Text>
                </View>
            </View>
        </>}
        <View style={arrayStyle('flexRow', 'justifyBetween')}>
            <Button loadingAware>{lang('Return to cart')}</Button>
            <Button
                loadingAware
                onPress={() => {
                    submit({
                        message: `${lang('Saving customer data')}...`,
                        onSubmitted: async (custObj: Customer) => {
                            await setSession({
                                customerPresent: true,
                                customerEmail: custObj.email,
                                customerCompany: custObj.company,
                                customerFirstname: custObj.firstName,
                                customerLastname: custObj.lastName,
                                customerAddress1: custObj.address1,
                                customerAddress2: custObj.address2,
                                customerCountry: custObj.country,
                                customerState: custObj.state,
                                customerPostcode: custObj.postcode,
                                customerPhone: custObj.phone,
                            });
                            nav.goto('/checkout/shipping');
                            return false;
                        },
                        url: !session.customerPresent && createAccount ? '/customer/create' : '/customer/save',
                    });
                }}
            >{lang('Continue to shipping')}</Button>
        </View>
    </>;
}

function FormHeader({
    submit,
}: {
    submit: SubmitFunction,
}) {
    const lang = useLang();
    const session = useSession();

    return session.customerPresent ? (
        <Button
            onPress={async () => await logout(submit, lang('Please relogin as the user that you want'))}
            style={arrayStyle('end', 'para8')}
        >
            {lang('Change customer')}
        </Button>
    ) : (
        <LoginForm />
    );
}

function LoginForm() {
    const [loginEmail, setLoginEmail] = React.useState(emptyString);
    const [password, setPassword] = React.useState(emptyString);
    
    const lang = useLang();
    const nav = useNavHelpers();

    const [Form, submit] = useForm(async (data) => {
        await login(loginEmail, password);
        if (data?.session?.customerPresent === true) {
            await setSession(data.session);
        }
        else {
            nav.refresh();
        }
        return true;
    });

    return <Form>
        <Text style={baseStyles.para8}>{lang('Existing customer')}</Text>
        <TextInput
            autoComplete="off"
            autoCorrect={false} 
            keyboardType="email-address"
            loadingAware
            name="loginEmail"
            onValueChange={email => setLoginEmail(email)}
            placeholder={lang("Email address")}
            spellCheck={false}
            returnKeyType="done"
            rules={[email, required]}
            style={baseStyles.para8}
            underlineColorAndroid="transparent"
            value={loginEmail}
        />
        <TextInput
            autoComplete="off"
            autoCorrect={false}
            loadingAware
            name="loginPassword"
            onValueChange={pwd => setPassword(pwd)}
            placeholder={lang("Password")}
            returnKeyType="done"
            rules={required}
            secureTextEntry
            spellCheck={false}
            style={baseStyles.para8}
            underlineColorAndroid="transparent"
            value={password}
        />
        <View style={arrayStyle('flexRow', 'justifyBetween', 'para8')}>
            <Button loadingAware>{lang('Forgotten')}</Button>
            <Button
                loadingAware
                onPress={() => {
                    submit({
                        message: lang('Logging in') + '...',
                        url: '/customer/login_action',
                    });
                }}
            >{lang('Login')}</Button>
        </View>
    </Form>;
}