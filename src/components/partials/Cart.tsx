/**
 * https://github.com/atmulyana/expressCartMobile
 */
import {
    Box,
    Button,
    ContentLink,
    Icon,
    Image,
    IntegerSpinner,
    ListContent,
    Notification,
    SubmittingIndicator,
    Text,
} from '@/components';
import {
    useCart,
    useConfig,
    useEffectEvent,
    useForm,
    useLang,
    useNavHelpers,
    useRefCallback,
    useStyles
} from '@/hooks';
import { setCart } from '@/hooks/cart';
import { DataProvider } from '@/hooks/contexts/data';
import { confirmModal } from '@/libs/alert';
import { currencySymbol, digitCount, formatAmount } from '@/libs/number-datetime';
import baseStyles, { arrayStyle } from '@/styles';
import type { SubmitFunction, TCart, TCartItem } from '@/types';
import { noChange, noop } from 'javascript-common';
import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';

const cartStyles = StyleSheet.create({
    box: {
        flex: -1,
    },
    buttons: {
        ...baseStyles.para8,
        ...baseStyles.ph8,
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
    },
    close: {
        ...baseStyles.ph8,
        flexDirection: 'row-reverse',
    },
    itemAmount: {
        ...baseStyles.ml4,
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    itemForm: {
        alignItems:'center',
        flexDirection:'row',
    },
    itemDelBtn: {

    },
    itemInfo: {
        ...baseStyles.ml4,
        flex: 2,
        justifyContent:'center',
    },
    itemQty: {
        flex: 3,
    }
});

const Item = React.memo(function Item({
    currency,
    data,
    isSubmitting,
    itemId,
    maxQty,
    onExceedMax,
    qtyLength,
    readOnly,
    submit,
}: {
    currency: string,
    data: TCartItem,
    isSubmitting: boolean,
    itemId: string,
    maxQty: number,
    onExceedMax: (max: number) => void,
    qtyLength: number,
    readOnly?: boolean,
    submit: SubmitFunction,
}) {
    const lang = useLang();
    const [isDeleting, setDeleting] = React.useState(false);
    const nav = useNavHelpers();
    const [qty, _setQty] = React.useState({
        value: data.quantity,
        toSubmit: false,
    });
    const setQty = useRefCallback((newQty: typeof qty) => {
        _setQty(oldQty => {
            if (newQty.value === oldQty.value && !newQty.toSubmit == !oldQty.toSubmit)
                return oldQty;
            return newQty;
        });
    });
    const onChangeQtyProp = useEffectEvent(setQty);
    const styles = useStyles();

    const deleteItem = useEffectEvent(() => {
        submit({
            url: '/product/removefromcart',
            data: {
                cartId: itemId,
            },
            onError: () => {
                setDeleting(false);
            },
        });
    });

    React.useEffect(() => {
        if (isDeleting) {
            deleteItem();
        }
    }, [isDeleting]);

    const updateCart = useEffectEvent((qty: number) => {
        //if (qty.value != data.quantity) {
            submit({
                url: '/product/updatecart',
                data: {
                    cartId: itemId,
                    productId: data.productId,
                    quantity: qty,
                },
                // onError: () => {
                //     setQty({value: data.quantity, toSubmit: false});
                // },
            });
        //}
    });
    React.useEffect(() => {
        if (qty.toSubmit) updateCart(qty.value);
    }, [qty]);
    
    React.useEffect(() => {
        if (!isSubmitting) onChangeQtyProp({value: data.quantity, toSubmit: false});
    }, [data.quantity, isSubmitting]);

    return <View style={styles.array('flexRow', 'para8')}>
        <View style={styles.flex1}>
            <Image uri={data.productImage} />
        </View>
        <View style={cartStyles.itemInfo}>
            <ContentLink href={data.link} onPress={() => nav.closeCart()} style={styles.para4}>
                <Text>{data.title}</Text>
            </ContentLink>
            {!!data.variantId &&
                <Text style={styles.para4}>
                    <Text style={styles.textBold}>{lang("Options")}:</Text> {data.variantTitle}
                </Text>
            }
            <View style={cartStyles.itemForm}>
            {!readOnly && <>
                <IntegerSpinner
                    min={1}
                    max={maxQty}
                    maxLength={qtyLength}
                    value={qty.value} //editable={false}
                    style={cartStyles.itemQty}
                    onValueChange={quantity => setQty({value: quantity ?? 1, toSubmit: true})}
                    onExceedMax={onExceedMax}
                />
                <Button
                    style={styles.array('btn-danger', 'ml4')}
                    onPress={() => setDeleting(true)}
                >
                    <Icon name="trash-2" size={styles.text.fontSize} />
                </Button>
            </>}
                <View style={cartStyles.itemAmount}>
                    <Text
                        submittingAware={qty.value != data.quantity}
                        style={styles.array('textBold', 'textRight')}
                    >
                        {currencySymbol(currency)}{formatAmount(data.totalItemPrice)}
                    </Text>             
                </View>
            </View>
        </View>
        <SubmittingIndicator visible={isDeleting} message={`${lang('Deleting')}...`} />
    </View>;
});

const CartTotal = React.memo(function CartTotal({
    cart,
    currency,
}: {
    cart: TCart,
    currency: string,
}) {
    const lang = useLang();

    return <View>
        <Text style={baseStyles.textRight}>
        {cart.totalCartShipping > 0
            && <>
                    <Text submittingAware>{cart.shippingMessage}</Text>{': '}
                    <Text style={baseStyles.textBold} submittingAware>
                        {currencySymbol(currency)}{formatAmount(cart.totalCartShipping)}
                    </Text>
               </>
            || <Text submittingAware>{cart.shippingMessage}</Text>
        }
        </Text>
        {cart.totalCartDiscount > 0
            && <Text style={baseStyles.textRight}>
                    {lang('Discount')}{': '}
                    <Text style={baseStyles.textRight} submittingAware>
                        {currencySymbol(currency)}{formatAmount(cart.totalCartDiscount)}
                    </Text>
               </Text>
        }
        <Text style={baseStyles.textRight}>
            {lang('Total')}{': '}
            <Text style={baseStyles.textBold} submittingAware>
                {currencySymbol(currency)}{formatAmount(cart.totalCartAmount)}
            </Text>
        </Text>
    </View>;
});

const CartContent = React.memo(function CartContent({
    isSubmitting = false,
    refreshable = false,
    readOnly,
    setCartEmpty,
    submit = noop,
}: {
    isSubmitting?: boolean,
    refreshable?: boolean,
    readOnly?: boolean,
    setCartEmpty: (isEmpty: boolean) => void,
    submit?: SubmitFunction,
}) {
    const cart = useCart();
    const config = useConfig();
    const lang = useLang();

    const itemIds = React.useMemo(() => Object.keys(cart.items), [cart]);
    const onExceedMax = React.useCallback(() => Notification.warning(
        `${lang('Exceeds maximum quantity')}: ${config.maxQuantity}`
    ), [config.maxQuantity, lang]);
    const qtyLength = React.useMemo(() => digitCount(config.maxQuantity), [config.maxQuantity])

    const renderItem = React.useCallback(({item: id}: {item: string}) => {
        return <Item
            currency={config.currencySymbol}
            data={cart.items[id]}
            isSubmitting={isSubmitting}
            itemId={id}
            maxQty={config.maxQuantity}
            onExceedMax={onExceedMax}
            qtyLength={qtyLength}
            readOnly={readOnly || submit == noop}
            submit={submit}
        />;
    }, [
        cart,
        config.currencySymbol,
        config.maxQuantity, onExceedMax, qtyLength,
        isSubmitting,
        readOnly,
        submit,
    ]);

    const onCartEmpty = useEffectEvent(setCartEmpty);
    React.useEffect(() => {
        onCartEmpty(itemIds.length < 1);
    }, [itemIds.length]);

    const CartComp = ListContent<string>;
    return <CartComp
        autoLoad={refreshable}
        data={itemIds}
        dataDefault={cart}
        dataSource={cart}
        extraData={renderItem}
        keyExtractor={noChange}
        ListEmptyComponent={CartListEmpty}
        ListHeaderComponent={CartListHeader}
        ListHeaderComponentStyle={baseStyles.pv0}
        ListFooterComponent={itemIds.length > 0 ? CartListFooter : null}
        ListFooterComponentStyle={null}
        ListFooterComponentStyleLoading={null}
        partial={!refreshable}
        renderItem={renderItem}
        url={refreshable ? '/checkout/cartdata' : undefined}
    />;
});

function CartListEmpty() {
    const lang = useLang();
    
    return <Text>{lang('Empty cart')}</Text>;
}

function CartListFooter() {
    const cart = useCart();
    const config = useConfig();

    return <CartTotal
        cart={cart}
        currency={config.currencySymbol}
    />;
}

function CartListHeader() {
    const lang = useLang();

    return <Text style={arrayStyle('textLarge', 'textBold', 'para8')}>
        {lang('Cart contents')}
    </Text> ;
}

export default function Cart({
    homeAfterClear = false,
    refreshable,
    readOnly,
    showCheckoutButton = true,
}: {
    homeAfterClear?: boolean,
    refreshable?: boolean,
    readOnly?: boolean,
    showCheckoutButton?: boolean,
}) {
    const lang = useLang();
    const nav = useNavHelpers();
    const [isCartEmpty, setCartEmpty] = React.useState(false);
    const [isClearingCart, setClearingCart] = React.useState(false);
    const styles = useStyles();

    const [Form, submit, isSubmitting] = useForm(async (data) => {
        if (typeof(data?.cart) == 'object') await setCart(data.cart);
    });

    const clearCart = useEffectEvent(() => {
        submit('/product/emptycart');
    });
    const goHomeIfEmpty = useEffectEvent(() => {
        if (homeAfterClear) nav.goHome();
    });
    
    React.useEffect(() => {
        if (isClearingCart) clearCart();
    }, [isClearingCart]);

    React.useEffect(() => {
        if (!isSubmitting) setClearingCart(false);
    }, [isSubmitting]);

    React.useEffect(() => {
        if (isCartEmpty) goHomeIfEmpty();
    }, [isCartEmpty]);

    return <Form fragment>
        <Box style={cartStyles.box}>
            <CartContent
                isSubmitting={isSubmitting}
                refreshable={refreshable}
                readOnly={readOnly}
                setCartEmpty={setCartEmpty}
                submit={submit}
            />
            <SubmittingIndicator message={`${lang('Clearing cart')}...`} visible={isClearingCart} />
        </Box>
        <View style={isCartEmpty ? baseStyles.hidden : cartStyles.buttons}>
            {showCheckoutButton && <Button
                submittingAware
                onPress={() => {
                    nav.closeCart();
                    nav.goto('/checkout/information');
                }}
            >
                {lang('Checkout')}
            </Button>}
            <Button
                style={styles.get('btn-danger')}
                submittingAware
                onPress={() => {
                    confirmModal(() => setClearingCart(true));
                }}
            >
                {lang('Clear cart')}
            </Button>
        </View>
    </Form>;
}

export function SideCart() {
    const nav = useNavHelpers();
    
    return <DataProvider>
        <View style={cartStyles.close}>
            <Button onPress={() => nav.closeCart()}>
                <Icon name="x" size={16} />
            </Button>
        </View>
        <Cart refreshable />
    </DataProvider>;
}