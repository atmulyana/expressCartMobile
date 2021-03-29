/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import LessPureComponent from './LessPureComponent';
import {serverUrl} from '../common';
import {extractImageStyle} from '../styleProps';

export const imagePlaceholder = require('../images/placeholder.png');

const styles = StyleSheet.create({
    default: {
        resizeMode: 'contain',
    },
    required: {
        alignSelf: 'stretch',
        flex: 1,
        overflow: 'hidden',
    },
});

const propTypes = {
    ...Image.propTypes,
    uri: PropTypes.string,
    keepAspectRatio: PropTypes.bool,
};
delete propTypes.source;
delete propTypes.style; //checked by extractImageStyle
const defaultProps = {
    ...Image.defaultProps,
    keepAspectRatio: true,
}
delete defaultProps.source;

const calculateLength = (actualCalculatedLength, actualBaseLength, baseLength) =>
    Math.round(actualCalculatedLength / actualBaseLength * baseLength);

//This class exists in order to be able to update width/height of Image independently
class ImageWraper extends LessPureComponent {
    state = {};

    updateDimension(width, height, currentWidth, currentHeight) {
        const {uri, source, keepAspectRatio} = this.props;
        const dim = {width, height};
        let base = 'width', calculated = 'height';
        
        const updateDim = actual => {
            dim[calculated] = calculateLength(actual[calculated], actual[base], dim[base]);
            this.setState(dim);
        };
        
        if (width > 0 && height > 0) {
            if (keepAspectRatio) {
                if (height != currentHeight) [base, calculated] = [calculated, base];
                updateDim({width: currentWidth, height: currentHeight});
            }
            else {
                this.setState(dim);
            }
        }
        else {
            if (width < 1) [base, calculated] = [calculated, base];
            if (uri) {
                Image.getSize(uri,
                    (actualWidth, actualHeight) => {
                        updateDim({width: actualWidth, height: actualHeight});
                    },
                    () => {
                        dim[calculated] = dim[base];
                        this.setState(dim);
                    }
                );
            }
            else {
                updateDim(Image.resolveAssetSource(source));
            }
        }
    }

    render() {
        const dim = {}, state = this.state;
        if (state.width > 0) dim.width = state.width;
        if (state.height > 0) dim.height = state.height;
        return <Image {...this.props} style={this.props.style.concat(dim)} />;
    }
}

export default class AppImage extends LessPureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;
    
    render() {
        let image = null, imageWidth = 0, imageHeight = 0;
        const style = extractImageStyle(this.props.style);
        if (this.state.height !== undefined) {
            style.image.height = this.state.height;
            this.state.height = undefined;
        }
        const source = this.props.uri ? {uri: serverUrl(this.props.uri)} : imagePlaceholder;
        
        return <View style={style.view /** width/height may include border and/or padding */}>
            <View style={styles.required /** has no border and padding */}
                onLayout={ev => {
                    const { width, height } = ev.nativeEvent.layout;
                    if (width != imageWidth || height != imageHeight || width < 1 || height < 1) {
                        image.updateDimension(width, height, imageWidth, imageHeight);
                    }
                }}
            >
            <ImageWraper ref={img => image = img} {...this.props}
                style={[styles.default, style.image, styles.required]}
                source={source} defaultSource={imagePlaceholder}
                onLayout={ev => {
                    imageWidth = ev.nativeEvent.layout.width;
                    imageHeight = ev.nativeEvent.layout.height;
                }}
            />
            </View>
        </View>;
    }
}