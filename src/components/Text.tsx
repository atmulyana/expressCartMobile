/**
 * https://github.com/atmulyana/expressCartMobile
 */
import type { ProcessProps } from '@/types';
import type { TextProps } from 'react-native';
import ProcessIndicator from './ProcessIndicator';
import TextApp from './TextApp';

export default function Text({
    children,
    loadingAware,
    submittingAware,
    ...props
}: TextProps & ProcessProps) {
    return <ProcessIndicator loadingAware={loadingAware} submittingAware={submittingAware}> 
        <TextApp {...props}>{children}</TextApp>
    </ProcessIndicator>;
}