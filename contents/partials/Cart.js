/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {Box, Button, ContentLink, Icon, Image, IntegerSpinner, LessPureComponent, ListPartial, Notification, Text} from '../../components';
import routes from '../routes';
import {appHelpers, callServer, confirmModal, currencySymbol, digitCount, formatAmount, lang} from '../../common';
import styles from '../../styles';

const renderItem = (cartId, data, isReadOnly, currency, maxQty, qtyLength, submitData, refresh) =>
    <View style={[{flexDirection:'row'}, styles.para8]}>
        <View style={{flex:1}}>
            <Image uri={data.productImage} />
        </View>
        <View style={[{flex:2, justifyContent:'center'}, styles.ml4]}>
            <ContentLink route={routes.productInfo(data.link)} onPress={() => appHelpers.closeCart()} style={styles.para4}>
                <Text>{data.title}</Text>
            </ContentLink>
            {!!data.variantId &&
                <Text para4><Text bold>{lang("Option")}:</Text> {data.variantTitle}</Text>
            }
            <View style={{alignItems:'center', flexDirection:'row'}}>
            {!isReadOnly && <>
                <IntegerSpinner min={1} max={maxQty} maxLength={qtyLength} value={data.quantity} //editable={false}
                    style={[styles.textInputHeight, {flex:3}]}
                    onValueChange={quantity => {
                        callServer('/product/updatecart', {
                            cartId,
                            productId: data.productId,
                            quantity
                        })
                        .then(refresh)
                        .catch(Notification.errorHandler)
                    }}
                    onExceedMax={() => Notification.warning(`Exceeds maximum quantity: ${maxQty}`)}
                />
                <Button style={[styles.buttonDanger, styles.ml4, {flex:0}]}
                    onPress={() => {
                        submitData('/product/removefromcart', {cartId})
                        .then(resp => {
                            refresh();
                            appHelpers.setCartCount(resp.totalCartItems);
                        });
                    }}
                >
                    <Icon icon="Trash2" stroke="white" style={styles.buttonDanger} height={styles.text.fontSize} width={styles.text.fontSize} />
                </Button>
            </>}
                <Text bold right style={{flex:2}}>
                    {currencySymbol(currency)}{formatAmount(data.totalItemPrice)}
                </Text>
            </View>
        </View>
    </View>;

const CartTotal = props => {
    const {session, currency} = props;
    return <View>
        <Text right>
        {session.totalCartShipping > 0
            && <>
                    {session.shippingMessage}{': '}
                    <Text bold>{currencySymbol(currency)}{formatAmount(session.totalCartShipping)}</Text>
               </>
            || session.shippingMessage
        }
        </Text>
        {session.totalCartDiscount > 0
            && <Text right>
                    {lang('Discount')}{': '}
                    <Text bold>{currencySymbol(currency)}{formatAmount(session.totalCartDiscount)}</Text>
               </Text>
        }
        <Text right>
            {lang('Total')}{': '}
            <Text bold>{currencySymbol(currency)}{formatAmount(session.totalCartAmount)}</Text>
        </Text>
    </View>;
};

const cartContents = [];
export class CartContent extends ListPartial {
    static defaultParams = {
        url: '/checkout/cartdata',
    };

    constructor(props) {
        super(props);
        Object.assign(this.state, {refreshFlag: 0});
    }

    refresh = () => this.refreshData(true)
        .then(data => {
            this.setState(state => ({refreshFlag: state.refreshFlag ^ -1}));
            for (let cart of cartContents) {
                if (cart != this) {
                    Object.assign(cart.data, data);
                    cart.setState(state => ({refreshFlag: state.refreshFlag ^ -1}));
                }
            }
        });
    
