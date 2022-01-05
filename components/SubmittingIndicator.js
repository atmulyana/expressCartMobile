/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import LessPureComponent from './LessPureComponent';
import Text from './Text';

export default class SubmittingIndicator extends LessPureComponent {
    static propTypes = {
        visible: PropTypes.bool,
    };
    static defaultProps = {
        message: null,
        visible: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible,
        };
    }

    get visible() {
        return this.state.visible;
    }

    set visible(value) {
        value ? this.show() : this.hide();
    }

    show(callback, message) {
        this.setState({message, visible: true}, callback);
    }

    hide(callback) {
        this.setState({visible: false}, callback);
    }

    shouldComponentUpdate(nextProps, nextState) {
        let should = super.shouldComponentUpdate(nextProps, nextState);
        if (nextProps.visible != this.props.visible) nextState.visible = nextProps.visible;
        return should;
    }

    render() {
        let display = this.visible ? 'flex' : 'none';
        let coverage = this.visible ? '100%' : 0;
        return (
            <View style={{alignItems: 'center', display: display, height: coverage, justifyContent: 'center',
                          position: 'absolute', width: coverage, zIndex:300000}}>
                <View style={[StyleSheet.absoluteFill, {backgroundColor: '#888', opacity: 0.1}]}></View>
                <ActivityIndicator animating={this.visible} size="large" color='#00f' style={{display: display}} />
                {this.state.message && <Text style={{backgroundColor:'white', color:'black'}}>{this.state.message}</Text>}
            </View>
        );
    }
}