/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { errorHandler, showResponseMessage } from '@/libs/notification';
import { callServer, decomposeData, isUrlPath } from '@/libs/server';
import type {
    DataReadyCallback,
    DataUrl,
    GetNextDataUrl,
    HookListener,
    HttpError,
    HttpReject,
    MergeData,
    NotFunc,
    UrlPath
} from '@/types';
import { isPlainObject, noop } from 'javascript-common';
import React from 'react';
import { setCart } from '../cart';
import { setConfig } from '../config';
import { setMenu } from '../menu';
import { usePathname } from '../navigation';
import { setPaymentConfig } from '../paymentConfig';
import { useRefMemo } from '../react';
import { setSession } from '../session';

type NextDataUrl = (prevUrl?: DataUrl) => UrlPath;
type Loading = boolean | 1;

type Data = Readonly<{
    snapshot: () => [any, Loading, DataUrl],
    isLoading: () => Loading,
    readonly isNoMore: boolean,
    readonly isUninitialized: boolean, 
    load: (
        urlOrData: any,
        onDataReady: DataReadyCallback,
        onError: HttpReject
    ) => Promise<any>,
    loadMore: <T>(
        nextUrlOrData: NotFunc<T> | NextDataUrl,
        mergeData: MergeData<T>
    ) => Promise<any>,
    setLoading: (isLoading: Loading) => void,
    subscribe: (listener: HookListener) => (() => void),
}>;
const defaultSnapshot: ReturnType<Data['snapshot']> = [null, false, null];
const defaultData: Data = {
    snapshot() {
        return defaultSnapshot;
    },
    isLoading() {
        return false;
    },
    isNoMore: false,
    isUninitialized: true,
    load: noop,
    loadMore: noop,
    setLoading: noop,
    subscribe: noop,
};

const DataContext = React.createContext(defaultData);
const uninitialized = Symbol('uninitialized-data');

function createData(): Data {
    let _data: any = uninitialized;
    let _isLoading: Loading = false;
    let _isNoMore = false;
    let _url: DataUrl;
    let _snapshot = [_data, _isLoading, _url] as [any, Loading, DataUrl];
    const listeners = new Set<HookListener>();
    
    function emitChangeEvent(newData: any, newLoading: Loading, newUrl: typeof _url) {
        if (!Object.is(newData, _data) || !Object.is(newLoading, _isLoading) || _url != newUrl) {
            _data = newData;
            _isLoading = newLoading;
            _url = newUrl;
            _snapshot = [_data, _isLoading, _url];
            for (let listener of listeners) listener();
        }
    }

    return {
        isLoading() {
            return _isLoading;
        },
        get isNoMore() {
            return _isNoMore;
        },
        get isUninitialized() {
            return _data === uninitialized;
        },

        async load(
            urlOrData: any,
            onDataReady: DataReadyCallback,
            onError: HttpReject
        ) {
            _isNoMore = false;
            const isUrl = isUrlPath(urlOrData);
            let newUrl = _url;
            emitChangeEvent(_data, true, newUrl);
            
            let newData = _data;
            const promise = isUrl
                ? callServer(urlOrData as UrlPath)
                : Promise.resolve(urlOrData); 
            return await promise
            .then(async data => {
                newUrl = isUrl ? (urlOrData as UrlPath) : null;
                const $ = decomposeData(data)
                if ($ === false) {
                    newData = data;
                    return null;
                }
                
                newData = $.data;
                if (await onDataReady($.data, $.newUrl) === false) {
                    throw {status:-1, handled: true} as HttpError;
                }
           
                if (isPlainObject($.config)) await setConfig($.config);
                if (isPlainObject($.paymentConfig)) await setPaymentConfig($.paymentConfig);
                if (isPlainObject($.menu) && Array.isArray($.menu.items)) await setMenu($.menu.items);
                await setSession($.session);
                await setCart($.cart);

                return {
                    message: $.message,
                    messageType: $.messageType,
                };
            })
            .finally(() => {
                emitChangeEvent(newData, false, newUrl);
            })
            .then(showResponseMessage)
            .catch((err: HttpError) => {
                onError(err);
                throw err;
            })
            .catch(errorHandler);
        },

        async loadMore<T>(nextUrlOrData: NotFunc<T> | NextDataUrl, mergeData: MergeData<T>) {
            emitChangeEvent(_data, 1, _url);

            let promise: Promise<T>;
            let newUrl: DataUrl;
            let newData: any;
            if (typeof(nextUrlOrData) == 'function') {
                newUrl = (nextUrlOrData as NextDataUrl)(_url);
                promise = callServer(newUrl);
            }
            else {
                newUrl = null;
                promise = Promise.resolve(nextUrlOrData);
            }
            promise
                .then(async (data) => {
                    let isNext = true, isRevertUrl = false;
                    [newData, isNext, isRevertUrl] = await mergeData(data, _data);
                    if (!isNext) {
                        _isNoMore = true;
                        if (newUrl && isRevertUrl) newUrl = _url;
                    }
                })
                .catch(err => {
                    newData = _data;
                    newUrl = _url;
                    throw err;
                })
                .finally(() => {
                    emitChangeEvent(newData, false, newUrl);
                });
        },
        
        setLoading(isLoading: Loading) {
            emitChangeEvent(_data, isLoading, _url);
        },

        snapshot() {
            return _snapshot;
        },
        
        subscribe(listener: HookListener) {
            if (!listeners.has(listener)) listeners.add(listener);
            return () => listeners.delete(listener);
        },
    };
}
function DataObjectProvider({children}: {children: React.ReactNode}) {
    const state = useRefMemo(createData);
    return <DataContext.Provider value={state}>
        {children}
    </DataContext.Provider>;
}

