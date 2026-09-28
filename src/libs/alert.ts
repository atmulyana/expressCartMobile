/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { Alert, type AlertButton } from 'react-native';
import lang from './lang';

export function confirmModal(callback?: AlertButton['onPress']) {
    Alert.alert(
        lang('Confirm'),
        lang('Are you sure you want to proceed?'),
        [
            {
                text: lang('Close'),
                style: 'cancel'
            },
            {
                text: lang('Confirm'),
                onPress: callback
            }
        ],
        {
            cancelable: false,
        }
    );
};