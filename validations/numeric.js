/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import {lang} from '../common';
import ValidationRule from './ValidationRule';

export class Numeric extends ValidationRule {
    static regex = /^(\+|-)?(\d+(\.\d+)?|\.\d+)$/;
    get errorMessage() {
        return lang('invalid numeric value');
    }
    validate() {
        this.isValid = Numeric.regex.test(this.value);
        return this;
    }
}
export const numeric = new Numeric();