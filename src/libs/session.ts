/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { getSession, setSession } from "@/hooks/session";
import { SubmitFunction, SubmitParams } from "@/types";
import { emptyObject, noop } from "javascript-common";
import { callServer } from "./server";
import { deleteStoredData, storeData } from "./storage";
export { getSession };

export async function login(email: string, password: string) {
    await setSession({
        customerPresent: true,
        customerEmail: email,
    });
    if (email && password) {
        storeData("email", email).catch(noop); //Ignores errors
        storeData("password", password).catch(noop); //Ignores errors
    }
}

export async function logout(submit?: SubmitFunction | null, message?: string | null, isLoginCleared = true) {
    const done = async () => {
        if (isLoginCleared) {
            deleteStoredData("email").catch(noop); //Ignores errors
            deleteStoredData("password").catch(noop); //Ignores errors
        }
        await setSession({
            customerPresent: false,
        });
    };
    const url = '/customer/logout';

    if (submit) {
        return new Promise<void>((resolve, reject) => {
            const params: SubmitParams = {
                url,
                postData: emptyObject,
                onSubmitted: async () => {
                    await done();
                    resolve();
                },
                onError: err => {
                    if (err.valid !== false) reject();
                    else resolve();
                },
            };
            if (message) params.message = message;
            submit(params);
        });
    }
    
    return callServer(url, emptyObject).then(done);
}

export async function relogin() {
    return true;
}