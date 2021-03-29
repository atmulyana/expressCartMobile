/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {
    StyleSheet,
    View,
    ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import LessPureComponent from './LessPureComponent';
import Text from './Text';
import {inputError as inputErrorStyle} from '../styles';
import {ValidationRule, Required, validate} from '../validations';

export default class Validation extends LessPureComponent {
    static propTypes = {
        ...ViewPropTypes,
        input: PropTypes.func,
        rule: PropTypes.oneOfType([PropTypes.instanceOf(ValidationRule), PropTypes.arrayOf(PropTypes.instanceOf(ValidationRule))]),
        value: PropTypes.any,
    };
    static defaultProps = {
        ...View.defaultProps,
        rule: new Required(),
    };

    constructor(props) {
        super(props);
        this.state.layout = props.layout;
    }

    state = {
        error: '',
        layout: null,
    }

    setLayout(layout) {
        this.setState({layout});
    }
    
    validate() {
        const props = this.props;
        const input = props.input && props.input();

        let value = props.value;
        if (typeof(value) == 'function') value = value();
        else if (value === undefined && input) {
            value = input?.props?.value;
        }

        let error = validate(value, props.rule);
        //if (typeof(error) == 'function') error = error();
        if (typeof(error) == 'string') {
            error = error.trim();
            this.setState({error});
            typeof(input?.setErrorStyle) == 'function' && input.setErrorStyle(error ? inputErrorStyle : null);
            error && typeof(input?.focus) == 'function' && input.focus();
            return !error;
        }
        else {
            this.clearValidation();
        }
        return true;
    }

    clearValidation() {
        const input = this.props.input && this.props.input();
        this.setState({error: ''});
        typeof(input?.setErrorStyle) == 'function' && input.setErrorStyle(null);
    }

    render() {
        const {layout, error} = this.state;
        let style = [];
        if (this.props.style) style = style.concat(this.props.style);
        if (layout) style.push({top: layout.y + layout.height, left: layout.x, width: layout.width});
        return <View {...this.props} style={style}>
            {this.props.children}
            <Text small error style={[errorStyle, {display: error ? 'flex' : 'none'}]}>{error}</Text>
        </View>
    }
}

const {errorStyle} = StyleSheet.create({
    errorStyle: {
        //bottom: -5,
        //position: 'absolute',
        //right: 4,
        alignSelf: 'flex-end',
        paddingHorizontal: 4,
        top: -5,
        zIndex: 10,
    }
});