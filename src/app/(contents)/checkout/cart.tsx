/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { Content } from "@/components";
import Cart from "@/components/partials/Cart";
import baseStyles from "@/styles";

export default function CheckoutShipping() {
    return <Content contentContainerStyle={baseStyles.p0}>
        <Cart homeAfterClear />
    </Content>;
}