/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useColors, useFormInputValue, useStyles } from '@/hooks';
import { extractTextStyle } from '@/libs/style';
import { InputProps, ProcessProps } from '@/types';
import React from 'react';
import {
    type StyleProp,
    StyleSheet,
    TextInput,
    type TextStyle,
    View,
    type ViewStyle,
} from 'react-native';
import ProcessIndicator from './ProcessIndicator';

export type DecorInputProps = Omit<React.ComponentProps<typeof TextInput>, 'multiline'> & {
    decorStyle?: StyleProp<ViewStyle>,
    Prefix?: Decor,
    Suffix?: Decor,
};

export type DecorProps = {
    decorStyle: ViewStyle,
    textStyle: TextStyle,
};

type Decor = React.ComponentType<DecorProps>;

const defaultStyles = StyleSheet.create({
    decorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
const requiredStyles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        flexDirection: 'row',
        overflow: 'hidden',
        padding: 0,
        paddingBottom: 0,
        paddingEnd: 0,
        paddingHorizontal: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingStart: 0,
        paddingTop: 0,
        paddingVertical: 0,
    },
    decorContainer: {
        flex: 0,
        maxWidth: '25%',
        overflow: 'hidden',
    },
    text: {
        flexBasis: '50%',
        flexGrow: 1,
    },
});

export default function DecoratedTextInput({
    decorStyle,
    loadingAware,
    name,
    onLayout,
    onChangeText,
    Prefix,
    ref,
    style,
    submittingAware,
    Suffix,
    value,
    ...props
}: DecorInputProps & InputProps & ProcessProps) {
    //@ts-ignore: makes sure no `multiline`
    delete props.multiline;
    const colors = useColors();
    const styles = useStyles();
    const styleProps = React.useMemo(() => {
        const $tyle = extractTextStyle([styles.textInput, style]);
        $tyle.view = Object.assign($tyle.view, requiredStyles.container);
        const decorContainer =  StyleSheet.flatten([
            defaultStyles.decorContainer,
            decorStyle,
            requiredStyles.decorContainer
        ] as StyleProp<ViewStyle>);
        decorContainer.width ??= $tyle.view.height ?? styles.textInputHeight.height;
        if (!decorContainer.width) delete decorContainer.width;
        //decorContainer.height = stretch
        return {
            decorContainer,
            textInput: [$tyle.text, requiredStyles.text],
            ...$tyle,
        };
    }, [decorStyle, style, styles]);

    const [_value, _onChangeText] = useFormInputValue(name, value, onChangeText, ref);
    
    return <ProcessIndicator loadingAware={loadingAware} submittingAware={submittingAware}>
        <View style={styleProps.view} onLayout={onLayout}>
            {Prefix &&
                <View style={styleProps.decorContainer}>
                    <Prefix decorStyle={styleProps.decorContainer} textStyle={styleProps.text} />
                </View>
            }
            <TextInput
                placeholderTextColor={colors.disabled}
                {...props}
                onChangeText={_onChangeText}
                style={styleProps.textInput}
                value={_value}
            />
            {Suffix &&
                <View style={styleProps.decorContainer}>
                    <Suffix decorStyle={styleProps.decorContainer} textStyle={styleProps.text} />
                </View>
            }
        </View>
    </ProcessIndicator>;
}