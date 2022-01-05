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
import {appHelpers} from '../common';
import styles from '../styles';

//This variable will be shared among instances of CartButton so that the new instance will get the recent cartCount
let m_cartCount = 0;

const m_buttons = [];

appHelpers.setCartCount = cartCount => {
    m_cartCount = cartCount;
    for (let btn of m_buttons) btn.setState({cartCount});
}

export default class CartButton extends LessPureComponent {
    state = {
        cartCount: m_cartCount,
    };

    componentDidMount() {
        super.componentDidMount();
        m_buttons.push(this);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        const idx = m_buttons.indexOf(this);
        if (idx > -1) m_buttons.splice(idx, 1); 
    }

    render() {
        return <TouchableOpacity {...this.props} onPress={() => appHelpers.openCart()}>
            <Icon icon="ShoppingCart" />
            <Text style={styles.cartCount}>{this.state.cartCount ?? 0}</Text>
        </TouchableOpacity>;
    }
}