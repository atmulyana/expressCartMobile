/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 */
import {URL, URLSearchParams} from 'react-native/Libraries/Blob/URL.js';
const path = require('path');

jest.mock('react-native-url-polyfill', () => ({
    __esModule: true,
    URL: MockURL,
    URLSearchParams: MockURLSearchParams,
}));

/** RegExp SOURCE: https://gist.github.com/dperini/729294 
 * with changes for capturing the parts
 * and separating path, search parameter and hash
 * and also to include local network address 
 */
const re_weburl = new RegExp(
    "^" +
        // protocol identifier (optional)
        // short syntax // still required
        "(?:((?:https?|ftp):)?\\/\\/)" +
        // user:pass BasicAuth (optional)
        "(?:([^:]+)(?::([^@]*))?@)?" +
        // IP address exclusion
        // Automative private IP address (problematic IP address)
        "(?!169\\.254(?:\\.\\d{1,3}){2})" +
        "(" +
            // Private & local networks IP addresses
            // excludes network & broadcast addresses
            "(?:(?:10|127)(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
            "(?:192\\.168\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
            "(?:172\\.(?:1[6-9]|2\\d|3[0-1])\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
            // IP address dotted notation octets
            // excludes loopback network 0.0.0.0
            // excludes reserved space >= 224.0.0.0
            // excludes network & broadcast addresses
            // (first & last IP address of each class)
            "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
            "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
            "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
            // host & domain names, may end with dot
            // can be replaced by a shortest alternative
            // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
            "(?:" +
                "(?:" +
                    "[a-z0-9\\u00a1-\\uffff]" +
                    "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
                ")?" +
                "[a-z0-9\\u00a1-\\uffff]\\." +
            ")+" +
            // TLD identifier name, may end with dot
            "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
        "|" +
            // host name for local network / loopback such as localhost or computer name
            "(?:" +
                "(?:" +
                    "[a-z0-9\\u00a1-\\uffff]" +
                    "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
                ")?" +
                "[a-z0-9\\u00a1-\\uffff]" +
            ")+" +
        ")" +
        // port number (optional)
        "(?::(\\d{2,5}))?" +
        // path (optional)
        "(\\/[^?#\\s]*)?" +
        // query/search (optional)
        "(\\?[^#\\s]*)?" +
        // fragment/hash (optional)
        "(#\\S*)?" +
    "$",
    "i"
);

const parseURL = url => {
    const parts = re_weburl.exec(url);
    return parts && {
        protocol: parts[1] || '',
        username: parts[2] || '',
        password: parts[3] || '',
        hostname: parts[4] || '',
        port:     parts[5] || '',
        pathname: parts[6] || '/',
        search:   parts[7] || '',
        hash:     parts[8] || '',
    };
};

const resolvePath = (abs, rel) => {
    if (!abs.endsWith('/')) abs = path.dirname(abs);
    return path.resolve(abs, rel)
        .replaceAll('\\', '/') //Replaces Windows path separator to URL path separator
        .replace(/^[A-Z]:/i, ''); //removes Windows Drive letter
};

class MockURL extends URL {
    #hash; #host; #hostname; #origin; #password; #pathname; #port; #protocol; #search; #username;

    constructor(url, base) {
        let parts = parseURL(url);
        if (parts) {
        }
        else if (parts = parseURL(base)) {
            url = url + '';
            const isRootPath = url.startsWith('/'), 
                  parts2 = parseURL('http://host.com' + (isRootPath ? '' : '/') + url);
            if (!parts2) throw new TypeError('Invalid parameter');
            const relPath = isRootPath ? parts2.pathname : parts2.pathname.substring(1);
            parts.pathname = resolvePath(parts.pathname, relPath);
            parts.search = parts2.search;
            parts.hash = parts2.hash;
        }
        else {
            throw new TypeError('Invalid parameter');
        }

        for (let name in parts) this['#' + name] = parts[name];

        this._searchParamsInstance = new MockURLSearchParams(this.#search);
        this.#host = this.#hostname + (this.#port ? ':' : '') + this.#port;
        this.#origin = `${this.#protocol}//${this.#host}`
    }

    get hash() {
        return this.#hash;
    }

    get host() {
        return this.#host;
    }

    get hostname() {
        return this.#hostname;
    }

    get origin() {
        this.#origin;
    }

    get password() {
        return this.#password;
    }

    get pathname() {
        return this.#pathname;
    }

    get port() {
        return this.#port;
    }

    get protocol() {
        return this.#protocol;
    }

    get search() {
        const params = this.searchParams.toString();
        return params ? '?' + params : params;
    }
    
    get username() {
        return this.#username;
    }

    toString() {
        const parts = [this.#protocol, '//'];
        if (this.#username) {
            parts.push(this.#username);
            if (this.#password) parts.push(':', this.#password);
            parts.push('@');
        }
        parts.push(this.#host, this.#pathname, this.search, this.#hash);
        return parts.join('');
    }
}

class MockURLSearchParams extends URLSearchParams {
    constructor(params) {
        if (typeof(params) == 'string') {
            if (params.startsWith('?')) params = params.substring(1);
            if (params) {
                params.split('&').forEach(entry => {
                    const [key, value] = entry.split('=', 2);
                    if (key && value) this.append(key, value);
                });
            }
        }
        else {
            super(params);
        }
    }
}