/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { closeNotification, pushNotification } from '@/hooks/notification';
import type { TNotification } from '@/types';

export { closeNotification, pushNotification };

export async function errorHandler(err: any) {
    if (typeof(err) != 'object') {
        if (err !== undefined) throw err;
        return;
    }

    /** `handled` property is primaryly used by error handler of `callServer`
     ** `valid` property is issued by `Form` component as the result of input validation */
    if (!err || !err.data || err.valid === false || err.handled) return;
    if (400 <= err.status && err.status <= 499) {
        const message = err.data?.message || err.data?.error || err.data?.err || err.message;
        if (typeof(message) == 'string') {
            err.handled = true;
            await pushNotification({
                message,
                type: 'error'
            });
        }
        else if (Array.isArray(err.data) && typeof(err.data[0]) == 'object' && err.data[0]?.message) {
            err.handled = true;
            await pushNotification({
                message: err.data[0].message,
                type: 'error'
            });
        }
    }
}

export async function showResponseMessage(data: {
    message?: string,
    messageType?: TNotification['type']
} | null | undefined) {
    if (data?.message) {
        await pushNotification({
            message: data.message,
            type: data.messageType || 'success'
        });
    }
    return data;
}