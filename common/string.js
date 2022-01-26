/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
export const str = (strTemplate, ...params) => (strTemplate+'').replace(/\$(\d+)/g, function(_, p1) {
    p1 = parseInt(p1) - 1;
    return params[p1] ?? '';
});