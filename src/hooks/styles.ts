/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { colorScheme } from "@/libs/style";
import baseStyles, {
    arrayStyle,
    boxBase,
    fontBase,
    textBase,
    textInputBase,
} from "@/styles";
import React from 'react';
import {
    type ImageStyle,
    type StyleProp,
    StyleSheet,
    type TextStyle,
    useColorScheme,
    type ViewStyle
} from "react-native";

let isDark = false;

const colors = {
    appName: '#6d6e72',
    backdrop: '#888',
    bg: 'white',
    bgSecond: '#eee',
    bgBar: '#ddd',
    bgLogo: 'transparent',
    border: '#bbb',
    cartTitle: '#cc3a2c',
    cartCountBg: 'red',
    danger: '#fb2c36',
    dangerBg: '#ffe2e2',
    dangerText: '#c10007',
    disabled: '#777',
    icon: '#212529',
    info: '#2b7fff',
    infoBg: '#dbeafe',
    infoText: '#1447e6',
    menuBg: '#eee',
    menuDivider1: '#ddd',
    menuDivider2: '#aaa',
    menuShadow: '#444',
    neutral: '#2b7fff',
    success: '#00c950',
    successBg: '#dcfce7',
    successText: '#008236',
    text: 'black',
    warning: '#efb100',
    warningBg: '#fef9c2',
    warningText: '#a65f00',
};
type TColors = typeof colors;
type ColorName1 = keyof TColors;

const darkColors: Partial<TColors> = {
    appName: '#92918d',
    backdrop: '#777',
    bg: 'black',
    bgSecond: '#111',
    bgBar: '#222',
    bgLogo: '#eee',
    border: '#444',
    cartTitle: '#33c5d3',
    cartCountBg: 'cyan',
    dangerBg: '#ffc9c9',
    dangerText: '#9f0712',
    disabled: '#888',
    icon: '#dedad6',
    infoBg: '#bedbff',
    infoText: '#193cb8',
    menuBg: '#111',
    menuDivider1: '#222',
    menuDivider2: '#555',
    menuShadow: '#bbb',
    successBg: '#b9f8cf',
    successText: '#016630',
    text: 'white',
    warningBg: '#fff085',
    warningText: '#894b00',
};

const colorNames = [
    'aqua',
    'black',
    'blue',
    'cyan',
    'gray',
    'green',
    'lime',
    'magenta',
    'maroon',
    'navy',
    'olive',
    'red',
    'silver',
    'transparent',
    'teal',
    'white',
    'yellow'
] as const;
type ColorName2 = (typeof colorNames)[number];
type ColorName = ColorName1 | ColorName2;
const colorSet = new Set(colorNames);

function getColor(name: ColorName1) {
    const color = colors[name];
    if (isDark) return darkColors[name] ?? color;
    return color;
}

function getAnyColor(name: string | symbol) {
    if (name in colors) return getColor(name as any);
    return name;
}

const Colors = new Proxy({}, {
    get(_, prop) {
        return getAnyColor(prop);
    }
}) as Readonly<TColors>;

const borderColor: ViewStyle = {
    get borderColor() {
        return getColor('border');
    },
};
const textColor: TextStyle = {
    get color() {
        return getColor('text');
    },
};

