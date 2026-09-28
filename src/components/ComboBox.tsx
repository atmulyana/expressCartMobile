/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useFormInputValue, useStyles } from '@/hooks';
import type { InputProps, ProcessProps } from '@/types';
import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Option, option, Select, select } from 'rn-select-option';
import ProcessIndicator from './ProcessIndicator';

type ItemValue = NonNullable< React.ComponentProps<typeof Select>['selectedValue'] >;
type SelectProps<T = ItemValue> = React.ComponentProps< ReturnType<typeof select<T>> >;
type Props<T = ItemValue> = Omit<SelectProps<T>, 'selectedValue'>
    & {
        value?: T,
    }
    & ProcessProps;
type SelectType<T> = ReturnType<typeof select<T>>;

export default function ComboBox<T = ItemValue>({
    loadingAware,
    name,
    onValueChange,
    ref,
    style,
    submittingAware,
    value,
    ...props
}: Props<T> & InputProps) {
    const styles = useStyles();
    const styleProp = React.useMemo(() => {
        return [styles.textInput, styles.textInputHeight, style] as StyleProp<TextStyle>;
    }, [style, styles]);
    const [_value, _onValueChange] = useFormInputValue(name, value, onValueChange, ref);

    const SelectT = Select as SelectType<T>;
    return <ProcessIndicator loadingAware={loadingAware} submittingAware={submittingAware}>
        <SelectT {...props} onValueChange={_onValueChange} selectedValue={_value} style={styleProp} />
    </ProcessIndicator>;
}

ComboBox.Item = Option;
ComboBox.item = option;