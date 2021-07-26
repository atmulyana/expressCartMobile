/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import { View } from 'react-native';

import styles from '../styles';
import routes from '../contents/routes';
import AccountMenu from './AccountMenu';
import LessPureComponent from './LessPureComponent';
import ContentLink from './ContentLink';
import Icon from './Icon';
import MainMenu from './MainMenu';


export default class CheckoutBar extends LessPureComponent {
    render() {
        return (
            <View style={styles.stickyBar}>
                <ContentLink route={routes.home}>
                    <Icon icon="Home" />
                </ContentLink>

                <View style={[styles.searchText, styles.ml4]} />
                
                <AccountMenu style={styles.ml4} />
                <MainMenu trigger={<Icon icon="MoreVertical" style={styles.ml4} />} />
            </View>
        );
    }
}