/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {FlatList} from 'react-native';
import Content from './Content';
import {LoadingMoreIndicator} from '../components';
import {callServer, emptyString} from '../common';
import {p8 as scrollContentStyle} from '../styles';

export default class ListContent extends Content {
    constructor(props) {
        super(props);
        Object.assign(this.state, {
            isLoadingMore: false,
            lastPageUrl: this.contentUrl,
        });

        let lastUrl;
        this.loadMoreData = () => {
            const url = this.getNextDataUrl();
            if (lastUrl == url) return; //double triggers happens.
            lastUrl = url;
            
            this.setState({isLoadingMore: true}, () => {
                //this.scoller.scrollToEnd();
                const state = {};
                callServer(url)
                    .then(data => {
                        this.mergeData(data);
                        if ((data?.results ?? []).length > 0) { //if no more data => page url should not change
                            state.lastPageUrl = url;
                        }
                    })
                    .finally(() => {
                        state.isLoadingMore = false;
                        this.setState(state);
                    });
            });
        }

        this.onDataReady = async (silent, data) => {
            await super.onDataReady(silent, data);
            lastUrl = undefined;
            this.state.lastPageUrl = this.contentUrl;
        }
    }

    getNextDataUrl() {
        return null;
    }

    getScroller() {
        return {
            Scroller: FlatList,
            props: {
                contentContainerStyle: scrollContentStyle,
                data: this.data?.results ?? [],
                keyExtractor: (item, idx) => idx + emptyString,
                ListFooterComponent: <LoadingMoreIndicator />,
                ListFooterComponentStyle: {
                    //display: this.state.isLoadingMore ? 'flex' : 'none',
                    opacity: this.state.isLoadingMore ? 1 : 0,
                    paddingVertical: 8,
                },
                onEndReachedThreshold: 0.1,
                onEndReached: this.loadMoreData,
                extraData: this.state.lastPageUrl,
            },
        };
    }

    render() {
        return null;
    }
}