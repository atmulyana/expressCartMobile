/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * 
 * Source: https://www.npmjs.com/package/@react-native-clipboard/clipboard#mocking-clipboard
 */
import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock';
jest.mock('@react-native-clipboard/clipboard', () => mockClipboard);