const _styles = StyleSheet.create({
    ...baseStyles,

    alert: {
        ...boxBase,
        alignItems: 'center',
        flex: 0,
        flexDirection: 'row',
        padding: 8,
    } as ViewStyle,
    alertDanger: {
        backgroundColor: getColor('dangerBg'),
        borderColor: getColor('danger'),
        color: getColor('dangerText'),
    },
    alertInfo: {
        backgroundColor: getColor('infoBg'),
        borderColor: getColor('info'),
        color: getColor('infoText'),
    },
    alertSuccess: {
        backgroundColor: getColor('successBg'),
        borderColor: getColor('success'),
        color: getColor('successText'),
    },
    alertWarning: {
        backgroundColor: getColor('warningBg'),
        borderColor: getColor('warning'),
        color: getColor('warningText'),
    },
    appNameLogo: {
        alignSelf: 'flex-end',
        backgroundColor: getColor('bgLogo'),
        flex: -1,
        //height: 20,
        width: 80,
        resizeMode: 'contain',
    },
    appNameText: {
        color: getColor('appName'),
        fontSize: 12,
        fontWeight:'bold',
        height: 12,
        lineHeight: 12,
        marginTop: 2,
        //paddingRight: 4,
        textAlign: 'right',
    },

    bb: {
        ...borderColor,
        borderWidth: 0,
        borderBottomWidth: 1,
    },
    box: boxBase,
    bt: {
        ...borderColor,
        borderWidth: 0,
        borderTopWidth: 1,
    },

    btn: {
        ...boxBase,
        ...fontBase,
        alignSelf: 'center',
        backgroundColor: getColor('text'),
        borderColor: getColor('text'),
        color: getColor('bg'),
        overflow: 'hidden',
        paddingHorizontal: 8,
        paddingVertical: 4,
    } as TextStyle,
    btnPlain: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        color: getColor('text'),
    },

    cartTitle: {
        color: getColor('cartTitle'),
        flex: 2,
        fontSize: 24,
        fontWeight: 'bold',
    },

    cartCount: {
        ...fontBase,
        backgroundColor: getColor('cartCountBg'),
        borderRadius: 4,
        color: getColor('bg'),
        includeFontPadding: false,
        lineHeight: 12,
        fontSize: 12,
        fontWeight: '700',
        padding: 2,
        paddingBottom: 1,
        position: 'absolute',
        right: -4,
        textAlign: 'center',
        textAlignVertical: 'center',
        top: -4,
    } as TextStyle,
    
    menuContainer: {
        backgroundColor: getColor('menuBg'),
        padding: 8,
        shadowColor: getColor('menuShadow'),
        shadowOpacity: 0.8,
    },
    menuDivider: {
        alignSelf: 'center',
        borderBottomColor: getColor('menuDivider1'),
        borderLeftColor: getColor('menuDivider1'),
        borderRightColor: getColor('menuDivider2'),
        borderTopColor: getColor('menuDivider2'),
        borderStyle: 'solid',
        borderWidth: 1,
        height: 2,
        marginVertical: 4,
        width: '90%',
    },
    
    modal: {
        ...boxBase,
        alignSelf: 'center',
        backgroundColor: getColor('bg'),
        height: 300,
        marginVertical: 'auto',
        maxHeight: '80%',
        width:'80%',
    } as ViewStyle,
    modalBackdrop: {
        backgroundColor: getColor('backdrop'),
        opacity: 0.7,
    },

    scrollView: {
        backgroundColor: getColor('bg'),
        flexShrink: 1,
    },

    productText: {
        ...textBase,
        fontWeight: '500',
        textAlign: 'center',
    } as TextStyle,
    
    stickyBar: {
        alignItems: 'center',
        backgroundColor: getColor('bgBar'),
        flex: 0,
        flexDirection: 'row',
        height: 40,
        padding: 4,
    },
    
    text: textBase,
    textInput: {
        ...textInputBase,
        ...boxBase,
        ...textBase,
    } as TextStyle,
});

type Style = ViewStyle | TextStyle | ImageStyle;
type StylesKey = keyof typeof _styles;
type Key = StylesKey
    | `bg-${ColorName}`
    | `brd-${ColorName}`
    | `txt-${ColorName}`
    | `btn-${ColorName}`
    | `btn-${ColorName}-${ColorName}`
    | `btn-outline-${ColorName}`;
    
let styles: typeof _styles /*{
    [p in StylesKey]: Style
}*/ & {
    array: <T = any>(key1: Key, key2: Key, ...keys: Key[]) => StyleProp<T>,
    get: (name: Key) => Style | null,
};

