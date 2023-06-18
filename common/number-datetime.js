/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import numeral from 'numeral';
import JsSimpleDateFormat, {JsDateFormatSymbols, TimerFormat, TimerFormatSymbols} from 'jssimpledateformat';
import lang from './lang';

Object.assign(TimerFormatSymbols.__symbols__, {
	it: {
		fewSeconds: 'qualche secondo',
		aMinute: 'un minuto',
		minutes: '${count} minuti',
		anHour: "un'ora",
		hours: '${count} ore',
        aDay: 'un giorno',
        days: '${count} giorni',
        aMonth: 'un mese',
        months: '${count} mesi',
        aYear: 'un anno',
        years: '${count} anni'
	},
});

const defaultDateTimeFormat = new JsSimpleDateFormat('dd/MM/yyyy hh:mma', lang.current);
const defaultTimerFormat = new TimerFormat(null, lang.current);

lang.addChangeListeners(langCode => {
    defaultDateTimeFormat.setDateFormatSymbols(new JsDateFormatSymbols(langCode));
    defaultTimerFormat.setTimerFormatSymbols(new TimerFormatSymbols(langCode));
});

export const formatAmount = amt => amt ? numeral(amt).format('0,000.00') : '0.00';
export const currencySymbol = symbol => symbol || '$';

export const formatDate = (date, format) => (format
    ? new JsSimpleDateFormat(format, lang.current)
    : defaultDateTimeFormat
).format(new Date(date));
export const timeAgo = date => defaultTimerFormat.approxFormat(new Date() - new Date(date), null, lang('Ago')?.toLowerCase());

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