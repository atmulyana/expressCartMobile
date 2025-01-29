/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import {setRef} from 'reactjs-common';
import Notification from './Notification';
import Partial from './Partial';
import ValidationContainer from './ValidationContainer';
import {lang} from '../common';

//To be applied to the Promise object returned by submitData method of Form.
//It will mute the failure because of validation so that it won't produce warning message.
//The user still gets validation messages on the invalid inputs.
Promise.prototype.valid = function(onSuccess) {
    return this.then(
        data => {
            //Problably it's a validation error object because the previous handler (this 'valid' method) didn't throw error.
            //So, always use this method in the chain of handlers of Promise returned by 'submitData' method of Form in order for
            //no mishandling
            if (isAlreadyHandledError(data)) return data;
            const ret = onSuccess(data);
            return typeof(ret) == 'undefined' ? data : ret;
        },
        err => {
            if (isAlreadyHandledError(err)) return err;
            throw err;
        }
    );
}
const isAlreadyHandledError = err => typeof(err) == 'object' && (err?.valid === false || err?.handled);

export default class Form extends Partial {
    #validation;

    constructor(props) {
        super(props);

        this.submitDataWithoutValidation = this.submitData;
        this.submitData = (url, data = {}) => {
            if (this.#validation && !this.#validation.validate()) {
                Notification.error(lang('One or more inputs are invalid'));
                return Promise.reject({valid:false});
            }
            return this.submitDataWithoutValidation(url, data)
            .then(data => {
                if (!this.#validation) return;
                const val = data.__validation__;
                if (val?.success === false) {
                    for (let name in val.inputMessages) {
                        this.#validation.setErrorMessage(name, val.inputMessages[name]);
                    }
                    if (val.message) Notification.error(val.message);
                    else Notification.error(lang('One or more inputs are invalid'));
                    throw {valid: false};
                }
                return data;
            });
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        super.componentDidUpdate(prevProps, prevState, snapshot);
        if (prevState.isLoading === true && this.state.isLoading === false) //data just (re)loaded from database
            this.#validation?.clearValidation(); //remove validation messages from the invalid edited inputs because data just refreshed from database
    }

    render() {
        //children will be contained in View prepared by Partial component
        const {children} = this.props,
              ref =  children.ref;
        return children?.type === ValidationContainer //has the only one child of type ValidationContainer
            ? {
                ...children,
                ref: comp => {
                    this.#validation = comp;
                    setRef(ref, comp);
                },
            }
            : children;
    }
}