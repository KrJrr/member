import AsyncStorage from '@react-native-community/async-storage';

export type StorageInferred =
    | 'loginInfoCache'
    | string
    ;

export const save = async <T>(key: StorageInferred, value: T): Promise<void> => {
    return new Promise(async resolve => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value))
        } catch (err) {
        }
        resolve();
    })
}

// export const get = async <T>(key: StorageInferred): Promise<T | undefined> => {
//     return new Promise(async resolve => {
//         const data: any = await AsyncStorage.getItem(key);
//         if (data)
//             resolve(JSON.parse(data));
//         else
//             resolve(undefined);
//     })
// }

export const get = async <T>(key: StorageInferred): Promise<T|undefined> => {

    const data: any = await AsyncStorage.getItem(key);

    if (data)
        return JSON.parse(data)
    else
        return undefined
    
}


export const InitSimpleStore = () => {
    AsyncStorage.getAllKeys()
        .then(keys => AsyncStorage.multiRemove(keys))
}

export default {
    save, get, InitSimpleStore
}