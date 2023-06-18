/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
export {isViewStyleProp, extractImageStyle} from 'rn-style-props';
import {extractTextStyle as package_extractTextStyle} from 'rn-style-props';

export const extractTextStyle = (style, paddingForText = true, attrName='style') =>
    package_extractTextStyle(style, paddingForText, attrName);