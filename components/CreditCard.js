/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {View} from 'react-native';
import Icon from './Icon';
import LessPureComponent from './LessPureComponent';
import TextInput from './TextInput';
import ValidatedInput from './ValidatedInput';
import {lang, noop} from '../common';
import styles, {gray} from '../styles';

const isNumeric = char => '0' <= char && char <= '9';
const textBaseStyle = [{borderWidth: 0, height: styles.textInputHeight.height - 2 }];


const defaultCharMap = (arChar, char) => {
    if (isNumeric(char)) arChar.push(char);
    else return false;
}

const createIdxMarks = idxs => {
    const marks = {};
    for (let idx of idxs) marks[idx] = true;
    return marks;
}

/**
 * All regular expression patterns to check which network the credit card number belongs to, is taken from javascript of js.stripe.com
 * So are the max length of number and CVC
 */
const defaultNumberSpaceIdxs = createIdxMarks([5,10,15]);
const shortNumberSpaceIdxs = createIdxMarks([5,12]);
const generalCardParams = {
    spaceIdxs: defaultNumberSpaceIdxs,
    maxLength: 19, //including spaces
    cvcMaxLength: 3,
};
const unknownCardParams = {
    spaceIdxs: defaultNumberSpaceIdxs,
    maxLength: 19, //including spaces
    cvcMaxLength: 4,
};
const cardParams = {
    visa: {
        pattern: /^4/,
        params: generalCardParams,
    },
    mastercard: {
        pattern: /^(51|52|53|54|55|22|23|24|25|26|27)/,
        params: generalCardParams,
    },
    amex: {
        pattern: /^(34|37)/,
        params: {
            spaceIdxs: shortNumberSpaceIdxs,
            maxLength: 17, //including spaces
            cvcMaxLength: 4,
        },
    },
    discover: {
        pattern: /^(60|64|65)/,
        params: generalCardParams,
    },
    diners: {
        pattern: /^(30|38|39)/,
        params: generalCardParams,
    },
    diners14: {
        pattern: /^(36)/,
        params: {
            spaceIdxs: shortNumberSpaceIdxs,
            maxLength: 16, //including spaces
            cvcMaxLength: 3,
        },
    },
    jcb: {
        pattern: /^(35)/,
        params: generalCardParams,
    },
    unionpay: {
        pattern: /^(62[0-6,8-9]|627[0-6,8-9]|6277[0-7,9]|62778[1-9]|81)/,
        params: {
            spaceIdxs: createIdxMarks([5,10,15,20]),
            maxLength: 23, //including spaces
            cvcMaxLength: 3,
        },
    },
    elo: {
        pattern: /^(5067|509|636368|627780)/,
        params: generalCardParams,
    },
};

const createNumericInput = (fnFormat = defaultCharMap, showlog=false) => {
    const vars = {
        //maxLength: 0,
        cardParams: unknownCardParams,
    };

    return class NumericTextInput extends LessPureComponent {
        state = {
            text: '',
            selection: {start: 0, end: 0},
        }

        static getDerivedStateFromProps(props, state) {
            state = super.getDerivedStateFromProps(props, state);
            if (state.text.length > props.maxLength) {
                state.text = state.text.substring(0, props.maxLength);
            }
            if (state.selection.start > props.maxLength) state.selection.start = props.maxLength;
            if (state.selection.start > state.selection.end || state.selection.end > props.maxLength) state.selection.end = state.selection.start;
                    
            return state;
        }

        __text = null;
        setState(state) {
            if (state.text !== undefined) this.__text = state.text;
            if (state.selection) {
                const props = this.props;
                if (this.__text !== null) {
                    vars.postProcess = noop;
                    //vars.maxLength = props.maxLength;
                    vars.props = props;
                    
                    let arChar = [], i = 0;
                    for (let char of this.__text) {
                        i++;
                        let validChar = fnFormat(arChar, char, this.__text.length == i, state.selection, this.state.selection.start, vars);
                        if (validChar === false) {
                            if (arChar.length < state.selection.start) {
                                state.selection.start--;
                                state.selection.end--;
                            }
                        }
                    }
                    
                    //if (vars.maxLength > 0 && arChar.length > vars.maxLength) arChar.length = vars.maxLength;
                    state.text = arChar.join('');
                    this.__text = null;
                }
                super.setState(state, () => {
                    vars.postProcess();
                    if (state.selection.start >= props.maxLength && props.onCaretAtTheEnd) props.onCaretAtTheEnd();
                });
            }
        }
    
        get value() {
            return this.state.text;
        }

        onChangeText = text => this.setState({text});
        onSelectionChange = ({nativeEvent:{selection}}) => this.setState({selection});

        render() {
            return <TextInput {...this.props}
                value={this.state.text}
                onChangeText={this.onChangeText}
                selection={this.state.selection}
                onSelectionChange={this.onSelectionChange}
                keyboardType="number-pad"
                style={textBaseStyle.concat(this.props.style)}
                maxLength={this.props.maxLength + 1}
            />;
        }
    }
}

