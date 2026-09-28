/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { Text } from '@/components';
import {
    useDarkMode,
    useLang,
    useMenu,
    useNavHelpers,
    useStyles
} from "@/hooks";
import { setLang } from '@/libs/setting';
import { colorScheme } from "@/libs/style";
import React from 'react';
import {
    Image,
    type StyleProp,
    type TextStyle,
    View,
} from 'react-native';
import {
    Menu,
    MenuOption,
    MenuOptions,
    renderers as MenuRenderers,
    MenuTrigger,
} from 'react-native-popup-menu';
import Icon from "../Icon";
const {Popover} = MenuRenderers;

const  MainMenu = React.memo(function MainMenu({
    style,
    trigger
}: {
    style?: StyleProp<TextStyle>,
    trigger?: React.ReactElement,
}) {
    const darkMode = useDarkMode();
    const lang = useLang();
    const menuItems = useMenu();
    const nav = useNavHelpers();
    const styles = useStyles();
    
    return <Menu renderer={Popover} rendererProps={{placement: 'bottom'}}>
            <MenuTrigger>{trigger || <Icon name="menu" style={style} />}</MenuTrigger>
            <MenuOptions customStyles={{
                optionsContainer: styles.menuContainer
            }}>
                <View style={styles.menuItem}>
                    <Icon name="globe" style={styles.menuIcon} />
                    <Text style={styles.array('menuText', 'flexGrow', 'ml4')}>{lang("Languages")}</Text>
                </View>
                {lang.availableLanguages.map((item, idx) =>
                    <MenuOption
                        key={idx}
                        style={styles.array('menuItem', 'menuSub')}
                        onSelect={() => setLang(item.code as any)}
                    >
                        <Icon
                            name={lang.currentCode == item.code ? "check-circle" : "circle"}
                            style={styles.menuIcon}
                        />
                        <Text style={styles.array('menuText', 'flexGrow', 'ml4')}>{item.name}</Text>
                        <Image source={item.flag} style={styles.array('menuImage', 'ml8')} />
                    </MenuOption>
                )}

                <View style={styles.menuDivider}/>
                
                <View style={styles.menuItem}>
                    <Icon name="eye" style={styles.menuIcon} />
                    <Text style={styles.array('menuText', 'flexGrow', 'ml4')}>{lang("Dark Mode")}</Text>
                </View>
                <MenuOption
                    key='On'
                    style={styles.array('menuItem', 'menuSub')}
                    onSelect={() => darkMode != 'dark' && colorScheme.update('dark')}
                >
                    <Icon
                        name={darkMode == 'dark' ? "check-circle" : "circle"}
                        style={styles.menuIcon}
                    />
                    <Text style={styles.array('menuText', 'flexGrow', 'ml4')}>{lang('On')}</Text>
                    <Icon name='moon' style={styles.array('menuIcon', 'ml8')} />
                </MenuOption>
                <MenuOption
                    key='Off'
                    style={styles.array('menuItem', 'menuSub')}
                    onSelect={() => darkMode != 'light' && colorScheme.update('light')}
                >
                    <Icon
                        name={darkMode == 'light' ? "check-circle" : "circle"}
                        style={styles.menuIcon}
                    />
                    <Text style={styles.array('menuText', 'flexGrow', 'ml4')}>{lang('Off')}</Text>
                    <Icon name='sun' style={styles.array('menuIcon', 'ml8')} />
                </MenuOption>
                <MenuOption
                    key='By System'
                    style={styles.array('menuItem', 'menuSub')}
                    onSelect={() => darkMode != 'unspecified' && colorScheme.update('unspecified')}
                >
                    <Icon
                        name={darkMode == 'unspecified' ? "check-circle" : "circle"}
                        style={styles.menuIcon}
                    />
                    <Text style={styles.array('menuText', 'flexGrow', 'ml4')}>{lang('By System')}</Text>
                    <View style={styles.array('menuIcon', 'ml4')} />
                </MenuOption>

                {menuItems?.length > 0 && <View style={styles.menuDivider}/>}

                {menuItems.map((item, idx) =>
                    <MenuOption key={idx} onSelect={() => {
                        nav.goto(item.link);
                    }}>
                        <Text style={styles.menuText}>{item.title}</Text>
                    </MenuOption>
                )}
            </MenuOptions>
        </Menu>;
});
export default MainMenu;