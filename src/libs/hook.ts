/**
 * https://github.com/atmulyana/expressCartMobile
 */

import type { HookListener } from "@/types";
import { objEquals } from "javascript-common";

//`set.values().toArray()` is not available yet in RN
function toArray<T>(set: Set<T>) {
    const ar: T[] = [];
    for (let item of set) ar.push(item);
    return ar;
}

export function createHookStore<D, I = D>(
    defaultData: D,
    reducer?: (inputData: I, prevData: D) => D | Promise<D>
) {
    const listeners = new Set<HookListener>();
    const addListener = (listener: HookListener) => {
        if (!listeners.has(listener)) listeners.add(listener);
    };
    const removeListener = (listener: HookListener) => {
        listeners.delete(listener);
    };

    let data: D = defaultData;
    const update = async (
        inputData: I,
        filterListeners?: (liteners: HookListener[]) => Iterable<HookListener>
    ) => {
        if (reducer) {
            data = await reducer(inputData, data);
        }
        else {
            data = inputData as any as D; //If `reducer` is undefined then type `I` is undefined
                //which means it's the same as type `D` (because of by default).
                //Therefore it's the safe type-cast ( with note: No explicit type declaration,
                //such as `createHookStore<string, number>('init')` )
        }

       const _listeners = filterListeners
            ? filterListeners(toArray(listeners))
            : listeners;
        for (let listener of _listeners) listener();
    };
    const updateSync = (
        inputData: I,
        filterListeners?: (liteners: HookListener[]) => Iterable<HookListener>
    ) => {
        let output: any;
        if (reducer) {
            output = reducer(inputData, data);
            if (output instanceof Promise) 
                throw "Asynchronous call! Please use `update` instead."
        }
        else {
            output = inputData;
        }
        data = output;

        const _listeners = filterListeners
            ? filterListeners(toArray(listeners))
            : listeners;
        for (let listener of _listeners) listener();
    };

    return {
        addListener,
        removeListener,
        
        /**
         * `getData` function always returns the initial value in rendering
         * process (of memoized component). To get the latest value, we must use hook:
         *      `React.useSyncExternalStore(store.subscribe, store.getData)`
         */
        getData() {
            return data;
        },
        
        update,
        updateSync,
        /**
         * `React.useSyncExternalStore` has checked the data equality using `Object.is`.
         * If it needs more deep equality, use this method.
         */
        async updateStrict(
            inputData: I,
            filterListeners?: (liteners: HookListener[]) => Iterable<HookListener>
        ) {
            if (!objEquals(inputData, data)) await update(inputData, filterListeners);
        },
         updateStrictSync(
            inputData: I,
            filterListeners?: (liteners: HookListener[]) => Iterable<HookListener>
        ) {
            if (!objEquals(inputData, data)) updateSync(inputData, filterListeners);
        },
        
        subscribe(listener: HookListener) {
            addListener(listener);
            return () => removeListener(listener);
        }
    };
}