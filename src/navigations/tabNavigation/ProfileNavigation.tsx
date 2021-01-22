import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as Base from '~/common/base'

import { useDispatch, useSelector } from 'react-redux';
import { changeScene, setMyAccount, setTemporaryAccount } from '~/store'
import SimpleStore from '~/common/SimpleStore';

import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'

const Stack = createStackNavigator<MainTabParamList>();

const ProfileNavigation = () => {
    const dispatch = useDispatch();

    const logout = () => {
        SimpleStore.InitSimpleStore(); //모든키 삭제하기
        dispatch(changeScene('Init'))
        dispatch(setMyAccount(undefined));
        dispatch(setTemporaryAccount({}))
    }

    return (
        <View>
            <Base.Button
                    onPress={logout}
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
                <Base.Text style={{ color: 'white', paddingHorizontal: 20, }}>로그아웃</Base.Text>
            </Base.Button>
        </View>
    )
}

export default ProfileNavigation

const styles = StyleSheet.create({})
