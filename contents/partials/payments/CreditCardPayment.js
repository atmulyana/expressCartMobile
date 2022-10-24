/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import PropTypes from 'prop-types';
import {required, rule} from 'react-native-form-input-validator/rules';
import {Button, CreditCard, Text, Validation} from '../../../components';
import {lang} from '../../../common';
import styles from '../../../styles';

export default function CreditCardPayment({ccProps, onSubmit, pageSubmit, paymentConfig, submitData}) {
    const cc = {
        input: null,
        validator: null,
        errMessage: null,
    };

    return <>
        <Text para4>{paymentConfig.description}</Text>
        <CreditCard  {...ccProps} ref={comp => cc.input = comp} style={styles.para4} validator={() => cc.validator} />
        <Validation
            errorTextStyle={[{marginTop: 0}, styles.para4]}
            ref={comp => cc.validator = comp}
            rules={[
                required,
                rule(() => {
                    let status;
                    if (!cc.input?.isValid) status = lang('Invalid Credit Card');
                    else if (!cc.errMessage) status = true;
                    else status = cc.errMessage;
                    return status;
                })
            ]}
            value={() => cc.input?.value}
        />
        <Button
            onPress={() => {
                cc.errMessage = null;
                let isValid = cc.validator?.validate();
                cc.input?.setValidationError(!isValid);
                if (!isValid) return;
                onSubmit({cc, pageSubmit, paymentConfig, submitData})
            }}
            pressedStyle={styles.buttonOutlineSuccessPressed}
            style={[styles.buttonOutlineSuccess, {alignSelf:'flex-start'}]}
            title={lang('Process Payment')}
        />
    </>;
}

CreditCardPayment.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    pageSubmit: PropTypes.func.isRequired,ccProps: PropTypes.object,
    paymentConfig: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
};