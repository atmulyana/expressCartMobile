/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import LessPureComponent from './LessPureComponent';

export default class ValidatedInput extends LessPureComponent {
    state = {
        errorStyle: null,
    };

    get validator() {
        return typeof(this.props.validator) == 'function' && this.props.validator() || null;
    }

    setErrorStyle(errorStyle) {
        this.setState({errorStyle});
    }

    setValidationHandler(changeEventName, props) {
        props = props ?? {...this.props};
        let eventHandler = props[changeEventName];
        if (typeof(props.validator) == 'function') {
            props[changeEventName] = ev => {
                if (this.state.errorStyle != null) {
                    props.validator()?.clearValidation(); //dont worry about the validity of input value because it should be re-validated when re-submitted
                }
                eventHandler && eventHandler(ev);
            };
        }
        return props;
    }
}