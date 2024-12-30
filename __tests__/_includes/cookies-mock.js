/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 */

jest.mock('@react-native-cookies/cookies', () => ({
    __esModule: true,
    default: {
        set: () => {},
    }
}));