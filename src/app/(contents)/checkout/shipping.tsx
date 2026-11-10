/**
 * https://github.com/atmulyana/expressCartMobile
 */
import {
    Box,
    Button,
    Content,
    Text,
    TwoPane,
} from "@/components";
import Cart from "@/components/partials/Cart";
import {
    useCart,
    useConfig,
    useLang,
    useNavHelpers,
} from "@/hooks";
import { currencySymbol, formatAmount } from "@/libs/number-datetime";
import baseStyles, { arrayStyle } from "@/styles";
import { View } from "react-native";

export default function CheckoutShipping() {
    const cart = useCart();
    const config = useConfig();
    const lang = useLang();
    const nav = useNavHelpers();

    return <Content title={`${lang('Checkout', 1)} - ${lang('Shipping')}`}>
        <TwoPane reverse
            left={<>
                <Box style={arrayStyle('m0', 'para8')}>
                    <Text style={arrayStyle('textLarge', 'textBold')}>{lang('Shipping options')}</Text>
                    {cart.shippingOptions ? null : (
                        <Box style={baseStyles.m0}>
                            {cart.totalCartShipping > 0 ? (
                                <View style={baseStyles.flexRow}>
                                    <Text style={baseStyles.flex1}>{cart.shippingMessage}</Text>
                                    <Text style={arrayStyle('flex1', 'textBold', 'textRight')}>
                                        {currencySymbol(config.currencySymbol)}{formatAmount(cart.totalCartShipping)}
                                    </Text>
                                </View>
                            ) : (
                                <Text>{cart.shippingMessage}</Text>
                            )}
                        </Box>
                    )}
                </Box>
                <View style={arrayStyle('flexRow', 'justifyBetween')}>
                    <Button onPress={() => nav.goto('/checkout/information')}>{lang('Return to information')}</Button>
                    <Button>{lang('Proceed to payment')}</Button>
                </View>
            </>}

            right={<View style={baseStyles.m_8}>
                <Cart homeAfterClear showCheckoutButton={false} />
            </View>}
        />
    </Content>;
}