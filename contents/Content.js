/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {
    RefreshControl,
    ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {customerLogin, home, getRouteByUrl} from './routes';
import {p8 as scrollContentStyle, scrollView as scrollViewStyle} from '../styles';
import {appHelpers, lang} from '../common';
import {Partial} from '../components';

function LoadingData({ url, loader, refresher, submitter, aborter }) {
    useFocusEffect(
        React.useCallback(
            () => {
                appHelpers.refreshContent = refresher;
                appHelpers.submitData = submitter;
                loader();
                return aborter;
            }, 
            [url]
        )
    );
    
    return null;
}

export default class Content extends Partial {
    static propTypes = { //overrides Partial.propTypes
    };
    static defaultProps = { //overrides Partial.defaultProps
    };

    constructor(props) {
        super(props);
        
        let _scroller = null;
        Object.defineProperty(this, 'scroller', {
            configurable: false,
            get() { return _scroller; },
        });
        this.setScroller = scroller => _scroller = scroller;
    }

    //Whether the user must log in or not
    //Overrides in child class to return true if the page requires the user has logged in before
    get authenticated() {
        return false;
    }

    get contentUrl() {
        return this.props.route?.params?.url ?? this.constructor.defaultParams?.url;
    }

    get contentData() {
        return this.props.route?.params?.data;
    }

    get contentTitle() {
        if (this.data?.filtered && this.data?.paginateUrl == 'search') {
            return `${lang('Search results')}: ${this.data?.searchTerm}`
        }
        return this.data?.title ?? this.props.route?.params?.title ?? '';
    }

    _render(content, submittingIndicator) {
        const styles = [scrollViewStyle];
        const contentStyles = [];
        const {Scroller, props:props1={}} = this.getScroller();
        if (props1.style) styles.push(props1.style);
        if (props1.contentContainerStyle) contentStyles.push(props1.contentContainerStyle);
        const props2 = typeof(this.scrollerProps) == 'object' ? this.scrollerProps : {};
        if (props2.style) styles.push(props2.style);
        if (props2.contentContainerStyle) contentStyles.push(props2.contentContainerStyle);
        const scrollerProps = Object.assign(
            {
                contentInsetAdjustmentBehavior: "automatic",
                nestedScrollEnabled: true,
                refreshControl: <RefreshControl
                    refreshing={this.state.isLoading}
                    onRefresh={() => {
                        this.state.isLoading = true; //when refreshing, it must be <true>, so that after data refreshed, it will be re-rendered
                                                     //not use setState because to avoid double re-render
                        this.refreshData();
                    }}

                />,
            },
            props1,
            props2,
            {
                style: styles,
                contentContainerStyle: contentStyles
            }
        );

        return (<>
            {this.props.navigation &&
                <LoadingData
                    url={this.props?.route?.params?.url}
                    loader={this.loadData}
                    refresher={this.refreshData.bind(this)}
                    submitter={this.submitData.bind(this)}
                />}
            {submittingIndicator}
            <Scroller ref={this.setScroller} {...scrollerProps}>
                {content}
            </Scroller>
        </>);
    }
    
    _setTitle = () => {
        let cartTitle = this.data?.config?.cartTitle ?? '';
        if (cartTitle) appHelpers.setCartTitle(cartTitle);
        this.props.navigation?.setOptions({title: this.contentTitle});
    };
    
    _handleRedirection = data => {
        if (data.responseRedirected) {
            let redirectUrl = data.responseURL?.pathname;
            if (redirectUrl) {
                const route = getRouteByUrl(redirectUrl);
                if (route == home) {
                    appHelpers.goHome();
                }
                else if (route) {
                    delete data.responseURL; //non serialized object can't be put on the state
                    appHelpers.replaceContent({ ...route, data });
                    return false;
                }
            }
        }
        return true;
    };

    clearLocalData() {
        if (this.props.route && this.props.route.params) this.props.route.params.data = null; //force to get fresh data from server when reloading
    }

    async onDataReady(silent, data) {
        if (!this.data.session?.customerPresent) {
            if (this.data.session = await appHelpers.relogin()) { //succeeds to relogin
            }
            else if (this.authenticated) { //cannot relogin but need to login
                appHelpers.replaceContent(customerLogin);
                return false;
            }
        }
        if (data && this._handleRedirection(data) === false) return false;
        if (!silent) {
            appHelpers.setHeaderBar(this.props.route?.params?.headerBar);  
            this._setTitle();
        }
    }

    onMoreDataReady() {
        this._setTitle();
    }

    onDataSubmitted(data) {
        return this._handleRedirection(data);
    }

    getScroller() {
        return {
            Scroller: ScrollView,
            props: {
                contentContainerStyle: scrollContentStyle,
            }
        };
    }
}
