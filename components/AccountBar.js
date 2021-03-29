/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {
    View,
} from 'react-native';

import styles from '../styles';
import { appHelpers } from '../common';
import routes from '../contents/routes';
import AccountMenu from './AccountMenu';
import LessPureComponent from './LessPureComponent';
import ContentLink from './ContentLink';
import Icon from './Icon';
import CartButton from './CartButton';
import MainMenu from './MainMenu';


export default class AccountBar extends LessPureComponent {
    render() {
        return (
            <View style={styles.stickyBar}>
                <ContentLink route={routes.home} onPress={() => !appHelpers.isAtHome()}>
                    <Icon icon="Home" />
                </ContentLink>

                <View style={[styles.searchText, styles.ml4]} />
                
                <AccountMenu style={styles.ml4} />
                <CartButton style={styles.ml4} />
                <MainMenu trigger={<Icon icon="MoreVertical" style={styles.ml4} />} />
            </View>
        );
    }
}