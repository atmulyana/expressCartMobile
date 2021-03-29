/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import LessPureComponent from './LessPureComponent';
import {contentWidth} from '../common';
import styles from '../styles';

export default class TwoPane extends LessPureComponent {
    static propTypes = {
        left: PropTypes.element,
        right: PropTypes.element,
    };
    render() {
        const props = this.props;
        const cntWidth = contentWidth();
        const paneStyle = [styles.paneOfTwo];
        if (cntWidth < styles.paneOfTwo.minWidth) paneStyle.push({minWidth: cntWidth});
        return <View style={styles.twoPane}>
            <View style={paneStyle}>
                {props.left}
            </View>
            <View style={paneStyle}>
                {props.right}
            </View>
        </View>;
    }
}