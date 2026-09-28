/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useStyles } from '@/hooks/styles';
import React from 'react';
import { Text as RNText, type TextProps } from 'react-native';

export default function Text({
    children,
    style,
    ...props
}: TextProps) {
    const styles = useStyles();
    const styleProp = React.useMemo(() => {
        return [styles.text, style];
    }, [styles, style]);

    return <RNText {...props} style={styleProp}>{children}</RNText>;
}