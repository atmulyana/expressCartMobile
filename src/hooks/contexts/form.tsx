/**
 * https://github.com/atmulyana/expressCartMobile
 */
import SubmittingIndicator from '@/components/SubmittingIndicator';
import Text from '@/components/TextApp';
import { createHookStore } from '@/libs/hook';
import lang from '@/libs/lang';
import {
    errorHandler,
    pushNotification,
    showResponseMessage
} from '@/libs/notification';
import { callServer, decomposeData } from '@/libs/server';
import baseStyles from '@/styles';
import type {
    DataReadyCallback,
    HookListener,
    HttpError,
    HttpUrl,
    InputChangeValue,
    InputChangeValueCallback,
    InputProps,
    InputValueReducer,
    InputValueRef,
    SubmitFunction,
    SubmitParams,
    UrlPath
} from '@/types';
import {
    ValidationContext,
    type ContextProps,
    type ContextRef,
} from '@react-input-validator/native';
import {
    emptyObject,
    emptyString,
    isPlainObject,
    noop
} from 'javascript-common';
import React from 'react';
import {
    View,
    type StyleProp,
    type ViewStyle,
} from 'react-native';
import { extRefCallback } from 'reactjs-common';
import useLang from '../lang';
import { useNavHelpers } from '../navigation';
import {
    useCopyRef,
    useEffectEvent,
    useMount,
    useRefData
} from '../react';

type SubmitParamsWithId = SubmitParams & {submitId: number};

type FormProps = {
    children?: React.ReactNode,
    fragment?: boolean,
    loading?: React.ReactNode,
    ref?: React.Ref<ContextRef>,
    style?: StyleProp<ViewStyle>,
    validationProps?: Partial<Omit<ContextProps, 'lang'>> | null,
};

type FormContextValue = {
    data: any,
    Form: React.ComponentType<FormProps>,
    inputs: {
        [name: string]: any,
    },
    mounted?: boolean,
    submit: SubmitFunction,
    submitState: {
        isOn: () => boolean,
        readonly message: string | null | undefined,
        subscribe: (listener: HookListener) => (() => void),
        update: (submitId: number, message?: string | null) => void,
    },
    validationRef: React.RefObject<ContextRef | null>,
};

type ContextValue = {
    currentId: string,
    forms: {[id: string]: FormContextValue},
}

const invalidResponse: HttpError = {
    handled: false,
    status: -1,
    valid: false,
};

const defaultValidationRef: ContextRef = {
    clearValidation: noop,
    getErrorMessage: noop,
    getInput: noop,
    get isValid() { return true; },
    refreshMessage: noop,
    setErrorMessage: noop,
    validate: noop,
    validateAsync: noop,
};
    
const Context = React.createContext<ContextValue>({
    currentId: emptyString,
    forms: emptyObject,
});
const IdContext = React.createContext(emptyString);

export function FormProvider({children}: {children: React.ReactNode}) {
    const ctxVal = useRefData<ContextValue>({
        currentId: emptyString,
        forms: {}
    });

    return <Context.Provider value={ctxVal}>
        {children}
    </Context.Provider>
}

