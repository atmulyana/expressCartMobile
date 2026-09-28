/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { createHookStore } from '@/libs/hook';
import { contentPadding } from '@/styles';
import React from 'react';
import { Dimensions } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';

type Insets = Pick<EdgeInsets, 'left' | 'right'>;
let insets: Insets = {left: 0, right: 0};

function getContentWidth() {
    return Dimensions.get('window').width - 2 * contentPadding - insets.left - insets.right;
}

const {getData, subscribe, updateSync} = createHookStore(getContentWidth());

export function useContentWidth() {
    return React.useSyncExternalStore(subscribe, getData);
}

export function useCorrectWidth(width: number) {
    const maxWidth = useContentWidth();
    return width > maxWidth ? maxWidth : width;
}

export function setInsets(_insets: Insets) {
    insets = _insets;
    updateSync(getContentWidth());
}

export function watchDimensionChange() {
    const listener = Dimensions.addEventListener(
        'change',
        () => {
            updateSync(getContentWidth());
        }
    );
    return () => listener.remove();
};