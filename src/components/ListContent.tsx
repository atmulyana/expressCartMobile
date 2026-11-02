/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useData, useLoadMoreData, useRefreshing } from '@/hooks';
import styles, { arrayStyle } from '@/styles';
import type { DataSource, GetNextDataUrl, MergeData, NotFunc } from '@/types';
import { emptyArray } from 'javascript-common';
import React from 'react';
import { FlatList, type StyleProp, type ViewStyle, type VirtualizedListProps } from 'react-native';
import Content from "./Content";
import Text from './Text';

export type ListRef = {
    loadMoreData: () => Promise<any>,
};

export default function ListContent<T, P extends VirtualizedListProps<T> = VirtualizedListProps<T>>({
    dataDefault,
    dataSource,
    ListEmptyComponent,
    ListFooterComponentStyle = arrayStyle('pb8', 'transparent'),
    ListFooterComponentStyleLoading = styles.pb8,
    mergeData = defaultMergeData,
    nextUrlOrData,
    partial = dataSource !== undefined && dataSource !== null,
    ref,
    //@ts-expect-error
    Scroller = FlatList,
    ...props
}: Omit<React.ComponentProps<typeof Content<P>>, 'children' | 'ref'> & {
    dataDefault?: DataSource,
    ListFooterComponentStyleLoading?: StyleProp<ViewStyle>,
    mergeData?: MergeData<DataSource>,
    nextUrlOrData?: NotFunc<DataSource> | GetNextDataUrl,
    ref?: React.Ref<ListRef>,
}) {
    let [data, isLoading, pageUrl] = useData(dataDefault);
    if (partial) {
        data = dataSource;
    }
    const loadMoreData = useLoadMoreData(nextUrlOrData, mergeData);
    const [isRefreshing] = useRefreshing();

    React.useImperativeHandle(ref, () => ({loadMoreData}), [loadMoreData]);
    
    return <Content
        contentContainerStyle={styles.list}
        data={Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : emptyArray}
        extraData={pageUrl}
        keyExtractor={keyExtractor}
        ListFooterComponent={DefaultListFooterComponent}
        onEndReachedThreshold={0.1}
        
        {...(props as P)}
        
        dataSource={dataSource}
        ListEmptyComponent={isLoading ? null : ListEmptyComponent}
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

function defaultMergeData(newData: any, oldData: any): [any, boolean, boolean] {
    let results = newData?.results;
    let isNext = false;
    if (Array.isArray(results)) {
        isNext = results.length > 0;
        if (Array.isArray(oldData?.results)) results = oldData.results.concat(results);
    }
    newData = Object.assign({}, oldData, newData, {results});
    return [
        newData,
        isNext,
        !isNext /* if no more data (empty list) then page url should not change */
    ];
}

function keyExtractor(_: any, idx: number) {
    return idx;
}