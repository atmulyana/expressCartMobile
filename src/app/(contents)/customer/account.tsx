/**
 * https://github.com/atmulyana/expressCartMobile
 */
import {
    Box,
    Button,
    Content,
    ListContent,
    SubmittingIndicator,
    Text,
    TwoPane,
} from '@/components';
import ShippingForm from '@/components/partials/ShippingForm';
import {
    useColors,
    useConfig,
    useData,
    useForm,
    useIsDarkMode,
    useLang,
    useNavHelpers,
    useRefCallback,
    useRefreshing,
    useSession,
    useStyles,
} from '@/hooks';
import {
    currencySymbol,
    formatAmount,
    formatDate
} from '@/libs/number-datetime';
import { getStatusColor } from '@/libs/style';
import baseStyles, { arrayStyle, contentPadding } from '@/styles';
import type {
    DataUrl,
    ListRef,
    Order,
    TCartItem
} from '@/types';
import { Redirect } from 'expo-router';
import {
    emptyArray,
    emptyObject,
    emptyString
} from 'javascript-common';
import React from 'react';
import {
    type ScrollViewProps,
    type StyleProp,
    StyleSheet,
    type TextStyle,
    View,
    type ViewStyle,
} from 'react-native';

type Data = {
    countryList: string[],
    isNext?: boolean,
    orders: Order[],
    page?: number,       
};

const accStyles = StyleSheet.create({
    productTitle: {
        color: '#17a2b8',
        fontWeight: 'bold',
    },
    productTitleDark: {
        color: '#eb5d47',
        fontWeight: 'bold',
    },
    title: {
        backgroundColor: 'rgba(0,0,0,.05)',
        flexDirection: 'row',
    },
    titleDark: {
        backgroundColor: 'rgba(255,255,255,.1)',
        flexDirection: 'row',
    },
    titleText: {
        alignItems: 'flex-start',
        flex: 1,
        rowGap: 2,
    },
});

const dummyOrder: Order = {
    _id: '123456789012345678901234',
    orderPaymentGateway: emptyString,
    orderTotal: 0,
    orderShipping: 0,
    orderItemCount: 0,
    orderProductCount: 0,
    orderEmail: emptyString,
    orderStatus: 'Created',
    orderDate: new Date(),
    orderProducts: emptyObject,
    orderType: 'Single',
    isDummy: true,
};

function getNextDataUrl(prevUrl?: DataUrl): DataUrl {
    const pageUrl = '/customer/account/orders/';
    const dataUrl = prevUrl?.trim?.();
    if (dataUrl?.startsWith(pageUrl)) {
        const page = parseInt(dataUrl.substring(pageUrl.length)) || 1;
        return `${pageUrl}${page + 1}`
    }
    return `${pageUrl}2`;
}

function getOrderKey(order: Order, idx: number)  {
    return order.isDummy ? idx.toString() : order._id;
}

function mergeOrdersData(
    newData: {isNext: boolean, list: Order[], page: number} | null,
    oldData: Data
): [Data, boolean, boolean] {
    const data: Data = {
        ...oldData,
        ...newData,
        orders: [...oldData.orders, ...(newData?.list ?? emptyArray)],
    }
    return [
        data,
        newData?.isNext ?? false,
        false,
    ];
}

export default function CustomerAccount() {
    const [{countryList, isNext, orders}] = useData<Data>({
        countryList: emptyArray,
        orders: emptyArray,
    });
    const lang = useLang();
    const [Form, submit, isSubmitting] = useForm();
    const ordersRef = React.useRef<ListRef>(null);
    const session = useSession();

    const submitBtn = React.useMemo(() => {
        return <Button
            loadingAware
            notMoreLoading
            style={{alignSelf: 'flex-start'}}
            onPress={() => submit('/customer/update')}
        >{lang('Save details')}</Button>
    }, [lang, submit]);

    const scrollHandler: NonNullable<ScrollViewProps['onScroll']> = useRefCallback(({ nativeEvent:{
        contentOffset,
        contentSize,
        layoutMeasurement
    }}) => {
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - contentPadding) {
            if (ordersRef.current) ordersRef.current.loadMoreData();
        }
    });
    
    if (!session.customerPresent) {
        return <Redirect href="/customer/login" />;
    }

    return <Content title={lang('Orders')} onScroll={scrollHandler}>
        <TwoPane
            left={<Box style={baseStyles.m0}>
                <Form fragment>
                    <ShippingForm
                        countryList={countryList}
                        footer={submitBtn}
                    />
                </Form>
                <SubmittingIndicator visible={isSubmitting} message={`${lang('Saving customer data')}...`} />
            </Box>}
            right={<Box style={baseStyles.m0}>
                <Orders isNext={isNext} orders={orders} ref={ordersRef} />
            </Box>}
        />
    </Content>;
}

