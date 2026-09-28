/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { createHookStore } from '@/libs/hook';
import type { MenuItem } from '@/types';
import { emptyArray } from 'javascript-common';
import React from 'react';

const {getData, subscribe, updateStrict: setMenu} = createHookStore(emptyArray as MenuItem[]);
export { setMenu };

export function useMenu() {
    return React.useSyncExternalStore(subscribe, getData);
}