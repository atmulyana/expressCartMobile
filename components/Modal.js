/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Button from './Button';
import Form from './Form';
import Icon from './Icon';
import LessPureComponent from './LessPureComponent';
import Text from './Text';
import ValidationContainer from './ValidationContainer';
import {lang, noop} from '../common';
import styles from '../styles';

export default class extends LessPureComponent {
    static propTypes = {
        ...Modal.propTypes,
        title: PropTypes.string,
        buttonDone: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]),
        cancelLabel: PropTypes.string,
        onSubmit: PropTypes.func,
        style: ViewPropTypes.style,
    };
    static defaultProps = {
        ...Modal.defaultProps,
        animationType: "fade",
        visible: false,
        onSubmit: noop,
    };

    _form;

    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible,
        };
    }

    show = () => {
        this.setState({visible:true});
    }

    hide = () => {
        this.setState({visible:false});
    }

    submitData = (url, data) => this._form?.submitData(url, data);

    shouldComponentUpdate(nextProps, nextState) {
        let should = super.shouldComponentUpdate(nextProps, nextState);
        if (nextProps.visible != this.props.visible) nextState.visible = nextProps.visible;
        return should;
    }

    render() {
        const props = this.props;
        const cancelLabel = props.cancelLabel === undefined ? lang('Cancel') :
                            !props.cancelLabel ? null :
                            props.cancelLabel;
        return <Modal
            animationType={props.animationType}
            hardwareAccelerated={props.hardwareAccelerated}
            onDismiss={props.onDismiss}
            onOrientationChange={props.onOrientationChange}
            onRequestClose={this.hide}
            onShow={props.onShow}
            presentationStyle={props.presentationStyle}
            statusBarTranslucent={props.statusBarTranslucent}
            supportedOrientations={props.supportedOrientations}
            transparent
            visible={this.state.visible}
        >
        <View style={{
            alignItems: 'center',
            height: '100%',
            justifyContent: 'center',
            width: '100%',
        }}>
            <Pressable style={[styles.modalBackdrop, StyleSheet.absoluteFill]} onPress={this.hide} />
            <Form ref={elm => this._form = elm} style={[styles.modal, props.style]}>
            <ValidationContainer>
                <View style={[styles.p8, styles.bb, {flexDirection:'row'}]}>
                    <Text large red style={{flex:1}}>{props.title ?? ''}</Text>
                    <Icon icon="X" strokeWidth={4} height={16} width={16} onPress={() => this.hide()} />
                </View>
                <ScrollView style={[styles.p8, {flex:1}]}>
                    {props.children}
                </ScrollView>
                <View style={[styles.p8, styles.bt, {flexDirection:'row', justifyContent:'space-between'}]}>
                    {cancelLabel && <Button title={cancelLabel} style={[styles.buttonOutlineDanger]} onPress={() => this.hide()} />}
                    {
                        typeof(props.buttonDone) == 'string'
                            ? <Button title={props.buttonDone} style={[styles.buttonOutlineSuccess]} onPress={props.onSubmit} /> :
                        props.buttonDone
                            ? props.buttonDone :
                        null
                    }
                </View>
            </ValidationContainer>
            </Form>
        </View>
        </Modal>;
    }
}