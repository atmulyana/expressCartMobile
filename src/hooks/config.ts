/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { createHookStore } from '@/libs/hook';
import type { Config } from "@/types";
import { emptyArray, emptyObject, emptyString } from 'javascript-common';
import React from 'react';

const {getData, subscribe, updateStrict: setConfig} = createHookStore<Config>({
    currencySymbol: '$',
    productsPerRow: 3,
    productsPerPage: 6,
    maxQuantity: 25,
    trackStock: true,
    showRelatedProducts: true,
    showHomepageVariants: true,
    paymentGateway: emptyArray,
    cartTitle: emptyString,
    modules: {
        enabled: emptyObject,
        loaded: emptyObject,
    }
});
export { setConfig };

export function useConfig() {
    return React.useSyncExternalStore(subscribe, getData);
}