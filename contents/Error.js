/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
 import React from 'react';
 import {Text} from '../components';
 import Content from './Content';

 export default class Error extends Content {
     render() {
         return <Text center>{this.data.message}</Text>
     }
 }