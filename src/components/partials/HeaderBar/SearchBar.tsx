/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useLang, useNavHelpers, usePathname } from '@/hooks';
import styles, { arrayStyle } from '@/styles';
import { emptyString } from 'javascript-common';
import React, { useEffectEvent } from 'react';
import { Platform } from 'react-native';
import CartButton from '../../CartButton';
import ContentLink from '../../ContentLink';
import Icon from '../../Icon';
import SearchTextInput from '../../SearchTextInput';
import AccountMenu from '../AccountMenu';
import MainMenu from '../MainMenu';

export default function SearchBar() {
    const lang = useLang();
    const nav = useNavHelpers();
    const path = usePathname();
    const [searchText, setSearchText] = React.useState(emptyString);
    
    const prefix = '/search/';
    const isSearching = path.startsWith(prefix);
    
    const onChangePath = useEffectEvent(() => {
        if (isSearching) {
            setSearchText( decodeURIComponent( path.substring(prefix.length).replace(/\+/g, ' ') ) );
        }
        else {
            setSearchText(emptyString);
        }
    });
    React.useEffect(() => {
        onChangePath();
    }, [path]);

    return <>
        <ContentLink href='/' style={isSearching ? styles.hidden : null}>
            <Icon name="home" />
        </ContentLink>
        <ContentLink href='/' style={isSearching ? null : styles.hidden}>
            <Icon name="arrow-left" />
        </ContentLink>

        <SearchTextInput
            autoComplete="off"
            autoCorrect={false}
            keyboardType={Platform.OS == 'android' ? "visible-password" : "default"}
            onChangeText={value => setSearchText(value)}
            onSubmitEditing={() => {
                const text = searchText.trim();
                if (text)
                    nav.goto(`/search/${encodeURIComponent(text)}`);
                else
                    nav.goHome();
            }}
            placeholder={lang("Search shop")}
            returnKeyType="search"
            spellCheck={false}
            style={arrayStyle('flex1', 'ml4')}
            underlineColorAndroid="transparent"
            value={searchText}
        />
        
        <AccountMenu style={styles.ml4} />
        <CartButton style={styles.ml4} />
        <MainMenu trigger={<Icon name="more-vertical" style={styles.ml4} />} />
    </>;
}