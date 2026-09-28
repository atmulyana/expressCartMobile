/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useData, useLoadMoreData, useRefreshing } from '@/hooks';
import styles, { arrayStyle } from '@/styles';
import type { GetNextDataUrl, MergeData, NotFunc } from '@/types';
import { emptyArray } from 'javascript-common';
import React from 'react';
import { FlatList, type StyleProp, type ViewStyle, type VirtualizedListProps } from 'react-native';
import Content from "./Content";
import Text from './Text';

export default function ListContent<T, P extends VirtualizedListProps<T> = VirtualizedListProps<T>>({
    dataDefault,
    dataSource,
    ListFooterComponentStyle = arrayStyle('pb8', 'transparent'),
    ListFooterComponentStyleLoading = styles.pb8,
    mergeData = defaultMergeData,
    nextUrlOrData,
    partial = dataSource !== undefined && dataSource !== null,
    //@ts-expect-error
    Scroller = FlatList,
    ...props
}: Omit<React.ComponentProps<typeof Content<P>>, 'children'> & {
    dataDefault?: any,
    ListFooterComponentStyleLoading?: StyleProp<ViewStyle>,
    mergeData?: MergeData<T>,
    nextUrlOrData?: NotFunc<T> | GetNextDataUrl,
}) {
    let [data, isLoading, pageUrl] = useData(dataDefault);
    if (partial) {
        [data, isLoading, pageUrl] = [dataSource, false, null];
    }
    const loadMoreData = useLoadMoreData(nextUrlOrData, mergeData);
    const [isRefreshing] = useRefreshing();
    
    return <Content
        contentContainerStyle={styles.list}
        data={Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : emptyArray}
        extraData={pageUrl}
        keyExtractor={keyExtractor}
        ListFooterComponent={DefaultListFooterComponent}
        onEndReachedThreshold={0.1}
        
        {...(props as P)}
        
        dataSource={dataSource}
        ListFooterComponentStyle={
            isLoading && !isRefreshing
                ? ListFooterComponentStyleLoading
                : ListFooterComponentStyle
        }
        onEndReached={loadMoreData}
        partial={partial}
        Scroller={Scroller as React.ComponentType<P>}
    />;
}

const DefaultListFooterComponent = <Text loadingAware style={styles.stretch}>Loading more...</Text>;

function defaultMergeData(newData: any, oldData: any) {
    let results = newData?.results;
    let isNext = false;
    if (Array.isArray(results)) {
        isNext = results.length > 0;
        if (Array.isArray(oldData?.results)) results = oldData.results.concat(results);
    }
    newData = Object.assign({}, oldData, newData, {results});
    return [newData, isNext] as [any, boolean];
}

function keyExtractor(_: any, idx: number) {
    return idx;
}