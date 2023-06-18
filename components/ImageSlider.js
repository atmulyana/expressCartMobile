/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {StyleSheet} from 'react-native';
import ImageSlider from 'rn-images-slider';
import Image from './Image';
import {serverUrl} from '../common';

export default function(props) {
    return <ImageSlider
        {...props}
        baseSrc={serverUrl('/')}
        noImage={<Image style={StyleSheet.absoluteFill} />}
    />;
}