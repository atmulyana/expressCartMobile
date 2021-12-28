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
import {noop} from '../common';
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
        input: noop,
        rule: new Required(),
    };

    state = {
        error: '',
        layout: null,
    }

    #currentLang;

    getErrorMessage() {
        let {input, rule, value} = this.props;
        input = input();

        if (typeof(value) == 'function') value = value();
        else if (value === undefined && input) value = input.props?.value;

        let error = validate(value, rule);
        //if (typeof(error) == 'function') error = error();
        if (typeof(error) == 'string') {
            return error.trim();
        }
        return '';
    }

    setLayout(layout) {
        if (this.isMounted) this.setState({layout});
        else this.state.layout = layout;
    }
    
    validate() {
        let error = this.getErrorMessage();
        this.setState({error});
        let input = this.props.input();
        typeof(input?.setErrorStyle) == 'function' && input.setErrorStyle(error ? inputErrorStyle : null);
        error && typeof(input?.focus) == 'function' && input.focus();
        return !error;
    }

    clearValidation() {
        const input = this.props.input();
        this.setState({error: ''});
        typeof(input?.setErrorStyle) == 'function' && input.setErrorStyle(null);
    }

    componentDidMount() {
        super.componentDidMount();
        this.#currentLang = this.state.lang;
    }

    componentDidUpdate() {
        if (this.state.lang != this.#currentLang //languange has just changed
            && this.state.error //the input is invalid at the moment
        ) {
            //updates the language of error message
            this.#currentLang = this.state.lang;
            let error = this.getErrorMessage();
            this.setState({error});
        }
    }

    render() {
        const {props: {children, style}, state: {error, layout}} = this;
        let styles = [];
        if (style) styles = styles.concat(style);
        if (layout) styles.push({top: layout.y + layout.height, left: layout.x, width: layout.width});
        return <View {...this.props} style={styles}>
            {children}
            <Text small error style={[errorStyle, {display: error ? 'flex' : 'none'}]}>{error}</Text>
        </View>;
    }
}

const {errorStyle} = StyleSheet.create({
    errorStyle: {
        alignSelf: 'flex-end',
        paddingHorizontal: 4,
        top: -5,
        zIndex: 999,
    }
});