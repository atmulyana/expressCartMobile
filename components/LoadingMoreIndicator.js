/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {/*ViewPropTypes,*/ TextPropTypes} from 'deprecated-react-native-prop-types';
import LessPureComponent from './LessPureComponent';
import PropTypes from 'prop-types';


export default class LoadingMoreIndicator extends LessPureComponent {
    static propTypes = {
        dotsCount: PropTypes.number,
        opacityScale: PropTypes.number,
        gradationTiming: PropTypes.number,
        posAmp: PropTypes.number,
        bouncingTiming: PropTypes.number,
        seqDelay: PropTypes.number,
        style: /*ViewPropTypes.style*/TextPropTypes.style,
    };

    static defaultProps = {
        dotsCount: 3,
        opacityScale: 0,
        gradationTiming: 300,
        posAmp: 2,
        bouncingTiming: 300,
        seqDelay:200,
        style: {
            backgroundColor: '#aaa',
            borderRadius: 4,
            borderStyle: 'solid',
            borderWidth: 1,
            height: 8,
            marginHorizontal: 2,
            width: 8,
        }
    };

    constructor(props) {
        super(props);
        
        const def = LoadingMoreIndicator.defaultProps;
        let count, opacityScale, posAmp, containerHeight, dotProps;

        const calculate = props => {
            count = props.dotsCount < 1 ? def.dotsCount : props.dotsCount;
            opacityScale = props.opacityScale < 0 ? 0 :
                           props.opacityScale > 1 ? 1 :
                           props.opacityScale;
            posAmp = Math.floor(Math.abs(props.posAmp));
            containerHeight = (props.style?.height ?? def.style.height) + 2 * posAmp;
            
            dotProps = [];
            for (let i = 0, pos = posAmp; i < count; i++) {
                dotProps.push({
                    opacity: new Animated.Value(opacityScale),
                    pos: new Animated.Value(pos),
                });
                pos = -pos;
            }
        }
        calculate(props);

        Object.defineProperty(this, 'containerHeight', {
            configurable: false,
            get() { return containerHeight; },
        });
        
        Object.defineProperty(this, 'dots', {
            configurable: false,
            get() { 
                let borderColor = this.props.style?.borderColor
                    ?? this.props.style?.backgroundColor
                    ?? this.props.style?.color
                    ?? def.backgroundColor;
                let backgroundColor = this.props.style?.backgroundColor
                    ?? this.props.style?.color
                    ?? def.backgroundColor;
                return dotProps.map((dp, idx) => <Animated.View key={idx}
                    style={[
                        def.style,
                        this.props.style,
                        {
                            backgroundColor,
                            borderColor,
                            position: 'relative',
                            top: dp.pos,
                            opacity: dp.opacity,
                        }
                    ]}
                />);
            },
        });
        
        
        let animTimer = false;
        const animate = dotIdx => {
            if (animTimer === null) return;
            
            if (dotIdx >= dotProps.length || dotIdx < 0) dotIdx = 0;
            const opacity = dotProps[dotIdx].opacity;
            const pos = dotProps[dotIdx].pos;
            
            Animated.timing(opacity, {
                toValue: opacity.__getValue() < 1 ? 1 : opacityScale,
                duration: this.props.gradationTiming,
                useNativeDriver: false,
            }).start();

            Animated.timing(pos, {
                toValue: pos.__getValue() < 0 ? posAmp : -posAmp,
                duration: this.props.bouncingTiming,
                useNativeDriver: false,
            }).start();

            animTimer = setTimeout(() => animate(++dotIdx), this.props.seqDelay);
        };

        const startAnimation = () => {
            animTimer = false;
            animate(0);
        }

        const stopAnimation = () => {
            if (animTimer !== null && animTimer !== false) clearTimeout(animTimer);
            animTimer = null;
        };

        this.componentDidMount = () => {
            startAnimation();
        };

        this.componentWillUnmount = () => {
            stopAnimation();
        };

        this.shouldComponentUpdate = (nextProps, nextState) => {
            const shouldUpdate = super.shouldComponentUpdate(nextProps, nextState);
            if (shouldUpdate) {
                stopAnimation();
                calculate(nextProps);
            }
            return shouldUpdate;
        };

        this.componentDidUpdate = () => {
            startAnimation();
        };
    }

    render() {
        return <View style={[styles.container, {height: this.containerHeight}]}>
            {this.dots}
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',        
    }
});