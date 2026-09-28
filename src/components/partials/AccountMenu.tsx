/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useColors, useLang, useNavHelpers, useSession, useStyles } from '@/hooks';
import { logout } from '@/libs/session';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {
    Menu,
    MenuOption,
    MenuOptions,
    renderers as MenuRenderers,
    MenuTrigger,
} from 'react-native-popup-menu';
import ContentLink from '../ContentLink';
import Icon from '../Icon';
const {Popover} = MenuRenderers;

const menuStyles = StyleSheet.create({
    dropIcon: {
        position: 'absolute',
        right: -4,
        top: 0,
        zIndex: 3,
    },
});

const AccountMenu = React.memo(function AccountMenu({
    style
}: {
    style?: React.ComponentProps<typeof View>['style'],
}) {
    const session = useSession();
    
    return session.customerPresent
        ? <MenuAccount style={style} />
        : (
            <ContentLink href='/customer/login' style={style}>
                <Icon name="user" />
            </ContentLink>
        );
});
export default AccountMenu;

const MenuAccount = function MenuAccount({
    style
}: {
    style?: React.ComponentProps<typeof View>['style'],
}) {
    const colors = useColors();
    const nav = useNavHelpers();
    const lang = useLang();
    const [loggingOut, setLoggingOut] = React.useState(false);
    const styles = useStyles();

    React.useEffect(() => {
        if (loggingOut) {
            logout().finally(() => setLoggingOut(false));
        }
    });

    return <Menu renderer={Popover} rendererProps={{placement: 'bottom'}}>
        <MenuTrigger>
            <View style={[style, styles.flexRow, {overflow: 'hidden'}]}>
                <Icon name="user" />
                <Icon
                    name="chevron-down"
                    color={colors.text}
                    size={12}
                    style={menuStyles.dropIcon}
                />
            </View>
        </MenuTrigger>
        <MenuOptions customStyles={{
            optionsContainer: styles.menuContainer
        }}>
            <MenuOption onSelect={() => nav.goto('/customer/account')}>
                <Text style={styles.menuText}>{lang('Account')}</Text>
            </MenuOption>
            <MenuOption disabled={loggingOut} onSelect={() => setLoggingOut(true)}>
                <Text style={styles.menuText}>{lang('Logout')}</Text>
            </MenuOption>
        </MenuOptions>
    </Menu>;
};