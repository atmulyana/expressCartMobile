/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {customerLogin, home, getRouteByUrl} from './routes';
import {contentCentered, p8 as scrollContentStyle, scrollView as scrollViewStyle} from '../styles';
import {appHelpers, emptyString, lang} from '../common';
import {Partial} from '../components';

function ContentInit({ url, loader, refresher, submitter, refreshNoLoadData, nav }) {
    if (!nav) return null;

    useFocusEffect(
        React.useCallback(
            () => {
                appHelpers.refreshContent = refresher;
                appHelpers.submitData = submitter;
                appHelpers.contentCanGoBack = nav.canGoBack();
                appHelpers.setHeaderBar(appHelpers.currentRoute?.params?.headerBar);
                refreshNoLoadData();
            }, 
            []
        )
    )
    React.useEffect(
        () => {
            loader();
        },
        [url]
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
        return this.data?.title ?? this.props.route?.params?.title ?? emptyString;
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
                    onRefresh={() => this.setState(
                        {isLoading: true},
                        () => this.refreshData()
                    )}
                />,
                //refreshing: this.state.isLoading,
            },
            props1,
            props2,
            {
                style: styles,
                contentContainerStyle: contentStyles
            }
        );

        return <>
            {this.state.isStarting
                /*On iOS, RefreshControl can only be shown by 'pull-down' gesture. Only setting 'refreshing' to 'true' doesn't have effect.
                *Therefore, we need to use ActivityIndicator to show loading process when the content is first loaded.
                */
                ? <View style={[StyleSheet.absoluteFill, contentCentered]}>
                    <ActivityIndicator animating={true} size="large" color='#000' />
                  </View>

                : <Scroller ref={this.setScroller} {...scrollerProps}>
                    {content}
                  </Scroller>
            }
            
            {submittingIndicator}
        </>;
    }

    _renderInits() {
        let contentFlag = appHelpers.contentFlag;
        return <ContentInit
            url={this.props?.route?.params?.url}
            loader={this.loadData}
            refresher={this.refreshData.bind(this)}
            submitter={this.submitData.bind(this)}
            refreshNoLoadData={() => {
                if (contentFlag != appHelpers.contentFlag) {
                    contentFlag = appHelpers.contentFlag;
                    this.forceUpdate();
                }
            }}
            nav={this.props?.navigation}
        />;
    }
    
    #setTitle = () => {
        let cartTitle = this.data?.config?.cartTitle ?? emptyString;
        if (cartTitle) appHelpers.setCartTitle(cartTitle);
        this.props.navigation?.setOptions({title: this.contentTitle});
    };
    
    #handleRedirection = data => {
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
            if (await appHelpers.relogin(this.data)) { //succeeds to relogin
                if (this.authenticated) { //It must already be redirected to login form at server, so don't continue, just reload data instead
                    setTimeout(appHelpers.refreshContent, 10);
                    return false;
                }
            }
            else if (this.authenticated) { //cannot (re)login but need to login
                appHelpers.replaceContent(customerLogin); //show login form
                return false;
            }
        }
        if (data && this.#handleRedirection(data) === false) return false;
        if (!silent) {
            this.#setTitle();
        }
    }

    onMoreDataReady() {
        this.#setTitle();
    }

    onDataSubmitted(data) {
        return this.#handleRedirection(data);
    }

    getScroller() {
        return {
            Scroller: ScrollView,
            props: {
                contentContainerStyle: scrollContentStyle,
            }
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.lang != prevState.lang) { //languange has just changed
            this.#setTitle(); //some titles are language-aware
        }
    }
}