export function useData<T = any>(initData?: T) {
    const ctx = React.useContext(DataContext);
    let data = React.useSyncExternalStore(ctx.subscribe, ctx.snapshot);
    if (data[0] === uninitialized) data = [initData, data[1], data[2]];
    return data;
}

export function useIsDataUnset() {
    const ctx = React.useContext(DataContext);
    return ctx.isUninitialized;
}

export function useIsLoading(notMore?: boolean) {
    const ctx = React.useContext(DataContext);
    const loading = React.useSyncExternalStore(ctx.subscribe, ctx.isLoading);
    if (notMore) return loading !== 1 && !!loading;
    return !!loading;
}

export function useLoadData(
    callback: DataReadyCallback = noop,
    urlOrData: any = null,
    errorCallback: HttpReject = noop,
) {
    const ctx = React.useContext(DataContext);
    const path = usePathname();
    urlOrData ??= path;
    return React.useCallback(async () => {
        return await ctx.load(urlOrData, callback, errorCallback);
    }, [ctx, urlOrData, callback, errorCallback]);
}

function _mergeData<T>(newData: T) {
    return [newData, false, false] as [T, boolean, boolean];
}
export function useLoadMoreData<T>(
    nextUrlOrData: NotFunc<T> | GetNextDataUrl = noop,
    mergeData: MergeData<T> = _mergeData<T>,
) {
    const ctx = React.useContext(DataContext);
    const path = usePathname();
    return React.useCallback(async () => {
        if (
            ctx.isLoading() //prevent double invocation of `loadMore` (which will use the same URL)
            ||
            ctx.isUninitialized //`load` is not yet invoked to initiate data. When the list is not loaded
                //yet (still empty), `List` component may think to to invoke `loadMore` because the
                //position is at the end of the list.
            ||
            ctx.isNoMore //prevent repetitive invocation without more data returned. It usually happens
                //when the position is at the end of the list. Must re-invoke `load` to reset it
                //(by refreshing the list)
        ) return false;
        
        let _nextUrlOrData: NotFunc<T> | NextDataUrl;
        if (typeof(nextUrlOrData) == 'function') {
            _nextUrlOrData = (prevUrl?: DataUrl) => (nextUrlOrData as GetNextDataUrl)(prevUrl) ?? path;
        }
        else {
            _nextUrlOrData = nextUrlOrData;
        }
        return await ctx.loadMore(_nextUrlOrData, mergeData);
    }, [ctx, nextUrlOrData, mergeData, path]);
}

export function useSetLoading() {
    return React.useContext(DataContext).setLoading;
}

type RefreshState = [
    boolean,
    (refreshing: boolean | ((r: boolean) => boolean)) => void,
];
const RefreshContext = React.createContext<RefreshState>([false, noop]);

function RefreshProvider({children}: {children: React.ReactNode}) {
    let setState: (
        state: RefreshState | ((s: RefreshState) => RefreshState)
    ) => void = noop;
    let state: RefreshState;
    [state, setState] = React.useState<RefreshState>([
        false,
        r => {
            setState(state => {
                if (typeof(r) == 'function') r = r(state[0]);
                return r == state[0]
                    ? state
                    : [r, state[1]];
            });
        }
    ]);
    return <RefreshContext.Provider value={state}>
        {children}
    </RefreshContext.Provider>;
}

export function useRefreshing() {
    return React.useContext(RefreshContext);
}


export function DataProvider({children}: {children: React.ReactNode}) {
    return <RefreshProvider>
        <DataObjectProvider>
            {children}
        </DataObjectProvider>
    </RefreshProvider>;
}