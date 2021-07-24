/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import Toast from 'react-native-tiny-toast';
import styles from '../styles';
import {styleArrayToObject} from '../styleProps';

function showToast(message, style, duration = Toast.duration.SHORT) {
    const containerStyle = styleArrayToObject([{}, styles.alert, style]);
    delete containerStyle.color;
    Toast.show(message, {
        containerStyle,
        duration,
        textStyle: {color: style.color},
    });
}
const success = message => showToast(message, styles.alertSuccess);
const warning = message => showToast(message, styles.alertWarning);
const error = message => showToast(message, styles.alertDanger, Toast.duration.LONG);
export default {
    success,
    warning,
    error,
    errorHandler: err => {
        if (typeof(err) != 'object') {
            if (err !== undefined) throw err;
            return;
        }
        if (!err || !err.data || err.valid === false || err.handled) return;
        if (err.status == 400) {
            if (typeof(err.data) == 'object' && err.data?.message) {
                err.handled = true;
                error(err.data.message);
            }
            else if (Array.isArray(err.data) && typeof(err.data[0]) == 'object' && err.data[0]?.message) {
                err.handled = true;
                error(err.data[0].message);
            }
        }
    }
};