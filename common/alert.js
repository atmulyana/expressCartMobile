/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import {Alert} from 'react-native';
import lang from './lang';

export const confirmModal = callback => {
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
    { cancelable: false }
    );
};