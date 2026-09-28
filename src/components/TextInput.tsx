/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useColors, useFormInputValue, useStyles } from '@/hooks';
import { textInputBase } from '@/styles';
import type { InputProps, ProcessProps } from '@/types';
import React from 'react';
import { TextInput as RNInput, type TextInputProps } from 'react-native';
import ProcessIndicator from './ProcessIndicator';

export default function TextInput({
    loadingAware,
    submittingAware,
    multiline,
    name,
    numberOfLines = 5,
    onChangeText,
    ref,
    style,
    value,
    ...props
}: Omit<TextInputProps, 'ref'> & ProcessProps & InputProps) {
    const colors = useColors();
    const styles = useStyles();
    const styleProp = React.useMemo(() => {
        return [
            styles.textInput,
            multiline ? styles.textArea : null,
            numberOfLines > 1 ? {
                height: (textInputBase.lineHeight as number) * numberOfLines
                    + 2 * (
                        (textInputBase.paddingVertical as number)
                        + (textInputBase.borderWidth as number)
                    ) + 1,
            } : null,
            style
        ];
    }, [styles, multiline, numberOfLines, style]);
    const [_value, _onChangeText] = useFormInputValue(name, value, onChangeText, ref);
    
    return <ProcessIndicator loadingAware={loadingAware} submittingAware={submittingAware}>
        <RNInput
            placeholderTextColor={colors.disabled}
            {...props}
            multiline={multiline}
            numberOfLines={numberOfLines}
            onChangeText={_onChangeText}
            style={styleProp}
            value={_value}
        />
    </ProcessIndicator>;
} 