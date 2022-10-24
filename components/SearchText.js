/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import IconTextInput from './IconTextInput';
import Icon, {ICON_SIZE} from './Icon';

const styles = StyleSheet.create({
   icon: {
        height: '90%',
        width: '90%',
    },
});

const getDimension = (iconStyle, textStyle) => {
    let {height, width} = styles.icon;
    if (('height' in iconStyle) && ('width' in iconStyle)) {
        height = iconStyle.height;
        width = iconStyle.width;
    }
    else if (('height' in iconStyle) || ('width' in iconStyle)) { //only one is true
        height = width = iconStyle.height ?? iconStyle.width;
    } else if ('lineHeight' in textStyle) {
        height = width = textStyle.lineHeight;
    }
    else if ('fontSize' in textStyle) {
        height = width = textStyle.fontSize;
    }

    return {height, width};
};

class SearchText extends IconTextInput {
    getIconContainerWidth(iconStyle, textStyle) {
        const dim = getDimension(iconStyle, textStyle);
        let width = typeof(dim.width) == 'number' ? dim.width :
                    typeof(dim.height) == 'number' ? dim.height :
                    ICON_SIZE;
        return Math.ceil(width / 0.9);
    }

    renderPrefixIcon(iconStyle, textStyle) {
        let props = {
            stroke: iconStyle.tintColor ?? iconStyle.color,
            fill: iconStyle.backgroundColor,
        }
        
        return <Icon icon="Search" {...props} style={getDimension(iconStyle, textStyle)} />;
    }
}

export default SearchText.createProxy();