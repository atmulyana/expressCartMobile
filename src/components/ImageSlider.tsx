/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { serverUrl } from '@/libs/server';
import baseStyles from '@/styles';
import type { ProcessProps } from '@/types';
import React from 'react';
import RNImageSlider, { type ImageSliderProp } from 'rn-images-slider'; //eslint-disable-line
import Image from './Image';
import ProcessIndicator from './ProcessIndicator';

const ImageSlider = React.memo(function ImageSlider({
    loadingAware,
    submittingAware,
    ...props
}: Omit<ImageSliderProp, 'baseSrc' | 'noImage'> & ProcessProps) {
    return <ProcessIndicator loadingAware={loadingAware} submittingAware={submittingAware}>
        <RNImageSlider
            {...props}
            baseSrc={serverUrl('/')}
            noImage={<Image style={baseStyles.fill} />}
        />
    </ProcessIndicator> ;
});
export default ImageSlider;