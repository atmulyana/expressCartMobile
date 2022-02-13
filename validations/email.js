/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import {lang} from '../common';
import ValidationRule from './ValidationRule';

export class Email extends ValidationRule {
    static regex = /^([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    get errorMessage() {
        return lang('invalid email address');
    }
    validate() {
        this.isValid = Email.regex.test(this.value);
        return this;
    }
}
export const email = new Email();