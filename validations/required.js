/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import {lang} from '../common';
import ValidationRule from './ValidationRule';
import isFilled from './isFilled';

export class Required extends ValidationRule {
    get priority() {return -1;}
    get errorMessage() {
        return lang('required');
    }

    validate() {
        this.isValid = isFilled(this.value);
        return this;
    }
}
export const required = new Required();