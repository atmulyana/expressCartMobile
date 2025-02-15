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
    View
} from 'react-native';
import {ViewPropTypes} from 'deprecated-react-native-prop-types';
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
        autoLoad: true,
    };
    
    state = {
        isLoading: false,
        isStarting: false,
    };

    constructor(props) {
        super(props);
        
        let _data = null;
        Object.defineProperty(this, 'data', {
            configurable: false,
            get() { return _data; },
        });

        const showResponseMessage = data => {
            if (/*data?.responseRedirected &&*/ data?.message) {
                if (data.messageType == 'danger') Notification.error(data.message);
                else if (data.messageType == 'waning') Notification.warning(data.message);
                else Notification.success(data.message);
                data.message = null; //prevent showing a message more than once
            }
            return data;
        };

        const _loadData = silent => {
            const NULL = Promise.resolve(null);
            const url = this.contentUrl;
            let dataLoadingProcess = url && !this.contentData ? callServer(url) : NULL;
            return dataLoadingProcess
                .then(async data => {
                    _data = data || this.contentData || {
                        $cartCount: null, //don't change the cart count
                        session: {
                            customerPresent: appHelpers.isLoggedIn //prevent to relogin
                        }
                    };
                    if (await this.onDataReady(silent, data) === false)
                        throw {status:-1, handled: true};
                    return _data;
                })
                .then(async data => {
                    if (!silent) {
                        if (typeof(data.paymentConfig) == 'object' && data.paymentConfig) appHelpers.paymentConfig = data.paymentConfig;
                        if (typeof(data.config?.maxQuantity) == 'number') appHelpers.maxQuantity = data.config.maxQuantity;
                        if (data.menu) appHelpers.setMenu(data.menu);
                        if (appHelpers.isLoggedIn != (data.session?.customerPresent ?? false)) {
                            data.session?.customerPresent ? appHelpers.login() : await appHelpers.relogin(data);
                        }
                    }
                    if (typeof(data.session?.cartItemCount || data.session?.totalCartItems) == 'number') { //we get valid session
                        const cart = data.session.cart;
                        appHelpers.setCartCount(
                            data.session.cartItemCount //nextCart
                            || /*data.session.totalCartItems*/ (cart && Object.keys(cart).length) //Sometimes, totalCartItems is not synchronized
                            || 0
                        );
                    }
                    else if (data.$cartCount !== null) {
                        appHelpers.setCartCount(0);
                    }
                    return data;
                })
                .finally(() => {
                    if (!silent) this.setState({isLoading:false, isStarting:false})
                })
                .then(showResponseMessage)
                .catch(err => Notification.errorHandler(err));
        };

        this.loadData = silent =>
            silent               ? _loadData(silent) :
            this.state.isLoading ? _loadData() : 
            /* else */             this.setState({isLoading:true, isStarting:true}, () => _loadData());

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
        this.submitData = (url, data = {}, httpHeaders, message, rejectIfHandled = false) => {
            return new Promise((resolve, reject) => {
                const submit = () => callServer(url, data, httpHeaders)
                    .then(data => {
                        if (url == '/blockonomics/checkout_action') console.log(data);
                        if (this.onDataSubmitted(data) === false)
                            throw {status:-1, handled: true};
                        return data;
                    })
                    .then(data => {
                        resolve(data);
                        return data;
                    })
                    .finally(() => _submittingIndicator?.hide())
                    .then(showResponseMessage)
                    .catch(err => {
                        Notification.errorHandler(err);
                        if (err !== undefined && typeof(err) != 'object' || !err?.handled || err?.handled && rejectIfHandled) {
                            if (!rejectIfHandled) console.log(`submitData error for ${url}: `, err)
                            reject(err);
                        }
                    });
                _submittingIndicator ? _submittingIndicator.show(submit, message) : submit();
            });
        };

        const oriRender = this.render
            ? this.render.bind(this) 
            : () => this.props.children;

        this.render = () => {
            //As the first statement:
            //Let the initial process before rendering in original render function is executed first
            //For ex., it can set this.scrollerProps in Content component
            let content = this.data && oriRender();
            content = this._render(content, <SubmittingIndicator ref={elm => _submittingIndicator = elm} />);
            let contentInit = this._renderInits(!this.data);
            return contentInit && content && <>{contentInit}{content}</>
                || contentInit
                || content;
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

    _renderInits(isNoData) {
        return null;
    }

    clearLocalData() {
        //this.props.data = null; //For Partial, cannot clear local data (cannot reload from server). But it's overridden in Content and ListPartial
    }

    refreshData(silent) {
        this.clearLocalData(); //force to get fresh data from server
        return this.loadData(silent);
    }

    async onDataReady() {
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