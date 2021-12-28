/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {View} from 'react-native';
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

    #input;
    #inputLayout;

    focus() {
        this.#input?.inputRef?.focus();
    }

    render() {
        let props = this.setValidationHandler('onValueChange'),
            containerProps = {},
            {errorStyle} = this.state,
            {style} = defaultProps;

        if (props.style) {
            style = {...props.style};
            style.inputIOS = inputStyle.concat(style.inputIOS).concat(errorStyle);
            style.inputAndroid = inputStyle.concat(style.inputAndroid).concat(errorStyle);
            style.iconContainer = [defaultProps.style.iconContainer].concat(style.iconContainer);
            if (style.viewContainer) {
                containerProps.style = style.viewContainer;
                delete style.viewContainer;
            }
        }
        
        props = {
            ...defaultProps,
            ...props,
            style,
            useNativeAndroidPickerStyle: false, //Always headless on android to make tiny height combobox
        };
        
        if (typeof(props.onLayout) == 'function') {
            props.textInputProps = props.textInputProps ?? {};
            props.textInputProps.onLayout = ev => this.#inputLayout = ev.nativeEvent.layout;
            containerProps.onLayout = ev => {
                if (this.#inputLayout) {
                    ev.nativeEvent.layout = {
                        ...ev.nativeEvent.layout,
                        height: this.#inputLayout.height,
                        width: this.#inputLayout.width,
                    };
                }
                props.onLayout(ev);
            };
        }
        
        return <View {...containerProps}>
            <RNPickerSelect {...props} ref={input => this.#input = input} />
        </View>;
    }
}