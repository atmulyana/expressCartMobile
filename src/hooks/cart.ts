/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { createHookStore } from '@/libs/hook';
import type { TCart } from "@/types";
import { emptyObject, emptyString } from 'javascript-common';
import React from 'react';

const emptyCart: TCart = {
    discountCode: emptyString,
    items: emptyObject,
    shippingOptions: false,
    totalCartAmount: 0,
    totalCartDiscount: 0,
    totalCartShipping: 0,
};
const {getData, subscribe, update} = createHookStore<TCart>(emptyCart);

export async function setCart(cart: TCart | null) {
    await update(cart ?? emptyCart);
}

export function useCart() {
    return React.useSyncExternalStore(subscribe, getData);
}