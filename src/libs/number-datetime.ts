/**
 * https://github.com/atmulyana/expressCartMobile
 */
import JsSimpleDateFormat, { JsDateFormatSymbols, TimerFormat, TimerFormatSymbols } from 'jssimpledateformat';
import numeral from 'numeral';
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

const defaultDateTimeFormat = new JsSimpleDateFormat('dd/MM/yyyy hh:mma', lang.currentCode);
const defaultTimerFormat = new TimerFormat(null, lang.currentCode);

lang.addChangeListener(() => {
    defaultDateTimeFormat.setDateFormatSymbols(new JsDateFormatSymbols(lang.currentCode));
    defaultTimerFormat.setTimerFormatSymbols(new TimerFormatSymbols(lang.currentCode));
});

export function formatAmount(amt: number) {
    return amt ? numeral(amt).format('0,000.00') : '0.00';
}

export function currencySymbol(symbol?: string | null) {
    return symbol || '$';
}

export function formatDate(date: Date | string, format?: string){
    return (format
        ? new JsSimpleDateFormat(format, lang.currentCode)
        : defaultDateTimeFormat
    ).format(new Date(date));
}

export function timeAgo(date: Date | string) {
    return defaultTimerFormat.approxFormat(
        new Date().getTime() - new Date(date).getTime(),
        null,
        lang('Ago')?.toLowerCase()
    );
}

export function digitCount(number: number) { /** number is non-negative integer */
    if (isNaN(number)) return 0;
    let tens = 10, count = 1;
    for (;;) {
        if (number < tens) return count;
        else {
            tens *= 10;
            count++;
        }
    }
}