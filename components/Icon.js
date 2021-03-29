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
import * as Icons from 'react-native-feather';

export const ICON_SIZE = 24;
export const ICON_COLOR = "#212529";

export default function Icon(props) {
    let props2 = {...props};
    
    let Icon = Icons[props2.icon];
    if (!Icon) throw `Invalid icon name: no name ${props2.icon}`;
    let iconSize = ICON_SIZE;
    let {height = iconSize, width = iconSize, style = {}} = props2;
    delete props2.icon;
    delete props2.style;

    props2.height = props2.width = '100%';
    props2.stroke = props2.stroke ?? style.color ?? ICON_COLOR;
    props2.fill = props2.fill ?? style.backgroundColor ?? 'transparent';
    delete style.color;
    
    return (<View style={[{flex: -1, height, width}, style]}>
        <Icon {...props2} />
    </View>);
};
Icon.propTypes = {
    icon: PropTypes.string.isRequired,
};