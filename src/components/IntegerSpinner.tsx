/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useCopyRef, useRefCallback, useRefMemo } from '@/hooks';
import { InputChangeValueCallback, InputProps, InputValueRef, ProcessProps } from '@/types';
import { emptyString, noop } from 'javascript-common';
import React from 'react';
import {
    StyleSheet,
    type TextInput,
    type TextInputEndEditingEvent,
    type TextInputProps,
    type TextStyle,
    type ViewStyle,
} from 'react-native';
import Button from './Button';
import DecoratedTextInput, { type DecorProps } from './DecoratedTextInput';

type Props = Omit<
    TextInputProps,
    'keyboardType' | 'onChangeText' | 'onEndEditing' | 'returnKeyType' | 'value'
> & {
    max?: number,
    min?: number,
    value?: number,
    onExceedMax?: (value: number, max: number) => void,
    onLessMin?: (value: number, min: number) => void,
    onValueChange?: (value: number | undefined, prevValue: number | undefined) => void,
};

const PADDING_BUTTON = 4;
const defaultStyles = StyleSheet.create({
    button: {
        fontSize: 14,
        fontWeight: 'bold',
    }
});
const requiredStyles = StyleSheet.create({
    button: {
        alignSelf: 'stretch',
        flex: 1,
        borderWidth: 0,
        borderRadius: 0,
        maxWidth: '100%',
        paddingBottom: 0,
        paddingEnd: PADDING_BUTTON,
        paddingHorizontal: PADDING_BUTTON,
        paddingLeft: PADDING_BUTTON,
        paddingStart: PADDING_BUTTON,
        paddingRight: PADDING_BUTTON,
        paddingTop: 0,
        paddingVertical: 0,
    }
});

const btnStyleMap: WeakMap<ViewStyle, WeakMap<TextStyle, TextStyle[]>> = new WeakMap();
function getButtonStyle(decorStyle: ViewStyle, textStyle: TextStyle) {
    if (!btnStyleMap.has(decorStyle)) btnStyleMap.set(decorStyle, new WeakMap());
    const map = btnStyleMap.get(decorStyle) as WeakMap<TextStyle, TextStyle[]>;
    if (!map.has(textStyle)) {
        const style: TextStyle[] = [
            defaultStyles.button,
            decorStyle as TextStyle
        ];
        if (textStyle.fontSize) style.push({fontSize: textStyle.fontSize});
        style.push(requiredStyles.button);
        map.set(textStyle, style);
    }
    return map.get(textStyle);
};

const valueChangeEvent = Symbol('IntegerSpinner-value-change-event'); 
function intVal(strValue: string | undefined) {
    let val = parseInt(strValue as any);
    if (isNaN(val)) return undefined;
    return val;
}

const IntegerSpinner = React.memo(function IntegerSpinner({
    min,
    max,
    name,
    onExceedMax,
    onLessMin,
    onValueChange,
    ref,
    textAlign = 'center',
    value,
    ...props
}: Props & InputProps<TextInput> & ProcessProps) {
    const [raiseEvent, setRaiseEvent] = React.useState(() => noop);
    const valRef = React.useRef<InputValueRef<string> & TextInput>(null);
    useCopyRef(ref, valRef);
    const {current: vars} = React.useRef({
        exceedsMax: noop,
        lastVal: undefined as string | undefined,
        lessMin: noop,
        max: max,
        min: min,
        onExceedMax,
        onLessMin,
        onValueChange,
        valueChange: noop,
    });
    if (max !== undefined && min !== undefined && max < min) max = min;
    vars.max = max;
    vars.min = min;
    vars.onExceedMax = onExceedMax;
    vars.onLessMin = onLessMin;
    vars.onValueChange = onValueChange;
    
    const {StepDown, StepUp} = useRefMemo(() => {
        const decreaseValue = () => valRef.current?.setValue(
            value => {
                const val = intVal(value);
                return (val === undefined
                    ? Math.min( Math.max(0, vars.min ?? 0), vars.max ?? 0)
                    : val - 1
                ) + emptyString;
            },
            valueChangeEvent
        );
        const increaseValue = () => valRef.current?.setValue(
            value => {
                const val = intVal(value);
                return (val === undefined
                    ? Math.min( Math.max(0, vars.min ?? 0), vars.max ?? 0)
                    : val + 1
                ) + emptyString;
            },
            valueChangeEvent
        );

        function StepDown({decorStyle, textStyle}: DecorProps) {
            return <Button
                style={getButtonStyle(decorStyle, textStyle)}
                onPress={decreaseValue}
            >-</Button>;
        }
        
        function StepUp({decorStyle, textStyle}: DecorProps) {
            return <Button
                style={getButtonStyle(decorStyle, textStyle)}
                onPress={increaseValue}
            >+</Button>
        }

        return {StepDown, StepUp};
    });

    const changeTextHandler: InputChangeValueCallback<string> = useRefCallback((
        newValue: string,
        eventFlag?: any,
        oldValue?: string
    ) => {
        if (eventFlag !== valueChangeEvent) return;

        vars.exceedsMax = noop;
        vars.lessMin = noop;
        vars.valueChange = noop;

        let newVal = intVal(newValue);
        const oldVal = intVal(oldValue);
        if (newVal !== undefined) {
            const valueEntered = newVal;
            if (vars.min !== undefined) {
                const _min = Math.ceil(vars.min);
                if (newVal < _min) {
                    newVal = _min;
                    vars.lessMin = () => {
                        if (vars.onLessMin) vars.onLessMin(valueEntered, _min);
                    };
                }
            }
            if (vars.max !== undefined) {
                const _max = Math.floor(vars.max);
                if (newVal > _max) {
                    newVal = _max;
                    vars.exceedsMax = () => {
                        if (vars.onExceedMax) vars.onExceedMax(valueEntered, _max);
                    };
                }
            }
        }

        if (!Object.is(newVal, oldVal)) {
            vars.valueChange = () => {
                if (vars.onValueChange) vars.onValueChange(newVal, oldVal);
            };
        }
        
        if (vars.exceedsMax != noop || vars.lessMin != noop || vars.valueChange != noop) {
            setRaiseEvent(() => {
                return () => {
                    vars.lessMin();
                    vars.exceedsMax();
                    vars.valueChange();
                };
            });
        }
        else {
            setRaiseEvent(() => noop);
        }

        vars.lastVal = (newVal ?? emptyString) + emptyString;
        return {newValue: vars.lastVal};
    });

    const endEditingHandler = useRefCallback((ev: TextInputEndEditingEvent) => {
        valRef.current?.setValue(
            /* Using `new String` to force updating because when `onEndEditing` event happens,
            the value doesn't change (The change has been consumed by `onChangeText` event) */
            new String(ev.nativeEvent.text) as any,
            valueChangeEvent,
            vars.lastVal
        );
    });

    React.useEffect(() => {
        raiseEvent();
    }, [raiseEvent]);

    return <DecoratedTextInput
        {...props}
        Prefix={StepDown}
        Suffix={StepUp}
        keyboardType="numeric"
        name={(name as any)?.trim?.() || true}
        onChangeText={changeTextHandler}
        onEndEditing={endEditingHandler}
        ref={valRef}
        returnKeyType="done"
        textAlign={textAlign}
        value={value === undefined ? value : value + emptyString}
    />;
});
export default IntegerSpinner;