    getListComponent() {
        const {isLoading, refreshFlag} = this.state;
        let session, cart, cartIds, cartReadOnly, currency, maxQty, qtyLength;
        if (isLoading) {
            cartIds = [];
        }
        else {
            session = this.data?.session ?? {};
            cart = this.data?.cart ?? session.cart ?? {};
            cartIds = Object.keys(cart);
            cartReadOnly = this.data?.cartReadOnly ?? false;
            currency = this.data?.currencySymbol ?? this.data?.config?.currencySymbol;
            maxQty = appHelpers.maxQuantity;
            qtyLength = digitCount(maxQty);

            typeof(this.props.setCartEmpty) == 'function' && setTimeout(() => this.props.setCartEmpty(cartIds.length < 1), 0);
        }
        
        const elm = super.getListComponent();
        Object.assign(elm.props, {
            data: cartIds,
            keyExtractor: cartId => cartId,
            ListEmptyComponent: isLoading ? null : <Text>{lang('Empty cart')}</Text>,
            ListHeaderComponent: <Text large bold para8>{lang('Cart contents')}</Text>,
            ListFooterComponent: cartIds.length > 0 && <CartTotal session={session} currency={currency} />,
            renderItem: ({item:cartId}) => renderItem(
                cartId,
                cart[cartId],
                cartReadOnly,
                currency,
                maxQty,
                qtyLength,
                this.submitData,
                this.refresh
            ),
            extraData: isLoading || refreshFlag,
        });
        return elm;
    }

    componentDidMount() {
        super.componentDidMount();
        cartContents.push(this);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        const idx = cartContents.indexOf(this);
        if (idx > -1) cartContents.splice(idx, 1); 
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     super.componentDidUpdate(prevProps, prevState, snapshot);
    //     if (typeof(this.props.setCartEmpty) == 'function') {
    //         this.props.setCartEmpty(Object.keys(this.data?.session ?? {}).length < 1);
    //     }
    // }
}

export default class Cart extends LessPureComponent {
    static propTypes = {
        autoLoad: PropTypes.bool,
        data: PropTypes.object,
        refreshable: PropTypes.bool,
        showCheckoutButton: PropTypes.bool,
    };
    static defaultProps = {
        autoLoad: true,
        refreshable: false,
        showCheckoutButton: true,
    };

    _content = null;
    state = {
        cartEmpty: true,
    };

    loadData() {
        this._content?.loadData();
    }

    render() {
        const props = this.props;
        return <>
            <Box style={{flex: -1}}>
                <CartContent ref={elm => this._content = elm} autoLoad={props.autoLoad} data={props.data} refreshable={props.refreshable}
                    setCartEmpty={cartEmpty => this.setState({cartEmpty})} />
            </Box>
            <View style={[
                {
                    display: this.state.cartEmpty ? 'none' : 'flex',
                    flexDirection: 'row-reverse',
                    justifyContent: 'space-between'
                },
                styles.ph8,
                styles.para8
            ]}>
                {props.showCheckoutButton && <Button
                    title={lang('Checkout')}
                    onPress={() => {
                        appHelpers.loadContent(routes.checkoutInformation);
                        appHelpers.closeCart();
                    }}
                />}
                <Button
                    title={lang('Clear cart')}
                    style={styles.buttonDanger}
                    onPress={() => {
                        confirmModal(() => {
                            this._content?.submitData('/product/emptycart')
                            .then(data => {
                                this._content.refresh();
                                Notification.success(data.message);
                                appHelpers.setCartCount(0);//appHelpers.refreshContent();
                            });
                        });
                    }}
                />
            </View>
        </>
    }
}

export class SideBarCart extends LessPureComponent {
    _content = null;

    loadData() {
        this._content?.loadData();
    }

    render() {
        return <>
            <View style={[{flexDirection: 'row-reverse'}, styles.ph8]}>
                <Button onPress={() => appHelpers.closeCart()}>
                    <Icon icon="X" stroke="white" width={16} height={16} />
                </Button>
            </View>
            <Cart ref={elm => this._content = elm} autoLoad={false} refreshable={true} />
        </>
    }
}