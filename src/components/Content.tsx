/**
 * https://github.com/atmulyana/expressCartMobile
 */
import {
    useEffectEvent,
    useLoadData,
    useMount,
    useNavHelpers,
    usePathname,
    useRefreshing,
    useSession,
    useStyles
} from "@/hooks";
import { setRefresher } from "@/hooks/navigation";
import { isUrlPath } from "@/libs/server";
import { relogin } from "@/libs/session";
import type { DataReadyCallback, DataSource, HttpReject, UrlPath } from '@/types';
import { useFocusEffect, useIsFocused, useNavigation } from "expo-router";
import { emptyObject, emptyString, isPlainObject, noop } from "javascript-common";
import React from 'react';
import { RefreshControl, ScrollView, type ScrollViewProps } from "react-native";


/*** We do really need VirtualizedList (FlatList) inside ScrollView */
//LogBox.ignoreLogs(['VirtualizedLists should never be nested']); //NOT working
const _logError = console.error.bind(console);
console.error = (message, ...optinalParams) => {
    if (typeof(message) == 'string' && message.startsWith('VirtualizedLists should never be nested')) return; 
    _logError(message, ...optinalParams);
};


export default function Content<P extends ScrollViewProps = ScrollViewProps>({
    authenticated = false,
    autoLoad = true,
    children,
    dataSource,
    contentContainerStyle,
    noData = false,
    onDataError,
    onDataReady = noop,
    partial = dataSource !== undefined && dataSource !== null,
    ref,
    //@ts-expect-error
    Scroller = ScrollView,
    style,
    title,
    url,
    ...scrollerProps
}: {
    authenticated?: boolean,
    autoLoad?: boolean,
    children?: React.ReactNode,
    dataSource?: DataSource,
    noData?: boolean,
    onDataError?: HttpReject,
    onDataReady?: (data: any, silent?: boolean) => any,
    partial?: boolean,
    ref?: React.Ref<React.ComponentType<P>>,
    Scroller?: React.ComponentType<P>,
    title?: string | ((newTitle: string, data: any, url: UrlPath) => string),
    url?: UrlPath,
} & P) {
    const isFocused = useIsFocused();
    const nav = useNavHelpers();
    const navigation = useNavigation();
    const path = usePathname();
    const session = useSession();
    const styles = useStyles();
    const [isRefreshing, setRefreshing] = useRefreshing();
    const $data = React.useRef<any>(emptyObject);

    const setTitle = React.useCallback((newTitle?: string, data?: any) => {
        if (partial) return;
        newTitle = (typeof(title) == 'function')
            ? title(newTitle ?? emptyString, data, path)
            : (newTitle ?? emptyString);
        navigation.setOptions({title: newTitle});
    }, [partial, title, path, navigation]);
    const titleOnChange = useEffectEvent((newTitle?: string, data?: any) => {
        if (isFocused) setTitle(newTitle, data);
    });

    React.useEffect(() => {
        if (typeof(title) != 'function') titleOnChange(title);
        else if (path) titleOnChange($data.current?.title, $data.current);
    }, [title, path]);

    const dataReadyHandler: DataReadyCallback = React.useCallback(async (data, newUrl) => {
        if (!session.customerPresent) { //not logged in
            if (await relogin()) { //succeeds to relogin
                if (authenticated) { //It must already be redirected to login form at server, so don't continue, just reload data instead
                    setTimeout(() => nav.refresh(), 10);
                    return false;
                }
            }
            else if (authenticated) { //cannot (re)login but need to login
                nav.goto('/customer/login'); //show login form
                return false;
            }
        }
        if (newUrl && !partial) {
            nav.goto(newUrl, true);
            return false;
        }

        if (isPlainObject(data)) {
            $data.current = data;
            let {title: newTitle, ...data2} = data;
            setTitle(newTitle, data);
            data = data2;
        }

        return await onDataReady(data);
    }, [
        nav, partial, setTitle,
        session, authenticated, onDataReady
    ]);
    
    const urlOrData = url ?? dataSource ?? null;
    const isStaticData = urlOrData !== null && !isUrlPath(urlOrData);
    const loadData = useLoadData(dataReadyHandler, urlOrData, onDataError);
    
    useMount(() => {
        if (autoLoad && !noData && isFocused) loadData();
    });

    useFocusEffect(
        React.useCallback(
            () => {
                setRefresher(noData ? null : loadData);
                if ($data.current === emptyObject && !noData) loadData();
            }, 
            [loadData, noData]
        )
    );

    const styleProps = React.useMemo(() => {
        return {
            style: [
                styles.scrollView,
                style,
            ],
            contentContainerStyle: [
                styles.p8,
                contentContainerStyle,
            ],
        } as P;
    }, [contentContainerStyle, style, styles]);

    return <>
        {/* <Stack.Screen
            dangerouslySingular={() => path}
            options={{
                title: typeof(title) == 'string' ? title : emptyString,
            }}
        /> */}
        <Scroller 
            contentInsetAdjustmentBehavior="automatic"
            nestedScrollEnabled={true}
            ref={ref}
            refreshControl={noData || isStaticData ? null : (
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={() => {
                        setRefreshing(true);
                        loadData().finally(() => {
                            setRefreshing(false);
                        });
                    }}
                />
            )}
            {...scrollerProps}
            {...styleProps}
        >
            {children}
        </Scroller>
    </>;
}