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
    render() {
        const props = {...this.props};
        let {style = {}, title, children} = props;
        delete props.children;
        delete props.style;
        delete props.title;
        
        const isTitleString = typeof(title) == 'string';
        style = extractTextStyle([defaultStyles.button, buttonStyle].concat(style), isTitleString);

        let content = isTitleString ? <Text style={[defaultStyles.text, style.text, requiredStyles.text]}>{title}</Text> :
                      children ? children :
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
});
const requiredStyles = StyleSheet.create({
    text: {
        alignSelf: 'stretch',
        flex: -1,
    },
});