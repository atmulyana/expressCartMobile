/**
 * https://github.com/atmulyana/expressCartMobile
 */
import { getSession, setSession } from "@/hooks/session";
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

export async function logout(isLoginCleared = true) {
    return callServer('/customer/logout', emptyObject).then(async () => {
        if (isLoginCleared) {
            deleteStoredData("email").catch(noop); //Ignores errors
            deleteStoredData("password").catch(noop); //Ignores errors
        }
        await setSession({
            customerPresent: false,
        });
    });
}

export async function relogin() {
    return true;
}