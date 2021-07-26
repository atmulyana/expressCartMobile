/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import LessPureComponent from './LessPureComponent';
import {appHelpers} from '../common';
import routes from '../contents/routes';

export default class ContentLink extends LessPureComponent {
    render() {
        const props = { ...this.props }, {style, route} = props;
        delete props.children;
        delete props.style;
        delete props.route;
        
        if (typeof(route) == 'object' && route.name) {
            const onClick = props.onPress;
            let url = route.url;
            if (typeof(url) == 'function') url = url();
            props.onPress = () => {
                let proceed = true;
                if (typeof(onClick) == 'function') proceed = onClick();
                if (proceed !== false) {
                    if (route == routes.home) {
                        if (!appHelpers.isAtHome()) appHelpers.goHome();
                    }
                    else
                        appHelpers.loadContent(route.name, url, route.headerBar);
                }
            }
        }
        
        return <TouchableOpacity {...props} style={[defaultStyle, style]}>
            {this.props.children}
        </TouchableOpacity>;
    }
}

const {defaultStyle} = StyleSheet.create({
    defaultStyle: {
        flex: -1,
        padding: 0,
    }
});