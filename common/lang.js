/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import { addEventListener, removeEventListener, findBestAvailableLanguage } from 'react-native-localize';
import EncryptedStorage from 'react-native-encrypted-storage';

const keyLangCode = 'en';
const languages = {
    [keyLangCode]: 'English',
    id: 'Indonesia',
    it: 'Italiano',
};

import SQLite from 'react-native-sqlite-storage-x';
SQLite.enablePromise(true);

/*** Realm module makes this app dies on emulator. Memory problem??? You may try on bigger memory or on the real smartphone
//=========================================================================================================================
import Realm from 'realm';
require('../setNativeEventListeners')('RNFSManager'); //'require' must be ended by ';' if not an error happens
//must be using 'require', not 'import', to make the above line works
const fs = require('react-native-fs');

//Copy [locales] database to document directory, so that it can be opened by Realm engine
(async function() {
    if (await fs.exists(fs.DocumentDirectoryPath + '/data.realm')) await fs.unlink(fs.DocumentDirectoryPath + '/data.realm')
    if (await fs.exists(fs.DocumentDirectoryPath + '/data.realm.lock')) await fs.unlink(fs.DocumentDirectoryPath + '/data.realm.lock')
    if (await fs.exists(fs.DocumentDirectoryPath + '/data.realm.management')) await fs.unlink(fs.DocumentDirectoryPath + '/data.realm.management')
    if (fs.MainBundlePath && await fs.exists(fs.MainBundlePath + '/data.realm')) //iOS
        await fs.copyFile(fs.MainBundlePath + '/data.realm', fs.DocumentDirectoryPath + '/data.realm');
    else
        Realm.copyBundledRealmFiles(); //android
    await lang.set();
}())
.catch(err => {
    throw err;
});

const LocalesSchema = {
    name: "locales",
    properties: {},
    primaryKey: keyLangCode,
};
for (let code of Object.keys(languages)) {
    LocalesSchema.properties[code] = code == keyLangCode ? 'string' : 'string?';
}
***/

class Lang extends Function {
    //protected fields
    _current = keyLangCode;
    _texts = {};

    get current() {
        return this._current;
    }

    async set(newLangCode) {
        let langCode = keyLangCode; //default
        if (languages[newLangCode]) { //The user really chooses a language from the language menu
            langCode = newLangCode;
            await EncryptedStorage.setItem("lang", langCode); //save the user preference
        }
        //If the user has not already chosen a laguage (e.g. when app starts)
        else if (langCode = await EncryptedStorage.getItem('lang')) { //Check if the user preference has been saved when the app ran previously 
        }
        else { //Otherwise, check the user preference on the system setting
            let langs = findBestAvailableLanguage(Object.keys(languages));
            if (langs) langCode = langs.languageTag;
        }
        
        /***
        let realm;
        try {
            realm = await Realm.open({
                path: fs.DocumentDirectoryPath + '/data.realm',
                readOnly: true,
                schema: [LocalesSchema]
            });
            let rows = realm.objects('locales')
                .map(row => ({key: row[keyLangCode], value: row[langCode]}));
            rows.unshift({});
            this._texts = rows.reduce((map, row) => {
                map[row.key] = row.value;
                return map;
            });
            rows = null;
        }
        finally {
            realm?.close();
        }
        ***/
        
        let db;
        try {
            db = await SQLite.openDatabase({name: "data.sqlite", createFromLocation: "~data.sqlite", readOnly: true});
            const [rs] = await db.executeSql(`SELECT ${keyLangCode} AS key, ${langCode} AS value FROM locales`);
            const map = {};
            rs.rows.raw().forEach(row => map[row.key] = row.value);
            this._texts = map;
        }
        catch (err) {
            //Ignores errors
            this._texts = {}
        }
        finally {
            db && await db.close();
        }

        this._current = langCode;
    }

    addChangeListeners(...listeners) {
        listeners.forEach(listerner => addEventListener('change', listerner));
    }

    removeChangeListeners(...listeners) {
        listeners.forEach(listerner => removeEventListener('change', listerner));
    }

    getText(key) {
        return this._texts[key] ?? key;
    }
}

const lang = new Lang();
function fnLang(text) {
    return fnLang.getText(text);
}
Object.setPrototypeOf(fnLang, lang);

export const availableLanguages = () => Object.keys(languages).map(code => ({code, name: languages[code]}));
export const currentLanguage = () => fnLang.current;
export default fnLang;