export function useForm(onSubmitted?: DataReadyCallback, onError?: SubmitParams['onError']): [
    FormContextValue['Form'],
    FormContextValue['submit'],
    boolean
] {
    const nav = useNavHelpers();
    const ctx = React.useContext(Context);
    const id = React.useId();
    if (!(id in ctx.forms)) {
        const {
            getData: getSubmitData,
            subscribe: subscribeSubmitState,
            updateSync: updateSubmitState
        } = createHookStore(emptyObject as {[id: number]: string | null});

        ctx.forms[id] = { //eslint-disable-line react-hooks/immutability
            data: null,
            Form: React.Fragment,
            inputs: {},
            validationRef: {
                current: defaultValidationRef,
            },
            submit: noop,
            submitState: {
                isOn() {
                    return Object.keys(getSubmitData()).length > 0;
                },
                get message() {
                    const messages = Object.values(getSubmitData());
                    return messages[messages.length - 1];
                },
                subscribe: subscribeSubmitState,
                update(submitId, message) {
                    const data = getSubmitData();
                    if (message === undefined) {
                        if (data !== emptyObject) {
                            delete data[submitId];
                            if (Object.keys(data).length > 0) {
                                updateSubmitState({...data});
                            }
                            else {
                                updateSubmitState(emptyObject);
                            }
                        }
                    }
                    else {
                        updateSubmitState({...data, [submitId]: message});
                    }
                },
            },
        };
        ctx.forms[id].Form = createForm(id, ctx.forms[id]);  //eslint-disable-line react-hooks/immutability
    }
    
    const [, doSubmit, isSubmitting] = React.useActionState(submit, ctx.forms[id]);
    if (ctx.forms[id].submit === noop) {
        let idCounter = Number.MIN_SAFE_INTEGER;

        //eslint-disable-next-line react-hooks/immutability
        ctx.forms[id].submit = (_params: HttpUrl | UrlPath | SubmitParams) => {
            const submitId = idCounter < Number.MAX_SAFE_INTEGER ? idCounter++ : (
                idCounter = Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER
            );
            
            let params: SubmitParamsWithId;
            if (typeof(_params) == 'string') {
                params = {
                    submitId,
                    url: _params,
                };
            }
            else {
                params = {
                    ..._params,
                    submitId,
                };
            }
            
            const _onError = params.onError;
            params.onError = async (err: any) => {
                await _onError?.(err);
                if (!err?.handled) await onError?.(err);
            };

            const _onSubmitted = params.onSubmitted;
            params.onSubmitted = async (data, newUrl) => {
                const ret1 = await _onSubmitted?.(data, newUrl);
                if (ret1 === false) return false;
                const ret2 = await onSubmitted?.(data, newUrl);
                if (ret2 === false) return false;
                if ((ret1 || ret2) !== true && newUrl) {
                    nav.goto(newUrl, true);
                    return false;
                }
            };

            const validation = ctx.forms[id].validationRef?.current;
            if (validation && !validation.validate()) {
                pushNotification({
                    message: lang('One or more inputs are invalid'),
                    type: 'error',
                });
                params.onError(invalidResponse);
                return;
            }

            if (!('data' in params)) params.data = emptyObject;

            ctx.forms[id].submitState.update(submitId, params.message ?? null);
            React.startTransition(() => {
                doSubmit(params);
            });
        }
    }

    ctx.currentId = id; //eslint-disable-line react-hooks/immutability
    useMount(() => {
        ctx.currentId = emptyString; //eslint-disable-line react-hooks/immutability
        return () => {
            delete ctx.forms[id];
        };
    });

    return [
        ctx.forms[id].Form,
        ctx.forms[id].submit,
        isSubmitting,
    ];
}

