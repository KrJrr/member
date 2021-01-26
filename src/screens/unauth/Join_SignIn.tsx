import React, { FC, useState, useCallback } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import * as Base from '~/common/base'
import Color from '~/common/Color'
import { useDispatch } from 'react-redux';

import { StackNavigationProp } from '@react-navigation/stack';

import { db, serverTimestamp } from '~/common/functions';

import { changeScene, setMyAccount } from '~/store'
import SimpleStore from '~/common/SimpleStore';

type Props = {
    navigation: StackNavigationProp<UnauthParamList, 'Join_SignIn'>
}

const Join_SignIn: FC<Props> = () => {
    const dispatch = useDispatch();
    const [phoneNumber, setPhoneNumber] = useState('');

    const LoginButton = useCallback(() => {
        db.collection('Account')
            .where('phoneNumber', '==', phoneNumber)
            .limit(1)
            .get()
            .then(snapshots => {

                if (snapshots.empty) {
                    return Alert.alert('계정이없습니다.', '계정을 만들어주세요. ')
                } else {
                    const ac = snapshots.docs[0].data() as AccountDB

                    SimpleStore.save<LoginInfoCache>('loginInfoCache', {
                        phoneNumber: ac.phoneNumber!,
                        uid: ac.id
                    })

                    dispatch(setMyAccount(ac))
                    dispatch(changeScene('Auth'))
                }
            })

    }, [phoneNumber])

    return (
        <Base.BaseView>
            <Base.Button
                style={{
                    alignSelf: 'center',
                    width: 300,
                    height: 50,
                    borderRadius: 10,
                    justifyContent: 'center',
                    backgroundColor: 'gold',
                    marginTop: 20,
                    marginBottom: 10
                }}
            >
                <Base.Text style={{ color: 'white', paddingHorizontal: 20, }}>카톡 로그인 추가할 버튼</Base.Text>
            </Base.Button>

            <Base.Button
                style={{
                    alignSelf: 'center',
                    width: 300,
                    height: 50,
                    borderRadius: 10,
                    justifyContent: 'center',
                    backgroundColor: 'gray',
                    marginBottom: 5
                }}
            >
                <Base.Text style={{ color: 'white', paddingHorizontal: 20, }}>구글 로그인 추가할 버튼</Base.Text>
            </Base.Button>

            <Base.TextInput
                placeholder={'전화번호를 입력해주세요'}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType='number-pad'
                style={styles.textinput}
                placeholderTextColor={Color.PLACEHOLDER}
                maxLength={11}
            />

            <Base.Button
                onPress={LoginButton}
                style={{
                    alignSelf: 'center',
                    width: 300,
                    height: 50,
                    borderRadius: 10,
                    justifyContent: 'center',
                    backgroundColor: '#62a8dc',
                    marginTop: 20,
                    marginBottom: 10
                }}
            >
                <Base.Text style={{ color: 'white', paddingHorizontal: 20, }}>
                    로그인하기
                    </Base.Text>
            </Base.Button>

        </Base.BaseView>
    )
}

export default Join_SignIn

const styles = StyleSheet.create({

    textinput: {
        color: Color.text.base,
        width: 300, paddingHorizontal: 20, alignSelf: 'center',
        backgroundColor: Color.INPUT, borderRadius: 10, height: 50, marginTop: 20
    },
})
