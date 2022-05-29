/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from '../styles';
import {extractTextStyle} from '../styleProps';
import Icon from './Icon';
import LessPureComponent from './LessPureComponent';

export const durations = Object.freeze({
    short: 2000,
    long: 3500,
});
const notifications = [];
notifications.last = function() {
    return this[this.length - 1];
};

class NotificationItem extends LessPureComponent {
    #timer = null;

    #clearTimer() {
        if (this.#timer !== null) clearTimeout(this.#timer);
        this.#timer = null;
    }

    #close() {
        this.#clearTimer();
        this.props.close();
    }

    componentDidMount() {
        super.componentDidMount();
        this.#timer = setTimeout(
            () => this.#close(),
            this.props.duration
        );
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.#clearTimer();
    }

    render() {
        const props = this.props;
        const style = extractTextStyle([styles.alert, props.style]);

        return <View style={style.view}>
            <View style={{alignItems: 'center', flex: 1}}>
                <Text style={style.text}>{props.message}</Text>
            </View>
            <TouchableOpacity onPress={() => this.#close()}>
                <Icon icon="X" stroke={style.text.color} strokeWidth={2} height={16} width={16} />
            </TouchableOpacity>
        </View>;
    }
}

export default class extends LessPureComponent {
    /* state = {
        items: [],
    };

    push(message, style, duration = durations.short) {
        this.setState(state => ({items: state.items.concat({message, style, duration})}));
    }

    remove(item) {
        this.setState(state => ({items: state.items.filter(entry => entry != item)}));
    } */

    #items = [];

    push(message, style, duration = durations.short) {
        this.#items.push({message, style, duration});
        this.forceUpdate();
    }

    remove(item) {
        const idx = this.#items.indexOf(item);
        if (idx > -1) {
            this.#items[idx] = null;
            if (!this.#items.some(elm => elm != null)) this.#items.length = 0;
            this.forceUpdate();
        }
    }

    static durations = durations;

    static success(message) {
        notifications.last()?.push(message, styles.alertSuccess);
    }

    static warning(message) {
        notifications.last()?.push(message, styles.alertWarning);
    }

    static error(message) {
        notifications.last()?.push(message, styles.alertDanger, durations.long);
    }

    static errorHandler(err) {
        if (typeof(err) != 'object') {
            if (err !== undefined) throw err;
            return;
        }

        /** `handled` property is primaryly used by error handler of `callServer`
         ** `valid` property is issued by `Form` component as the result of input validation */
        if (!err || !err.data || err.valid === false || err.handled) return;
        if (err.status == 400) {
            if (typeof(err.data) == 'object' && typeof(err.data?.message || err.data?.error || err.data?.err) == 'string') {
                err.handled = true;
                this.error(err.data.message || err.data.error || err.data.err);
            }
            else if (Array.isArray(err.data) && typeof(err.data[0]) == 'object' && err.data[0]?.message) {
                err.handled = true;
                this.error(err.data[0].message);
            }
        }
    }

    componentDidMount() {
        super.componentDidMount();
        notifications.push(this);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        const idx = notifications.indexOf(this);
        if (idx > -1) notifications.splice(idx, 1); 
    }

    render = () => this.#items.length
        ? <View style={styles.alertContainer}>
            {this.#items.map((item, idx) => item && <NotificationItem key={idx} {...item} close={() => this.remove(item)} />)}
          </View>
        
        : null;
}
