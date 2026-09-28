/**
 * https://github.com/atmulyana/expressCartMobile
 */
import styles, { arrayStyle } from '@/styles';
import { View } from 'react-native';
import ContentLink from '../../ContentLink';
import Icon from '../../Icon';
import MainMenu from '../MainMenu';

export default function GenericBar() {
    return <>
        <ContentLink href='/'>
            <Icon name="home" />
        </ContentLink>

        <View style={arrayStyle('flex1', 'ml4')} />
        
        <MainMenu trigger={<Icon name="more-vertical" style={styles.ml4} />} />
    </>;
}