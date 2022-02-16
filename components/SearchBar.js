/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {Platform, View} from 'react-native';

import {appHelpers, lang} from '../common';
import styles from '../styles';
import {home, search} from '../contents/routes';
import AccountMenu from './AccountMenu';
import CartButton from './CartButton';
import ContentLink from './ContentLink';
import Icon from './Icon';
import LessPureComponent from './LessPureComponent';
import MainMenu from './MainMenu';
import SearchText from './SearchText';


function getSearchTextFromUrl() {
    const url = appHelpers.currentRoute?.params?.url ?? '',
          prefix = '/search/';
    if (url.startsWith(prefix)) {
        return decodeURIComponent( url.substring(prefix.length).replace(/\+/g, ' ') );
    }
    return '';
}

export default class SearchBar extends LessPureComponent {
    state = {
        searchText: '',
    }

    constructor(props) {
        super(props);
        this.state.searchText = getSearchTextFromUrl();
    }

    get searchText() {
        return this.state.searchText;
    }

    set searchText(value) {
        this.setState({searchText: value});
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.flag != nextProps.flag) nextState.searchText = getSearchTextFromUrl();
        return super.shouldComponentUpdate(nextProps, nextState);
    }

    render() {
        let isSearching = this.state.searchText?.trim();
        let txtSearch = null;
        return (
            <View style={styles.stickyBar}>
                <ContentLink route={home} style={{display: isSearching ? 'none' : 'flex'}}>
                    <Icon icon="Home" />
                </ContentLink>
                <ContentLink route={home}
                             onPress={() => {
                                 this.setState({searchText:''});
                                 txtSearch?.blur();
                             }}
                             style={[styles.ml4, {display: isSearching ? 'flex' : 'none'}]}>
                    <Icon icon="ArrowLeft" />
                </ContentLink>

                <SearchText ref={inp => txtSearch = inp} style={[styles.searchText, styles.ml4]}
                    placeholder={lang("Search shop")} underlineColorAndroid="transparent"
                    returnKeyType="search" keyboardType={Platform.OS == 'android' ? "visible-password" : "default"}
                    autoCorrect={false} spellCheck={false} autoCompleteType="off"
                    value={this.state.searchText} onChangeText={value => this.setState({searchText: value})}
                    onSubmitEditing={() => {
                        if (isSearching) 
                            appHelpers.loadContent(search(encodeURIComponent(this.state.searchText)));
                        else
                            appHelpers.goHome();
                    }}
                />
                
                <AccountMenu style={styles.ml4} />
                <CartButton style={styles.ml4} />
                <MainMenu trigger={<Icon icon="MoreVertical" style={styles.ml4} />} />
            </View>
        );
    }
}