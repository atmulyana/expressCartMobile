/**
 * https://github.com/atmulyana/expressCartMobile
 */
import React from 'react';
import { type TextInputProps } from 'react-native';
import DecoratedTextInput, { type DecorProps } from './DecoratedTextInput';
import Icon from './Icon';



const SearchIcon = React.memo(function SearchIcon({decorStyle, textStyle}: DecorProps) {
    let iconSize: number | undefined = textStyle.lineHeight ?? textStyle.fontSize
        ?? (typeof(decorStyle.height) == 'number' ? decorStyle.height : void(0))
        ?? (typeof(textStyle.height) == 'number' ? Math.floor(textStyle.height * 0.9) : void(0));
    return <Icon
        name='search'
        size={iconSize}
        style={{
            marginBottom: textStyle.paddingBottom ?? textStyle.paddingVertical ?? textStyle.padding,
            marginTop: textStyle.paddingTop ?? textStyle.paddingVertical ?? textStyle.padding,
            padding: 0,
        }}
    />;
});

export default function SearchTextInput(props: TextInputProps) {
    return <DecoratedTextInput {...props} Prefix={SearchIcon} />;
}
