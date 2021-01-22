import React, { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Base from '~/common/base'

import { setTemporaryAccount } from '~/store'

type Props = {
    navigation: StackNavigationProp<UnauthParamList, 'Join_SignUp'>
}

const Join_SignUp: FC<Props> = ({ navigation }) => {

    const dispatch = useDispatch();

    const changeType = (type: JobType) => {
        // console.log(type)

        if (type === 'ceo') {
            dispatch(setTemporaryAccount({ jobType: type }))
            navigation.navigate('Join_Ceo')
        } else if (type === 'staff') {
            dispatch(setTemporaryAccount({ jobType: type }))
            navigation.navigate('Join_Staff')
        }
    }

    return (
        <Base.BaseView >
            <Base.CenterButton
                onPress={() => {
                    changeType('staff')
                }}
                style={styles.staffButton}
            >
                <Base.Text
                    style={styles.text}
                >
                    개인회원 가입
                </Base.Text>
            </Base.CenterButton>
            <Base.CenterButton
                onPress={() => {
                    changeType('ceo')
                }}
                style={styles.ceoButton}
            >
                <Base.Text
                    style={styles.text}
                >
                    기업회원 가입
                </Base.Text>
            </Base.CenterButton>

        </Base.BaseView>
    )
}

export default Join_SignUp

const styles = StyleSheet.create({
    text: { color: 'white' },
    staffButton: {
        alignSelf: 'center',
        width: 300,
        height: 44,
        borderRadius: 10,
        backgroundColor: '#62a8dc',
        marginTop: 20,
        marginBottom: 20
    },
    ceoButton: {
        alignSelf: 'center',
        width: 300,
        height: 44,
        borderRadius: 10,
        backgroundColor: '#244157'
    }


})
