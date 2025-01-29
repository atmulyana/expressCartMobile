/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {
    ComboBox,
    LessPureComponent,
    Notification,
    Form,
    Text,
    TextInput,
    ValidationContainer,
} from '../../components';
import {emptyString, lang} from '../../common';
import styles from '../../styles';
import {email, required, strlen} from 'react-native-form-input-validator/rules';

const initState = (props, state) => {
    var data = props?.data?.session ?? {};
    Object.assign(state, {
        email: data.customerEmail ?? emptyString,
        company: data.customerCompany ?? emptyString,
        firstName: data.customerFirstname ?? emptyString,
        lastName: data.customerLastname ?? emptyString,
        address1: data.customerAddress1 ?? emptyString,
        address2: data.customerAddress2 ?? emptyString,
        country: data.customerCountry ?? emptyString,
        state: data.customerState ?? emptyString,
        postcode: data.customerPostcode ?? emptyString,
        phone: data.customerPhone ?? emptyString,
        password: emptyString,
        orderComment: data.orderComment ?? emptyString,
    });
}

export default class extends LessPureComponent {
    static propTypes = {
        header: PropTypes.element,
        footer: PropTypes.element,
    };

    _form;

    constructor(props) {
        super(props);
        initState(this.props, this.state);
    }

    submit(url = '/customer/update', extraData = {}) {
        return this._form.submitData(url, Object.assign({}, this.state, extraData));
    }

    shouldComponentUpdate(nextProps, nextState) {
        let should = super.shouldComponentUpdate(nextProps, nextState);
        if (this.props?.data?.session != nextProps.data?.session) {
            initState(nextProps, nextState);
        }
        return should;
    }

    render() {
        const state = this.state;
        return <Form ref={form => this._form = form} data={this.props.data}>
        <ValidationContainer>
            <Text large para8>{lang('Customer details')}</Text>

            {this.props.header}

            <TextInput placeholder={lang("Email address")} value={state.email} onChangeText={email => this.setState({email})}
                keyboardType="email-address" fixHeight para8 validation={[required, email, strlen(5)]} />
            <TextInput placeholder={lang("Company name")} value={state.company} onChangeText={company => this.setState({company})}
                fixHeight para8 />
            <View style={[styles.para8, {flexDirection:'row'}]}>
                <TextInput placeholder={lang("First name")} value={state.firstName} onChangeText={firstName => this.setState({firstName})}
                    fixHeight style={{flex:1}} validation={required} />
                <TextInput placeholder={lang("Last name")} value={state.lastName} onChangeText={lastName => this.setState({lastName})}
                    fixHeight ml4 style={{flex:1}} validation={required} />
            </View>
            <TextInput placeholder={lang("Address 1")} value={state.address1} onChangeText={address1 => this.setState({address1})}
                fixHeight para8 validation={required} />
            <TextInput placeholder={`${lang("Address 2")} (${lang("optional")})`} value={state.address2} onChangeText={address2 => this.setState({address2})}
                fixHeight para8 />
            <ComboBox
                placeholder={lang('Select Country')}
                value={state.country}
                onValueChange={country => this.setState({country})}
                style={styles.para8}
                validation={required}
            >{
                (this.props.data?.countryList ?? []).sort().map(countryName => <ComboBox.Item key={countryName} value={countryName} label={countryName} />)
            }</ComboBox>
            <View style={[styles.para8, {flexDirection:'row'}]}>
                <TextInput placeholder={lang("State")} value={state.state} onChangeText={state => this.setState({state})}
                    fixHeight style={{flex:1}} validation={required} />
                <TextInput placeholder={lang("Post code")} value={state.postcode} onChangeText={postcode => this.setState({postcode})}
                    fixHeight ml4 style={{flex:1}} validation={required} />
            </View>
            <TextInput placeholder={lang("Phone number")} value={state.phone} onChangeText={phone => this.setState({phone})}
                keyboardType="phone-pad" fixHeight para8 validation={required} />
            <TextInput placeholder={lang("Order comment")} value={state.orderComment} onChangeText={orderComment => this.setState({orderComment})}
                para8 multiline numberOfLines={3} />
            
            {this.props.footer}
        </ValidationContainer>
        </Form>;
    }
}