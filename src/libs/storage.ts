/**
 * https://github.com/atmulyana/expressCartMobile
 */
//import Storage from 'expo-secure-store'; //Its documentation says it can't be used on emulator/simulator
                                           //(`Storage` will be `undefined`)
import Storage from 'react-native-encrypted-storage';

export async function deleteStoredData(key: string) {
    // return await Storage.deleteItemAsync(key, {
    //     requireAuthentication: false,
    // });  
    return await Storage.removeItem(key);
}

export async function getStoredData(key: string) {
    // return await Storage.getItemAsync(key, {
    //     requireAuthentication: false,
    // });
    return await Storage.getItem(key);
}

export async function storeData(key: string, value: string) {
    // await Storage.setItemAsync(key, value, {
    //     requireAuthentication: false,
    // });
    await Storage.setItem(key, value);
}