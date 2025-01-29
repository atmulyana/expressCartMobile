/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {setStatusStyleDefault, withValidation} from 'react-native-form-input-validator';
import {ValidationRule} from 'react-native-form-input-validator/rules';
import {lang, proxyClass} from '../common';
import LessPureComponent from './LessPureComponent';

export default class ValidatedInput extends LessPureComponent {
    static createProxy() {
        return proxyClass(this, target => target.inputRef, true);
    };

    static defaultCreateOption = rules => ({
        lang,
        rules,
        setStatusStyle: setStatusStyleDefault,
    });

    constructor(props, InputComponent, createOption = ValidatedInput.defaultCreateOption) {
        super(props)
        if (InputComponent) {
            const {name, validation} = this.props;
            if (Array.isArray(validation) || (validation instanceof ValidationRule)) {
                const opt = createOption(validation);
                if (name) opt.name = name;
                this.#element = withValidation(InputComponent, opt);
            }
            else {
                this.#element = InputComponent;
            }
        }
    }

    #element;
    #inputRef = React.createRef();
    get inputRef() {
        return this.#inputRef.current;
    }

    inputElement(props) {
        const Element = this.#element;
        return <Element {...(props ?? this.props)} ref={this.#inputRef} />;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            this.state.lang != prevState.lang //languange has just changed
            && typeof(this.inputRef?.validate) == 'function' //withValidation
            && !this.inputRef.isValid //showing validation error message
        )
            this.inputRef.validate(); //refresh the message (change the language)
    }
}