function updateStyles() {
    const arrays: {[key: string]: Style[]} = {};
    const names: {[key: string]: Style} = {};
    
    function _getColor(name: string): string {
        return getColor(name as any)
            ?? (colorSet.has(name as any) ? name : null);
    }
    const get = (name: Key) => {
        let styleObj: Style | null = null;
        if (name in _styles) {
            return styles[name as StylesKey];
        }
        else if (name in names) {
            return names[name];
        }
        else if (name.startsWith('bg-')) {
            const color = _getColor(name.substring(3));
            if (color) {
                styleObj = {backgroundColor: color};
            }
        }
        else if (name.startsWith('brd-')) {
            const color = _getColor(name.substring(4));
            if (color) {
                styleObj = {borderColor: color};
            }
        }
        else if (name.startsWith('txt-')) {
            const color = _getColor(name.substring(4));
            if (color) {
                styleObj = {color: color};
            }
        }
        else if (name.startsWith('btn-outline-')) {
            const color = _getColor(name.substring(12));
            if (color) {
                styleObj = {
                    backgroundColor: 'transparent',
                    borderColor: color,
                    color: color,
                };
            }
        }
        else if (name.startsWith('btn-')) {
            let [color1, color2, ...others] = name.substring(4).split('-');
            if (others.length < 1) {
                let color = _getColor(color1);
                if (color) {
                    styleObj = {
                        backgroundColor: color,
                        borderColor: color,
                        color: 'white',
                    };
                    if (color2) {
                        color = _getColor(color2);
                        if (color) styleObj.color = color;
                        else styleObj = null;
                    }
                }
            }
        }

        if (styleObj) {
            names[name] = styleObj;
            return styleObj;
        }
        throw `Invalid style name '${name}'`;
    };

    styles = {
        ..._styles,
        
        alert: {
            ..._styles.alert,
            ...borderColor,
        },
        alertDanger: {
            ..._styles.alertDanger,
            backgroundColor: getColor('dangerBg'),
            borderColor: getColor('danger'),
            color: getColor('dangerText'),
        },
        alertInfo: {
            ..._styles.alertInfo,
            backgroundColor: getColor('infoBg'),
            borderColor: getColor('info'),
            color: getColor('infoText'),
        },
        alertSuccess: {
            ..._styles.alertSuccess,
            backgroundColor: getColor('successBg'),
            borderColor: getColor('success'),
            color: getColor('successText'),
        },
        alertWarning: {
            ..._styles.alertWarning,
            backgroundColor: getColor('warningBg'),
            borderColor: getColor('warning'),
            color: getColor('warningText'),
        },
        appNameLogo: {
            ..._styles.appNameLogo,
            backgroundColor: getColor('bgLogo'),
        },
        appNameText: {
            ..._styles.appNameText,
            color: getColor('appName'),
        },
        bb: {
            ..._styles.bb,
            ...borderColor,
        },
        box: {
            ..._styles.box,
            ...borderColor,
        },
        bt: {
            ..._styles.bt,
            ...borderColor,
        },
        btn: {
            ..._styles.btn,
            backgroundColor: getColor('text'),
            borderColor: getColor('text'),
            color: getColor('bg'),
        },

        btnPlain: {
            ..._styles.btnPlain,
            color: getColor('text'),
        },
        cartTitle: {
            ..._styles.cartTitle,
            color: getColor('cartTitle'),
        },
        cartCount: {
            ..._styles.cartCount,
            ...fontBase,
            backgroundColor: getColor('cartCountBg'),
            color: getColor('bg'),
        },
        menuContainer: {
            ..._styles.menuContainer,
            backgroundColor: getColor('menuBg'),
            shadowColor: getColor('menuShadow'),
        },
        menuDivider: {
            ..._styles.menuDivider,
            borderBottomColor: getColor('menuDivider1'),
            borderLeftColor: getColor('menuDivider1'),
            borderRightColor: getColor('menuDivider2'),
            borderTopColor: getColor('menuDivider2'),
        },
        modal: {
            ..._styles.modal,
            ...borderColor,
            backgroundColor: getColor('bg'),
        },
        modalBackdrop: {
            ..._styles.modalBackdrop,
            backgroundColor: getColor('backdrop'),
        },
        productItem: {
            ..._styles.productItem,
            backgroundColor: getColor('bgSecond'),
        },
        productText: {
            ..._styles.productText,
            ...textColor,
        },
        scrollView: {
            ..._styles.scrollView,
            backgroundColor: getColor('bg'),
        },
        stickyBar: {
            ..._styles.stickyBar,
            backgroundColor: getColor('bgBar'),
        },
        text: {
            ..._styles.text,
            ...textColor,
        },
        textInput: {
            ..._styles.textInput,
            ...(borderColor as TextStyle),
            ...textColor,
        },

        array<T = any>(key1: Key, key2: Key, ...keys: Key[]) {
            const s = arrayStyle(key1 as any, key2 as any, ...keys as any[]);
            if (s != null) return s;
            
            const arKey = [key1, key2, ...keys];
            const key = arKey.join(' ');
            if (!(key in arrays)) {
                arrays[key] = arKey.map(key => get(key));
            }
            return arrays[key] as StyleProp<T>;
        },
        get,
    }
}
updateStyles();

function useUpdateColors() {
    const _isDark = useColorScheme() == 'dark';
    if (isDark != _isDark) {
        //`useColorScheme` is a "global" hook, all components will get the same value.
        isDark = _isDark; //eslint-disable-line react-hooks/globals
        updateStyles();
    }
}

export function useColors() {
    useUpdateColors();
    return Colors;
}

export function useDarkMode() {
    return React.useSyncExternalStore(colorScheme.subscribe, colorScheme.getData);
}

export function useIsDarkMode() {
    useUpdateColors();
    return isDark;
}

export function useStyles() {
    useUpdateColors();
    return styles;
}