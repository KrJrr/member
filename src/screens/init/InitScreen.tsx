import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, ActivityIndicator , AppState} from 'react-native'
import * as Base from '~/common/base'
import { useDispatch, useSelector } from 'react-redux';

import { changeScene, setMyAccount } from '~/store'

import FastImage from 'react-native-fast-image';
import { ReduxState } from '~/store'
import SimpleStore from '~/common/SimpleStore';
import auth from '@react-native-firebase/auth';
import { appType } from '~/../CONFIG';
import { getDocumentDataWithPath } from '~/common/functions';

import CodePush from 'react-native-code-push';

const InitScreen = () => {
    let [animating, setAnimating] = useState(true)
    const [stepText, setStepText] = useState('불러오는 중');

    const dispatch = useDispatch();
    useEffect(() => {
        codePushSync();
        //앱이 켜졌을 때 마다 codePushSync() 실행해서 업데이트 체크한다.
        AppState.addEventListener('change', (state) => {
            state === 'active' && codePushSync()
        })

        setTimeout(() => {
            console.log('settime')
            initProcess()
        }, 1000);

    }, [])

    const codePushSync = () =>{
        CodePush.sync({
          updateDialog: { //업데이트 다이얼로그 설정
            title : "새로운 업데이트가 존재합니다.",
            optionalUpdateMessage : "지금 업데이트하시겠습니까?",
            optionalIgnoreButtonLabel : "나중에",
            optionalInstallButtonLabel : "업데이트"
          },
          installMode: CodePush.InstallMode.IMMEDIATE //즉시 업데이트
        });
      }

    const initProcess = useCallback(async () => {

        let updateDialog = false
        const loginInfoCache = await SimpleStore.get<LoginInfoCache>('loginInfoCache');
        if (loginInfoCache === undefined) {
            updateDialog = false
            goToScene('Unauth')
        }
        else {
            //firebase 인증에 등록되었는지 확인
            const firebaseLoginInfo = await auth()
                .signInWithEmailAndPassword(appType + loginInfoCache.phoneNumber + '@member.com', 'KrJrr87');

            const account = await getDocumentDataWithPath<AccountDB>(`Account/${firebaseLoginInfo.user.uid}`);
            dispatch(setMyAccount(account))

            updateDialog = true
            goToScene('Auth')
        }

            // CodePush.sync({
            //     // 처음 들어온거라면 바로 업뎃 시작
            //     // 두번째 들어온거라면 다이얼로그 띄어서 업뎃 할 건지 물어봄
            //     installMode: CodePush.InstallMode.IMMEDIATE,
            //     updateDialog: (updateDialog) ? {
            //         appendReleaseDescription: true,
            //         title: '업데이트',
            //         mandatoryUpdateMessage: '업데이트가 가능합니다. 업데이트를 시작하시겠습니까?',
            //         mandatoryContinueButtonLabel: '업데이트'
            //     } : undefined
            // },
            //     syncStatus => {
            //         console.log(syncStatus)
            //         if (syncStatus === 0) {
            //             //up_to_date 상태면 완료된 것
            //             // SimpleStore.save('initCodePush', true);
            //         }
            //         else if (syncStatus === 5)
            //             setStepText('업데이트 확인 중');
            //     // else if (syncStatus === 7) {
            //     //     setStepText('업데이트 다운로드 중')
            //     // }
            //     // else if (syncStatus === 8)
            //     //     setStepText('업데이트 설치 중')
            // },
            // ).catch(err => {
            //     console.log('뭐지', err)
            // })
        

    }, [])

    const goToScene = useCallback((scene: eScene) => dispatch(changeScene(scene)), [])

    return (
        <Base.BaseView style={styles.container} >
            <FastImage
                resizeMode={'contain'}
                source={require('resources/image/512w.png')}
                style={{ width: 100, height: 100 }}
            />
            <ActivityIndicator
                animating={animating}
                color='skyblue'
                size='large'
                style={styles.activityIndicator}
            />
        </Base.BaseView>
    )
}

export default InitScreen

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    activityIndicator: {
        alignItems: 'center',
        height: 80
    }
})
