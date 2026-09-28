/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { useMount, useNotification, useStyles } from "@/hooks";
import { closeNotification, errorHandler, pushNotification } from '@/libs/notification';
import { extractTextStyle } from "@/libs/style";
import styles from '@/styles';
import { Duration, type TNotification } from '@/types';
import { noop } from "javascript-common";
import React from 'react';
import { type TextStyle, TouchableOpacity, View } from 'react-native';
import Icon from "./Icon";
import Text from "./Text";


type TNotificationComponent = React.ComponentType & {
    danger: (message: string) => void,
    errorHandler: (err: any) => void,
    success: (message: string) => void,
    warning: (message: string) => void,
    push: (notif: TNotification | string, type?: TNotification['type'], duartion?: Duration) => void,
}

type TNotificationItem = TNotification & {
    key?: number,
};


function NotificationItem({
    close,
    duration,
    message,
    type = 'error'
}: TNotification & {
    close: () => void,
}) {
    duration ??= type == 'error' || type == 'warning' ? Duration.long : Duration.short;
    const styles = useStyles();
    const style = React.useMemo(function() {
        const style = extractTextStyle([
            styles.alert as TextStyle,
            type == 'info' ? styles.alertInfo :
            type == 'success' ? styles.alertSuccess :
            type == 'warning' ? styles.alertWarning :
                                styles.alertDanger,
        ]);
        style.text = Object.assign(style.text, {flex: 1, paddingRight: 8});
        return style;
    }, [styles, type]);
    
    useMount(() => {
        const timerId = setTimeout(close, duration);
        return () => clearTimeout(timerId);
    });

    return <View style={style.view}>
        <Text style={style.text}>{message}</Text>
        <TouchableOpacity onPress={close}>
            <Icon color={style.text.color} name="x" size={16} />
        </TouchableOpacity>
    </View>;
}

const NotificationComponent = React.memo(function Notification() {
    const items = useNotification();
    
    if (items.length < 1) return null;
    const t = new Date().getTime();
    return <View style={styles.alertContainer}>
        {items.map((item, idx) => {
            const it = item as TNotificationItem;
            it.key ??= (t + idx);
            return <NotificationItem
                key={it.key}
                message={it.message}
                type={it.type}
                duration={it.duration}
                close={() => closeNotification(item).catch(noop)}
            />;
        })}
    </View>;
});
const Notification: TNotificationComponent = Object.assign(NotificationComponent, {
    push(notif: TNotification | string, type?: TNotification['type'], duration?: Duration) {
        const notification = typeof(notif) == 'object' ? notif : {message: notif, type, duration};
        pushNotification(notification).catch(noop);
    },
    danger(message: string) {
        Notification.push(message, 'error');
    },
    warning(message: string) {
        Notification.push(message, 'warning');
    },
    success(message: string) {
        Notification.push(message, 'success');
    },
    errorHandler,
}) as any as TNotificationComponent;
export default Notification;