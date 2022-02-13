/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 */
import {join} from 'path';
const sqlite3 = require('sqlite3').verbose();
const __datadir = join(__dirname, '../../ios') + '/'

const enablePromise = () => {}; //consider always true

const openDatabase = params => new Promise((resolve, reject) => {
    const dataFilePath = params.createFromLocation.replace(/^~/, __datadir),
          mode = !!params.readOnly ? sqlite3.OPEN_READONLY : undefined;
    const db = new sqlite3.Database(dataFilePath, mode, err => {
        if (err == null) resolve(new Database(db));
        else reject(err);
    });
});

class Database {
    #db;

    constructor(db) {
        this.#db = db;
    }

    close() {
        return new Promise((resolve, reject) => {
            this.#db.close(err => {
                if (err) reject(err);
                else resolve(true);
            })
        });
    }

    executeSql(sql, args) {
        return new Promise((resolve, reject) => {
            this.#db.all(sql, args, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                const rs = {
                    insertId: 0, //???
                    rowsAffected: 0, //???
                    rows: {
                        length: rows.length,
                        raw: () => rows,
                        item: idx => rows[idx],
                    },
                };
                resolve([rs]);
            });
        });
    }
}

jest.mock('react-native-sqlite-storage-x', () => ({
    __esModule: true,
    default: {
        enablePromise,
        openDatabase,
    },
}));