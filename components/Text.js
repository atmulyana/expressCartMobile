/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 * 
 * To make 'style' writing shorter
 */
import React from 'react';
import { Text, TextPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import LessPureComponent from './LessPureComponent';
import styles from '../styles';

const propStyles = {
    bold: 'textBold',
    center: 'textCenter',
    error: 'textError',
    gray: 'textGray',
    green: 'textGreen',
    large: 'textLarge',
    link: 'textLink',
    red: 'textRed',
    right: 'textRight',
    small: 'textSmall',
    yellow: 'textYellow',
    para4: 'para4',
    para8: 'para8',
    p8: 'p8',
    ph8: 'ph8',
    ml4: 'ml4',
    mr4: 'mr4',
    m8: 'm8',
};

export default class extends LessPureComponent {
    static propTypes = {
        ...TextPropTypes,
        ...Object.fromEntries( Object.keys(propStyles).map(key => [ key, PropTypes.bool ]) ),
    };
    static defaultProps = {
        ...Text.defaultProps,
    };

    render() {
        const props = this.props;
        let style = [styles.text];
        for (let key in propStyles) if (props[key]) style.push( styles[ propStyles[key] ] );
        if (props.style) style = style.concat(props.style);
        return <Text {...props} style={style}>{props.children}</Text>;
    }
}