/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Box, Button, Icon, LessPureComponent, Partial, Text, TwoPane} from '../components';
import Content from './Content';
import routes from './routes';
import ShippingForm from './partials/ShippingForm';
import {appHelpers, currencySymbol, formatAmount, formatDate, lang} from '../common';
import {buttonOutlinePrimary, buttonOutlineSuccess, gray, green, p8, red, text as textStyle, yellow} from '../styles';

const styles = StyleSheet.create({
    orderButtons: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
    }
});

const RowBox = props => <View style={[p8, props.style]}>
    {props.children}
</View>;

const RowText = props => <RowBox style={{flexDirection:'row'}}>
    <Text bold style={{flex:0}}>{lang(props.label)}:</Text>
    <Text right style={{flex:1}}>{props.value}</Text>
</RowBox>;

const Separator = props => <View style={[{backgroundColor:gray, height:1}, props.style]} />;

class OrderItem extends LessPureComponent {
    state = {
        open: false,
    };

    render() {
        const {data, config} = this.props, state = this.state;
        const statusColor = {
            Paid: green,
            Approved: green,
            'Approved - Processing': green,
            Failed: red,
            Completed: green,
            Shipped: green,
            Pending: yellow,
        }[data.orderStatus] ?? red;
        const products = Array.isArray(data.orderProducts) ? data.orderProducts
            : (data.orderProducts && typeof(data.orderProducts) == 'object' && Object.values(data.orderProducts) || []);

        return <Box style={{padding:0}}>
            <RowBox style={{backgroundColor:'rgba(0,0,0,.03)', flexDirection:'row'}}>
                <View style={{flex:1}}>
                    <Text>OrderId: {data._id}</Text>
                    <Text>Date: {formatDate(data.orderDate)}</Text>
                </View>
                <Button style={buttonOutlineSuccess} title={lang(state.open ? 'Close' : 'View')}
                    onPress={() => this.setState(state => ({open: !state.open}))}
                />
            </RowBox>
            <Separator style={{display: state.open ? 'flex' : 'none'}} />
            <RowBox style={{display: state.open ? 'flex' : 'none'}}>
                <Box style={{padding:0}}>
                    <RowText
                        label="Order status"
                        value={<Text style={{color:statusColor}}>{data.orderStatus}</Text>}
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
                        <Text bold style={{color:'#17a2b8'}}>{lang('Products ordered')}</Text>
                    </RowBox>
                    {products.map((item, idx) => <View key={idx}>
                        <Separator key={`productItemSeparator${idx}`} />
                        <RowBox key={`productItem${idx}`}>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{flex:1}}>
                                    {item.quantity} x {item.title}
                                    {item.variantId && <>
                                        <Text>{' > '}</Text>
                                        <Text yellow>{lang('Options')}:</Text>
                                        <Text>{' '}{item.variantTitle}</Text>
                                    </>}
                                </Text>
                                <Text style={{flex:0}}>{currencySymbol(config.currencySymbol)}{formatAmount(item.totalItemPrice)}</Text>
                            </View>
                            {item.productComment && <Text bold><Text red>{lang('Comment')}{': '}</Text>{item.productComment}</Text>}
                        </RowBox>
                    </View>)}
                </Box>
            </RowBox>
        </Box>;
    }
}

class Orders extends Partial {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
    }

    onDataSubmitted(data) {
        this.setState({data});
    }

    shouldComponentUpdate(nextProps, nextState) {
        let should = super.shouldComponentUpdate(nextProps, nextState);
        if (nextProps.data != this.props.data) nextState.data = nextProps.data;
        return should;
    }
    
    render() {
        const {config, orders, isNext, page = 1} = this.state.data;
        const pageNo = parseInt(page) || 1;
        return <>
            <Text large bold para4>{lang('Orders')}</Text>
            {orders && orders.length > 0
                ? orders.map((item, idx) => <OrderItem key={idx} data={item} config={config} />)
                : <Text>{lang('There are no orders for this account')}{'. '}
                    <Text green link onPress={() => appHelpers.goHome()}>{lang('Order here')}</Text>
                  </Text>
            }
            {(isNext || pageNo > 1) && <View style={styles.orderButtons}>
                <Button disabled={pageNo < 2} style={buttonOutlinePrimary}
                    onClick={() => this.submitData(`/customer/account/orders/${pageNo - 1}`, null)}
                >
                    <Icon icon="ChevronsLeft"
                        width={textStyle.fontSize}
                        height={textStyle.fontSize}
                    />
                </Button>
                <Button disabled={!isNext} style={buttonOutlinePrimary}
                    onClick={() => this.submitData(`/customer/account/orders/${pageNo + 1}`, null)}
                >
                    <Icon icon="ChevronsRight"
                        width={textStyle.fontSize}
                        height={textStyle.fontSize}
                    />
                </Button>
            </View>}
        </>;
    }
}

export default class CustomerAccount extends Content {
    static defaultParams = {
        headerBar: routes.customerAccount.headerBar,
        title: lang('Orders'),
        url: routes.customerAccount.url,
    };

    _shipping;

    get authenticated() {
        return true;
    }

    render() {
        return <TwoPane
            left={<Box>
                <ShippingForm ref={comp => this._shipping = comp}
                    data={this.data}
                    footer={<Button title={lang('Save details')}
                        style={{alignSelf:'flex-start'}}
                        onPress={() => this._shipping.submit()}
                    />}
                />
            </Box>}
            right={<Box>
                <Orders data={this.data} />
            </Box>}
        />;
    }
}