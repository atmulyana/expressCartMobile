/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { noop } from "javascript-common";
import {
    Appearance,
    type ColorSchemeName,
    type ImageStyle,
    type StyleProp,
    type TextStyle,
    type ViewStyle
} from "react-native";
import { extractTextStyle as package_extractTextStyle } from 'rn-style-props';
import { createHookStore } from "./hook";
import { deleteStoredData, getStoredData, storeData } from "./storage";

export { extractImageStyle, isViewStyleProp } from 'rn-style-props';
export const extractTextStyle = (
    style: StyleProp<ImageStyle | TextStyle | ViewStyle>,
    paddingForText = true,
    attrName = 'style'
) =>
    package_extractTextStyle(style, paddingForText, attrName) as {
        view: ViewStyle,
        text: TextStyle,
    };

const COLOR_SCHEME_KEY = 'colorScheme';
export const colorScheme = createHookStore(
    'unspecified' as ColorSchemeName,
    (scheme: ColorSchemeName) => {
        Appearance.setColorScheme(scheme);
        (scheme == 'unspecified'
            ? deleteStoredData(COLOR_SCHEME_KEY)
            : storeData(COLOR_SCHEME_KEY, scheme)
        ).catch(noop /* Ignore errors */);
        return scheme;
    }
);
export async function initColorScheme() {
    const scheme = await getStoredData(COLOR_SCHEME_KEY) ?? 'unspecified';
    if (scheme != colorScheme.getData()) await colorScheme.update(scheme as ColorSchemeName);
}