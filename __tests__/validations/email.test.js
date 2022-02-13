/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 */
import '../_includes/validation-mocks';
import {email} from '../../validations/email';

test('validation: email', () => {
    expect(email.setValue('abc').validate().isValid).toBe(false);
    expect(email.setValue('abc@').validate().isValid).toBe(false);
    expect(email.setValue('abc@def').validate().isValid).toBe(false);
    expect(email.setValue('abc@def.com').validate().isValid).toBe(true);
});