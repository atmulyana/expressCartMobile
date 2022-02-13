/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 */
import '../_includes/validation-mocks';
import {min} from '../../validations/min';

test('validation: min', () => {
    const val = min(5);
    expect(val.setValue(4).validate().isValid).toBe(false);
    expect(val.setValue(5).validate().isValid).toBe(true);
    expect(val.setValue(6).validate().isValid).toBe(true);
});