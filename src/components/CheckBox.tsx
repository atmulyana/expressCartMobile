/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useColors } from "@/hooks";
import baseStyles, { boxBase } from "@/styles";
import { InputValidationProps, ProcessProps } from "@/types";
import React from 'react';
import { StyleSheet, Switch, View, type SwitchProps } from "react-native";
import { forwardRef } from 'reactjs-common';
import Icon from "./Icon";
import ProcessIndicator from './ProcessIndicator';
import ValidatedInput from './ValidatedInput';

type InputProps = Pick<SwitchProps, 'disabled' | 'onValueChange' | 'style' | 'value'> & ProcessProps;
type Props = InputProps & InputValidationProps<InputProps, Switch, boolean>;

const borderWidth = 2;
const height = baseStyles.textInputHeight.height as number;
const chkStyles = StyleSheet.create({
    box: {
        ...boxBase,
        alignItems: 'center',
        borderWidth,
        display: 'flex',
        height,
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 0,
        width: height,
    },
    check: {
        color: 'white',
        fontSize: height - 2 * borderWidth,
        fontWeight: 'bold',
    },
    switch: {
        ...StyleSheet.absoluteFill,
        opacity: 0,
        zIndex: 1,
    },
});


//Must use `React.forwardRef` in order for the validation library can invoke `focus` method
const Input = forwardRef(function Input(
    {
        disabled,
        loadingAware,
        notMoreLoading,
        style,
        submittingAware,
        value = false,
        ...props
    }: InputProps,
    ref: React.Ref<Switch>
) {
    const colors = useColors();
    const boxStyle = React.useMemo(() => {
        return [
            style,
            chkStyles.box,
            value ? {
                backgroundColor: colors.neutral,
                borderColor: colors.neutral,
            } : {
                backgroundColor: colors.bg,
                borderColor: colors.border,
            },
            disabled ? baseStyles.disabled : null,
        ];
    }, [colors, disabled, style, value]);
    
    return <ProcessIndicator loadingAware={loadingAware} notMoreLoading={notMoreLoading} submittingAware={submittingAware}>
        <View style={boxStyle}>
            {value && <Icon name="check" style={chkStyles.check} />}
            <Switch {...props} disabled={disabled} ref={ref} style={chkStyles.switch} value={value} />
        </View>
    </ProcessIndicator>;
});

export default function CheckBox({
    value = false,
    ...props
}: Props) {
    return <ValidatedInput Component={Input} {...props} value={value} />;
} 