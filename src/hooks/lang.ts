/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { createHookStore } from "@/libs/hook";
import lang from '@/libs/lang';
import React from 'react';

type Lang = {code: string, flag: number, name: string};

type TLang = {
    (text: string, index?: number, locale?: string): string,
    readonly availableLanguages: Lang[];
    readonly currentCode: string,
    setCode: (code: string) => Promise<void>,
};

function createLangFunc() {
    const fn = (text: string, idx: number = 0) => lang.getText(text, idx);
    Object.setPrototypeOf(fn, lang);
    return fn as TLang;
}

const langStore = createHookStore(createLangFunc());
lang.addChangeListener(() => {
    langStore.updateSync(createLangFunc());
});

export default function useLang() {
    return React.useSyncExternalStore(langStore.subscribe, langStore.getData);
}