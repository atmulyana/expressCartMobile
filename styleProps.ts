/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */

const layoutStyle = {
    display: true,
    width: true,
    height: true,
    bottom: true,
    end: true,
    left: true,
    right: true,
    start: true,
    top: true,
    minWidth: true,
    maxWidth: true,
    minHeight: true,
    maxHeight: true,
    margin: true,
    marginBottom: true,
    marginEnd: true,
    marginHorizontal: true,
    marginLeft: true,
    marginRight: true,
    marginStart: true,
    marginTop: true,
    marginVertical: true,
    padding: true,
    paddingBottom: true,
    paddingEnd: true,
    paddingHorizontal: true,
    paddingLeft: true,
    paddingRight: true,
    paddingStart: true,
    paddingTop: true,
    paddingVertical: true,
    borderWidth: true,
    borderBottomWidth: true,
    borderEndWidth: true,
    borderLeftWidth: true,
    borderRightWidth: true,
    borderStartWidth: true,
    borderTopWidth: true,
    position: true,
    flexDirection: true,
    flexWrap: true,
    justifyContent: true,
    alignItems: true,
    alignSelf: true,
    alignContent: true,
    overflow: true,
    flex: true,
    flexGrow: true,
    flexShrink: true,
    flexBasis: true,
    aspectRatio: true,
    zIndex: true,
    direction: true,
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
    borderColor: true,
    borderBottomColor: true,
    borderEndColor: true,
    borderLeftColor: true,
    borderRightColor: true,
    borderStartColor: true,
    borderTopColor: true,
    borderRadius: true,
    borderBottomEndRadius: true,
    borderBottomLeftRadius: true,
    borderBottomRightRadius: true,
    borderBottomStartRadius: true,
    borderTopEndRadius: true,
    borderTopLeftRadius: true,
    borderTopRightRadius: true,
    borderTopStartRadius: true,
    borderStyle: true,
    borderWidth: true,
    borderBottomWidth: true,
    borderEndWidth: true,
    borderLeftWidth: true,
    borderRightWidth: true,
    borderStartWidth: true,
    borderTopWidth: true,
    opacity: true,
    elevation: true,
};
  
const textStyle = {
    color: true,
    fontFamily: true,
    fontSize: true,
    fontStyle: true,
    fontWeight: true,
    fontVariant: true,
    textShadowOffset: true,
    textShadowRadius: true,
    textShadowColor: true,
    letterSpacing: true,
    lineHeight: true,
    textAlign: true,
    textAlignVertical: true,
    includeFontPadding: true,
    textDecorationLine: true,
    textDecorationStyle: true,
    textDecorationColor: true,
    textTransform: true,
    writingDirection: true,
};
  
const imageStyle = {
    resizeMode: true,
    tintColor: true,
    overlayColor: true,
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
    if (!Array.isArray(style)) style = [style];
    for (let i in style) {
        if (!style[i]) continue;
        for (let propName in style[i]) {
            if (!isTextStyleValidProp(propName))
                throw `${propName} is not valid property for ${attrName}`;
            if (isTextStyleProp(propName) || paddingForText && propName.indexOf('padding') > -1) {
                textStyle[propName] = style[i][propName];
            }
            else {
                viewStyle[propName] = style[i][propName];
            }
        }
    }
    return {view: viewStyle, text: textStyle};
};

export const extractImageStyle = (style, attrName='style') => {
    const imageStyle = {}, viewStyle = {};
    if (!Array.isArray(style)) style = [style];
    for (let i in style) {
        if (!style[i]) continue;
        for (let propName in style[i]) {
            if (!isImageStyleValidProp(propName))
                throw `${propName} is not valid property for ${attrName}`;
            if (isImageStyleProp(propName)) {
                imageStyle[propName] = style[i][propName];
            }
            else {
                viewStyle[propName] = style[i][propName];
            }
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