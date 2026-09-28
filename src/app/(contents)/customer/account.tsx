/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { Box, Button, Content, SubmittingIndicator } from '@/components';
import ShippingForm from '@/components/partials/ShippingForm';
import { useData, useForm, useLang, useSession } from '@/hooks';
import type { Order } from '@/types';
import { Redirect } from 'expo-router';
import { emptyArray } from 'javascript-common';
import React from 'react';

export default function CustomerAccount() {
    const [{countryList/*, orders*/}] = useData({
        countryList: emptyArray,
        orders: emptyArray,
    } as {
        countryList: string[],
        orders: Order[],
    });
    const lang = useLang();
    const [Form, /*submit*/, isSubmitting] = useForm();
    const session = useSession();

    const submitBtn = React.useMemo(() => {
        return <Button
            loadingAware
            style={{alignSelf: 'flex-start'}}
            //onPress={() => submit('/customer/update')}
        >{lang('Save details')}</Button>
    }, [lang/*, submit*/]);
    
    if (!session.customerPresent) {
        return <Redirect href="/customer/login" />;
    }

    return <Content title={lang('Orders')}>
        <Box>
            <Form fragment>
                <ShippingForm
                    countryList={countryList}
                    footer={submitBtn}
                />
            </Form>
            <SubmittingIndicator visible={isSubmitting} message={`${lang('Saving customer data')}...`} />
        </Box>
    </Content>;
}
