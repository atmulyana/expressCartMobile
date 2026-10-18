/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useStyles } from '@/hooks';
import type { InputValidationProps, ProcessProps } from '@/types';
import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Option, option, Select, select } from 'rn-select-option';
import ProcessIndicator from './ProcessIndicator';
import ValidatedInput from './ValidatedInput';

type ItemValue = NonNullable< React.ComponentProps<typeof Select>['selectedValue'] >;
type SelectType<T> = ReturnType<typeof select<T>>;
type SelectRef = NonNullable<React.ComponentProps<SelectType<ItemValue>>['ref']> extends React.Ref<infer TRef> ? TRef : never;
type SelectProps<T = ItemValue> = React.ComponentProps< ReturnType<typeof select<T>> >;
type ComboProps<T = ItemValue> = Omit<SelectProps<T>, 'selectedValue' | 'ref'>
    & {
        value?: T,
    }
    & ProcessProps;
type Props<T = ItemValue> = ComboProps<T> & InputValidationProps<ComboProps<T>, SelectRef>;

//Must use `React.forwardRef` in order for the validation library can invoke `focus` method
const Input = React.forwardRef(function Input<T = ItemValue>(
    {
        loadingAware,
        style,
        submittingAware,
        value,
        ...props
    }: ComboProps<T>,
    ref: React.Ref<SelectRef>
) {
    const styles = useStyles();
    const styleProp = React.useMemo(() => {
        return [styles.textInput, styles.textInputHeight, style] as StyleProp<TextStyle>;
    }, [style, styles]);

    const SelectT = Select as SelectType<T>;
    return <ProcessIndicator loadingAware={loadingAware} submittingAware={submittingAware}>
        <SelectT {...props} ref={ref} selectedValue={value} style={styleProp} />
    </ProcessIndicator>;
}) as <T = ItemValue>(props: ComboProps<T> & React.RefAttributes<SelectRef>) => React.ReactNode;

export default function ComboBox<T = ItemValue>(props: Props<T>) {
    return <ValidatedInput Component={Input<T>} {...props} />;
}

ComboBox.Item = Option;
ComboBox.item = option;