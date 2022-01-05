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

import styles from '../styles';
import { appHelpers, availableLanguages, currentLanguage, lang, noop } from '../common';
import LessPureComponent from './LessPureComponent';
import Icon from './Icon';
import {getRouteByUrl, web} from '../contents/routes';

//This variable will be shared among instances of MainMenu so that the new instance will get the recent menu
let m_menu = null;

export default class MainMenu extends LessPureComponent {
    state = {
        menu: m_menu,
    };

    componentDidMount() {
        super.componentDidMount();
        appHelpers.setMenu = menu => {
            m_menu = menu;
            this.setState({menu});
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        appHelpers.setMenu = noop;
    }

    render() {
        const menuItems = this.state.menu?.items ?? [];

        return <Menu renderer={Popover} rendererProps={{placement: 'bottom'}}>
            <MenuTrigger>{this.props.trigger || <Icon icon="Menu" style={this.props.style} />}</MenuTrigger>
            <MenuOptions style={styles.menuContainer}>
                <View style={styles.menuItem}>
                    <Icon icon="Globe" style={styles.menuIcon} />
                    <Text style={[styles.menuText, styles.ml4]}>{lang("Languages")}</Text>
                </View>
                {availableLanguages().map((lang, idx) =>
                    <MenuOption key={idx} style={[styles.menuItem, styles.subMenu]} onSelect={() => appHelpers.setLang(lang.code)}>
                        <Icon icon={currentLanguage() == lang.code ? "CheckCircle" : "Circle"} style={styles.menuIcon} />
                        <Text style={[styles.menuText, styles.ml4]}>{lang.name}</Text>
                    </MenuOption>
                )}
                
                <View style={styles.menuDivider}/>

                {menuItems.map((item, idx) =>
                    <MenuOption key={idx} onSelect={() => {
                        const route = getRouteByUrl(item.link) ?? web(item.link);
                        appHelpers.loadContent(route);
                    }}>
                        <Text style={styles.menuText}>{item.title}</Text>
                    </MenuOption>
                )}
            </MenuOptions>
        </Menu>
    }
}