export function useFormInputValue<Instance = unknown, Value = any>(
    name?: InputProps<Instance, Value>['name'],
    value?: Value,
    setValue?: InputChangeValueCallback<Value>,
    ref?: InputProps<Instance, Value>['ref'],
    refCallback?: (ref: (InputValueRef<Value> & Omit<Instance, keyof InputValueRef<Value>>) | null) => any
) {
    type RetType = [
        Value | undefined,
        InputChangeValue<Value> | undefined,
        React.RefCallback<Instance>
    ];
    type TReducer = InputValueReducer<Value>;

    const ctx = React.useContext(Context);
    const id = React.useContext(IdContext);
    const inputs = ctx.forms[id]?.inputs;
    const [val, setVal] = React.useState<Value | undefined>(value);
    const nameTrimmed = (name as any)?.trim?.();
    const isNameNotTrue = name !== true;
    
    const changeValue: InputChangeValue<Value> = React.useCallback((newVal, ...args) => {
        const isNamedInput = inputs && nameTrimmed;
        if (!isNamedInput && isNameNotTrue) {
            if (setValue) {
                if (typeof(newVal) == 'function') {
                    newVal = (newVal as TReducer)(value);
                }
                setValue(newVal as Value);
            }
            return;
        }

        let exec: (() => void) | undefined;
        setVal(oldVal => {
            let newValue: Value | undefined;
            if (typeof(newVal) == 'function') {
                newValue = (newVal as TReducer)(oldVal);
            }
            else {
                newValue = newVal;
            }
            let valAltered = !Object.is(oldVal, newValue);
        
            if (valAltered) {
                if (setValue) {
                    exec = () => {
                        args.push(oldVal);
                        //`setValue` may change some "state" value that may trigger another
                        //component rendering. So, don't execute it now to avoid an error.
                        const confine = setValue(newValue as Value, ...args);
                        if (confine) {
                            newValue = confine.newValue;
                            valAltered = !Object.is(oldVal, newValue);
                        }
                        if (isNamedInput) inputs[nameTrimmed] = newValue;
                        if (valAltered) setVal(newValue);
                    };
                }
                else {
                    exec = noop;
                    if (isNamedInput) inputs[nameTrimmed] = newValue;
                    return newValue;
                }
            }

            return oldVal; //Don't re-render yet, still adjustment. Here, we only want to know the old value. 
        });
        
        if (!exec) {
            /* Sometimes previous `setVal` call is asynchronous (`exec` is not set yet). When this
            happens, wait `exec` to be set. */
            function deferExec() {
                setTimeout(() => {
                    if (!exec) {
                        deferExec();
                    }
                    else {
                        React.startTransition(exec);
                    }
                }, 0);
            }
            deferExec();
        }
        else {
            exec();
        }
    }, [
        inputs, isNameNotTrue, nameTrimmed,
        setValue, value
    ]);

    React.useEffect(() => {
        return () => {
            if (inputs && nameTrimmed) delete inputs[nameTrimmed];
        };
    }, [nameTrimmed, inputs]);

    const onValueChange = useEffectEvent(changeValue);
    React.useEffect(() => {
        onValueChange(value);
    }, [value]);

    let retVal: RetType[0], retSetter: RetType[1];
    if (name === true) {
        [retVal, retSetter] = [val, changeValue];
    }
    else if (!(inputs && nameTrimmed)) {
        [retVal, retSetter] = [value, setValue && changeValue];
    }
    else {
        inputs[nameTrimmed] = val; //eslint-disable-line react-hooks/immutability
        [retVal, retSetter] = [val, changeValue];
    }

    const refProp = React.useCallback( //eslint-disable-line react-hooks/exhaustive-deps
        extRefCallback<Instance, InputValueRef<Value>>( //eslint-disable-line react-hooks/use-memo
            ref,
            {
                get value() {
                    return retVal;
                },
                set value(val) {
                    retSetter?.(val);
                },
                setValue: retSetter ?? noop,
            },
            refCallback
        ),
        [retVal, retSetter, ref, refCallback]
    );

    return [retVal, retSetter, refProp] as RetType;
}

export function useSubmitState(): [boolean, string | undefined | null] {
    const ctx = React.useContext(Context);
    const id = React.useContext(IdContext) || ctx.currentId;
    const formCtx = ctx.forms[id];
    const isSubmitting = React.useSyncExternalStore(
        formCtx?.submitState?.subscribe ?? noop,
        formCtx?.submitState?.isOn ?? noop
    );
    return [isSubmitting ?? false, formCtx?.submitState.message];
}

