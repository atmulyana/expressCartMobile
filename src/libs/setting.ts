/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { noop } from "javascript-common";
import lang, { initLang } from "./lang";
import { setCookie } from "./server";
import { initColorScheme } from "./style";

export async function initApp() {
    await initLang();
    setCookie('locale', lang.currentCode).catch(noop);
    await initColorScheme();
}

export const setLang: typeof lang.setCode = async (code, dontPersist) => {
    await lang.setCode(code, dontPersist);
    setCookie('locale', lang.currentCode).catch(noop);
}