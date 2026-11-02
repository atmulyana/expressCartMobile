/**
 * https://github.com/atmulyana/expressCartMobile
 */
import {
    type ImageStyle,
    type StyleProp,
    StyleSheet,
    type TextStyle,
    type ViewStyle,
} from "react-native";

export const boxBase: ViewStyle = {
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
};
export const contentPadding = 8;
export const fontBase: TextStyle = {
    fontFamily: 'Arial',
    fontSize: 14,
};
export const textBase: TextStyle = {
    ...fontBase,
    lineHeight: 17,
};
export const textInputBase: TextStyle = {
    ...(boxBase as TextStyle),
    ...textBase,
    paddingVertical: 4,
}

/**
 * `baseStyles` is not color scheme dependent, can be imported directly.
 * For the styles that would change based on the color scheme, we use
 * `useStyle` hook ("@/hooks/style").
 */
const baseStyles = StyleSheet.create({
    alertContainer: {
        bottom: 0,
        flex: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        zIndex: 400000,
    },
    appName: {
        flex: 1,
        justifyContent: 'center',
    },

    btnDisabled: {
        opacity: 0.5,
    },
    
    center: {
        alignSelf: 'center',
    },
    contentCentered: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    fill: StyleSheet.absoluteFill,
    flex1: {
        flex: 1,
    },
    flexGrow: {
        flexGrow: 1,
        flexShrink: 0,
    },
    flexRow: {
        flexDirection: 'row',
    },
    flexShrink: {
        flexShrink: 1,
    },
    gap: {
        gap: contentPadding,
    },

    hidden: {
        display: 'none',
    },

    justifyBetween: {
        justifyContent: 'space-between',
    },

    list: {
        rowGap: contentPadding,
    },

    m0: {
        margin: 0,
    },
    m8: {
        margin: 8,
    },
    
    menuItem: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    menuIcon: {
        height: 16,
        width: 16,
    },
    menuImage: {
        height: 14,
        resizeMode: 'contain',
    },
    menuSub: {
        paddingLeft: 16,
    },
    menuText: {
        ...fontBase,
        fontSize: 16,
        height: 16,
        includeFontPadding: false,
        lineHeight: 16,
        marginVertical: 0,
        paddingVertical: 0,
        textAlignVertical: 'center',
    },

    ml4: {
        marginLeft: 4,
    },
    ml8: {
        marginLeft: 8,
    },
    mr4: {
        marginRight: 4,
    },

    navHeader: {
        flexDirection: 'row',
        height: 24,
    },
    navHeaderTitle: {
        ...fontBase,
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    
    p0: {
        padding: 0,
    },
    p8: {
        padding: contentPadding,
    },
    para4: {
        flex: 0,
        marginBottom: 4,
    },
    para8: {
        flex: 0,
        marginBottom: 8,
    },
    pb8: {
        paddingVertical: contentPadding,
    },
    ph8: {
        paddingHorizontal: contentPadding,
    },
    
    pagingButtons: {
        flexDirection: 'row',
        gap: contentPadding,
        justifyContent: 'center',
    },

    productImage: {
        alignSelf: 'stretch',
        resizeMode: 'contain',
    },
    productItem: {
        borderRadius: 2,
        flex: -1,
        minWidth: 150,
        width: '50%',
    } as ViewStyle,
    productRow: {
        flexDirection: 'row',
        gap: contentPadding,
        justifyContent: 'center',
    },

    start: {
        alignSelf: 'flex-start',
    },
    stretch: {
        alignSelf: 'stretch',
    },

    textArea: {
        textAlignVertical: 'top',
    },
    textBold: {
        fontWeight: 'bold',
    },
    textCenter: {
        textAlign: 'center',
    },
    textInputHeight: {
        //textInput.lineHeight + 2 * (textInput.paddingVertical + textInput.borderWidth). Plus 1 is to avoid _, y, g and j clipped at bottom, especially on iOS
        //@ts-ignore
        height: textBase.lineHeight + 2 * (textInputBase.paddingVertical + boxBase.borderWidth) + 1,
    },
    textLarge: {
        fontSize: Math.round((fontBase.fontSize as number) * 1.2),
        lineHeight: Math.round((textBase.lineHeight as number) * 1.2),
    },
    textLink: {
        textDecorationLine: 'underline',
    },
    textMiddle: {
        textAlignVertical: 'center',
    },
    textRight: {
        textAlign: 'right',
    },
    textSmall: {
        fontSize: Math.round((fontBase.fontSize as number) * 0.8),
        lineHeight: Math.round((textBase.lineHeight as number) * 0.8),
    },

    transparent: {
        opacity: 0,
    },
});
export default baseStyles;

type Style = ViewStyle | TextStyle | ImageStyle;
type StylesKey = keyof typeof baseStyles;

const arrays: {[key: string]: Style[]} = {};
export function arrayStyle<T = any>(key1: StylesKey, key2: StylesKey, ...keys: StylesKey[]) {
    const arKey = [key1, key2, ...keys];
    const key = arKey.join(' ');
    if (!(key in arrays)) {
        const ar = arKey.map(key => baseStyles[key] ?? null);
        if (ar.some(s => s == null)) return null;
        arrays[key] = ar;
    }
    return arrays[key] as StyleProp<T>;
}