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
        const paneWidth = Math.floor((cntWidth - styles.twoPane.columnGap) / 2);
        const paneStyle = [styles.paneOfTwo];
        let minWidth = styles.paneOfTwo.minWidth;
        if (cntWidth < minWidth) {
            minWidth = cntWidth;
            paneStyle.push({minWidth: cntWidth});
        }
        paneStyle.push({width: minWidth > paneWidth ? cntWidth : paneWidth})
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