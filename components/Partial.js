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
    StyleSheet,
    View,
    ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import Notification from './Notification';
import LessPureComponent from './LessPureComponent';
import SubmittingIndicator from './SubmittingIndicator';
import {appHelpers, callServer} from '../common';
import {contentCentered} from '../styles';

export default class Partial extends LessPureComponent {
    static propTypes = {
        ...ViewPropTypes,
        autoLoad: PropTypes.bool,
        data: PropTypes.object,
        url: PropTypes.string,
    };
    static defaultProps = {
        ...View.defaultProps,
        autoLoad: true,
    };
    
    state = {
        isLoading: false,
    };

    constructor(props) {
        super(props);
        
        let _data = null;
        Object.defineProperty(this, 'data', {
            configurable: false,
            get() { return _data; },
        });

        const showResponseMessage = data => {
            if (/*data?.responseRedirected &&*/ data?.message && data?.messageType) {
                if (data?.messageType == 'danger') Notification.error(data.message);
                else if (data?.messageType == 'waning') Notification.warning(data.message);
                else Notification.success(data.message);
            }
            return data;
        };

        const _loadData = silent => {
            const NULL = Promise.resolve(null);
            const url = this.contentUrl;
            let dataLoadingProcess = url && !this.contentData ? callServer(url) : NULL;
            return dataLoadingProcess
                .then(data => {
                    _data = data || this.contentData || {};
                    if (this.onDataReady(silent, data) === false)
                        throw {status:-1, handled: true};
                    return _data;
                })
                .then(data => {
                    if (!silent) {
                        if (typeof(data.paymentConfig) == 'object' && data.paymentConfig) appHelpers.paymentConfig = data.paymentConfig;
                        if (typeof(data.config?.maxQuantity) == 'number') appHelpers.maxQuantity = data.config.maxQuantity;
                        if (data.menu) appHelpers.setMenu(data.menu);
                        if (typeof(data?.session?.totalCartItems) == 'number') { //we get valid session
                            const cart = data.session.cart;
                            appHelpers.setCartCount( //data.session.totalCartItems
                                cart ? Object.keys(cart).length : 0    //Sometimes, totalCartItems is not synchronized
                            );
                        }
                        if (data.session && appHelpers.isLoggedIn != data.session?.customerPresent) {
                            data.session?.customerPresent ? appHelpers.login() : appHelpers.logout();
                        }
                    }
                    return data;
                })
                .catch(Notification.errorHandler)
                .finally(() => {
                    if (!silent) this.setState({isLoading:false})
                })
                .then(showResponseMessage);
        };

        this.loadData = silent =>
            silent               ? _loadData(silent) :
            this.state.isLoading ? _loadData() : 
            /* else */             this.setState({isLoading: true}, _loadData);

        this.mergeData = newData => {
            let results = null;
            if (_data?.results && newData?.results) results = _data.results.concat(newData.results);
            _data = Object.assign({}, _data, newData);
            if (results) _data.results = results;
            this.onMoreDataReady();
        };

        let _submittingIndicator;
        Object.defineProperty(this, 'submittingIndicator', {
            configurable: false,
            get() { return _submittingIndicator; },
        });
        this.submitData = (url, data = {}, httpHeaders) => {
            return new Promise((resolve, reject) => {
                const submit = () => callServer(url, data, httpHeaders)
                    .then(data => {
                        if (this.onDataSubmitted(data) === false)
                            throw {status:-1, handled: true};
                        return data;
                    })
                    .then(data => {
                        resolve(data);
                        return data;
                    })
                    .catch(err => {
                        let isNotHandled = !(typeof(err) == 'object' && err?.handled);
                        if (isNotHandled) console.log('submitData err: ', err)
                        Notification.errorHandler(err);
                        if (isNotHandled) reject(err); 
                    })
                    .finally(() => _submittingIndicator?.hide())
                    .then(showResponseMessage);
                _submittingIndicator ? _submittingIndicator.show(submit) : submit();
            });
        };

        const oriRender = this.render
            ? this.render.bind(this) 
            : () => this.props.children;

        this.render = () => {
            //As the first statement:
            //Let the initial process before rendering in original render function is executed first
            //For ex., it can set this.scrollerProps in Content component
            const content = this.data && oriRender();
            return this._render(content, <SubmittingIndicator ref={elm => _submittingIndicator = elm} />);
        };
    }

    get contentUrl() {
        return this.props.url ?? this.constructor.defaultParams?.url;
    }

    get contentData() {
        return this.props.data;
    }

    _render(content, submittingIndicator) {
        const {isLoading} = this.state;
        return <View {...this.props}>
            {content}
            <View style={[StyleSheet.absoluteFill, contentCentered, {display: isLoading?'flex':'none'}]}>
                <ActivityIndicator animating={isLoading} size="large" color='#00f' />
            </View>
            {submittingIndicator}
        </View>;
    }

    clearLocalData() {
        //this.props.data = null; //For Partial, cannot clear local data (cannot reload from server). But it's overridden in Content and ListPartial
    }

    refreshData(silent) {
        this.clearLocalData(); //force to get fresh data from server
        return this.loadData(silent);
    }

    onDataReady() {
        //To be overriden by child class
    }

    onMoreDataReady() {
        //To be overriden by child class
    }

    onDataSubmitted() {
        //To be overriden by child class
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.autoLoad) this.loadData();
    }

    componentDidUpdate(prevProps) {
        const props = this.props;
        if (props.autoLoad)  {
            if (props.url != prevProps.url || props.data != prevProps.data) {
                this.loadData();
            }
        }
    }
}