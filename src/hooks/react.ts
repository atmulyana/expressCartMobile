/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { emptyArray } from 'javascript-common';
import React from 'react';

/**
 * @param ref1 should be from `ref` parameter. Beacause of that, it must accept `null` ref value.
 * @param ref2 should be from `React.useRef`
 */
export function useCopyRef<T>(ref1: React.Ref<T> | undefined, ref2: React.RefObject<T | null>) {
    React.useImperativeHandle(
        ref1,
        () => ref2.current as T,
        emptyArray //eslint-disable-line react-hooks/exhaustive-deps
    );
}

/**
 * Replaces `React.useEffectEvent`.
 * `React.useEffectEvent` doesn't work as expected: It returns the old context. All variables
 * (states and props) used by `callback` are not updated to the recent values.
 * NOTE: It's EXPO bug
 */
export function useEffectEvent<T extends Function>(callback: T){
    //return React.useEffectEvent(callback);
    return callback;
}

export function useMount(callback: React.EffectCallback) {
    //eslint-disable-next-line react-hooks/exhaustive-deps
    return React.useEffect(callback, emptyArray);
}

export function useRefCallback<T extends Function>(callback: T) {
    //eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
    return React.useCallback(callback, emptyArray);
}

export function useRefData<T>(data: T | (() => T)) {
    const ref = React.useRef<T>(typeof(data) == 'function' ? (data as () => T)() : data);
    return ref.current; //eslint-disable-line react-hooks/refs
}

export function useRefMemo<T>(getValue: () => T) {
    //eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
    return React.useMemo(getValue, emptyArray);
}