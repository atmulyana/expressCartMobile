/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { createHookStore } from "@/libs/hook";
import type { HookListener, TNotification } from "@/types";
import { emptyArray } from "javascript-common";
import React from 'react';

const store = createHookStore(emptyArray as TNotification[]);
function subscribe(listener: HookListener) {
    store.updateSync(emptyArray);
    store.addListener(listener);
    return () => store.removeListener(listener);
}

export function useNotification() {
    return React.useSyncExternalStore(subscribe, store.getData);
}

function filterListeners(listeners: HookListener[]) {
    return listeners.length > 0 ? [ listeners[listeners.length - 1] ] : listeners;
}

export async function pushNotification(notification: TNotification) {
    const notifications = [...store.getData(), notification];
    await store.update(notifications, filterListeners);
}

export async function closeNotification(notification: TNotification) {
    const notifications = store.getData().filter(item => item != notification);
    await store.update(
        notifications.length > 0 ? notifications : emptyArray,
        filterListeners
    );
}