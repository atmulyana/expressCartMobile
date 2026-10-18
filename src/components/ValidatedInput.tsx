/**
 * https://github.com/atmulyana/expressCartMobile
 */
import {
    useEffectEvent,
    useFormInputValue,
    useLang,
    useRefData
} from "@/hooks";
import type {
    InputChangeValue,
    InputValidationProps,
    ValidationRef,
    ValidationValueRef,
} from '@/types';
import {
    type AbstractComponent,
    type ValidationOption,
    withValidation
} from "@react-input-validator/native";
import { emptyArray } from "javascript-common";
import React from 'react';

type ManagedProps<Props> = Omit<Props, 'onValueChange' | 'ref' | 'value'>;

export default function ValidatedInput<Props, Instance = unknown>({
    Component,
    name = true,
    onValueChange,
    ref,
    rules,
    validationOptions,
    value,
    ...props
}: {
    Component: AbstractComponent<Props, Instance>,
}
& InputValidationProps<Props, Instance> 
& ManagedProps<Props>) {
    const inputRef = React.useRef<ValidationValueRef<Instance>>(null);
    const [_value, _onValueChange, _ref] = useFormInputValue<ValidationRef<Instance>>(
        name, value, onValueChange, ref,
        newRef => inputRef.current = newRef
    );
    const lang = useLang();

    const vars = useRefData(() => {
        const option: ValidationOption<Props, any> = {
            ...validationOptions,
            name: name?.toString?.(),
            rules: rules ?? (emptyArray as any),
        };
        return {
            Input: withValidation(Component, option),
            option,
        };
    });
    vars.option.name = name?.toString?.(); //eslint-disable-line react-hooks/immutability
    if (rules) vars.option.rules = rules; //eslint-disable-line react-hooks/immutability

    const updateLang = useEffectEvent(() => {
        if (typeof(inputRef.current?.validate) == 'function' && !inputRef.current.isValid) {
            inputRef.current.validate();
        }
    });
    React.useEffect(() => {
        updateLang();
    }, [lang]);

    const Input = vars.Input as React.ComponentType<
        ManagedProps<Props>
        & React.RefAttributes<ValidationRef<Instance>>
        & {
            onValueChange?: InputChangeValue<any>,
            value?: any,
        }
    >;
    return <Input {...(props as ManagedProps<Props>)} onValueChange={_onValueChange} ref={_ref} value={_value} />;
}