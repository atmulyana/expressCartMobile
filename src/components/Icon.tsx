/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useColors } from '@/hooks';
import FeatherIcon from '@react-native-vector-icons/feather';
import { emptyObject } from 'javascript-common';
import React from 'react';
import { StyleSheet } from 'react-native';

type IconProps = React.ComponentProps<typeof FeatherIcon>;

const DEFAULT_SIZE = 24;

const Icon = React.memo(function Icon(props: {
    name: IconProps['name'],
    color?: IconProps['color'],
    onPress?: IconProps['onPress'],
    size?: IconProps['size'],
    style?: IconProps['style'],
}) {
    const colors = useColors();
    let {
        color = colors.icon,
        name,
        onPress,
        size,
        style = emptyObject as IconProps['style'],
    } = props;

    let {
        flex = -1,
        fontSize,
        height,
        lineHeight,
        minHeight = size,
        minWidth = size,
        textAlign = 'center',
        textAlignVertical = 'center',
        width = size, 
        ...style2
    } = StyleSheet.flatten(style);
    
    if (typeof(size) != 'number') {
        if (typeof(height) == 'number') size = height;
        else if (typeof(lineHeight) == 'number') size = lineHeight;
        else if (typeof(fontSize) == 'number') size = fontSize;
    }
    if (typeof(size) != 'number') size = DEFAULT_SIZE;

    lineHeight = fontSize = size;
    if (!height) height = size;
    
    return <FeatherIcon
        name={name} 
        color={style2.color ?? color}
        onPress={onPress}
        size={size}
        style={{
            flex,
            fontSize,
            height,
            lineHeight,
            minHeight,
            minWidth,
            textAlign,
            textAlignVertical,
            width,
            ...style2,
        }}
    />;
});
export default Icon;