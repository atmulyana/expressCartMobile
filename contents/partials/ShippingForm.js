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
import {lang} from '../../common';
import styles from '../../styles';
import {email, required, strlen} from '../../validations';

const initState = (props, state) => {
    var data = props?.data?.session ?? {};
    Object.assign(state, {
        email: data.customerEmail ?? '',
        company: data.customerCompany ?? '',
        firstName: data.customerFirstname ??'',
        lastName: data.customerLastname ?? '',
        address1: data.customerAddress1 ?? '',
        address2: data.customerAddress2 ?? '',
        country: data.customerCountry ?? '',
        state: data.customerState ?? '',
        postcode: data.customerPostcode ?? '',
        phone: data.customerPhone ?? '',
        password: '',
        orderComment: data.orderComment ?? '',
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
        return this._form.submitData(url, Object.assign({}, this.state, extraData))
            .valid(data => {
                if (url == '/customer/update') Notification.success(lang('Customer saved'));
                return data;
            });
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
            <Text large para4>{lang('Customer details')}</Text>

            {this.props.header}

            <TextInput placeholder={lang("Email address")} value={state.email} onChangeText={email => this.setState({email})}
                keyboardType="email-address" fixHeight para4 validation={[required, email, strlen(5)]} />
            <TextInput placeholder={lang("Company name")} value={state.company} onChangeText={company => this.setState({company})}
                fixHeight para4 />
            <View style={[styles.para4, {flexDirection:'row'}]}>
                <TextInput placeholder={lang("First name")} value={state.firstName} onChangeText={firstName => this.setState({firstName})}
                    fixHeight style={{flex:1}} validation={required} />
                <TextInput placeholder={lang("Last name")} value={state.lastName} onChangeText={lastName => this.setState({lastName})}
                    fixHeight ml4 style={{flex:1}} validation={required} />
            </View>
            <TextInput placeholder={lang("Address 1")} value={state.address1} onChangeText={address1 => this.setState({address1})}
                fixHeight para4 validation={required} />
            <TextInput placeholder={`${lang("Address 2")} (${lang("optional")})`} value={state.address2} onChangeText={address2 => this.setState({address2})}
                fixHeight para4 />
            <ComboBox
                placeholder={{value: '', label: lang('Select Country')}}
                items={(this.props.data?.countryList ?? []).map(countryName => ({value: countryName, label: countryName}))}
                value={state.country}
                onValueChange={country => this.setState({country})}
                style={{
                    viewContainer: styles.para4,
                    headlessAndroidContainer: styles.para4,
                }}
                validation={required}
            />
            <View style={[styles.para4, {flexDirection:'row'}]}>
                <TextInput placeholder={lang("State")} value={state.state} onChangeText={state => this.setState({state})}
                    fixHeight style={{flex:1}} validation={required} />
                <TextInput placeholder={lang("Post code")} value={state.postcode} onChangeText={postcode => this.setState({postcode})}
                    fixHeight ml4 style={{flex:1}} validation={required} />
            </View>
            <TextInput placeholder={lang("Phone number")} value={state.phone} onChangeText={phone => this.setState({phone})}
                keyboardType="phone-pad" fixHeight para4 validation={required} />
            <TextInput placeholder={lang("Order comment")} value={state.orderComment} onChangeText={orderComment => this.setState({orderComment})}
                para4 multiline numberOfLines={3} />
            
            {this.props.footer}
        </ValidationContainer>
        </Form>;
    }
}