/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import {lang, str} from '../common';
import ValidationRule from './ValidationRule';

export class StrLength extends ValidationRule {
    constructor(min, max) {
        super();
        this.min = min;
        this.max = max;
    }
    
    #message;
    get errorMessage() {
        return this.#message;
    }

    validate() {
        this.#message = '';
        var strVal = this.value+'';
        if (this.min !== undefined && strVal.length < this.min) this.#message = str(lang('must be at least $1 characters'), this.min);
        if (this.max !== undefined && strVal.length > this.max) this.#message = str(lang("don't exceed $1 characters"), this.max);
        this.isValid = !this.#message;
        return this;
    }
}
export const strlen = (min, max) => new StrLength(min, max);
export const strlenmax = max => new StrLength(undefined, max);