/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import {lang} from '../common';
import ValidationRule from './ValidationRule';

export class CustomRule extends ValidationRule {
    constructor(validateFunc, errorMessage) {
        super();
        this.#validate = validateFunc;
        this.#errorMessage = errorMessage;
    }

    #validate;
    #errorMessage;
    #message;
    
    get errorMessage() {
        return this.#message;
    }

    validate() {
        const validationValue = this.#validate(this.value); //It may return true if valid or an error message
        this.isValid = validationValue === true;
        this.#message = this.isValid ? null 
            : (typeof(validationValue) == 'string') ? validationValue
            : (this.#errorMessage ?? lang('invalid'));
        return this;
    }
}
export const rule = (validateFunc, errorMessage) => new CustomRule(validateFunc, errorMessage);