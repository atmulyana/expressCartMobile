/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import LessPureComponent from './LessPureComponent';
import Icon from './Icon';
import {appHelpers, noop} from '../common';
import styles from '../styles';

//This variable will be shared among instances of CartButton so that the new instance will get the recent cartCount
let m_cartCount = 0;

export default class CartButton extends LessPureComponent {
    state = {
        cartCount: m_cartCount,
    };

    componentDidMount() {
        super.componentDidMount();
        appHelpers.setCartCount = cartCount => {
            m_cartCount = cartCount;
            this.setState({cartCount});
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        appHelpers.setCartCount = noop;
    }

    render() {
        return <TouchableOpacity {...this.props} onPress={() => appHelpers.openCart()}>
            <Icon icon="ShoppingCart" />
            <Text style={styles.cartCount}>{this.state.cartCount ?? 0}</Text>
        </TouchableOpacity>;
    }
}