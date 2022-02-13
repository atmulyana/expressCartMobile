/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
export default value => {
    if (typeof(value) == 'string') {
        return value.trim() != '';
    }
    else {
        return value !== undefined && value !== null;
    }
}