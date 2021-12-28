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
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1,
        justifyContent: 'center',
        overflow: 'hidden',
    },
});

const propTypes = {
    ...Image.propTypes,
    uri: PropTypes.string,
    keepAspectRatio: PropTypes.bool,
};
delete propTypes.source; //replaced by uri
const defaultProps = {
    ...Image.defaultProps,
    keepAspectRatio: true,
}
delete defaultProps.source;

const calculateLength = (actualCalculatedLength, actualBaseLength, baseLength) =>
    actualCalculatedLength / actualBaseLength * baseLength;

//This class exists in order to be able to update width/height of Image independently
class ImageWraper extends LessPureComponent {
    #dim = null;

    updateDimension(width, height) {
        if (!this.isMounted) {
            this.#dim = {width, height};
            return;
        }
        
        const {source, keepAspectRatio} = this.props;
        const newStyle = {width, height};
        
        const updateDim = actual => {
            if (width > 0 && height > 0) {
                newStyle.height = calculateLength(actual.height, actual.width, newStyle.width);
                if (newStyle.height > height) { //if the new image size is bigger than space size
                    //then change the base side
                    newStyle.width = calculateLength(actual.width, actual.height, newStyle.height);
                }
            }
            else {
                let base = 'width', calculated = 'height';
                if (width < 1) [base, calculated] = [calculated, base];
                newStyle[calculated] = calculateLength(actual[calculated], actual[base], newStyle[base]);
            }
            this.setState({newStyle});
        };

        if (width > 0 && height > 0 && !keepAspectRatio) { //if width & height on space have been known and it needs not to keep aspect ratio
            //then width/height of image needs not to be calculated
            newStyle.resizeMode = 'stretch';
            this.setState({newStyle});
        }
        else if (typeof(source) == 'object' && source.uri) { //For remote image, usually one of width or height of space hasn't been known (zero)
            //If it so then calculate the unknown measure
            Image.getSize(source.uri,
                (actualWidth, actualHeight) => {
                    updateDim({width: actualWidth, height: actualHeight});
                },
                () => { //can't get the actual dimension of image, consider the space height is the same as width
                    if (newStyle.width < 1) newStyle.width = newStyle.height;
                    if (newStyle.height < 1) newStyle.height = newStyle.width;
                    if (!keepAspectRatio) newStyle.resizeMode = 'stretch';
                    this.setState({newStyle});
                }
            );
        }
        else { //local image, especially if we want to keep aspect ratio
            updateDim(Image.resolveAssetSource(source));
        }
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.#dim != null) {
            this.updateDimension(this.#dim.width, this.#dim.height);
            this.#dim = null;
        } 
    }

    render() {
        return <Image {...this.props} style={this.props.style.concat(this.state.newStyle)} />;
    }
}

//The purpose of using this class, we do need to set width and height of an Image but just follows the layout rule
export default class AppImage extends LessPureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;
    
    render() {
        let image = null;
        const style = extractImageStyle(this.props.style);
        const source = this.props.uri ? {uri: serverUrl(this.props.uri)} : imagePlaceholder;

        return <View style={style.view /** width/height may include border and/or padding */}>
            <View style={styles.required /** has no border and padding (it will have the true dimension fro the Image) */}
                onLayout={ev => {
                    let coverDim = ev.nativeEvent.layout;
                    image.updateDimension(coverDim.width, coverDim.height);
                }}
            >
            <ImageWraper ref={img => image = img} {...this.props}
                style={[styles.default, style.image]}
                source={source} defaultSource={imagePlaceholder}
            />
            </View>
        </View>;
    }
}