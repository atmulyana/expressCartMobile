/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
 import React from 'react';
 import {ActivityIndicator, StyleSheet, View} from 'react-native';
 import {WebView} from 'react-native-webview';
 import Content from './Content';
 import layoutHtml from './web/layout';
 import {LessPureComponent} from "../components";
 

 class WebContainer extends LessPureComponent {
    state = {
        isWebLoading: false,
    };

    onLoadStart = () => this.setState({isWebLoading: true});
    onLoadEnd = () => this.setState({isWebLoading: false});

    render() {
        const isLoading = this.props.isLoading || this.state.isWebLoading;
        return <>
            <WebView {...this.props} onLoadStart={this.onLoadStart} onLoadEnd={this.onLoadEnd} />
            <View style={[StyleSheet.absoluteFill, {alignItems: 'center', display: isLoading?'flex':'none'}]}>
                <ActivityIndicator animating={isLoading} size="large" color='#000' style={{top: '10%'}} />
            </View>
        </>;
    }
 }

 export default class WebPage extends Content {
    getScroller() {
        let html = '';
        if (this.data) {
            html = this.data.page?.pageContent ?? '';
            html = layoutHtml.replace('{{{page.pageContent}}}', html);
        }
        
        return {
            Scroller: WebContainer,
            props: {
                isLoading: this.state.isLoading,
                refreshControl: undefined,
                // renderLoading: () => <ActivityIndicator animating={true} size="large" color='#000' />,
                // startInLoadingState: true,
                source: {html},
            },
         };
     }
 }