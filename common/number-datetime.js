/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import numeral from 'numeral';
import moment from 'moment';

export const formatAmount = amt => amt ? numeral(amt).format('0.00') : '0.00';
export const currencySymbol = symbol => symbol || '$';
export const formatDate = (date, format) => moment(date).format(format);
export const timeAgo = date => moment(date).fromNow();
export const digitCount = number => { /** number is non-negative integer */
    if (isNaN(number = parseInt(number))) return;
    let tens = 10, count = 1;
    for (;;) {
        if (number < tens) return count;
        else {
            tens *= 10;
            count++;
        }
    }
};