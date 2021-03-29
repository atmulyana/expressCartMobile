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
import LoginhBar from '../components/LoginBar';
import SearchBar from '../components/SearchBar';

const headerBars = {
    account: AccountBar,
    checkout: CheckoutBar,
    login: LoginhBar,
    search: SearchBar,
};

export default props => {
    const Bar = headerBars[props.name];
    return Bar ? <Bar {...props} /> : null;
}