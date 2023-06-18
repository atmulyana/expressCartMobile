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
        const {style:oriStyle, ...props} = this.props;
        const style = [styles.text];
        for (let key of Object.keys(props)) {
            if (props[key] === true && propStyles[key]) {
                style.push( styles[ propStyles[key] ] );
                
                //Must delete from `props` because it may have meaning for RN `Text` component
                //For example: `right`, even if not documented it seems it has effect because the app can crash if we set `right` prop
                //to RN `Text` component especially on Android
                delete props[key];
            }
        }
        if (oriStyle) style.push(oriStyle);
        return <Text {...props} style={style}>{props.children}</Text>;
    }
}