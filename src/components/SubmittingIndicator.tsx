/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useColors, useStyles } from '@/hooks/styles';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Text from './TextApp';

export default function SubmittingIndicator({
    message,
    visible,
}: {
    message?: string | null,
    visible?: boolean,
}) {
    const colors = useColors();
    const styles = useStyles();
    
    if (!visible) return null;
    message = message?.trim();
    return <View style={indicatorStyles.container}>
        <View style={[indicatorStyles.backdrop, {backgroundColor: colors.bgBar}]}></View>
        <ActivityIndicator animating size="large" color={colors.info} />
        {message && <Text style={styles.array('textCenter', 'textBold', 'txt-infoText')}>{message}</Text>}
    </View>;
}

const indicatorStyles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFill,
        opacity: 0.7,
    },
    container: {
        ...StyleSheet.absoluteFill,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex:300000,
    }
});