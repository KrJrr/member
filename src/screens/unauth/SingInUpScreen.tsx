import React, { FC, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import * as Base from '~/common/base'
import FastImage from 'react-native-fast-image';

import { StackNavigationProp } from '@react-navigation/stack';
type Props = {
    navigation: StackNavigationProp<UnauthParamList, 'SingInUpScreen'>
}

const SignInUpScreen: FC<Props> = ({ navigation }) => {

    const onNextSingUp = useCallback(() => {
        navigation.navigate('Join_SignUp')
    }, [])

    const onNextSignIn = useCallback(() => {
        navigation.navigate('Join_SignIn')
    }, [])

    return (
        <Base.BaseView >

            <FastImage
                resizeMode={'contain'}
                source={require('../../../resources/image/512w.png')}
                style={{ width: 50, height: 50, alignSelf: 'center', marginTop: 50, marginBottom: 30 }}
            />

            <Base.CenterButton
                onPress={onNextSignIn}
                style={{
                    alignSelf: 'center',
                    width: 300,
                    height: 44,
                    borderRadius: 10,
                    backgroundColor: '#62a8dc',
                    marginBottom: 20
                }}
            >
                <Base.Text
                    style={{ color: 'white' }}
                >
                    로그인
                </Base.Text>
            </Base.CenterButton>
            <Base.CenterButton
                onPress={onNextSingUp}
                style={{
                    alignSelf: 'center',
                    width: 300,
                    height: 44,
                    borderRadius: 10,
                    backgroundColor: '#62a8dc'
                }}
            >
                <Base.Text
                    style={{ color: 'white' }}
                >
                    가입하기
                </Base.Text>
            </Base.CenterButton>
        </Base.BaseView>
    )
}

export default SignInUpScreen

const styles = StyleSheet.create({
    container: { justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 50 }
})