function OrderItem({
    data,
}: {
    data: Order,
}) {
    const config = useConfig();
    const isDark = useIsDarkMode();
    const [isRefreshing, setRefreshing] = useRefreshing();
    const lang = useLang();
    const styles = useStyles();
    const [isOpen, setOpen] = React.useState(false);
    const viewClose = useRefCallback(() => {
        setOpen(isOpen => !isOpen);
    });

    React.useEffect(() => {
        if (isRefreshing) setOpen(false);
    }, [isRefreshing]);

    const products = data.orderProducts ?? emptyObject;
    const isLoadingAware = data.isDummy || isRefreshing;
    let item: TCartItem;

    return <Box style={styles.array('p0','m0')}>
        <RowBox style={isDark ? accStyles.titleDark : accStyles.title}>
            <View style={accStyles.titleText}>
                <Text loadingAware={isLoadingAware}>OrderId: {data._id}</Text>
                <Text loadingAware={isLoadingAware}>Date: {formatDate(data.orderDate)}</Text>
            </View>
            <Button
                disabled={isLoadingAware}
                onPress={viewClose}
                style={styles.get('btn-outline-success')}
            >{lang(isOpen ? 'Close' : 'View')}</Button>
        </RowBox>
        <Separator style={isOpen ? null : styles.hidden} />
        <RowBox style={isOpen ? null : styles.hidden}>
            <Box style={styles.array('p0','m0')}>
                <RowText
                    label="Order status"
                    value={<Text style={styles.get(`txt-${getStatusColor(data.orderStatus)}`) as TextStyle}>{data.orderStatus}</Text>}
                />
                <Separator />
                <RowText label="Order date" value={formatDate(data.orderDate)} />
                <Separator />
                <RowText label="Order ID" value={data._id} />
                {data.orderExpectedBtc && <>
                    <Separator />
                    <RowText label="Order Expected BTC" value={data.orderExpectedBtc} />
                </>}
                {data.orderReceivedBtc && <>
                    <Separator />
                    <RowText label="Order Received BTC" value={data.orderReceivedBtc} />
                </>}
                {data.orderBlockonomicsTxid && <>
                    <Separator />
                    <RowText label="Order Blockonomics Txid" value={data.orderBlockonomicsTxid} />
                </>}
                <Separator />
                <RowText
                    label="Order net amount"
                    value={currencySymbol(config.currencySymbol) + formatAmount(data.orderTotal - data.orderShipping)}
                />
                <Separator />
                <RowText
                    label="Order shipping amount"
                    value={currencySymbol(config.currencySymbol) + formatAmount(data.orderShipping)}
                />
                <Separator />
                <RowText
                    label="Order total amount"
                    value={currencySymbol(config.currencySymbol) + formatAmount(data.orderTotal)}
                />
                <Separator />
                <RowText label="Email address" value={data.orderEmail} />
                <Separator />
                <RowText label="Company" value={data.orderCompany} />
                <Separator />
                <RowText label="First name" value={data.orderFirstname} />
                <Separator />
                <RowText label="Last name" value={data.orderLastname} />
                <Separator />
                <RowText label="Address 1" value={data.orderAddr1} />
                <Separator />
                <RowText label="Address 2" value={data.orderAddr2} />
                <Separator />
                <RowText label="Country" value={data.orderCountry} />
                <Separator />
                <RowText label="State" value={data.orderState} />
                <Separator />
                <RowText label="Post code" value={data.orderPostcode} />
                <Separator />
                <RowText label="Phone number" value={data.orderPhoneNumber} />
                <Separator />
                <RowBox><Text>{' '}</Text></RowBox>
                <Separator />
                <RowBox>
                    <Text style={isDark ? accStyles.productTitleDark : accStyles.productTitle}>{lang('Products ordered')}</Text>
                </RowBox>
                {Object.keys(products).map(idx => (item = products[idx], <View key={idx}>
                    <Separator />
                    <RowBox>
                        <View style={styles.flexRow}>
                            <Text style={styles.flex1}>
                                {item.quantity} x {item.title}
                                {item.variantId && <>
                                    <Text>{' > '}</Text>
                                    <Text style={styles.get('txt-warning') as TextStyle}>{lang('Options')}:</Text>
                                    <Text>{' '}{item.variantTitle}</Text>
                                </>}
                            </Text>
                            <Text style={{flex:0}}>{currencySymbol(config.currencySymbol)}{formatAmount(item.totalItemPrice)}</Text>
                        </View>
                        {item.productComment && <Text style={styles.textBold}>
                            <Text style={styles.get('txt-danger') as TextStyle}>{lang('Comment')}{': '}</Text>{item.productComment}
                        </Text>}
                    </RowBox>
                </View>))}
            </Box>
        </RowBox>
    </Box>;
}

