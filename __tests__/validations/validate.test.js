/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 */
import '../_includes/validation-mocks';
import {optional} from '../../validations/optional';
import {required} from '../../validations/required';
import {numeric} from '../../validations/numeric';
import {min} from '../../validations/min';
import validate from '../../validations/validate';


test('validation: validate with optional rule', () => {
    const rules = [min(5), numeric, optional];
    expect(validate('', rules)).toBe(true);
    expect(validate('6abc', rules)).toContain('numeric');
    expect(validate('6', rules)).toBe(true);
    expect(validate('-1', rules)).toContain('minimum');
});

test('validation: validate with required rule', () => {
    const rules = [min(5), numeric, required];
    expect(validate('', rules)).toContain('required');
    expect(validate('6abc', rules)).toContain('numeric');
    expect(validate('6', rules)).toBe(true);
    expect(validate('-1', rules)).toContain('minimum');
});