/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { getStoredData, storeData } from "@/libs/storage";
import type { HookListener } from "@/types";
import { Asset } from "expo-asset";
import { Directory, File } from "expo-file-system";
import * as SQLite from 'expo-sqlite';
import { emptyObject, emptyString, noop } from "javascript-common";
import { AppState, type AppStateStatus } from "react-native";
import { findBestLanguageTag } from 'react-native-localize';

const keyLangCode = 'en';
const languages = {
    [keyLangCode]: {
        name: 'English',
        flag: require('@/assets/images/flags/en.png'),
    },
    id: {
        name: 'Indonesia',
        flag: require('@/assets/images/flags/id.png'),
    },
    it: {
        name: 'Italiano',
        flag: require('@/assets/images/flags/it.png'),
    },
} as const;
type LangCode = keyof typeof languages;


async function openDatabase() {
    let db: SQLite.SQLiteDatabase | null = null;
    try {
        const dbName = "lang.db";
        const dbFile = new File('file://', SQLite.defaultDatabaseDirectory, dbName);
        if (!dbFile.exists) {
            const dbDir = new Directory('file://' + SQLite.defaultDatabaseDirectory);
            if (!dbDir.exists) dbDir.create();
            let dbAsset = Asset.fromModule(require('@/assets/db/lang.db'));
            dbAsset = await dbAsset.downloadAsync();
            const assetFile = new File(dbAsset.localUri ?? emptyString);
            await assetFile.move(dbFile, {overwrite: true});
        }
        db = await SQLite.openDatabaseAsync(dbName);
    }
    catch (ex: any) {
        console.error("Error on opening database: ", ex);
    }
    return db;
}

type Texts = {
    [key: string]: {
        [idx: number]: string,
    }
};

let m_currentCode: LangCode = keyLangCode;
let m_texts: Texts = emptyObject;
let m_changeListeners: HookListener[] = [];

class Lang extends Function {
    constructor() {
        super(
            'text', 'idx',
            "return arguments.callee.getText(text, idx);"
        );
    }

    get availableLanguages() {
        return Object.keys(languages).map(code => ({
            code,
            ...languages[code as LangCode],
        }));
    }

    get currentCode() {
        return m_currentCode;
    }

    addChangeListener(listener: HookListener) {
        m_changeListeners.push(listener);
        return () => {
            m_changeListeners = m_changeListeners.filter(item => item != listener);
        };
    }

    getText(text: string, idx: number = 0) {
        const texts = m_texts;
        return texts[text] && (texts[text][idx] || texts[text][0]) || text;
    }

    async setCode(code: LangCode, dontPersist: boolean = false) {
        if (code == m_currentCode) return;
        let db: SQLite.SQLiteDatabase | null = null;
        const prevTexts = m_texts;
        m_texts = emptyObject;
        try {
            if (!(code in languages)) code = keyLangCode;
            if (code == keyLangCode) return;

            db = await openDatabase();
            if (!db) {
                if (code == m_currentCode) m_texts = prevTexts;
                return;
            }
            
            const texts: Texts = {};
            for await (const row of db.getEachAsync<{
                key: string,
                idx: number,
                value: string,
            }>(
                `SELECT ${keyLangCode} AS key, idx, ${code} AS value FROM locales ORDER BY key`
            )) {
                if (!texts[row.key]) texts[row.key] = {};
                texts[row.key][row.idx] = row.value;
            }

            /* if (Object.keys(texts).length > 0) m_texts = texts; */
            for (let _ in texts) {
                m_texts = texts; 
                break;
            }
        }
        finally {
            await db?.closeAsync();
            m_currentCode = code;
            if (!dontPersist) storeData('lang', code).catch(noop);
            if (prevTexts != m_texts) {
                for (let listener of m_changeListeners) listener();
            }
        }
    }
}

const lang = new Lang();
export default lang;

export async function initLang() {
    let code: LangCode | null = await getStoredData('lang') as LangCode | null;
    if (!code) {
        let langs = findBestLanguageTag(Object.keys(languages));
        if (langs) code = langs.languageTag as LangCode;
    }
    await lang.setCode(code ?? lang.currentCode, true);
}

export function watchSysLangChange() {
    const handleEvent = async (state: AppStateStatus) => {
        if (state == 'active') {
            let code: LangCode | null = await getStoredData('lang') as LangCode | null;
            if (!code) {
                let langs = findBestLanguageTag(Object.keys(languages));
                if (langs) {
                    /**
                     * BUG: language `code` will change if the app is forcely stopped
                     * and then restarted
                     */
                    code = langs.languageTag as LangCode;
                    lang.setCode(code);
                }
            }
        }
    };

    const listener = AppState.addEventListener('change', handleEvent);
    return () => listener.remove();
}