/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 * 
 * To make 'style' writing shorter and handle validation
 */
import {TextInput} from 'react-native';
import PropTypes from 'prop-types';
import ValidatedInput from './ValidatedInput';
import {shallowCompareExclude} from '../common';
import styles from '../styles';

const propStyles = {
    editable: 'textInputDisabled',
    fixHeight: 'textInputHeight',
    multiline: 'textArea',
    para4: 'para4',
    para8: 'para8',
    p8: 'p8',
    ph8: 'ph8',
    ml4: 'ml4',
    mr4: 'mr4',
    m8: 'm8',
};

export default (class extends ValidatedInput {
    static displayName = "App.TextInput";
    static propTypes = {
        ...TextInput.propTypes,
        ...Object.fromEntries( Object.keys(propStyles).map(key => [ key, PropTypes.bool ]) ),
    };
    static defaultProps = {
        ...TextInput.defaultProps,
    };
    
    constructor(props) {
        super(props, TextInput);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompareExclude(this, nextProps, nextState, 'validation', 'onChangeText');
    }

    render() {
        const props = this.props;
        let style = [styles.textInput];
        for (let key in propStyles) if (props[key]) style.push( styles[ propStyles[key] ] );
        style = style.concat(props.style);
        return this.inputElement({...props, style});
    }
}).createProxy();