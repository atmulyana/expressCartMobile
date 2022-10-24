/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import IconTextInput from './IconTextInput';
import Button from './Button';
import styles from '../styles';

const PADDING_BUTTON = 4;
const defaultStyles = StyleSheet.create({
    button: {
        fontSize: 14,
    }
});
const requiredStyles = StyleSheet.create({
    button: {
        alignSelf: 'stretch',
        flex: 1,
        borderWidth: 0,
        borderRadius: 0,
        maxWidth: '100%',
        paddingBottom: 0,
        paddingEnd: PADDING_BUTTON,
        paddingHorizontal: PADDING_BUTTON,
        paddingLeft: PADDING_BUTTON,
        paddingStart: PADDING_BUTTON,
        paddingRight: PADDING_BUTTON,
        paddingTop: 0,
        paddingVertical: 0,
    }
});

const getButtonStyle = (iconStyle, textStyle) => {
    const style = [defaultStyles.button, styles.button, iconStyle];
    if (textStyle.fontSize) style.push({fontSize: textStyle.fontSize});
    style.push(requiredStyles.button);
    return style;
};

const intVal = strValue => {
    let val = parseInt(strValue);
    if (isNaN(val)) return undefined;
    return val;
};

class IntegerSpinner extends IconTextInput {
    static propTypes = {
        ...super.propTypes,
        max: PropTypes.number,
        min: PropTypes.number,
        value: PropTypes.number,
        onExceedMax: PropTypes.func,
        onLessMin: PropTypes.func,
        onValueChange: PropTypes.func,
    };

    state = Object.assign(this.state /* super.state */, {
        editingValue: undefined,
        internalUpdate: false,
        value: '0',
        valueEntered: undefined,
    });

    static getDerivedStateFromProps(props, state) {
        state = super.getDerivedStateFromProps(props, state);
        if (state.internalUpdate) {
            //By setting it to false, it causes internal update (by calling setState) always triggers componentDidUpdate
            //It's usefull to keep triggerring onLessMin and onExceedMax event when the +/- button is pressed repeatedly
            //even though it has reached the limit.
            //On the other hand, it's also to identify whether the next update is triggered internally or externally.
            state.internalUpdate = false;
        }
        else {
            state.value = props.value ?? '';
        }
        state.value = (state.value+'').trim();
        
        let value = parseInt(state.value) || 0;
        state.valueEntered = value;
        if (props.min !== undefined) {
            const min = Math.ceil(props.min);
            if (value < min) value = min;
        }
        if (props.max !== undefined) {
            const max = Math.floor(props.max);
            if (value > max) value = max;
        }
        state.value = value + '';
        return state;
    }

    setState(state, callback) {
        this.state.internalUpdate = true;
        super.setState(state, callback);
    }

    getProps(props) {
        props.textAlign = props.textAlign ?? 'center';  //props.style = props.style ? [styles.textCenter].concat(props.style) : styles.textCenter;
        props.value = this.state.editingValue !== undefined ? this.state.editingValue : this.state.value;
        this.state.editingValue = undefined;
        props.keyboardType = "numeric";
        props.returnKeyType = "done";
        props.onEndEditing = ev => this.setState({value: ev.nativeEvent.text, editingValue: undefined});
        
        const onChangeText = props.onChangeText;
        props.onChangeText = value => {
            this.setState({editingValue: value});
            onChangeText && onChangeText(value);
        };
        
        return props;
    }

    getIconContainerWidth(iconStyle, textStyle) {
        return (textStyle.fontSize ?? styles.button.fontSize ?? defaultStyles.button.fontSize) + 2 * PADDING_BUTTON;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        super.componentDidUpdate(prevProps, prevState, snapshot);
        const state = this.state, props = this.props;
        
        if (props.onValueChange && prevState.value !== state.value)
            props.onValueChange(intVal(state.value), intVal(prevState.value));
        
        if (state.valueEntered !== undefined) {
            if (props.min !== undefined && props.onLessMin && props.min > state.valueEntered)
                props.onLessMin(state.valueEntered, props.min);
            if (props.max !== undefined && props.onExceedMax && props.max < state.valueEntered)
                props.onExceedMax(state.valueEntered, props.max);
        }
    }

    renderPrefixIcon(iconStyle, textStyle) {
        return <Button title="-" style={getButtonStyle(iconStyle, textStyle)}
            onPress={() => this.setState( state => ({value: parseInt(state.value) - 1}) )}
        />;
    }

    renderSuffixIcon(iconStyle, textStyle) {
        return <Button title="+" style={getButtonStyle(iconStyle, textStyle)}
            onPress={() => this.setState( state => ({value: parseInt(state.value) + 1}) )}
        />;
    }
}

export default IntegerSpinner.createProxy();