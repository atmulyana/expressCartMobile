/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {ScrollView, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import PropTypes from 'prop-types';
import Image from './Image';
import LessPureComponent from './LessPureComponent';
import {extractImageStyle} from '../styleProps';

export default class ImageSlider extends LessPureComponent {
    static propTypes = {
        imageStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        uris: PropTypes.arrayOf(PropTypes.string),
    }

    state = {
        selectedIndex: 0,
    };
    #scrollRef = React.createRef();

    onScroll({nativeEvent: {contentOffset: {x}}}) {
        const pagingSize = this.imageWidth + margin;
        this.setState({selectedIndex: Math.round(x / pagingSize)});
    }

    setIndex(idx) {
        this.#scrollRef.current?.scrollTo({
            x: idx * (this.imageWidth + margin),
            y: 0,
            animated: true,
        });
        this.setState({selectedIndex: idx});
    }

    render() {
        let {uris, imageStyle} = this.props,
            style = extractImageStyle(imageStyle),
            imageWidth = style.view.width;
        this.imageWidth = imageWidth;
        if (typeof(imageWidth) != 'number') throw new Error("`imageStyle.width` must be set as number");
        if (!Array.isArray(uris) || uris.length < 1) uris = [null];
        
        return <View style={style.view}> 
            <ScrollView
                bounces={false}
                contentContainerStyle={[styles.images, {width: uris.length * imageWidth + margin * (uris.length - 1)}]}
                horizontal
                onMomentumScrollEnd={ev => this.onScroll(ev)}
                ref={this.#scrollRef}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                snapToInterval={imageWidth + margin}
            >
                {uris.map(uri => <Image key={uri} uri={uri} style={imageStyle} />)}
            </ScrollView>
            {uris.length > 1 &&
                <Paging
                    count={uris.length}
                    setIndex={idx => this.setIndex(idx)}
                    selectedIndex={this.state.selectedIndex}
                />
            }
        </View>;
    }
}

const Paging = ({count, setIndex, selectedIndex}) => <View style={styles.paging}>
    {new Array(count).fill(null).map((_, i) => 
        <TouchableWithoutFeedback
            key={i}
            onPress={() => setIndex(i)}
        >
            <View style={[
                styles.dot,
                i == selectedIndex ? {opacity: 0.5} : null
            ]} />
        </TouchableWithoutFeedback>
    )}
</View>;

const styles = StyleSheet.create({
    dot: {
        backgroundColor: 'black',
        borderRadius: 5,
        height: 10,
        marginHorizontal: 5,
        opacity: 0.25,
        width: 10,
    },
    images: {
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    paging: {
        alignItems: 'flex-start',
        bottom: 0,
        flexDirection: 'row',
        height: 15,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
    },
});
const margin = 10;