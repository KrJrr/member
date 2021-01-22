import React, { FC, useCallback, useState, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as Base from '~/common/base'
import { useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import Postcode from 'react-native-daum-postcode';

import { setTemporaryAccount } from '~/store'

type Props = {
    navigation: StackNavigationProp<UnauthParamList, 'Join_Address'>
}

const Join_Address: FC<Props> = ({ navigation }) => {

    const dispatch = useDispatch();

    const API_KEY = 'b60db68ad868de8dec3750639c1e1d45'

    const APIProcess = async (data: string) => {
        fetch(`https://dapi.kakao.com/v2/local/search/address.json?query=${data}`, {
            headers: {
                Authorization: `KakaoAK ${API_KEY}`
            }
        })
            .then(response => response.json())
            .then(json => {
                // console.log(json)

                dispatch(setTemporaryAccount({ longitude: json.documents[0].x, latitude: json.documents[0].y, address: json.documents[0].address_name }))
                navigation.goBack()
            })
    }

    return (
        <Postcode
            style={{ width: 400, height: 600 }}
            jsOptions={{ animation: false, hideMapBtn: true, hideEngBtn: true }}
            onSelected={(data) => {
                // console.log(JSON.stringify(data.roadAddress))

                APIProcess(JSON.stringify(data.roadAddress))

            }}
        />
    )
}

export default Join_Address

const styles = StyleSheet.create({

    Wrapper: {
        flex: 1,
    },
})
