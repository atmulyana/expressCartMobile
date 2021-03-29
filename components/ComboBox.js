/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import PropTypes from 'prop-types';
import Icon from './Icon';
import ValidatedInput from './ValidatedInput';
import styles from '../styles';

const inputStyle = [styles.textInput, styles.textInputHeight, { marginHorizontal: 2 }];

const defaultProps = {
    placeholder: {},
    style: {
        inputIOS: inputStyle,
        inputAndroid: inputStyle,
        iconContainer: {
            right: styles.textInput.borderWidth + 2,
            top: styles.textInput.paddingVertical + styles.textInput.borderWidth
        },
    },
    useNativeAndroidPickerStyle: false,
    Icon: () => <Icon icon="ChevronDown" width={styles.text.fontSize} height={styles.text.fontSize} />,
};

export default class ComboBox extends ValidatedInput {
    static propTypes = {
        ...RNPickerSelect.propTypes,
        onLayout: PropTypes.func,
    };
    // static defaultProps = {
    //     ...RNPickerSelect.defaultProps,
    // };

    _input;

    focus() {
        this._input?.inputRef?.focus();
    }

    render() {
        const props = this.setValidationHandler('onValueChange'), {errorStyle} = this.state;
        
        let {style} = defaultProps;
        if (props.style) {
            style = {...props.style};
            style.inputIOS = inputStyle.concat(style.inputIOS).concat(errorStyle);
            style.inputAndroid = inputStyle.concat(style.inputAndroid).concat(errorStyle);
            style.iconContainer = [defaultProps.style.iconContainer].concat(style.iconContainer);
        }

        if (typeof(props.onLayout) == 'function') {
            props.touchableWrapperProps = props.touchableWrapperProps ?? {};
            props.pickerProps = props.pickerProps ?? {};
            props.touchableWrapperProps.onLayout = props.pickerProps.onLayout = props.onLayout;
        }
        
        return <RNPickerSelect ref={input => this._input = input}  {...{...defaultProps, ...props, style}} />
    }
}