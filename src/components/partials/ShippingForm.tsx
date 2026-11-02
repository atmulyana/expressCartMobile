/**
 * https://github.com/atmulyana/expressCartMobile
 */
import {
    ComboBox,
    Text,
    TextInput
} from '@/components';
import {
    useLang,
    useSession
} from '@/hooks';
import baseStyles, { arrayStyle } from '@/styles';
import { type Rules } from '@react-input-validator/native';
import { email, length, regex, required } from '@react-input-validator/rules';
import React from 'react';
import { View } from 'react-native';

const emailRules: Rules = [required, email, length(5)];
const phoneRegex = /^(?:\+([1-9]\d{0,2})|\(\+([1-9]\d{0,2})\)|0)(\d{1,3})(?:-\d+)*-?\d+$/;

const ShippingForm = React.memo(function ShippingForm({
    countryList,
    header,
    footer,
}: {
    countryList: string[],
    header?: React.ReactNode,
    footer?: React.ReactNode,
}) {
    const lang = useLang();
    const session = useSession();

    return <>
        <Text style={arrayStyle('textBold', 'textLarge', 'para8')}>{lang('Customer details')}</Text>

        {header}

        <TextInput
            keyboardType="email-address"
            loadingAware
            name="email"
            notMoreLoading
            placeholder={lang("Email address")}
            rules={emailRules}
            style={arrayStyle('textInputHeight', 'para8')}
            value={session.customerEmail}
        />
        <TextInput
            loadingAware
            name="company"
            notMoreLoading
            placeholder={lang("Company name")}
            style={arrayStyle('textInputHeight', 'para8')}
            value={session.customerCompany}
        />
        <View style={arrayStyle('flexRow', 'para8')}>
            <TextInput
                loadingAware
                name="firstName"
                notMoreLoading
                placeholder={lang("First name")}
                rules={required}
                style={arrayStyle('textInputHeight', 'flex1')}
                value={session.customerFirstname}
            />
            <TextInput
                loadingAware
                name="lastName"
                notMoreLoading
                placeholder={lang("Last name")}
                rules={required}
                style={arrayStyle('textInputHeight', 'flex1', 'ml4')}
                value={session.customerLastname}
            />
        </View>
        <TextInput
            loadingAware
            name="address1"
            notMoreLoading
            placeholder={lang("Address 1")}
            rules={required}
            style={arrayStyle('textInputHeight', 'para8')}
            value={session.customerAddress1}
        />
        <TextInput
            loadingAware
            name="address2"
            notMoreLoading
            placeholder={`${lang("Address 2")} (${lang("optional")})`}
            style={arrayStyle('textInputHeight', 'para8')}
            value={session.customerAddress2}
        />
        <ComboBox
            loadingAware
            name="country"
            notMoreLoading
            placeholder={lang('Select Country')}
            rules={required}
            style={baseStyles.para8}
            value={session.customerCountry}
        >{(countryList ?? []).sort().map(countryName => (
            <ComboBox.Item key={countryName} value={countryName} label={countryName} />
        ))}</ComboBox>
        <View style={arrayStyle('flexRow', 'para8')}>
            <TextInput
                loadingAware
                name="state"
                notMoreLoading
                placeholder={lang("State")}
                rules={required}
                style={arrayStyle('textInputHeight', 'flex1')}
                value={session.customerState}
            />
            <TextInput
                loadingAware
                name="postcode"
                notMoreLoading
                placeholder={lang("Post code")}
                rules={required}
                style={arrayStyle('textInputHeight', 'flex1', 'ml4')}
                value={session.customerPostcode}
            />
        </View>
        <TextInput
            loadingAware
            name="phone"
            notMoreLoading
            keyboardType="phone-pad"
            placeholder={lang("Phone number")}
            rules={[
                required,
                regex(phoneRegex).setErrorMessage(lang('invalid phone number'))
            ]}
            style={arrayStyle('textInputHeight', 'para8')}
            value={session.customerPhone}
        />
        
        {footer}
        {/* 
        //PART OF `footer` in checkout info
        <TextInput
            loadingAware
            multiline
            name="orderComment"
            numberOfLines={3}
            placeholder={lang("Order comment")}
            style={baseStyles.para8}
            value={cart.orderComment}
        /> */}
    </>;
});
export default ShippingForm;