/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import {lang, str} from '../common';

export class ValidationRule {
    get priority() {return 0;}
    get errorMessage() {return '';}
    name = '';
    value;
    isValid;
    validate() {
        return this;
    }
}

const isFilled = value => {
    if (typeof(value) == 'string') {
        return value.trim() != '';
    }
    else {
        return value !== undefined && value !== null;
    }
} 

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

export class Optional extends ValidationRule {
    get priority() {return -1;}
    get errorMessage() {
        return null; //always true
    }
    isValid = true;
    isFilled;

    validate() {
        this.isValid = true;
        this.isFilled = isFilled(this.value);
        return this;
    }
}
export const optional = new Optional();

export class StrLength extends ValidationRule {
    constructor(min, max) {
        super();
        this.min = min;
        this.max = max;
    }
    
    _message;
    get errorMessage() {
        return this._message;
    }

    validate() {
        this._message = '';
        var strVal = this.value+'';
        if (this.min !== undefined && strVal.length < this.min) this._message = str(lang('must be at least $1 characters'), this.min);
        if (this.max !== undefined && strVal.length > this.max) this._message = str(lang("don't exceed $1 characters"), this.max);
        this.isValid = !this._message;
        return this;
    }
}
export const strlen = (min, max) => new StrLength(min, max);

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

export class Numeric extends ValidationRule {
    static regex = /^(\+|-)?\d+(\.\d+)?$/;
    get errorMessage() {
        return lang('invalid numeric value');
    }
    validate() {
        this.isValid = Numeric.regex.test(this.value);
        return this;
    }
}
export const numeric = new Numeric();

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

export class CustomRule extends ValidationRule {
    constructor(validateFunc, errorMessage) {
        super();
        this._validate = validateFunc;
        this._errorMessage = errorMessage;
    }

    _validate;
    _errorMessage;
    _message;
    
    get errorMessage() {
        return this._message;
    }

    validate() {
        const validationValue = this._validate(this.value); //It may return true if valid or an error message
        this.isValid = validationValue === true;
        this._message = this.isValid ? null 
            : (typeof(validationValue) == 'string') ? validationValue
            : (this._errorMessage ?? lang('invalid'));
        return this;
    }
}
export const rule = (validateFunc, errorMessage) => new CustomRule(validateFunc, errorMessage);

export const validate = (value, rules) => {
    if (!Array.isArray(rules)) {
        if (rules instanceof ValidationRule) rules = [rules];
        else return false;
    }
    
    rules = rules.filter(rule => rule instanceof ValidationRule).sort((rule1, rule2) => (
        rule1.priority < rule2.priority ? -1 :
        rule1.priority > rule2.priority ? 1 :
        0
    ));
    if (rules.length < 1) return false;
    
    for (let rule of rules) {
        rule.value = value;
        rule.validate();
        if (rule.isValid) {
            if ((rule instanceof Optional) && !rule.isFilled) return true; //Don't check the rest of rules if the input is optional and not filled
        }
        else {
            return rule.errorMessage;
        }
    }
    return true;
};