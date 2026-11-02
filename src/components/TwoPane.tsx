/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { contentPadding } from "@/styles";
import React from 'react';
import { StyleSheet, View } from "react-native";

const paneStyles = StyleSheet.create({
    paneOfTwo: {
        flexBasis: 340,
        flexGrow: 1,
        flexShrink: 0,
    },
    twoPane: {
        alignSelf: 'stretch',
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: contentPadding,
        justifyContent: 'center',
    },
    wrapReverse: {
        alignContent: 'flex-end',
        alignItems: 'flex-end',
        flexWrap: 'wrap-reverse',
    },
});
const twoPaneRevStyle = [paneStyles.twoPane, paneStyles.wrapReverse];

export default function TwoPane({
    left,
    reverse,
    right,
}: {
    left: React.ReactElement,
    reverse?: boolean,
    right: React.ReactElement,
}) {
    return <View style={reverse ? twoPaneRevStyle : paneStyles.twoPane}>
        <View style={paneStyles.paneOfTwo}>
            {left}
        </View>
        <View style={paneStyles.paneOfTwo}>
            {right}
        </View>
    </View>;
}
