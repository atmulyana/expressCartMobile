/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import { StyleSheet, Text} from 'react-native';
import LessPureComponent from './LessPureComponent';
import ContentLink from './ContentLink';
import {button as buttonStyle} from '../styles';
import {extractTextStyle} from '../styleProps';

export default class Button extends LessPureComponent {
    contructor() {
        this.state.isPressed = false;
    }

    #pressIn = () => this.setState({isPressed: true});
    #pressOut = () => this.setState({isPressed: false});

    render() {
        const props = {...this.props},
              {isPressed} = this.state;
        let {style = {}, pressedStyle = defaultStyles.pressed, title, children} = props;
        delete props.children;
        delete props.style;
        delete props.title;
        props.onPressIn = this.#pressIn;
        props.onPressOut = this.#pressOut;
        
        const isTitleString = typeof(title) == 'string';
        style = [defaultStyles.button, buttonStyle, style];
        if (isPressed) style.push(pressedStyle);
        style = extractTextStyle(style, isTitleString);

        let content = isTitleString ? <Text style={[defaultStyles.text, style.text, requiredStyles.text]}>{title}</Text> :
                      children ? (typeof(children) == 'function' ? children(style.text) : children) :
                      title;
        
        return <ContentLink {...props} style={style.view}>{content}</ContentLink>;
    }
}

const defaultStyles = StyleSheet.create({
    button: {
        flex: 0,
    },
    text: {
        includeFontPadding: false,
        padding: 4,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    pressed: {
        opacity: 0.5,
    },
});
const requiredStyles = StyleSheet.create({
    text: {
        alignSelf: 'stretch',
        flex: -1,
    },
});