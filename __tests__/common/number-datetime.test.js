/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 */
import {
    currencySymbol,
    digitCount,
    formatAmount,
} from '../../common/number-datetime';

test('currencySymbol', () => {
    expect(currencySymbol()).toBe('$');
    expect(currencySymbol('$')).toBe('$');
    expect(currencySymbol('£')).toBe('£');
});

test('digitCount', () => {
    expect(digitCount(1)).toBe(1);
    expect(digitCount(12)).toBe(2);
    expect(digitCount(123)).toBe(3);
    expect(digitCount(1234567890)).toBe(10);
});

test('formatAmount', () => {
    expect(formatAmount()).toBe('0.00');
    expect(formatAmount(null)).toBe('0.00');
    expect(formatAmount(0)).toBe('0.00');
    expect(formatAmount(1.2)).toBe('1.20');
    expect(formatAmount(1.23)).toBe('1.23');
    expect(formatAmount(1.234)).toBe('1.23');
    expect(formatAmount(1.567)).toBe('1.57');
    expect(formatAmount(1234.567)).toBe('1,234.57');
});