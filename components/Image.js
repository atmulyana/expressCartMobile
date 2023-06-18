/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import Image, {NoImage} from 'rn-flex-image';
import {serverUrl} from '../common';

export const imagePlaceholder = NoImage;

export default function({uri, ...props}) {
    const src = uri ? serverUrl(uri) : null;
    return <Image {...props} src={src} />;
}