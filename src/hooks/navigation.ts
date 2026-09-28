/**
 * https://github.com/atmulyana/expressCartMobile
 */
import type { LinkHref, UrlPathLocal } from '@/types';
import { usePathname as expo_usePathname, router, useNavigationContainerRef } from 'expo-router';
import { DrawerActions } from 'expo-router/build/react-navigation';
import { noop } from 'javascript-common';

/**
 * Different from `useNavigation` from "expo-router", it should be able to be used 
 * outside of screen component. It's useful especially to open/clode 'side cart' drawer.
 */
export function useNavHelpers() {
    const navRoot = useNavigationContainerRef();

    //navigation container ref should never change as long as the app open
    //and be always the same for all components
    $navRoot = navRoot; //eslint-disable-line react-hooks/globals
    
    return helpers;
}

export function usePathname() {
    return expo_usePathname() as UrlPathLocal;
}

let $navRoot!: ReturnType<typeof useNavigationContainerRef>;

function goHome() {
    router.dismissTo('/');
    // $navRoot.reset({
    //     index: 0,
    //     routes: [
    //         {
    //             name: 'index'
    //         }
    //     ]
    // });
}

let reload: () => void = noop;
export function setRefresher(refresher: (() => void) | null) {
    reload = refresher ?? noop;
}

const helpers = {
    canGoBack() {
        return router.canGoBack();
    },
    closeCart() {
        $navRoot.dispatch(DrawerActions.closeDrawer());
    },
    goBack() {
        router.back();
    },
    goHome,
    goto(path: LinkHref, replace = false) {
        if (path == '/') goHome();
        else if (replace) router.replace(path);
        else router.push(path);
    },
    isAtHome() {
        const state = $navRoot.getState();
        return state.index == 0 && state.routes[0].name == 'index';
    },
    openCart() {
        $navRoot.dispatch(DrawerActions.openDrawer());
    },
    refresh() {
        //router.reload();
        reload();
    },
};