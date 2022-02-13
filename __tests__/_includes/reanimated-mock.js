/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 *
 * Source: https://reactnavigation.org/docs/testing
 */
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => {};
    return Reanimated;
});
  
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');