function createForm(id: string, ctx: FormContextValue) {
    return function Form({
        children,
        validationProps = emptyObject,
        fragment,
        loading,
        ref,
        style,
    }: FormProps) {
        useCopyRef(ref, ctx.validationRef);

        const onlyOnce = React.useRef(false);

        useMount(() => {
            const isFirst = !ctx.mounted;
            if (isFirst) {
                ctx.mounted = true;
                onlyOnce.current = true;
            }
            return () => {
                if (isFirst) ctx.mounted = false
            };
        });

        if (ctx.mounted && !onlyOnce.current) return <Text style={baseStyles.textBold}>CANNOT MOUNT THE SAME FORM TWICE</Text>;

        let content: React.ReactNode;
        if (fragment) {
            content = children;
        }
        else {
            content = <FormView loading={loading} style={style}>
                {children}
            </FormView>;
        }

        if (validationProps) {
            content = <FormValidation validationProps={validationProps} formCtx={ctx}>
                {content}
            </FormValidation>;
        }

        return <IdContext.Provider value={id}>
            {content}
        </IdContext.Provider>;
    }
}

function FormView({
    children,
    loading,
    style,
}: Pick<FormProps, 'children' | 'loading' | 'style'>) {
    const [isSubmitting, submitMessage] = useSubmitState();
    
    return <View style={style}>
        {children}
        {loading !== undefined ? loading : (
            <SubmittingIndicator visible={isSubmitting} message={submitMessage} />
        )}
    </View>;
}

function FormValidation({
    children,
    validationProps,
    formCtx,
}: Pick<FormProps, 'children' | 'validationProps'> & {
    formCtx: FormContextValue,
}) {
    const lang = useLang();
    //eslint-disable-next-line react-hooks/immutability, react-hooks/refs
    formCtx.validationRef = React.useRef<ContextRef>(null);

    //eslint-disable-next-line react-hooks/refs
    return <ValidationContext focusOnInvalid {...validationProps} lang={lang} ref={formCtx.validationRef}>
        {children}
    </ValidationContext>;
}

async function submit(ctx: FormContextValue, params: SubmitParamsWithId) {
    const validation = ctx.validationRef?.current;
    const data: any = (Object.keys(ctx.inputs).length > 0 || params.data) ? {
        ...ctx.inputs,
        ...params.data,
    } : null;

    let promise: Promise<any>;
    const dummyServer = 'http://dummy-server';
    if (params.url.startsWith(dummyServer)) {
        let responseData = null;
        const search = params.url.substring(dummyServer.length);
        if (search[0] == '?') {
            const urlParams = new URLSearchParams(search);
            if (urlParams.has('message')) {
                responseData = {
                    message: urlParams.get('message'),
                    messageType: urlParams.get('messageType'),
                };
            }
        }
        promise = Promise.resolve(responseData);
    }
    else {
        promise = callServer(params.url, data, params.httpHeaders);
    }
    
    promise.then(data => {
        if (!validation || !isPlainObject(data)) return data;
        const validationData = data.__validation__;
        delete data.__validation__;
        if (validationData?.success === false) {
            for (let name in validationData.inputMessages) {
                validation.setErrorMessage(name, validationData.inputMessages[name]);
            }
            const message = validationData.message?.trim() ? validationData.message : lang('One or more inputs are invalid');
            pushNotification({
                message,
                type: 'error',
            });
            throw invalidResponse;
        }
        return data;
    })
    .then(async (data) => {
        const {newUrl, message, messageType, ...$} = decomposeData(data) || (emptyObject as any);
        if (await params.onSubmitted?.($, newUrl) === false)
            throw {status:-1, handled: true};
        
        ctx.data = $.data;
        
        return {
            message,
            messageType,
        };
    })
    .finally(() => {
        ctx.submitState.update(params.submitId);
    })
    .then(showResponseMessage)
    .catch(async (err) => {
        if (params.onError
            && isPlainObject(err)
            && typeof(err.status) == 'number'
            && typeof(err.handled) == 'boolean'
        ) await params.onError(err);
        await errorHandler(err);
        if (
            err !== undefined && typeof(err) != 'object'
            || !err?.handled
            || err?.handled && params.rejectIfHandled
        ) {
            if (!params.rejectIfHandled || err?.valid !== false) console.error(`submit error for ${params.url}: `, err);
            throw err;
        }
    })
    .catch(err => {
        /**
         * TO BE REVIEWED
         */
        if (params?.rejectIfHandled) throw err;
    });
    
    return ctx;
}