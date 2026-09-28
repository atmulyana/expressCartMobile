/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useCart, useNavHelpers, useStyles } from "@/hooks";
import React from 'react';
import { type GestureResponderEvent, Pressable, Text } from "react-native";
import Icon from "./Icon";

type Props = Omit<React.ComponentProps<typeof Pressable>, 'children'>;

export default function CartButton({onPress, ...props}: Props) {
    const cart = useCart();
    const nav = useNavHelpers();
    //const session = useSession()
    const styles = useStyles();
    const pressHandler = React.useCallback((ev: GestureResponderEvent) => {
        if (onPress) onPress(ev);
        nav.openCart();
    }, [onPress, nav]);

    return <Pressable
        {...props}
        onPress={pressHandler}
    >
        <Icon name="shopping-cart" />
        <Text style={styles.cartCount}>{
            cart.cartItemCount //nextCart
            ?? (
                /*session.totalCartItems*/ (cart.items && Object.keys(cart.items).length) //Sometimes, totalCartItems is not synchronized
                || 0
            )
        }</Text>
    </Pressable>;
}