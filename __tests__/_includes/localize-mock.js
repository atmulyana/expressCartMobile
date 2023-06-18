/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 */
// import localizeMock from "react-native-localize/mock";
// jest.mock("react-native-localize", () => localizeMock);

let mock_sysLang = false;

jest.mock('react-native-localize', () => ({
    __esModule: true,
    findBestLanguageTag: () => (mock_sysLang ? {languageTag: mock_sysLang} : null),
}));

export const setSysLang = lang => mock_sysLang = lang;