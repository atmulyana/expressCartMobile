/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useColors, useStyles } from '@/hooks';
import { textInputBase } from '@/styles';
import type { InputValidationProps, ProcessProps } from '@/types';
import React from 'react';
import { TextInput as RNInput, type TextInputProps } from 'react-native';
import ProcessIndicator from './ProcessIndicator';
import ValidatedInput from './ValidatedInput';

type InputTextProps = Omit<TextInputProps, 'onChangeText'>
    & {
        onValueChange?: (text: string) => void,
    }
    //& React.RefAttributes<RNInput>
    & ProcessProps;
type Props = InputTextProps & InputValidationProps<InputTextProps, RNInput>;

//Must use `React.forwardRef` in order for the validation library can invoke `focus` method
const InputText = React.forwardRef(function InputText(
    {
        loadingAware,
        multiline,
        numberOfLines = 5,
        onValueChange,
        style,
        submittingAware,
        ...props
    }: InputTextProps,
    ref: React.Ref<RNInput>
) {
    const colors = useColors();
    const styles = useStyles();
    const styleProp = React.useMemo(() => {
        return [
            styles.textInput,
            multiline ? styles.textArea : null,
            multiline && numberOfLines > 1 ? {
                height: (textInputBase.lineHeight as number) * numberOfLines
                    + 2 * (
                        (textInputBase.paddingVertical as number)
                        + (textInputBase.borderWidth as number)
                    ) + 1,
            } : null,
            style
        ];
    }, [styles, multiline, numberOfLines, style]);
    
    return <ProcessIndicator loadingAware={loadingAware} submittingAware={submittingAware}>
        <RNInput
            placeholderTextColor={colors.disabled}
            {...props}
            multiline={multiline}
            numberOfLines={numberOfLines}
            onChangeText={onValueChange}
            ref={ref}
            style={styleProp}
        />
    </ProcessIndicator>;
});

export default function TextInput(props: Props) {
    return <ValidatedInput Component={InputText} {...props} />;
} 