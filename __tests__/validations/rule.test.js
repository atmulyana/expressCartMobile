/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 */
import '../_includes/validation-mocks';
import {rule} from '../../validations/rule';

test('validation: rule validates to true', () => {
    const val = rule(() => true).validate();
    expect(val.isValid).toBe(true);
    expect(val.errorMessage).toBe(null);
});

test('validation: rule validates to false', () => {
    const val = rule(() => false).validate();
    expect(val.isValid).toBe(false);
    expect(val.errorMessage).toBe('invalid');
});

test('validation: rule validates to false with message', () => {
    const val = rule(() => false, 'abc').validate();
    expect(val.isValid).toBe(false);
    expect(val.errorMessage).toBe('abc');
});