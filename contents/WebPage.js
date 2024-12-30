/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
 import React from 'react';
 import RenderHtml from '@builder.io/react-native-render-html';
 import Content from './Content';
 import {contentWidth, emptyString} from '../common';

 export default class WebPage extends Content {
    render() {
        const html = this.data?.page?.pageContent ?? emptyString;
        if (html) {
            return <RenderHtml source={{html}} contentWidth={contentWidth()} />;
        }
        return null;
    }
 }