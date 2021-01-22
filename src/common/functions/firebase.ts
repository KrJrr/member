import firestore from '@react-native-firebase/firestore';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export const db = firestore();
export const Timestamp = firestore.Timestamp;

export const serverTimestamp = () => firestore.FieldValue.serverTimestamp();



export const getDataFromDocument = <T extends DB>(doc: FirebaseFirestoreTypes.DocumentSnapshot) => {
    if (!doc.exists) return undefined;
    const data = doc.data() as DB;
    // data.id = doc.id;
    return data as T;
}

export const getDocumentDataWithPath = <T extends DB>(path: string) => {
    return new Promise<T>((resolve, reject) => {
        db.doc(path).get()
            .then(getDataFromDocument)
            .then(val => resolve(val as T))
            .catch(err => reject(err))
    })
}

/**
 * 
 * @param query firesotre query
 * @param lastQueryValue 마지막 시간 값을 long형으로 변경해 놓은 값임  
 */
export const getFirestoreArrayDataWithQuery = <T extends DB>(query: FirebaseFirestoreTypes.Query, lastTime?: number | string) => {
    const getArrayDataFromSnapshot = (snapshots: FirebaseFirestoreTypes.QuerySnapshot) => {
        if (snapshots.empty) return [] as Array<T>;
        return snapshots.docs.map(getDataFromDocument);
    }

    //숫자로 들어올때는 time을 getTime으로 들어온 것이기 때문에 new Date를 기준으로 찾고
    //string일 경우는 그대로 검색하면 된다.
    if (lastTime !== undefined) {
        if (Number.isInteger(lastTime)) {
            query = query.startAfter(new Date(lastTime));
        } else {
            query = query.startAfter(lastTime);
        }
    }

    return new Promise<Array<T>>((resolve, reject) => {
        query.get()
            .then(getArrayDataFromSnapshot)
            .then(val => resolve(val as Array<T>)
            ).catch(err => reject(err));
    })
}