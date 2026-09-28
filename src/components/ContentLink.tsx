/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useNavHelpers } from "@/hooks";
import { extractTextStyle } from "@/libs/style";
import type { LinkHref, ProcessProps } from "@/types";
import React from 'react';
import { Pressable, type StyleProp, StyleSheet, type TextStyle, type ViewStyle } from "react-native";
import ProcessIndicator from "./ProcessIndicator";
import Text from "./Text";

const defaultStyles = StyleSheet.create({
    text: {
        alignSelf: 'center',
    },
    view: {
        flex: -1,
        padding: 0,
    }
});

const ContentLink = React.memo(function ContentLink({
    children,
    href,
    loadingAware,
    onPress,
    style,
    submittingAware,
    ...props
}: Omit<React.ComponentProps<typeof Pressable>, 'children' | 'style'> & {
    children: React.ReactNode,
    href: LinkHref,
    style?: StyleProp<TextStyle | ViewStyle>,
} & ProcessProps) {
    const helpers = useNavHelpers();
    const styles = React.useMemo(() => {
        return extractTextStyle([
            defaultStyles.view,
            typeof(children) == 'string' ? defaultStyles.text : null,
            style
        ]);
    }, [children, style]);

    return <ProcessIndicator loadingAware={loadingAware} submittingAware={submittingAware}>
        <Pressable
            {...props}
            style={styles.view}
            onPress={ev => {
                let proceed: any = true;
                if (onPress) proceed = onPress(ev);
                if (proceed !== false) {
                    if (href.trim() == '/') {
                        if (!helpers.isAtHome()) helpers.goHome();
                    }
                    else {
                        helpers.goto(href);
                    }
                }
            }}
        >
            {typeof(children) == 'string' ? <Text style={styles.text}>{children}</Text> : children}
        </Pressable>
    </ProcessIndicator>;
});
export default ContentLink;