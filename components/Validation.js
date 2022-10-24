/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {Validation} from 'react-native-form-input-validator';
import {lang} from '../common';
import ValidatedInput from './ValidatedInput';

export default (class extends ValidatedInput {
    static displayName = "App.Validation";
    #ref = React.createRef();

    get inputRef() {
        return this.#ref.current;
    }

    render() {
        return <Validation {...this.props} ref={this.#ref} lang={lang} />;
    }
}).createProxy();