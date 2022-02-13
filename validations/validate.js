/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import ValidationRule from './ValidationRule';
import {Optional} from './optional';

export default (value, rules) => {
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