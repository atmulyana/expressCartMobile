/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import {lang, str} from '../common';
import ValidationRule from './ValidationRule';

export class Max extends ValidationRule {
    constructor(max) {
        super();
        this.max = max;
    }

    max;
    
    get priority() {return 1}
    get errorMessage() {
        return str(lang('maximum $1'), this.max);
    }

    validate() {
        this.value = parseFloat(this.value);
        this.isValid = this.value <= this.max;
        return this;
    }
}
export const max = maxVal => new Max(maxVal);