/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useColors } from '@/hooks';
import baseStyles from '@/styles';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
    Mask,
    Polygon,
    Rect,
} from 'react-native-svg';
import Text from './TextApp';

const starStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 0,
        flexDirection: 'row',
        gap: 8,
    }
});

const values: number[] = [];
for (let i = 1; i <= 5; i++) values.push(i);

function Star({
    fill,
    fillColor,
    onPress,
    stroke = "currentColor",
    size,
}: {
    fill: number | boolean,
    fillColor: string,
    onPress?: () => void,
    size: number,
    stroke?: string, 
}) {
    let scale = 0;
    if (typeof(fill) == 'number') scale = fill < 0 ? 0 : fill > 1 ? 1 : fill;
    else scale = !!fill ? 1 : 0;

    return <Svg
        fill="none"
        height={size}
        onPress={onPress}
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        viewBox="0 0 24 24"
        width={size}
    >
        <Mask id="ratingStarMask">
            <Rect
                fill="black"
                height="24"
                width="24"
                x="0"
                y="0"
            />
            <Polygon
                fill='white'
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                strokeWidth={0}
            />
        </Mask>
        <Rect
            fill={fillColor}
            height={20}
            mask="url(#ratingStarMask)"
            x={2}
            y={2}
            strokeWidth={0}
            width={scale * 20}
        />
        <Polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        />
    </Svg>;
}

const RatingStars = React.memo(function RatingStars({
    fill = '#ffc107',
    rating,
    onLayout,
    onRate,
    showNumber = true,
    numberPosition = 'right',
    size = 24,
    stroke,
}: {
    fill?: string,
    rating: number,
    onLayout?: React.ComponentProps<typeof View>['onLayout'],
    onRate?: (rating: number) => void,
    showNumber?: boolean,
    numberPosition?: 'left' | 'right', 
    size?: number,
    stroke?: string,
}) {
    const colors = useColors();
    stroke ??= colors.icon;

    const ratingVal = React.useMemo(() => {
        let ratingVal = rating;
        if (ratingVal > 5) ratingVal = 5;
        else if (ratingVal < 0) ratingVal = 0;
        else ratingVal = Math.round(ratingVal * 10) / 10;
        return ratingVal;
    }, [rating]);

    const styles = React.useMemo(() => {
        return {
            container: [starStyles.container, {height: size}],
            number: [
                baseStyles.textBold,
                {
                    fontSize: size - 4,
                    lineHeight: size - 4,
                    paddingTop: 1,
                }
            ]
        };
    }, [size]);

    const stars: React.ReactElement[] = [];
    let fillVal = ratingVal;
    for (let i = 1; i <= 5; i++) {
        stars.push(<Star
            key={i}
            fill={fillVal}
            fillColor={fill}
            onPress={typeof(onRate) == 'function' ? (() => onRate(i)) : void(0)}
            size={size}
            stroke={stroke}
        />);
        fillVal -= 1;
    }

    return <View onLayout={onLayout} style={styles.container}>
        {showNumber && numberPosition == 'left' && <Text style={styles.number}>{ratingVal}</Text>}
        {stars}
        {showNumber && numberPosition != 'left' && <Text style={styles.number}>{ratingVal}</Text>}
    </View>;
});
export default RatingStars;