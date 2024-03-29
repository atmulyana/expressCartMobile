/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {appHelpers, currentLanguage} from '../common';

export default class LessPureComponent extends React.Component /*React.PureComponent*/ {
    state = {};

    static getDerivedStateFromProps(props, state) {
        state = {...state};
        state.lang = currentLanguage(); //To update all texts if the language changes
        state.isLoggedIn = appHelpers.isLoggedIn; //To update display if it has different view between the status when logged in/out
        return state;
    }
    
    #isMounted = false;
    get isMounted() {
        return this.#isMounted;
    }

    componentDidMount() {
        this.#isMounted = true;
    }

    componentWillUnmount() {
        this.#isMounted = false;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    setState(state, callback) {
        if (this.#isMounted) super.setState(state, callback); //Securing for async process
    }
}