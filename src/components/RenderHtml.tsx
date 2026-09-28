/**
 * https://github.com/atmulyana/expressCartMobile
 */

import { useContentWidth, useStyles } from '@/hooks';
import type { ProcessProps } from '@/types';
import RNRenderHtml from '@builder.io/react-native-render-html';
import React from 'react';
import ProcessIndicator from './ProcessIndicator';

const RenderHtml = React.memo(function RenderHtml({
    html,
    loadingAware,
    submittingAware,
}: {
    html: string,
} & ProcessProps) {
    const cntWidth = useContentWidth();
    const styles = useStyles();

    return <ProcessIndicator loadingAware={loadingAware} submittingAware={submittingAware}>
        <RNRenderHtml
            contentWidth={cntWidth}
            baseStyle={styles.text as any}
            source={{html}}
        />
    </ProcessIndicator> ;
});
export default RenderHtml;