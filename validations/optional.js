/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import ValidationRule from "./ValidationRule";
import isFilled from "./isFilled";

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