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
import CreditCard from 'rn-cc-input';
import {Button, Text, Validation} from '../../../components';
import {lang} from '../../../common';
import styles from '../../../styles';

const ccInputStyle = [styles.textInput, styles.textInputHeight, styles.para4],
      ccInputStyleError = {borderColor: styles.red};

export default function CreditCardPayment({ccProps, onSubmit, pageSubmit, paymentConfig, submitData}) {
    const {current: cc} = React.useRef({
        input: null,
        validator: null,
        errMessage: null,
    });
    cc.invalidMessage = lang('Invalid Credit Card');
    const inputRef = React.useCallback(comp => cc.input = comp, []),
          inputValue = React.useCallback(() => cc.input?.value, []),
          validatorRef = React.useCallback(comp => cc.validator = comp, []),
          validatorRef2 = React.useCallback(() => cc.validator, []);

    return <>
        <Text para4>{paymentConfig.description}</Text>
        <CreditCard {...ccProps}
            cardHolderText={lang('Card holder')}
            ifValidNumberNext={true}
            numberText={lang('Card number')}
            placeholderTextColorError={styles.red}
            postalCodeText={lang('Post code')}
            ref={inputRef}
            style={ccInputStyle}
            styleError={ccInputStyleError}
            validator={validatorRef2}
        />
        <Validation
            errorTextStyle={[{marginTop: 0}, styles.para4]}
            ref={validatorRef}
            rules={[
                required,
                rule(() => {
                    let status;
                    if (!cc.input?.isValid) status = cc.invalidMessage;
                    else if (!cc.errMessage) status = true;
                    else status = cc.errMessage;
                    return status;
                })
            ]}
            value={inputValue}
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