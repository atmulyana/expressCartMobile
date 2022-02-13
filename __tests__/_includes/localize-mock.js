/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 */
let mock_sysLang = false;

jest.mock('react-native-localize', () => ({
    __esModule: true,
    addEventListener: () => {},
    removeEventListener: () => {},
    findBestAvailableLanguage: () => (mock_sysLang ? {languageTag: mock_sysLang} : null),
}));

export const setSysLang = lang => mock_sysLang = lang;