/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
/****** === NOTE ===
 * To use payment via Adyen, you must add a configuration to the server application: add new line into 'config/payment/config/adyen.json' as follow
 * 
 *     "clientKey": "<Client Encryption Public Key>"
 * 
 * Change '<Client Encryption Public Key>' with your own public key which you can get from menu 'Developers > API credentials' in your Adyen account.
 * Also, add into 'config/payment/schema/adyen.json', under "properties" as follow
 * 
 *      "clientKey": {
 *          "type": "string"
 *      },
 * 
 * and also optionally add a new item, that is "clientKey", into array "required"
 */
import React from 'react';
import {Buffer} from "buffer";
import JsSimpleDateFormat from 'jssimpledateformat';
import {RSAKey} from 'jsbn-rsa';
import sjcl from 'sjcl';
/**** sjcl.codec.bytes was not bundled ****/
sjcl.codec.bytes = {
    /** Convert from a bitArray to an array of bytes. */
    fromBits: function (arr) {
        var out = [], bl = sjcl.bitArray.bitLength(arr), i, tmp;
        for (i=0; i<bl/8; i++) {
            if ((i&3) === 0) {
                tmp = arr[i/4];
            }
            out.push(tmp >>> 24);
            tmp <<= 8;
        }
        return out;
    },
};
import PaymentComponent from './PaymentComponent';
import routes from '../../routes';
import {Button, CreditCard, Notification, Text, Validation} from '../../../components';
import {appHelpers, lang} from '../../../common';
import styles from '../../../styles';
import {rule} from '../../../validations';

const ENCRYPT_DATE_FORMATTER = new JsSimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
const ENCRYPT_PREFIX = 'adyenjs_';
const ENCRYPT_VERSION = '0_1_25';
const ENCRYPT_SEPARATOR = '$';
const EncryptedFields = {
    number: 'encryptedCardNumber',
    expiryMonth: 'encryptedExpiryMonth',
    expiryYear: 'encryptedExpiryYear',
    cvc: 'encryptedSecurityCode',
} 


{
    let seedIdx = 1024/8, seed = Buffer.alloc(seedIdx);
    for (seedIdx -= 1; seedIdx >= 0; seedIdx--)
        //We use the simple Math.random for seeding the random because the package that can generates strong random needs more complex installation.
        //The data should have been secured by https.
        seed[seedIdx] = Math.floor(Math.random() * 256) | 0;
    seed = new Uint32Array(new Uint8Array(seed).buffer);
    sjcl.random.addEntropy(seed, 1024, "crypto.randomBytes");
}
/****
 * The encryption below follows how Adyen does encryption. It can be found in the source code at:
 * 
 *      https://test.adyen.com/hpp/cse/js/<PublicKeyToken>.shtml
 * 
 * Java/kotlin version can be found at:
 *      
 *      https://github.com/Adyen/adyen-android
 */
class Encryption {
    #rsa;
    #aesKey;
    #data
    
    constructor(rsa, data) {
        this.#rsa = rsa;
        this.#aesKey = sjcl.random.randomWords(8, 6);
        this.#data = data;
    }

    static createRsa(publicKey) {
        const [exponent, modulus] = (publicKey+'').split('|', 2);
        let rsa = new RSAKey();
		rsa.setPublic(modulus, exponent);
		return rsa;
    }

    #encryptData() {
        let data = this.#data,
            iv = sjcl.random.randomWords(3, 6),
            now = new Date(),
            nowUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
        data.generationtime = ENCRYPT_DATE_FORMATTER.format(nowUTC);
        
        const aes = new sjcl.cipher.aes(this.#aesKey),
			  dataBits = sjcl.codec.utf8String.toBits(JSON.stringify(data)),
			  encryptedData = sjcl.mode.ccm.encrypt(aes, dataBits, iv);
			
        return sjcl.codec.base64.fromBits( sjcl.bitArray.concat(iv, encryptedData) );
    }

    #encryptKey() {
        /**** encrypt_b64 is not defined (commented in the code);
         **** Meanwhile, we replace pkcs1pad2 function with the same function from Adyen source  ****/
        let keybytes = sjcl.codec.bytes.fromBits(this.#aesKey),
            encrypted = this.#rsa.encrypt(keybytes);
        // return this.#rsa.encrypt_b64(keybytes);
        return Buffer.from(encrypted, 'hex').toString('base64');
    }

    encrypt() {
        const encryptedData = this.#encryptData(),
              encryptedKey = this.#encryptKey();
        return `${ENCRYPT_PREFIX}${ENCRYPT_VERSION}${ENCRYPT_SEPARATOR}${encryptedKey}${ENCRYPT_SEPARATOR}${encryptedData}`;
    }
}


export default class Adyen extends PaymentComponent {
    state = {
        holderNameVisible: null
    };

    // componentDidMount() {
    //     super.componentDidMount();
    //     if (typeof(this.state.holderNameVisible) != 'boolean') {
    //         this.props.pageSubmit('/adyen/setup')
    //         .then(data => {
    //             let holderField = data.paymentMethods.find(item => item.name == 'Credit Card')?.details.find(item => item.key == 'holderName');
    //             this.setState({holderNameVisible: holderField && !holderField.optional});
    //         });
    //     }
    // }

    render() {
        const {paymentConfig, pageSubmit} = this.props;
        let cc = null, ccValidator, ccErrMessage;
        return <>
            <Text para4>{paymentConfig.adyen.description}</Text>
            {/* {typeof(this.state.holderNameVisible) == 'boolean' &&
                <CreditCard ref={comp => cc = comp} showCardHolder={this.state.holderNameVisible} style={styles.para4} validator={() => ccValidator} />} */}
            <CreditCard ref={comp => cc = comp} style={styles.para4} validator={() => ccValidator} />
            <Validation ref={comp => ccValidator = comp}
                input={() => cc}
                rule={rule(() => {
                    if (!cc?.isValid) return false;
                    if (!ccErrMessage) return true;
                    return ccErrMessage;
                })}
            />
            <Button style={[styles.buttonOutlineSuccess, {alignSelf:'flex-start'}]} pressedStyle={styles.buttonOutlineSuccessPressed}
                title={lang('Process Payment')}
                onPress={() => {
                    ccErrMessage = null;
                    if (!ccValidator?.validate()) return;

                    let rsa;
                    try {
                        rsa = Encryption.createRsa(paymentConfig.adyen.clientKey);
                    }
                    catch {
                        Notification.error(lang('Wrong public key'));
                        return;
                    }
                    
                    const ccData = cc.value;
                    const payment = {
                        type: 'scheme',
                        [EncryptedFields.number]: new Encryption(rsa, {number: ccData.number}).encrypt(),
                        [EncryptedFields.expiryMonth]: new Encryption(rsa, {expiryMonth: ccData.expired.month}).encrypt(),
                        [EncryptedFields.expiryYear]: new Encryption(rsa, {
                            expiryYear: ccData.expired.year < 100 ? ccData.expired.year + 2000 : ccData.expired.year
                        }).encrypt(),
                        [EncryptedFields.cvc]: new Encryption(rsa, {expiryYear: ccData.cvc}).encrypt(),
                    };
                    
                    pageSubmit(
                        `/adyen/checkout_action`, 
                        {payment: JSON.stringify(payment)},
                    )
                    .then(data => {
                        appHelpers.replaceContent(routes.payment(data.paymentId));
                    })
                    .catch(err => {
                        Notification.error(lang('Failed to complete transaction'));
                        err.handled = true;
                    });
                }}
            />
        </>;
    }
}