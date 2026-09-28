/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { Button, Content, Icon, ProcessIndicator, RenderHtml, Text } from '@/components';
import { useLang, useNavHelpers, useRefCallback, useStyles } from '@/hooks';
import { HttpReject } from '@/types';
import { emptyString } from 'javascript-common';
import React from 'react';
import { View } from 'react-native';

export default function WebPage() {
    const [response, setResponse] = React.useState({
        status: 0,
        html: emptyString,
    });
    const lang = useLang();
    const nav = useNavHelpers();
    const styles = useStyles();

    const onDataError: HttpReject = useRefCallback(err => {
        if (err.status == 404) err.handled = true;
        setResponse({status: err.status, html: emptyString});
    });
    const onDataReady = useRefCallback((data: any) => {
        setResponse({
            status: 200,
            html: data?.page?.pageContent ?? emptyString,
        });
    });

    return <Content
        contentContainerStyle={response.status == 404 ? styles.array('flex1', 'contentCentered') : null}
        onDataError={onDataError}
        onDataReady={onDataReady}
    >{
        response.status == 0 ? (
            <ProcessIndicator loadingAware>
                <View style={{height: 50}} />
            </ProcessIndicator>
        ) :
        response.status == 404 ? (
            <>
                <Text style={styles.array('textLarge', 'textBold', 'txt-danger', 'para8')}>
                    {lang("What you're looking for is not found")}
                </Text>
                <View style={styles.array('flexRow', 'gap', 'contentCentered')}>
                    <Button
                        style={styles.get('btn-outline-info')}
                        pressedStyle={styles.get('btn-info')}
                        onPress={() => nav.goHome()}
                    >{(_, style) => (
                        <View style={styles.array('flexRow', 'gap', 'contentCentered')}>
                            <Icon name='home' size={18} style={style} />
                            <Text style={style}>{lang('Go Home')}</Text>
                        </View>
                    )}</Button>
                    {nav.canGoBack() && <Button
                        style={styles.get('btn-outline-info')}
                        pressedStyle={styles.get('btn-info')}
                        onPress={() => nav.goBack()}
                    >{(_, style) => (
                        <View style={styles.array('flexRow', 'gap', 'contentCentered')}>
                            <Icon name='arrow-left-circle' size={18} style={style} />
                            <Text style={style}>{lang('Go Back')}</Text>
                        </View>
                    )}</Button>}
                </View>
            </>
        ) :
        <RenderHtml html={response.html} />
    }</Content>;
}