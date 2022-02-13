/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
export default class {
    get priority() {return 0;}
    get errorMessage() {return '';}
    name = '';
    value;
    isValid;
    setValue(value) {
        this.value = value;
        return this;
    }
    validate() {
        return this;
    }
}