function Orders({
    isNext,
    orders,
    ref,
}: {
    isNext?: boolean,
    orders: Order[],
    ref?: React.Ref<ListRef>,
}) {
    const renderItem = useRefCallback(({item}: {item: Order}) => <OrderItem data={item} />);
    
    const OrdersComp = ListContent<Order>;
    return <OrdersComp
        autoLoad={false}
        contentContainerStyle={arrayStyle('list', 'p0')}
        data={orders}
        dataDefault={emptyArray}
        dataSource={orders}
        keyExtractor={getOrderKey}
        ListEmptyComponent={OrdersEmpty}
        ListHeaderComponent={OrdersHeader}
        ListFooterComponent={OrdersFooter}
        ListFooterComponentStyle={baseStyles.hidden}
        ListFooterComponentStyleLoading={baseStyles.list}
        mergeData={mergeOrdersData}
        nextUrlOrData={isNext ? getNextDataUrl : null}
        partial
        renderItem={renderItem}
        ref={ref}
        style={baseStyles.flexGrow}
    />;
}

function OrdersEmpty() {
    const lang = useLang();
    const nav = useNavHelpers();
    const styles = useStyles();
    return <Text>{lang('There are no orders for this account')}{'. '}
        <Text onPress={() => nav.goHome()} style={styles.array('textLink', 'txt-successText')}>{lang('Order here')}</Text>
    </Text>
}

function OrdersFooter() {
    return <>
        <OrderItem data={dummyOrder} />
        <OrderItem data={dummyOrder} />
        <OrderItem data={dummyOrder} />
    </>;
}

function OrdersHeader() {
    const lang = useLang();
    return <Text style={arrayStyle('textBold', 'textLarge')}>{lang('Orders')}</Text>;
}

function RowBox({
    children,
    style,
}: {
    children?: React.ReactNode,
    style?: StyleProp<ViewStyle>,
}) {
    return <View style={[baseStyles.p8, style]}>
        {children}
    </View>;
}

function RowText({
    label,
    value,
}: {
    label: string,
    value: React.ReactNode,
}) {
    const lang = useLang();

    return <RowBox style={baseStyles.flexRow}>
        <Text style={baseStyles.textBold}>{lang(label)}:</Text>
        <Text style={arrayStyle('flex1', 'textRight')}>{value}</Text>
    </RowBox>;
}

function Separator({
    style,
}: {
    style?: StyleProp<ViewStyle>,
}) {
    const colors = useColors();
    return <View style={[{backgroundColor: colors.border, height:1}, style]} />;
}
