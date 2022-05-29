/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import {Dimensions} from 'react-native';

let winInsets = {left: 0, right: 0};
export const contentPadding = 8;

export const setWinInsets = newInsets => winInsets = newInsets;

export const contentWidth = () => {
    return Dimensions.get('window').width - 2 * contentPadding - winInsets.left - winInsets.right;
};

export const correctWidth = width => {
    const maxWidth = contentWidth();
    return width > maxWidth ? maxWidth : width;
}

export const addChangeListener = handler => {
    const listener = Dimensions.addEventListener('change', handler);
    return () => listener.remove();
};