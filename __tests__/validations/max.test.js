/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 */
import '../_includes/validation-mocks';
import {max} from '../../validations/max';

test('validation: max', () => {
    const val = max(5);
    expect(val.setValue(4).validate().isValid).toBe(true);
    expect(val.setValue(5).validate().isValid).toBe(true);
    expect(val.setValue(6).validate().isValid).toBe(false);
});