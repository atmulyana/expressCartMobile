/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 * 
 * To make 'style' writing shorter and handle validation
 */
import React from 'react';
import { TextInput } from 'react-native';
import PropTypes from 'prop-types';
import ValidatedInput from './ValidatedInput';
import styles from '../styles';

const propStyles = {
    editable: 'textInputDisabled',
    fixHeight: 'textInputHeight',
    multiline: 'textArea',
    para4: 'para4',
    para8: 'para8',
    p8: 'p8',
    ph8: 'ph8',
    ml4: 'ml4',
    mr4: 'mr4',
    m8: 'm8',
};

export default class extends ValidatedInput {
    static propTypes = {
        ...TextInput.propTypes,
        ...Object.fromEntries( Object.keys(propStyles).map(key => [ key, PropTypes.bool ]) ),
    };
    static defaultProps = {
        ...TextInput.defaultProps,
    };
    
    _txtInput = null;

    blur() {
        this._txtInput?.blur();
    }

    clear() {
        this._txtInput?.clear();
    }

    focus() {
        this._txtInput?.focus();
    }

    isFocused() {
        this._txtInput?.isFocused();
    }

    render() {
        const props = this.setValidationHandler('onChangeText');
        let style = [styles.textInput];
        for (let key in propStyles) if (props[key]) style.push( styles[ propStyles[key] ] );
        if (props.style) style = style.concat(props.style);
        if (this.state.errorStyle) style = style.concat(this.state.errorStyle);
        return <TextInput ref={inp => this._txtInput = inp} {...props} style={style} />;
    }
}