/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { createHookStore } from '@/libs/hook';
import type { PaymentConfigs } from "@/types";
import { emptyObject } from 'javascript-common';
import React from 'react';

const {getData, subscribe, updateStrict: setPaymentConfig} = createHookStore<PaymentConfigs>(emptyObject);
export { setPaymentConfig };

export function usePaymentConfig() {
    return React.useSyncExternalStore(subscribe, getData);
}