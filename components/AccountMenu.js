/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {
    Text,
    View,
} from 'react-native';

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers as MenuRenderers,
} from 'react-native-popup-menu';
const {Popover} = MenuRenderers;

import { appHelpers, lang } from '../common';
import styles from '../styles';
import routes from '../contents/routes';
import ContentLink from './ContentLink';
import Icon, {ICON_SIZE} from './Icon';
import LessPureComponent from './LessPureComponent';

export default class AccountMenu extends LessPureComponent {
    render = () => appHelpers.isLoggedIn
        ? (
            <Menu renderer={Popover} rendererProps={{placement: 'bottom'}}>
                <MenuTrigger>
                    <View {...this.props} style={[this.props.style, {flexDirection:'row'}]}>
                        <Icon icon="User" />
                        <Icon icon="ChevronDown" width={ICON_SIZE/3} height={ICON_SIZE/3} strokeWidth={4} stroke="black" />
                    </View>
                </MenuTrigger>
                <MenuOptions style={styles.menuContainer}>
                    <MenuOption onSelect={() => appHelpers.loadContent(routes.customerAccount)}>
                        <Text style={styles.menuText}>{lang('Account')}</Text>
                    </MenuOption>
                    <MenuOption onSelect={appHelpers.doLogout}>
                        <Text style={styles.menuText}>{lang('Logout')}</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        )

        : (
            <ContentLink route={routes.customerLogin} {...this.props}>
                <Icon icon="User" />
            </ContentLink>
        )

}