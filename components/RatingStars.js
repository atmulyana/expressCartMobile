/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import LessPureComponent from './LessPureComponent';
import Icon, {ICON_COLOR, ICON_SIZE} from './Icon';
import {noop} from '../common';

const styles = StyleSheet.create({
    container: {
        flex: 0,
        flexDirection: 'row',
    },
    star: {
        marginHorizontal: 4,
    },
});

const values = [];
for (let i = 0; i < 5; i++) values.push(i);

export default class RatingStars extends LessPureComponent {
    static propTypes = {
        fill: PropTypes.string,
        rating: PropTypes.oneOf(values.concat(values.length)).isRequired,
        size: PropTypes.number,
        stroke: PropTypes.string,
        onRate: PropTypes.func,
    };

    static defaultProps = {
        fill: '#ffc107',
        //rating: 0,
        size: ICON_SIZE,
        stroke: ICON_COLOR,
        onRate: noop,
    };

    render() {
        const props = this.props;
        return <View style={styles.container}>
            {values.map(i => <Icon key={i}
                icon="Star"
                height={props.size}
                width={props.size}
                style={styles.star}
                stroke={props.stroke}
                fill={i < props.rating ? props.fill : 'transparent'}
                onPress={() => props.onRate && props.onRate(i+1)}
            />)}
        </View>;
    }
}