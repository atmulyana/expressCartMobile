/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {Image, ScrollView, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
const validator = require("card-validator");
import Icon from './Icon';
import LessPureComponent from './LessPureComponent';
import TextInput from './TextInput';
import ValidatedInput from './ValidatedInput';
import {lang, noop} from '../common';
import styles from '../styles';

const ARROW_COLOR = '#ddd';
const ARROW_WIDTH = 16;
const ARROW_THICK = 4;
const ICON_WIDTH = 32;

const icons = {
    'american-express': require('../images/cards/amex.png'),
    'diners-club': require('../images/cards/diners.png'),
    discover: require('../images/cards/discover.png'),
    jcb: require('../images/cards/jcb.png'),
    maestro: require('../images/cards/maestro.png'),
    'master-card': require('../images/cards/mastercard.png'),
    mastercard: require('../images/cards/mastercard.png'),
    rupay: require('../images/cards/rupay.png'),
    unionpay: require('../images/cards/unionpay.png'),
    unknown: require('../images/cards/unknown.png'),
    visa: require('../images/cards/visa.png'),
}
const textBaseStyle = [{borderWidth: 0, height: styles.textInputHeight.height - 2 }];
const unknownCard = {
    niceType: 'Unknown',
    type: 'unknown',
    gaps: [4, 8, 12],
    lengths: [16],
    code: {name: 'CVC', size: 3},
};


const justNumbers = s => s.replace(/\D/g,'');

const createInput = (field, fnFormat = justNumbers) => {
    return class _TextInput extends LessPureComponent {
        static propTypes = {
            nextInput: PropTypes.func,
            onValidate: PropTypes.func,
            prevInput: PropTypes.func,
        };
        static defaultProps = {
            nextInput: noop,
            onValidate: noop,
            prevInput: noop,
        };
        
        #input;
        #prevTextLength = 0;
        #validatorParams = [];
        #validity;

        state = {
            text: '',
        }

        get isValid() {
            return this.#validity?.isValid;
        }

        get validatorParams() {
            return this.#validatorParams;
        }
        set validatorParams(val) {
            this.#validatorParams = Array.isArray(val) ? val : [val];
        }

        get validity() {
            return this.#validity;
        }

        get value() {
            return this.state.text;
        }

        
        blur() {
            this.#input?.blur();
        }

        focus() {
            this.#input?.focus();
        }

        nextFocus() {
            this.props.nextInput()?.focus();
        }

        onChangeText = text => {
            let isNotValidated = true;
            const validate = () => {
                this.#validity = validator[field](text, ...this.validatorParams);
                isNotValidated = false;
                return this.#validity;
            };
            text = fnFormat(text, validate);
            if (isNotValidated) validate();
            this.#prevTextLength = this.state.text.length;
            this.setState({text});
            this.props.onValidate(this.#validity);
        }

        onKeyPress = ({ nativeEvent: { key} }) => {
            if (this.state.text == "" && key == 'Backspace') this.prevFocus();
        }

        onSelectionChange = ({ nativeEvent: { selection: { start:pos } } }) => {
            let endPos = this.props.maxLength,
                endPos2 = this.value.length;
            if (this.#prevTextLength < endPos2 && pos == endPos && endPos == endPos2) this.nextFocus();
            else if (this.isValid && this.#prevTextLength < endPos2 && pos == endPos2) this.nextFocus();
        }

        prevFocus() {
            this.props.prevInput()?.focus();
        }

        render() {
            return <TextInput
                keyboardType="number-pad"
                {...this.props}
                onChangeText={this.onChangeText}
                onKeyPress={this.onKeyPress}
                onSelectionChange={this.onSelectionChange}
                ref={inp => this.#input = inp}
                style={textBaseStyle.concat(this.props.style)}
                value={this.state.text}
            />;
        }
    }
}

const CardNumber = createInput('number', (text, validate) => {
    const card = validate()?.card ?? unknownCard;
    text = justNumbers(text);
    let subNumbers = [], i = 0;
    for (let j of card.gaps) {
        subNumbers.push(text.substring(i, j));
        i = j;
        if (i >= text.length) break;
    }
    if (i < text.length) subNumbers.push(text.substr(i));
    return subNumbers.join(' ');
});

const CardExpiry = createInput('expirationDate', text => {
    text = justNumbers(text).replace(/^0+/, '0');
    if (text[0] > '1' || text[0] == '1' && text[1] > '2') text = '0' + text;
    text = text.substr(0, 4);
    if (text.length > 2) return `${text.substr(0, 2)}/${text.substr(2)}`;
    return text;
});

const CardCVC = createInput('cvv');
const CardHolder = createInput('cardholderName', s => s);
const CardZIP = createInput('postalCode');

export default class CreditCard extends ValidatedInput {
    static propTypes = {
        showCardHolder: PropTypes.bool,
        showPostalCode: PropTypes.bool,
    };
    static defaultProps = {
        showCardHolder: false,
        showPostalCode: false,
    };

    constructor(props) {
        super(props);
        Object.assign(this.state, {
            card: unknownCard,
            scrollStat: -1, //-1: at the beginning, 0: at the middle, 1: at the end
        });
    }

    #number;
    #expired;
    #cvc;
    #cardHolder;
    #zip;

    #scroller;
    #scrollPos = 0;
    #scrollStep = 0;
    
    get isValid() {
        return this.#number?.isValid
            && this.#expired?.isValid
            && this.#cvc?.isValid
            && (!this.props.showCardHolder || this.#cardHolder?.isValid)
            && (!this.#zip?.value || this.#zip?.isValid); 
    }

    get value() {
        return {
            number: this.#number?.value?.replace(/\s/g, ''),
            expired: {
                month: parseInt(this.#expired?.validity?.month) || 0,
                year: parseInt(this.#expired?.validity?.year) || 0,
            },
            cvc: this.#cvc?.value,
            cardHolder: this.#cardHolder?.value,
            zip: this.#zip?.value,
        };
    }

    handleCardValidation = validity => {
        let card = validity.card ?? unknownCard;
        if (this.#cvc) this.#cvc.validatorParams = card.code.size;
        this.setState({card});
    }

    handleFocus = () => {
        this.validator?.clearValidation();
    }

    scroll = dir => {
        //Blur all inputs because if an input having focus will disappear because of scrolling then it will resist the scrolling
        this.#number.blur();
        this.#expired.blur();
        this.#cvc.blur();
        this.#cardHolder?.blur();
        this.#zip?.blur();
        this.#scroller.scrollTo({x: this.#scrollPos + dir * this.#scrollStep});
    }

    render() {
        const {card, errorStyle, scrollStat} = this.state;
        const icon = icons[card.type] ?? icons[unknownCard.type];
        //if (!icons[card.type]) console.log(card.type);
        const oneWidth = styles.textInput.fontSize,
              iconStyle = {flex:0, height:textBaseStyle[0].height},
              arrowStyle = {backgroundColor: styles.box.borderColor, color: ARROW_COLOR, height: '100%', width: ARROW_WIDTH},
              inputStyle = (isValid, widthUnits) => [
                {flex:0, width: oneWidth * widthUnits},
                isValid || !errorStyle ? null : {color: errorStyle.color}
              ],
              placeholderTextColor = isValid => isValid ? styles.gray : errorStyle?.color ?? styles.gray;
        return <View style={[
            styles.box,
            this.props.style,
            {alignItems:'center', flexDirection:'row'},
            errorStyle ? {borderColor: errorStyle.borderColor} : null,
        ]}>
            <Image
                source={icon}
                style={[iconStyle, {resizeMode:'contain', width:ICON_WIDTH}]}
            />
            <TouchableOpacity 
                onPress={() => this.scroll(-1)}
                style={[iconStyle, {display: scrollStat == -1 ? 'none' : 'flex'}]}
            >
                <Icon
                    icon="ChevronLeft"
                    strokeWidth={ARROW_THICK}
                    style={arrowStyle}
                />
            </TouchableOpacity>
            <ScrollView
                horizontal={true}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="never"
                ref={comp => this.#scroller = comp}
                scrollEnabled={true}
                scrollEventThrottle={1}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={{flex:1}}
                onLayout={({nativeEvent: {layout: {width}}}) => {
                    this.#scrollStep = Math.round(width / 2);
                }}
                onScroll={({nativeEvent: {layoutMeasurement, contentOffset, contentSize}}) => {
                    this.#scrollPos = contentOffset.x;
                    let scrollStat = 0;
                    if (contentOffset.x <= 0) scrollStat = -1;
                    else if (layoutMeasurement.width + contentOffset.x >= contentSize.width) scrollStat = 1;
                    this.setState({scrollStat});
                }}
            >
                <CardNumber
                    maxLength={card.lengths[card.lengths.length - 1] + card.gaps.length}
                    nextInput={() => this.#expired}
                    onFocus={this.handleFocus}
                    onValidate={this.handleCardValidation}
                    placeholder={lang('Card number')}
                    placeholderTextColor={placeholderTextColor(this.#number?.isValid)}
                    ref={comp => this.#number = comp}
                    style={inputStyle(this.#number?.isValid, 16)}
                />
                <CardExpiry
                    maxLength={5}
                    nextInput={() => this.#cvc}
                    onFocus={this.handleFocus}
                    placeholder="MM/YY"
                    placeholderTextColor={placeholderTextColor(this.#expired?.isValid)}
                    prevInput={() => this.#number}
                    ref={comp => this.#expired = comp}
                    style={inputStyle(this.#expired?.isValid, 4)}
                />
                <CardCVC
                    maxLength={card.code.size}
                    nextInput={() => this.#cardHolder ?? this.#zip}
                    onFocus={this.handleFocus}
                    placeholder={card.code.name}
                    placeholderTextColor={placeholderTextColor(this.#cvc?.isValid)}
                    prevInput={() => this.#expired}
                    ref={comp => this.#cvc = comp}
                    style={inputStyle(this.#cvc?.isValid, 3)}
                />
                {this.props.showCardHolder && <CardHolder
                    keyboardType="default"
                    maxLength={255}
                    nextInput={() => this.#zip}
                    onFocus={this.handleFocus}
                    placeholder={lang("Card holder name")}
                    placeholderTextColor={placeholderTextColor(this.#cardHolder?.isValid)}
                    prevInput={() => this.#cvc}
                    ref={comp => this.#cardHolder = comp}
                    style={inputStyle(this.#cardHolder?.isValid, 20)}
                />}
                {this.props.showPostalCode && <CardZIP
                    maxLength={6}
                    onFocus={this.handleFocus}
                    placeholder={lang("Postal code")}
                    placeholderTextColor={placeholderTextColor(!this.#zip?.value || this.#zip?.isValid)}
                    prevInput={() => this.#cardHolder ?? this.#cvc}
                    ref={comp => this.#zip = comp}
                    style={inputStyle(this.#zip?.isValid, 6)}
                />}
            </ScrollView>
            <TouchableOpacity 
                onPress={() => this.scroll(1)}
                style={[iconStyle, {display: scrollStat == 1 ? 'none' : 'flex'}]}
            >
                <Icon
                    icon="ChevronRight"
                    strokeWidth={ARROW_THICK}
                    style={arrowStyle}
                />
            </TouchableOpacity>
        </View>;
    }
}