/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import AccountBar from './AccountBar';
import CheckoutBar from './CheckoutBar';
import LessPureComponent from './LessPureComponent';
import LoginhBar from './LoginBar';
import SearchBar from './SearchBar';

const headerBars = {
    account: AccountBar,
    checkout: CheckoutBar,
    login: LoginhBar,
    search: SearchBar,
};

export default class extends LessPureComponent {
    render() {
        const props = this.props;
        const Bar = headerBars[props.name];
        return Bar ? <Bar {...props} /> : null;
    }
}