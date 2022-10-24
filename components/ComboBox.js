/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {Modal, Platform, StyleSheet, TextInput, TouchableWithoutFeedback, View} from 'react-native';
import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';
import {Picker} from '@react-native-picker/picker';
import Icon from './Icon';
import ValidatedInput from './ValidatedInput';
import {lang, shallowCompareExclude} from '../common';
import styles from '../styles';
import {extractTextStyle} from '../styleProps';

export default class ComboBox extends ValidatedInput {
    static propTypes = {
        items: PropTypes.arrayOf(
            PropTypes.shape({
                value: PropTypes.any.isRequired,
                label: PropTypes.string,
            })
        ).isRequired,
    };

    constructor(props) {
        super(props, _ComboBox);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompareExclude(this, nextProps, nextState, 'validation', 'onValueChange');
    }

    render() {
        return this.inputElement();
    }
}

const _style = StyleSheet.create({
    arrowContainer: {
        alignItems: 'center',
        flex: 0,
        height: styles.textInputHeight.height,
        justifyContent: 'center',
        width: styles.textInput.fontSize + 6,
    },
    arrow: {
        color: styles.textInput.borderColor,
        height: styles.textInput.fontSize,
        strokeWidth: 8,
        width: styles.textInput.fontSize,
    },
    container: {
        flexDirection: 'row',
        overflow: 'hidden',
    },
    input: Object.assign({}, styles.textInput, styles.textInputHeight),
    selectIOSClose: {
        color: styles.textInput.borderColor,
        position: 'absolute',
        right: styles.box.borderRadius,
        top: styles.box.borderRadius,
        strokeWidth: 3,
    },
    selectIOSBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black',
        opacity: 0.6,
    },
    selectIOSContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectIOS: {
        ...styles.box,
        backgroundColor: '#eee',
        borderColor: styles.textInput.borderColor,
        borderWidth: 1,
        height: 210,
        maxHeight: '95%',
        maxWidth: 400,
        overflow: 'hidden',
        shadowColor: 'gray',
        shadowOffset: 2,
        width: '80%',
    },
    text: {
        flex: 1
    },
    touch: {
        ...StyleSheet.absoluteFillObject,
        color: 'transparent',
        opacity: 0,
    },
});

const Select = Platform.OS != 'ios'
    ? props => <Picker {...props} style={_style.touch} />
    : ({children, itemStyle, style, ...props}) => {
        const [visible, showList] = React.useState(false);
        return <>
            <TouchableWithoutFeedback onPress={() => showList(true)}><View style={_style.touch} /></TouchableWithoutFeedback>
            <Modal visible={visible} supportedOrientations={['landscape', 'portrait']} transparent={true}>
                <View style={_style.selectIOSContainer}>
                    <TouchableWithoutFeedback onPress={() => showList(false)}><View style={_style.selectIOSBackdrop} /></TouchableWithoutFeedback>
                    <View style={_style.selectIOS}>
                        <Picker {...props} itemStyle={[styles.text, styles.textBold, itemStyle]} style={[style, StyleSheet.absoluteFill]}>
                            {children}
                        </Picker>
                        <TouchableWithoutFeedback onPress={() => showList(false)}>
                            <Icon icon="X" style={_style.selectIOSClose} />
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </Modal>
        </>;
    };

const _ComboBox = React.forwardRef((props, ref) => {
    let {items, onValueChange, style, value: selectedValue, ...props2} = props,
        selectedLabel;
    style = extractTextStyle([_style.input, style]);
    const children = items.map(item => {
        const label = lang(item.label ?? item.value+'');
        if (isEqual(item.value, selectedValue)) {
            selectedValue = item.value; //for Object, it's necessary (`selectedValue` and `item.value` may have different reference, especially on iOS)
            selectedLabel = label;
        }
        return <Picker.Item {...item} key={item.value} label={label} />
    });
    if (!selectedLabel) {
        children.unshift(<Picker.Item key={null} label="" value={undefined} />)
    }

    return <View style={[style.view, _style.container]}>
        <TextInput {...props2} editable={false} ref={ref} style={[style.text, _style.text]} value={selectedLabel} />
        <View style={_style.arrowContainer}>
            <Icon icon="ChevronDown" style={_style.arrow} />
        </View>
        <Select {...{children, onValueChange, selectedValue}} />
    </View>;
});