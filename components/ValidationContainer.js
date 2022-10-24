/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {ValidationContext} from 'react-native-form-input-validator';
import {lang, proxyClass} from '../common';
import LessPureComponent from './LessPureComponent';

class ValidationContainer extends LessPureComponent {
    #contextRef = React.createRef();

    get contextRef() {
        return this.#contextRef.current;
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (this.state.lang != prevState.lang) //languange has just changed
    //         this.#contextRef.current?.refreshMessage();
    // }

    render() {
        return <ValidationContext ref={this.#contextRef} focusOnInvalid={true} lang={lang}>
            {this.props.children}
        </ValidationContext>
    }
}

export default proxyClass(ValidationContainer, target => target.contextRef);