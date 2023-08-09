/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {Select, Option} from 'rn-select-option';
import ValidatedInput from './ValidatedInput';
import {shallowCompareExclude} from '../common';
import styles from '../styles';

export default class ComboBox extends ValidatedInput {
    constructor(props) {
        super(props, _Select);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompareExclude(this, nextProps, nextState, 'validation', 'onValueChange');
    }

    render() {
        return this.inputElement();
    }
}

ComboBox.Item = Option;

const _Select = React.forwardRef(function _Select({style, value, ...props}, ref) {
    return <Select {...props} ref={ref} selectedValue={value} style={[styles.textInput, styles.textInputHeight, style]} />
});