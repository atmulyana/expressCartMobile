/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useStyles } from "@/hooks";
import React from 'react';
import { View, type ViewProps } from "react-native";

export default function Box({
    children,
    style,
    ...props
}: ViewProps) {
    const styles = useStyles();
    const styleProp = React.useMemo(() => {
        const baseStyle = styles.array('box', 'p8', 'm8');
        return style ? [baseStyle, style] : baseStyle;
    }, [styles, style]);

    return <View {...props} style={styleProp}>
        {children}
    </View>;
}