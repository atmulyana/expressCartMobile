/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {View} from 'react-native';
import {ViewPropTypes} from 'deprecated-react-native-prop-types';
import LessPureComponent from './LessPureComponent';
import styles from '../styles';

export default class Box extends LessPureComponent {
    static propTypes = {
        ...ViewPropTypes
    };
    
    render() {
        const props = this.props;
        return <View {...props} style={[styles.box, styles.m8, styles.p8].concat(props.style)}>
            {props.children}
        </View>
    }
}