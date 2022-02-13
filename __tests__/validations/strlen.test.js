/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 */
import '../_includes/validation-mocks';
import {strlen, strlenmax} from '../../validations/strlen';

test('validation: strlen with min value', () => {
    const val = strlen(2);
    expect(val.setValue('1').validate().isValid).toBe(false);
    expect(val.setValue('12').validate().isValid).toBe(true);
    expect(val.setValue('123').validate().isValid).toBe(true);
});

test('validation: strlen with max value', () => {
    const val = strlenmax(4);
    expect(val.setValue('123').validate().isValid).toBe(true);
    expect(val.setValue('1234').validate().isValid).toBe(true);
    expect(val.setValue('12345').validate().isValid).toBe(false);
});

test('validation: strlen with min and max value', () => {
    const val = strlen(2, 4);
    expect(val.setValue('1').validate().isValid).toBe(false);
    expect(val.setValue('12').validate().isValid).toBe(true);
    expect(val.setValue('123').validate().isValid).toBe(true);
    expect(val.setValue('1234').validate().isValid).toBe(true);
    expect(val.setValue('12345').validate().isValid).toBe(false);
});