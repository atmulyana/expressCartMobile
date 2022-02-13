/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import {lang, str} from '../common';
import ValidationRule from './ValidationRule';

export class Min extends ValidationRule {
    constructor(min) {
        super();
        this.min = min;
    }

    min;
    
    get priority() {return 1}
    get errorMessage() {
        return str(lang('minimum $1'), this.min);
    }

    validate() {
        this.value = parseFloat(this.value);
        this.isValid = this.value >= this.min;
        return this;
    }
}
export const min = minVal => new Min(minVal);