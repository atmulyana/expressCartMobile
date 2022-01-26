/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import {Dimensions} from 'react-native';
import appHelpers from "./appHelpers";

export const contentPadding = 8;
export const contentWidth = () => {
    const {winInsets} = appHelpers;
    return Dimensions.get('window').width - 2 * contentPadding - winInsets.left - winInsets.right;
};
export const correctWidth = width => {
    const maxWidth = contentWidth();
    return width > maxWidth ? maxWidth : width;
}