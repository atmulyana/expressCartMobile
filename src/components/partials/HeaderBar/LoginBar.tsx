/**
 * https://github.com/atmulyana/expressCartMobile
 */
import styles, { arrayStyle } from '@/styles';
import { View } from 'react-native';
import CartButton from '../../CartButton';
import ContentLink from '../../ContentLink';
import Icon from '../../Icon';
import MainMenu from '../MainMenu';

export default function LoginBar() {
    return <>
        <ContentLink href='/'>
            <Icon name="home" />
        </ContentLink>

        <View style={arrayStyle('flex1', 'ml4')} />
        
        <CartButton style={styles.ml4} />
        <MainMenu trigger={<Icon name="more-vertical" style={styles.ml4} />} />
    </>;
}