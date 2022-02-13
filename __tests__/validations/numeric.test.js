/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 */
import '../_includes/validation-mocks';
import {numeric} from '../../validations/numeric';

test('validation: numeric', () => {
    expect(numeric.setValue('.2').validate().isValid).toBe(true);
    expect(numeric.setValue('-.2').validate().isValid).toBe(true);
    expect(numeric.setValue('1.2').validate().isValid).toBe(true);
    expect(numeric.setValue('-1.2').validate().isValid).toBe(true);
    expect(numeric.setValue('-123').validate().isValid).toBe(true);
    expect(numeric.setValue('123').validate().isValid).toBe(true);
    expect(numeric.setValue('+123').validate().isValid).toBe(true);
    expect(numeric.setValue('123abc').validate().isValid).toBe(false);
    expect(numeric.setValue('').validate().isValid).toBe(false);
});