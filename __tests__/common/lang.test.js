/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 */
import '../_includes/encrypted-storage-mock';
import '../_includes/sqlite-mock';
import {setSysLang} from '../_includes/localize-mock';

import lang, {availableLanguages, currentLanguage} from '../../common/lang';

test('availableLanguages', () => {
    expect(availableLanguages()).toEqual([
        {code: 'en', name: 'English'},
        {code: 'id', name: 'Indonesia'},
        {code: 'it', name: 'Italiano'},
    ]);
});

test("Default languange should be 'en'", async () => {
    await lang.set();
    expect(currentLanguage()).toBe('en');
    expect(lang('Cart')).toBe('Cart');
});

test("Set system languange to be 'id'", async () => {
    setSysLang('id');
    await lang.set();
    expect(currentLanguage()).toBe('id');
    expect(lang('Cart')).toBe('Keranjang');
});

test("Set app languange to be 'it'", async () => {
    await lang.set('it');
    expect(currentLanguage()).toBe('it');
    expect(lang('Cart')).toBe('Carrello');
});

test("When the app starts, the languange should be the last chosen one (in this case it is 'it')", async () => {
    await lang.set();
    expect(currentLanguage()).toBe('it');
    expect(lang('Cart')).toBe('Carrello');
});