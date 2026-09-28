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
import React from 'react';
import { View } from 'react-native';

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
        <Text style={arrayStyle('textLarge', 'para8')}>{lang('Customer details')}</Text>

            {header}

            <TextInput
                keyboardType="email-address"
                loadingAware
                name="email"
                placeholder={lang("Email address")}
                style={arrayStyle('textInputHeight', 'para8')}
                value={session.customerEmail}
            />
            <TextInput
                loadingAware
                name="company"
                placeholder={lang("Company name")}
                style={arrayStyle('textInputHeight', 'para8')}
                value={session.customerCompany}
            />
            <View style={arrayStyle('flexRow', 'para8')}>
                <TextInput
                    loadingAware
                    name="firstName"
                    placeholder={lang("First name")}
                    style={arrayStyle('textInputHeight', 'flex1')}
                    value={session.customerFirstname}
                />
                <TextInput
                    loadingAware
                    name="lastName"
                    placeholder={lang("Last name")}
                    style={arrayStyle('textInputHeight', 'flex1', 'ml4')}
                    value={session.customerLastname}
                />
            </View>
            <TextInput
                loadingAware
                name="address1"
                placeholder={lang("Address 1")}
                style={arrayStyle('textInputHeight', 'para8')}
                value={session.customerAddress1}
            />
            <TextInput
                loadingAware
                name="address2"
                placeholder={`${lang("Address 2")} (${lang("optional")})`}
                style={arrayStyle('textInputHeight', 'para8')}
                value={session.customerAddress2}
            />
            <ComboBox
                loadingAware
                name="country"
                placeholder={lang('Select Country')}
                value={session.customerCountry}
                style={baseStyles.para8}
            >{(countryList ?? []).sort().map(countryName => (
                <ComboBox.Item key={countryName} value={countryName} label={countryName} />
            ))}</ComboBox>
            <View style={arrayStyle('flexRow', 'para8')}>
                <TextInput
                    loadingAware
                    name="state"
                    placeholder={lang("State")}
                    style={arrayStyle('textInputHeight', 'flex1')}
                    value={session.customerState}
                />
                <TextInput
                    loadingAware
                    name="postcode"
                    placeholder={lang("Post code")}
                    style={arrayStyle('textInputHeight', 'flex1', 'ml4')}
                    value={session.customerPostcode}
                />
            </View>
            <TextInput
                loadingAware
                name="phone"
                keyboardType="phone-pad"
                placeholder={lang("Phone number")}
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