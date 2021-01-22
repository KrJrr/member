import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native'
import messaging from '@react-native-firebase/messaging';
import { useDispatch, useSelector } from 'react-redux';
import SimpleStore from '~/common/SimpleStore';
import { ReduxState, addRecruitList, setTemporaryAccount2, setTemporaryAccount, loadHomeDataAsync } from '~/store';
import AsyncStorage from '@react-native-community/async-storage';

const AppManager = () => {
    const { myAccount } = useSelector((state: ReduxState) => state.auth);

    useEffect(() => {

        updateAccountInfo();
        // initBadge();

    }, [])

    const updateAccountInfo = async () => {
        let data: Partial<AccountDB> = {};

        let fcmToken = ''
        let permission = await messaging().hasPermission();

        if (permission !== messaging.AuthorizationStatus.AUTHORIZED)
            permission = await messaging().requestPermission();

        if (permission === messaging.AuthorizationStatus.AUTHORIZED) {
            fcmToken = await messaging().getToken();
        }

        if (myAccount?.fcmToken !== fcmToken) {
            // console.log('fcm', fcmToken)
            data.fcmToken = fcmToken;
        }

        // const loginInfoCache = await SimpleStore.get<LoginInfoCache>('loginInfoCache');

        const loginInfoCache = AsyncStorage.getItem('loginInfoCache')
        console.log('loginInfoCache', loginInfoCache)
        // db.doc(`Account/${loginInfoCache?.user.uid}`).update(data)

        // if (myAccount?.id === undefined) {

        // } else {
        //     db.doc(`Account/${myAccount?.id}`).update(data)
        // }

    }

    return null
    
}

export default AppManager

const styles = StyleSheet.create({})
