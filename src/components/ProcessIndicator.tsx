/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useMount } from '@/hooks';
import { useIsLoading } from '@/hooks/contexts/data';
import { useSubmitState } from '@/hooks/contexts/form';
import { useIsDarkMode } from '@/hooks/styles';
import { extractImageStyle, extractTextStyle } from '@/libs/style';
import type { ProcessProps } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { emptyObject } from 'javascript-common';
import React from 'react';
import {
    Animated,
    Easing,
    Image,
    type ImageStyle,
    type LayoutChangeEvent,
    type LayoutRectangle,
    type StyleProp,
    StyleSheet,
    Text,
    TextInput,
    type TextStyle,
    useAnimatedValue,
    View,
    type ViewStyle,
} from 'react-native';
import FlexImage from 'rn-flex-image';
import ImageSlider from 'rn-images-slider'; //eslint-disable-line

type ChildrenProps = {
    children?: React.ReactNode,
    onLayout?: (event: LayoutChangeEvent) => void,
    style?: StyleProp<ImageStyle | ViewStyle | TextStyle>
        | ( /* `./Button` */ (...p: any[]) => StyleProp<ImageStyle | ViewStyle | TextStyle> )
};

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

function useIsSubmitting() {
    const [isSubmitting] = useSubmitState();
    return isSubmitting;
}

function useIsStillProcess() {
    const isLoading = useIsLoading();
    const [isSubmitting] = useSubmitState();
    return isLoading || isSubmitting;
}

export default function ProcessIndicator<
    P extends ChildrenProps
>({
    children,
    loadingAware,
    paddingForText,
    submittingAware,
}: {
    children: React.ReactElement<P>,
    paddingForText?: boolean,
} & ProcessProps) {
    const useIsProcessing = loadingAware && submittingAware ? useIsStillProcess :
        loadingAware ? useIsLoading :
        submittingAware ? useIsSubmitting :
        null;

    if (useIsProcessing) {
        return <SkeletonPlaceholder paddingForText={paddingForText} useIsProcessing={useIsProcessing}>
            {children}
        </SkeletonPlaceholder>
    }
    return children;
}

function SkeletonPlaceholder<P extends ChildrenProps>({
    children,
    paddingForText,
    useIsProcessing,
}: {
    children: React.ReactElement<P>,
    paddingForText?: boolean,
    useIsProcessing: () => boolean,
}) {
    const {
        key,
        props: {
            children: childs,
            onLayout: _onLayout,
            style,
            ...props
        },
        type: Component,
    } = children;
    const isChildsElemet = typeof(childs) == 'object' && (
        typeof((childs as any).type) == 'function'
        || typeof((childs as any).type) == 'string'
    ) && ('props' in (childs as any));

    const [styles, zIndex] = React.useMemo(() => {
        let styles: {
            box?: StyleProp<ViewStyle>,
            content?: StyleProp<TextStyle | ImageStyle>,
            image?: ImageStyle,
            text?: TextStyle,
            view?: ViewStyle,
        } = emptyObject,
        zIndex = 1;

        const style2 = (typeof(style) == 'function') ? style(emptyObject) : style;
        if (Component === Text || Component === TextInput) {
            styles = extractTextStyle(style2, paddingForText);
        }
        else if (Component === Image || Component === FlexImage || Component === ImageSlider) {
            styles = extractImageStyle(style2);
            if (Component === Image) styles.view = {alignSelf: 'flex-start', ...styles.view};
            //if (Component === FlexImage) styles.image = {flex: 1, ...styles.image};
        }
        else if (style2) {
            let view: ViewStyle, text: TextStyle, image: ImageStyle;
            ({view, text} = extractTextStyle(style2, paddingForText));
            ({view, image} = extractImageStyle(view));
            styles = {
                image,
                text,
                view,
                content: (Object.keys(image).length > 0 || Object.keys(text).length > 0)
                    && [image, text],
            };
        }
        
        if (styles.view) {
            styles.box = [styles.view, {display: 'flex'}];
            const sv = styles.view;
            if (sv.position == 'static') sv.position = 'relative';
            sv.overflow = 'hidden';
            if (typeof(sv.zIndex) == 'number' && sv.zIndex > 0) zIndex = sv.zIndex + 1;
        }

        return [styles, zIndex];
    }, [Component, style, paddingForText]);

    const isReady = !useIsProcessing();
    const [layout, setLayout] = React.useState<LayoutRectangle | null>(null);
    const onLayout = React.useCallback((ev: LayoutChangeEvent) => {
        setLayout(ev.nativeEvent.layout);
        _onLayout?.(ev);
    }, [_onLayout]);
    
    if (styles.view?.display == 'none') {
        return children; //Not visible => No need to display loading indicator
    }
    else if (isReady) {
        if (styles.view?.display != 'contents') {
            return <Component key={key} {...children.props} onLayout={onLayout} />;
        }
        return children;
    }
    else if (layout) {
        return <React.Fragment key={key}>
            <Component {...children.props} onLayout={onLayout} />
            <View
                style={[styles.box, {
                    height: layout.height,
                    left: layout.x,
                    position: 'absolute',
                    top: layout.y,
                    width: layout.width,
                    zIndex,
                }]}
            >
                <Indicator />
            </View>
        </React.Fragment>;
    }
    else if (Component === Text || Component === TextInput) {
        return <View key={key} style={styles.view}>
            <Component {...props} style={styles.text}>{childs}</Component> 
            <Indicator zIndex={zIndex} />
        </View>;
    }
    else if (Component === Image || Component === FlexImage || Component === ImageSlider) {
        return <View key={key} style={styles.view}>
            <Component {...props} style={styles.image} /> 
            <Indicator zIndex={zIndex} />
        </View>;
    }
    else if (isChildsElemet && styles.view?.display != 'contents') {
        return <View key={key} style={styles.box}>
            {childs}
            <Indicator zIndex={zIndex} />
        </View>;
    }
    //else if (childs not element || styles.view?.display == 'contents')
    else {
        if (styles.content) (props as any).style = styles.content;
        return <View key={key} style={styles.box}>
            <Component {...props}>{childs}</Component>
            <Indicator zIndex={zIndex} />
        </View>;
    }
}

//const Indicator = (props: {zIndex?: number}) => null;
const Indicator = React.memo(function Indicator({zIndex}: {zIndex?: number}) {
    const animVal = useAnimatedValue(0);
    const isDark = useIsDarkMode();

    useMount(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animVal, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: false,
                }),
                Animated.timing(animVal, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: false,
                }),
            ])
        ).start();
    });

    const gradientColors = React.useMemo(() => {
        let colorStart = '#aaa', colorEnd = '#ddd';
        if (isDark) {
            colorStart = '#555';
            colorEnd = '#222';
        }
        const color1 = animVal.interpolate({
            inputRange: [0, 1],
            outputRange: [colorStart, colorEnd],
        });

        const color2 = animVal.interpolate({
            inputRange: [0, 1],
            outputRange: [colorEnd, colorStart],
        });

        return [color1, color2] as [typeof color1, typeof color2];
    }, [isDark, animVal]); 

    return <AnimatedLinearGradient
        colors={gradientColors}
        start={gradientStart}
        end={gradientEnd}
        style={[StyleSheet.absoluteFill, {zIndex}]}
    />;
});

const gradientStart = { x: 0, y: 0.5 };
const gradientEnd = { x: 1, y: 0.5 };