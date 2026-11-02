/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { serverUrl } from '@/libs/server';
import type { ProcessProps, UrlPath } from '@/types';
import type { Image as ImageInstance, ImageProps } from 'react-native';
import FlexImage, { NoImage } from 'rn-flex-image';
import ProcessIndicator from './ProcessIndicator';

export const imagePlaceholder = NoImage;

export default function Image({
    loadingAware,
    notMoreLoading,
    ref,
    submittingAware,
    source,
    uri,
    ...props
}: ImageProps
& ProcessProps 
& {
    ref?: React.Ref<ImageInstance>,
    uri?: UrlPath,
}) {
    return <ProcessIndicator loadingAware={loadingAware} notMoreLoading={notMoreLoading} submittingAware={submittingAware}>
        <FlexImage
            {...props}
            ref={ref}
            source={
                uri ? {uri: serverUrl(uri)} : source
            }
        />
   </ProcessIndicator>;
} 