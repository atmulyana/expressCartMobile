/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import {StyleSheet} from 'react-native';

const layoutStyle = {
    alignContent: true,
    alignItems: true,
    alignSelf: true,
    aspectRatio: true,
    borderBottomWidth: true,
    borderEndWidth: true,
    borderLeftWidth: true,
    borderRightWidth: true,
    borderStartWidth: true,
    borderTopWidth: true,
    borderWidth: true,
    bottom: true,
    direction: true,
    display: true,
    end: true,
    flex: true,
    flexBasis: true,
    flexDirection: true,
    flexGrow: true,
    flexShrink: true,
    flexWrap: true,
    height: true,
    justifyContent: true,
    left: true,
    margin: true,
    marginBottom: true,
    marginEnd: true,
    marginHorizontal: true,
    marginLeft: true,
    marginRight: true,
    marginStart: true,
    marginTop: true,
    marginVertical: true,
    maxHeight: true,
    maxWidth: true,
    minHeight: true,
    minWidth: true,
    overflow: true,
    padding: true,
    paddingBottom: true,
    paddingEnd: true,
    paddingHorizontal: true,
    paddingLeft: true,
    paddingRight: true,
    paddingStart: true,
    paddingTop: true,
    paddingVertical: true,
    position: true,
    right: true,
    start: true,
    top: true,
    width: true,
    zIndex: true,
};
  
const transformStyle = {
    transform: true,
};
  
const shadowStyle = {
    shadowColor: true,
    shadowOffset: true,
    shadowOpacity: true,
    shadowRadius: true,
};
  
const viewStyle = {
    backfaceVisibility: true,
    backgroundColor: true,
    borderBottomColor: true,
    borderBottomEndRadius: true,
    borderBottomLeftRadius: true,
    borderBottomRightRadius: true,
    borderBottomStartRadius: true,
    borderBottomWidth: true,
    borderColor: true,
    borderEndColor: true,
    borderEndWidth: true,
    borderLeftColor: true,
    borderLeftWidth: true,
    borderRadius: true,
    borderRightColor: true,
    borderRightWidth: true,
    borderStartColor: true,
    borderStartWidth: true,
    borderStyle: true,
    borderTopColor: true,
    borderTopEndRadius: true,
    borderTopLeftRadius: true,
    borderTopRightRadius: true,
    borderTopStartRadius: true,
    borderTopWidth: true,
    borderWidth: true,
    elevation: true,
    opacity: true,
};
  
const textStyle = {
    color: true,
    fontFamily: true,
    fontSize: true,
    fontStyle: true,
    fontVariant: true,
    fontWeight: true,
    includeFontPadding: true,
    letterSpacing: true,
    lineHeight: true,
    textAlign: true,
    textAlignVertical: true,
    textDecorationColor: true,
    textDecorationLine: true,
    textDecorationStyle: true,
    textShadowColor: true,
    textShadowOffset: true,
    textShadowRadius: true,
    textTransform: true,
    writingDirection: true,
};
  
const imageStyle = {
    overlayColor: true,
    resizeMode: true,
    tintColor: true,
};


export const layoutStyleProps = Object.keys(layoutStyle);
export const transformStyleProps = Object.keys(transformStyle);
export const shadowStyleProps = Object.keys(shadowStyle);
export const viewStyleProps = Object.keys(viewStyle);
export const textStyleProps = Object.keys(textStyle);
export const imageStyleProps = Object.keys(imageStyle);

export const isLayoutStyleProp = propName => layoutStyle[propName];
export const isTransformStyleProp = propName => transformStyle[propName];
export const isShadowStyleProp = propName => shadowStyle[propName];
export const isViewStyleProp = propName => viewStyle[propName];
export const isTextStyleProp = propName => textStyle[propName];
export const isImageStyleProp = propName => imageStyle[propName];

export const isViewStyleValidProp = propName =>
    isLayoutStyleProp(propName) || isTransformStyleProp(propName) || isShadowStyleProp(propName) || isViewStyleProp(propName);
export const isTextStyleValidProp = propName => isViewStyleValidProp(propName) || isTextStyleProp(propName);
export const isImageStyleValidProp = propName => isViewStyleValidProp(propName) || isImageStyleProp(propName);

export const extractTextStyle = (style, paddingForText = true, attrName='style') => {
    const textStyle = {}, viewStyle = {};
    style = StyleSheet.flatten(style);
    for (let propName in style) {
        if (!isTextStyleValidProp(propName))
            throw `${propName} is not valid property for ${attrName}`;
        if (isTextStyleProp(propName) || paddingForText && propName.indexOf('padding') > -1) {
            textStyle[propName] = style[propName];
        }
        else {
            viewStyle[propName] = style[propName];
        }
    }
    return {view: viewStyle, text: textStyle};
};

export const extractImageStyle = (style, attrName='style') => {
    const imageStyle = {}, viewStyle = {};
    style = StyleSheet.flatten(style);
    for (let propName in style) {
        if (!isImageStyleValidProp(propName))
            throw `${propName} is not valid property for ${attrName}`;
        if (isImageStyleProp(propName)) {
            imageStyle[propName] = style[propName];
        }
        else {
            viewStyle[propName] = style[propName];
        }
    }
    return {view: viewStyle, image: imageStyle};
};

export default {
    layoutStyleProps,
    transformStyleProps,
    shadowStyleProps,
    viewStyleProps,
    textStyleProps,
    imageStyleProps,
    
    isLayoutStyleProp,
    isTransformStyleProp,
    isShadowStyleProp,
    isViewStyleProp,
    isTextStyleProp,
    isImageStyleProp,
    
    isViewStyleValidProp,
    isTextStyleValidProp,
    isImageStyleValidProp,
};