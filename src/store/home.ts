

import {
    delay, put, takeEvery, takeLatest, getContext,
    call, select, takeLeading
} from 'redux-saga/effects';

import _ from 'lodash';
import { db, getDocumentDataWithPath, getFirestoreArrayDataWithQuery } from '~/common/functions';

import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';


export interface IHomeState {
    readonly recruitData: Array<RecruitList>
    readonly bannerData: Array<string>
}

const initialState: IHomeState = {
    recruitData: [],
    bannerData: [],
}

export type HomeActionInferred =
    | ReturnType<typeof addRecruitList>
    | ReturnType<typeof loadHomeDataAsync>
    | ReturnType<typeof addBannerList>


//Action
export const addRecruitList = (list: Array<RecruitList>) => ({
    type: 'ADD_RECRUIT_LIST', list
})

export const addBannerList = (list: Array<string>) => ({
    type: 'ADD_BANNER_LIST', list
})

export const loadHomeDataAsync = (isInit: boolean) => ({
    type: 'LOAD_HOME_DATA_ASYNC', isInit
} as const);



// export const converToTimestamp = (timestamp: FirestoreTimestamp) => {
//     try {
//         const t = timestamp as any;

//         if (t === undefined) return Timestamp.now();
//         if (t.seconds) {
//             return new Timestamp(t.seconds, t.nanoseconds);
//         } else if (t._seconds) {
//             return new Timestamp(t._seconds, t._nanoseconds);
//         }
//         return Timestamp.now();
//     } catch (err) {
//         return Timestamp.now();
//     }
// }

function* loadRecruitList() {
    const state = yield select();  //모든 상태 가져오기

    // console.log(state)

    let data = yield call(staffData)

    let recruitList = new Array()
    let cnt = 0;

    data.forEach((x: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {

        // console.log(x.data().recruitList)

        x.data().recruitList.map((y: RecruitItem) => {
            // console.log(y)

            let arr: RecruitList = {
                id: cnt++ + '',
                uid: x.data().id,
                uri: x.data().image.uri ? x.data().image.uri : '',

                co_name: x.data().co_name,
                fcmToken: x.data().fcmToken,
                name: x.data().name,
                address: x.data().address,
                longitude: x.data().longitude,
                latitude: x.data().latitude,
                phoneNumber: x.data().phoneNumber,
                

                title: y.title,
                wage: y.wage,
                content: y.content,
                startAt: y.startAt
            }

            recruitList.push(arr)
        })

        // console.log(recruitList)
        return recruitList
        // let arr: RecruitList = {
        //     uid: x.data().id,
        //     title: x.data().recruitList
        //     // fcmToken: x.data().fcmToken,
        //     // name: x.data().name,
        //     uri: x.data().image.uri ? x.data().image.uri : '',
        // }

        // 
    })

    // console.log(recruitList)
    let bannerList = yield call(urlImage)
    yield put(addRecruitList(recruitList))
    yield put(addBannerList(bannerList))
}

const urlImage = async () => {
    // const ref1 = storage().ref('banner/people.jpg').getDownloadURL();
    const ref = await storage().ref('banner').list()

    let bannerlist = new Array()

    await Promise.all(ref.items.map(async (x) => {
        const downloadUrl = await storage().ref(x.path).getDownloadURL();
        let arr: BannerList = {
            uri: downloadUrl
        }
        bannerlist.push(arr)
    }))


    return bannerlist
}

const staffData = async () => {
    return db.collection('Account')
        .where('jobType', '==', 'ceo')
        .get()
}

const MyData = async () => {
    return db.collection('Account')
        .doc()
        .get()
}



export function* homeSaga() {
    yield takeLatest('LOAD_HOME_DATA_ASYNC', loadRecruitList)
}

//Reducer
export default function homeReducer(
    state = initialState,
    action: HomeActionInferred
): IHomeState {
    switch (action.type) {
        case 'ADD_RECRUIT_LIST':
            return {
                ...state,
                recruitData: action.list
            }
        case 'ADD_BANNER_LIST':
            return {
                ...state,
                bannerData: action.list,
                // bannerData: _.uniqWith([...state.bannerData, ...action.list]),
            }
        default:
            return state

    }
}
