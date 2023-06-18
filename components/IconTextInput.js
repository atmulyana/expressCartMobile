/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import PropTypes from 'prop-types';
import {isDifferentStyle} from 'react-native-form-input-validator';
import ValidatedInput from './ValidatedInput';
import {lang, shallowCompareExclude} from '../common';
import {extractTextStyle, isViewStyleProp} from '../styleProps';
import {textInput as textInputStyle} from '../styles';

const defaultStyles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
const requiredStyles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        flexDirection: 'row',
        padding: 0,
        paddingBottom: 0,
        paddingEnd: 0,
        paddingHorizontal: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingStart: 0,
        paddingTop: 0,
        paddingVertical: 0,
    },
    text: {
        flex: 1,
    },
    iconContainer: {
        flex: 0,
        maxWidth: '25%',
    },
});

const iconProps = {color:true, height:true, tintColor:true, width:true};
const iconStyleValidator = (propValue, key, componentName, location, propFullName) => {
    if (Array.isArray(propValue)) {
        if (typeof(propValue[key]) != 'object')
            return new Error(`${propFullName}[${key}] of ${componentName} is not an object. All array elements must be an object.`);
        for (let propName in propValue[key]) {
            let ret = iconStyleValidator(propValue[key], propName, componentName, location, propFullName);
            if (ret instanceof Error) return ret;
        }
    }
    else if (!isViewStyleProp(key) && !iconProps[key])
        return new Error(`'${key}' is not valid property for ${propFullName} of ${componentName}`);
};
const getStyle = props => props.style.view;
const setStatusStyle = (props, style) => {
    const inputStyle = props.style.view;
    if (style) {
        props.style.view = [inputStyle, style];
    }
    else if (Array.isArray(inputStyle)) {
        props.style.view = inputStyle[0];
    }
};
const setStyle = (props, style) => props.style.view = style;

export default class IconTextInput extends ValidatedInput {
    static propTypes = {
        ...TextInput.propTypes,
        iconStyle: PropTypes.oneOfType([ //TextInput.propTypes.style,
            PropTypes.objectOf(iconStyleValidator),
            PropTypes.arrayOf(iconStyleValidator)
        ]), 
    };
    static defaultProps = {
        ...TextInput.defaultProps,
    };

    constructor(props) {
        super(props, _TextInput, rules => ({
            getStyle,
            lang,
            rules,
            setStatusStyle,
            setStyle,
        }));
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompareExclude(this, nextProps, nextState, 'style', 'validation') || isDifferentStyle(this.props.style, nextProps.style);
    }

    getProps(props) {
        return props;
    }

    getIconContainerWidth(iconStyle, textStyle) {
    }

    renderPrefixIcon(iconStyle, textStyle) {
        return null;
    }

    renderSuffixIcon(iconStyle, textStyle) {
        return null;
    }

    render() {
        const props = this.getProps({...this.props});
        let {style = [], iconStyle = []} = props;
        delete props.style;
        delete props.iconStyle;

        style = extractTextStyle([textInputStyle].concat(style));
        style.view = Object.assign(style.view, requiredStyles.container);
        
        iconStyle =  StyleSheet.flatten([defaultStyles.iconContainer, iconStyle, requiredStyles.iconContainer]);
        
        const prefixIcon = this.renderPrefixIcon(iconStyle, style.text),
              suffixIcon = this.renderSuffixIcon(iconStyle, style.text);

        iconStyle = {...iconStyle};
        iconStyle.width = this.getIconContainerWidth(iconStyle, style.text)
            ?? (typeof(style.view.height) == 'number' ? style.view.height : false);
        if (!iconStyle.width) delete iconStyle.width;
        delete iconStyle.height;
        
        return this.inputElement({...props, iconStyle, prefixIcon, style, suffixIcon});
    }
}

const _TextInput = React.forwardRef(({iconStyle, prefixIcon, style, suffixIcon, ...props}, ref) => (
    <View style={style.view}>
        {prefixIcon &&
            <View style={iconStyle}>
                {prefixIcon}
            </View>
        }
        <TextInput ref={ref} {...props} style={[style.text, requiredStyles.text]} />
        {suffixIcon &&
            <View style={iconStyle}>
                {suffixIcon}
            </View>
        }
    </View>
));