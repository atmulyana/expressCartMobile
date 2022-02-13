/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 */
const mockValues = {
};

jest.mock('react-native-encrypted-storage', () => ({
    __esModule: true,
    default: {
        setItem: (name, value) => (mockValues[name] = value, Promise.resolve(true)),
        getItem: name => Promise.resolve(mockValues[name]),
        removeItem: name => (delete mockValues[name], Promise.resolve(true)),
        clear: () => (mockValues.keys().forEach(key => delete mockValues[key]), Promise.resolve(true)),
    },
}));