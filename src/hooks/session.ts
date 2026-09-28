/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { createHookStore } from '@/libs/hook';
import type { Session } from "@/types";
import React from 'react';

const {getData: getSession, subscribe, updateStrict: setSession} = createHookStore<Session>({
    customerPresent: false,
});
export { getSession, setSession };

export function useSession() {
    return React.useSyncExternalStore(subscribe, getSession);
}