const CardNumber = createNumericInput((arChar, char, isEndInput, selection, prevCaretPos, vars) => {
    if (arChar.length < 1) {
        vars.IIN = [];
    }
    if (vars.IIN.length < 6 && vars.cardParams == unknownCardParams && isNumeric(char)) {
        vars.IIN.push(char);
        const iin = vars.IIN.join('');
        for (let name in cardParams) {
            let card = cardParams[name];
            if (card.pattern.test(iin)) {
                vars.postProcess = () => vars.props.setLength(card.params.maxLength, card.params.cvcMaxLength);
                vars.cardParams = card.params;
                break;
            }
        }
    }
    const {spaceIdxs} = vars.cardParams;
    vars.maxLength = vars.cardParams.maxLength;

    if (isEndInput) {
        vars.cardParams = unknownCardParams; //to recheck in the next change event
    }

    if (spaceIdxs[arChar.length + 1]) { //where space separator must be placed here
        if (char == ' ') {
            arChar.push(char);
        }
        else if (isNumeric(char)) {
            arChar.push(' ')
            if (selection.start == arChar.length) selection.start++;
            arChar.push(char); 
        }
        else return false;
    }
    else if (isNumeric(char)) {
        arChar.push(char);
        if (selection.start > prevCaretPos //adds/inserts new char
            && isEndInput //at the end of input text
            && arChar.length < 19 //not reached the max length yet
            && spaceIdxs[arChar.length + 1] //space separator must be placed at the next
        ) {
            if (selection.start == arChar.length) selection.start++;
            arChar.push(' ');
        }
    }
    else {
        return false;
    }
});

const CardExpiry = createNumericInput((arChar, char, isEndInput, selection, prevCaretPos, vars) => {
    if (arChar.length == 1 && arChar[0] == '0' && char == '0') {
        return false;
    }
    else if (arChar.length == 2 && char == '/' || isNumeric(char)) {
        arChar.push(char);
    }
    else {
        return false;
    }

    const isAddNewChar = prevCaretPos < selection.start;
    if (isEndInput) {
        if (!isAddNewChar && selection.start == 1 && arChar[0] == '0') {
            arChar.length = 1;
        }
        else if (arChar[0] > '1') {
            arChar.unshift('0');
            if (isAddNewChar && selection.start == 1) selection.start = 2;
        }
        else if (arChar[0] == '1') {
            if (isAddNewChar) {
                if (arChar[1] > '2') {
                    arChar.unshift('0');
                    selection.start++;
                }
            }
            else {
                if (arChar.length > 1 && selection.start <= 1) {
                    arChar.unshift('0');
                    if (selection.start == 1) selection.start = 2;
                }
            }
        }

        if (arChar.length >= 3 && arChar[2] != '/') {
            arChar.splice(2, 0, '/');
            if (isAddNewChar && selection.start >= 3) selection.start++;
        }
        else if (arChar.length == 2 && isAddNewChar) {
            arChar.push('/');
            if (selection.start == 2) selection.start++;
        }
        else if (!isAddNewChar && arChar.length == 3 && arChar[2] == '/') {
            arChar.length = 2;
        }
    }
});

const CardCVC = createNumericInput(defaultCharMap, true);
const CardZIP = createNumericInput();

export default class CreditCard extends ValidatedInput {
    _number;
    _expired;
    _cvc;
    _zip;

    state = {
        maxLength: unknownCardParams.maxLength,
        cvcMaxLength: unknownCardParams.cvcMaxLength,
    };

    get value() {
        let exp = (this._expired?.value ?? '').split('/');
        return {
            number: this._number?.value?.replace(/\s/g, ''),
            expired: {
                month: parseInt(exp[0]) || 0,
                year: (parseInt(exp[1]) || 0) + 2000,
            },
            cvc: this._cvc?.value,
            zip: this._zip?.value,
        };
    }

    handleFocus = () => {
        this.validator?.clearValidation();
    }

    setLength = (maxLength, cvcMaxLength) => {
        const state = {};
        if (this.state.maxLength != maxLength) state.maxLength = maxLength;
        if (this.state.cvcMaxLength != cvcMaxLength) state.cvcMaxLength = cvcMaxLength;
        if (Object.keys(state).length > 0) this.setState(state);
    }

    render() {
        const oneWidth = styles.textInput.fontSize,
              errorStyle = this.state.errorStyle,
              textColorStyle = errorStyle ? {color: errorStyle.color} : null,
              flexRowStyle = {flexDirection:'row'};
        return <View style={[
            styles.box,
            this.props.style,
            flexRowStyle,
            {flexWrap:'wrap', justifyContent:'flex-end'},
            errorStyle ? {borderColor: errorStyle.borderColor} : null,
        ]}>
            <View style={[flexRowStyle, {flex:1, minWidth:190}]}>
                <Icon icon="CreditCard" height={styles.textInput.lineHeight} width={styles.textInput.lineHeight}
                    stroke={errorStyle ? errorStyle.color : gray}
                    style={{alignSelf:'center', flex:0, marginHorizontal:2}}
                />
                <CardNumber ref={comp => this._number = comp} placeholder={lang('Card number')} maxLength={this.state.maxLength}
                    style={[{flex:1}, textColorStyle]} onFocus={this.handleFocus} setLength={this.setLength} />
            </View>
            <View style={[flexRowStyle, {flex:0}]}>
                <CardExpiry ref={comp => this._expired = comp} placeholder="MM/YY" maxLength={5}
                    style={[{flex:0, width:oneWidth*4}, textColorStyle]} onFocus={this.handleFocus} />
                <CardCVC ref={comp => this._cvc = comp} placeholder="CVC" maxLength={this.state.cvcMaxLength}
                    style={[{flex:0, width:oneWidth*3}, textColorStyle]} onFocus={this.handleFocus} />
                <CardZIP ref={comp => this._zip = comp} placeholder="ZIP" maxLength={6}
                    style={[{flex:0, width:oneWidth*5}, textColorStyle]} onFocus={this.handleFocus} />
            </View>
        </View>;
    }
}