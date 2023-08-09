/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import {StyleSheet} from 'react-native';
import {contentPadding} from './common';

const gray = '#aaa';
const green = '#28a745';
const red = '#dc3545';
const yellow = '#ffc107';

const fontBase = {
    fontFamily: 'Arial',
    fontSize: 14,
};
const textBase = {
    ...fontBase,
    color: 'black',
    lineHeight: 17,
};
const borderBase = {
    borderColor: gray,
    borderStyle: 'solid',
    borderWidth: 0,
};
const boxBase = {
    ...borderBase,
    borderRadius: 4,
    borderWidth: 1,
};

module.exports = Object.assign({gray, red, green, yellow},
StyleSheet.create({
    box: {
        ...boxBase,
    },

    button: {
        ...boxBase,
        ...fontBase,
        alignSelf: 'center',
        backgroundColor: 'black',
        borderColor: 'transparent',
        color: 'white',
        padding: 4,
    },
    buttonDanger: {
        backgroundColor: '#cc3a2c',
        borderColor: '#cc3a2c',
    },
    buttonOutlineDanger: {
        backgroundColor: 'transparent',
        borderColor: red,
        color: red,
    },
    buttonOutlineDangerPressed: {
        backgroundColor: red,
        color: 'white',
    },
    buttonOutlineSuccess: {
        backgroundColor: 'transparent',
        borderColor: green,
        color: green,
    },
    buttonOutlineSuccessPressed: {
        backgroundColor: green,
        color: 'white',
    },
    buttonOutlinePrimary: {
        alignSelf:'stretch',
        backgroundColor:'white',
        borderColor:'#007bff',
        color:'#007bff'
    },

    text: {
        ...textBase,
    },
    textBold: {
        fontWeight: 'bold',
    },
    textCenter: {
        textAlign: 'center',
    },
    textError: {
        backgroundColor: '#fdd',
        color: red,
    },
    textGray: {
        color: gray,
    },
    textGreen: {
        color: green,
    },
    textLarge: {
        fontSize: Math.round(fontBase.fontSize * 1.2),
        lineHeight: Math.round(textBase.lineHeight * 1.2),
    },
    textLink: {
        textDecorationLine: 'underline',
    },
    textRed: {
        color: red,
    },
    textRight: {
        textAlign: 'right',
    },
    textSmall: {
        fontSize: Math.round(fontBase.fontSize * 0.8),
        lineHeight: Math.round(textBase.lineHeight * 0.8),
    },
    textYellow: {
        color: yellow,
    },

    textInput: {
        ...boxBase,
        ...textBase,
        paddingVertical: 4,
    },
    textInputDisabled: {
        color: gray,
    },
    textInputHeight: {
        //textInput.lineHeight + 2 * (textInput.paddingVertical + textInput.borderWidth). Plus 1 is to avoid _, y, g and j clipped at bottom, especially on iOS
        height: textBase.lineHeight + 2 * (4 + boxBase.borderWidth) + 1,
    },
    textArea: {
        textAlignVertical: 'top',
    },
    
    para4: {
        flex: 0,
        marginBottom: 4,
    },
    para8: {
        flex: 0,
        marginBottom: 8,
    },
    bb: {
        ...borderBase,
        borderBottomWidth: 1,
    },
    bt: {
        ...borderBase,
        borderTopWidth: 1,
    },
    p8: {
        padding: contentPadding,
    },
    ph8: {
        paddingHorizontal: 8,
    },
    ml4: {
        marginLeft: 4,
    },
    mr4: {
        marginRight: 4,
    },
    m8: {
        margin: 8,
    },
    contentCentered: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    navHeader: {
        height: 24,
    },
    navHeaderTitle: {
        ...fontBase,
        flex: 1,
        fontWeight: 'bold',
        textAlignVertical: 'center',
    },

    scrollView: {
        backgroundColor: 'white',
        flex: 1,
    },

    stickyBar: {
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        flex: 0,
        flexDirection: 'row',
        height: 40,
        paddingHorizontal: 2,
        paddingVertical: 4,
    },
    searchText: {
        flex: 1,
    },

    menuDivider: {
        alignSelf: 'center',
        borderBottomColor: '#ddd',
        borderLeftColor: '#ddd',
        borderRightColor: '#aaa',
        borderTopColor: '#aaa',
        borderStyle: 'solid',
        borderWidth: 1,
        height: 2,
        marginVertical: 4,
        width: '90%',
    },
    menuContainer: {
        padding: 8,
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
    subMenu: {
        paddingLeft: 16,
    },

    cartTitle: {
        color: '#cc3a2c',
        flex: 2,
        fontSize: 24,
        fontWeight: 'bold',
    },
    appName: {
        flex: 1,
        justifyContent: 'center',
    },
    appNameLogo: {
        alignSelf: 'flex-end',
        flex: -1,
        //height: 20,
        width: 80,
        resizeMode: 'contain',
    },
    appNameText: {
        color: 'rgb(109, 110, 114)',
        fontSize: 12,
        fontWeight:'bold',
        height: 12,
        lineHeight: 12,
        marginTop: 2,
        //paddingRight: 4,
        textAlign: 'right',
    },

    productRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    productItem: {
        backgroundColor: '#fcfcfc',
        borderRadius: 2,
        flex: -1,
        margin: 4,
        minWidth: 150,
        width: '50%',
    },
    productImage: {
        alignSelf: 'stretch',
        resizeMode: 'contain',
    },
    productText: {
        ...textBase,
        fontWeight: '500',
        textAlign: 'center',
    },
    productInfoRow: {
        flexWrap: 'wrap',
    },
    productRelatedRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginTop: 8,
    },
    productRelatedTitle: {
        width: '100%',
    },
    productInfoCol: {
        flex: 0,
        padding: 8,
    },
    productInfoImage: {
        flex: 0,
        height: 400,
        width: 400,
    },
    productRelatedImageContainer: {
        alignItems: 'center',
        flex: 0,
        marginRight: 8,
        minHeight: 80,
        minWidth: 80,
    },

    review: {
        borderColor: gray,
        borderStyle: 'solid',
        borderWidth: 1,
        padding: 8,
    },
    reviewTime: {
        color: gray,
        fontSize: 11,
        textAlign: 'right',
    },

    cartCount: {
        ...fontBase,
        backgroundColor: 'red',
        borderRadius: 4,
        color: 'white',
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
    },

    twoPane: {
        alignSelf: 'stretch',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
        columnGap: contentPadding,
        flexDirection: 'row',
        flexWrap: 'wrap-reverse',
        justifyContent: 'center',
    },
    paneOfTwo: {
        minWidth: 340,
        width: '50%',
    },

    modal: {
        ...boxBase,
        alignSelf: 'center',
        backgroundColor: 'white',
        marginVertical: 'auto',
        maxHeight: '80%',
        width:'80%',
    },
    modalBackdrop: {
        backgroundColor: '#888',
        opacity: 0.7,
    },

    alert: {
        ...boxBase,
        alignItems: 'center',
        flex: 0,
        flexDirection: 'row',
        padding: 8,
    },
    alertContainer: {
        bottom: 0,
        flex: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        zIndex: 400000,
    },
    alertDanger: {
        backgroundColor: '#f8d7da',
        borderColor: '#ffecb5',
        color: '#842029',
    },
    alertSuccess: {
        backgroundColor: '#d1e7dd',
        borderColor: '#badbcc',
        color: '#0f5132',
    },
    alertWarning: {
        backgroundColor: '#fff3cd',
        borderColor: '#badbcc',
        color: '#664d03',
    },
}));