/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useStyles } from '@/hooks';
import { extractTextStyle } from '@/libs/style';
import type { ProcessProps } from '@/types';
import React from 'react';
import {
    Pressable,
    type PressableStateCallbackType,
    type StyleProp,
    StyleSheet, Text,
    type TextStyle,
    type ViewStyle
} from "react-native";
import Icon from './Icon';
import ProcessIndicator from './ProcessIndicator';

type Props = Omit<React.ComponentProps<typeof Pressable>, 'children' | 'style'>;

const {defaultPressedStyle} = StyleSheet.create({
    defaultPressedStyle: {
        opacity: 0.5,
    }
});

export default function Button({
    children,
    disabled,
    loadingAware,
    notMoreLoading,
    pressedStyle = defaultPressedStyle,
    submittingAware,
    ...props
}: Props & ProcessProps & {
    children: React.ReactNode | ((pressed: boolean, style: StyleProp<TextStyle>) => React.ReactNode),
    pressedStyle?: StyleProp<TextStyle | ViewStyle>,
    style?: StyleProp<TextStyle | ViewStyle>,
}) {
    const styles = useStyles();
    const [style, viewStyle] = React.useMemo(() => {
        const normal = extractTextStyle([
            styles.btn,
            disabled ? styles.btnDisabled : null,
            props.style
        ], false);
        const pressed = extractTextStyle(pressedStyle, false);
        const style = {
            normal: {
                view: normal.view,
                text: normal.text,
            },
            pressed: {
                view: [normal.view, pressed.view],
                text: [normal.text, pressed.text],
            }
        };
        const viewStyle = (state: PressableStateCallbackType) => {
            return state.pressed ? style.pressed.view : style.normal.view;
        };
        return [style, viewStyle];
    }, [disabled, pressedStyle, props.style, styles]);
    
    const childs = (pressed: boolean) => {
        const _style = pressed ? style.pressed.text : style.normal.text;
        if (typeof(children) == 'function') return children(pressed, _style);
        if (typeof(children) == 'string') return <Text style={_style}>{children}</Text>;
        if ((children as any)?.type === Icon) {
            const elm = children as any;
            return <Icon key={elm.key} {...elm.props} style={[_style, elm.props?.style]} />;
        }
        return children;
    }

    return <ProcessIndicator
        loadingAware={loadingAware}
        notMoreLoading={notMoreLoading}
        paddingForText={false}
        submittingAware={submittingAware}
    >
        <Pressable {...props} disabled={disabled} style={viewStyle}>{
            state => childs(state.pressed)
        }</Pressable>
    </ProcessIndicator>;
}