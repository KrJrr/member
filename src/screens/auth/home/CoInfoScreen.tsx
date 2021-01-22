import React, { FC, useEffect, useState, useMemo, useCallback } from 'react'
import { Alert, StyleSheet, Text, View, ScrollView, Dimensions, ListViewBase, Linking, TouchableOpacity } from 'react-native'
import * as Base from '~/common/base'
import { useSelector, useDispatch } from 'react-redux';
import { ReduxState, setMyAccount } from '~/store'
import FastImage from 'react-native-fast-image';
import Color from '~/common/Color'
import { db, serverTimestamp, Timestamp } from '~/common/functions';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import _ from 'lodash'
import { WebView } from 'react-native-webview';
import Icon from '~/common/Icon';

type Props = {
    navigation: StackNavigationProp<AuthParamList, 'CoInfoScreen'>
    route: RouteProp<AuthParamList, 'CoInfoScreen'>
}

const CoInfoScreen: FC<Props> = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { myAccount } = useSelector((state: ReduxState) => state.auth);
    const { recruitData } = useSelector((state: ReduxState) => state.home);
    const windowWidth = Dimensions.get('window').width;

    const Info = useMemo(() => {
        // route.params.uid
        if (myAccount?.jobType === 'ceo') {
            // console.log(_.filter(myAccount.recruitList, { 'id': route.params.id }))
            return _.filter(myAccount.recruitList, { 'id': route.params.id })
        } else {
            return _.filter(recruitData, { 'uid': route.params.uid, 'id': route.params.id })
        }

    }, [])

    const onSendMessage = (token: string, uid: string, phoneNumber: string, name: string) => {

        //firebase messaging 
        const SERVER_KEY = 'AAAA1iw9Y4w:APA91bEpffXlmTefV_RKS3Jhw03UX4-JVqmyUWZD42Bjdvyj-ehl28ZtSjj5J4epnW-rujG9BScl31Uhj7q5wmPV4rwtUDebaaasehY5oWxcn957ERARtpUPv9E673RAhsGXMKj-DmT3'

        fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Authorization': 'key=' + SERVER_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                notification: {
                    title: '신청',
                    body: name + '(님)으로부터 알바 신청이 들어왔습니다.' + '\n tel : ' + phoneNumber,
                    // sound: 'default',
                    // badge: 1,
                    // color: 'black',
                },
                data: {
                    name: name,
                    phoneNumber: phoneNumber
                    // sender: uid,
                    // payload: payload,
                },
                'to': token,
                'priority': 'high'
            })
        })

        //신청한 구직자의 uid 등록
        db.collection(`Account/${uid}/StaffList`).add({
            uid: myAccount?.id
        })

    }

    const injectedJavaScript = React.useMemo(() => {
        if (myAccount?.jobType === 'ceo') {
            return `initOnReady(${myAccount.latitude},${myAccount.longitude});void(0);`
        } else {
            return `initOnReady(${Info[0].latitude},${Info[0].longitude});void(0);`
        }
    }, []);

    const onBackButton = useCallback(() => navigation.goBack(), []);

    return (
        <>
            <TouchableOpacity
                onPress={onBackButton}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 50,
                    marginLeft: 20
                }}
            >
                <Icon.AntDesign name='arrowleft' size={24} color='black' />

            </TouchableOpacity>
            <ScrollView
                style={{ backgroundColor: 'white' }}
            >

                <Base.BaseView
                >
                    {myAccount?.jobType === 'ceo' ?
                        <>
                            {
                                !myAccount.image ?
                                    <View style={{ width: windowWidth, height: 200, backgroundColor: '#62a8dc', position: 'absolute' }}>
                                    </View>
                                    :
                                    <FastImage
                                        source={{ uri: myAccount.image.uri }}
                                        style={{ width: windowWidth, height: 200, position: 'absolute' }}
                                    />
                            }

                            < View
                                style={{
                                    backgroundColor: 'white',
                                    marginTop: 150,
                                    margin: 20,
                                    elevation: 10,
                                    borderRadius: 10
                                }}
                            >
                                <View
                                    style={{ justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <Text
                                        style={{ fontWeight: 'bold', fontSize: 30 }}
                                    >{myAccount.co_name}</Text>
                                    <Text style={{ fontSize: 20 }}>{Info[0].title}</Text>
                                </View>

                                <View
                                    style={{ flexDirection: 'row', alignSelf: 'center', margin: 20 }}
                                >
                                    <Base.Button
                                        onPress={() => {
                                            Linking.openURL(`tel:${myAccount.phoneNumber}`)
                                        }}
                                        style={{
                                            width: 100,
                                            height: 40,
                                            backgroundColor: '#62a8dc',
                                            borderRadius: 5,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >

                                        <Base.Text
                                            style={{ color: 'white' }}
                                        >
                                            전화
                            </Base.Text>
                                    </Base.Button>


                                </View>

                            </View>

                            <Base.Text
                                style={{ marginLeft: 20, fontSize: 22 }}
                            >
                                근무정보
                        </Base.Text>

                            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#C0C0C0', marginVertical: 10 }}></View>

                            <Base.Text style={{ marginLeft: 20, marginTop: 10, fontSize: 15 }}>
                                근무위치
                        </Base.Text>


                            <Base.Text style={{ marginLeft: 20, fontSize: 15, color: '#62a8dc' }}>
                                {myAccount.address}
                            </Base.Text>
                            <View
                                style={{
                                    height: 150,
                                    backgroundColor: '#ffffff',
                                    elevation: 5,
                                    marginLeft: 20,
                                    marginRight: 20,
                                    marginBottom: 10,
                                    borderRadius: 4

                                }}
                            >
                                <WebView
                                    // source={{ uri: 'https://map.kakao.com/link/map/우리회사,37.402056,127.108212' }}
                                    source={{ uri: 'https://member-37712.web.app/' }}
                                    injectedJavaScript={injectedJavaScript}
                                />

                            </View>
                            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#C0C0C0', marginVertical: 10 }}></View>

                            <Base.Text style={{ marginLeft: 20, fontSize: 15 }}>
                                시급
                        </Base.Text>



                            <Base.Text style={{ marginLeft: 20, marginBottom: 10, fontSize: 15, color: '#62a8dc' }}>
                                {Info[0].wage} 원
                        </Base.Text>
                            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#C0C0C0', marginVertical: 10 }}></View>
                            <Base.Text style={{ marginLeft: 20, fontSize: 15 }}>
                                상세 내용
                        </Base.Text>

                            <View
                                style={{
                                    height: 100,
                                    backgroundColor: '#ffffff',
                                    elevation: 5,
                                    marginLeft: 20,
                                    marginRight: 20,
                                    marginBottom: 10,
                                    borderRadius: 4

                                }}
                            >
                                <Base.Text style={{ fontSize: 15, marginLeft: 10, marginTop: 10 }}>
                                    {Info[0].content}
                                </Base.Text>
                            </View>

                        </>
                        :
                        <>
                            {
                                Info[0].uri === '' ?
                                    <View style={{ width: windowWidth, height: 200, backgroundColor: '#62a8dc', position: 'absolute' }}>
                                    </View>
                                    :
                                    <FastImage
                                        source={{ uri: Info[0].uri }}
                                        style={{ width: windowWidth, height: 200, position: 'absolute' }}
                                    />
                            }

                            < View
                                style={{
                                    backgroundColor: 'white',
                                    marginTop: 150,
                                    margin: 20,
                                    elevation: 10,
                                    borderRadius: 10
                                }}
                            >
                                <View
                                    style={{ justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <Text
                                        style={{ fontWeight: 'bold', fontSize: 30 }}
                                    >{Info[0].co_name}</Text>
                                    <Text style={{ fontSize: 20 }}>{Info[0].title}</Text>
                                </View>

                                <View
                                    style={{ flexDirection: 'row', alignSelf: 'center', margin: 20 }}
                                >
                                    <Base.Button
                                        onPress={() => {
                                            Linking.openURL(`tel:${Info[0].phoneNumber}`)
                                        }}
                                        style={{
                                            width: 100,
                                            height: 40,
                                            backgroundColor: '#62a8dc',
                                            borderRadius: 5,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 40
                                        }}
                                    >

                                        <Base.Text
                                            style={{ color: 'white' }}
                                        >
                                            전화
                                </Base.Text>
                                    </Base.Button>

                                    <Base.Button
                                        onPress={() => {
                                            onSendMessage(Info[0].fcmToken, myAccount?.id, myAccount?.phoneNumber, myAccount?.name)
                                        }}
                                        style={{
                                            width: 100,
                                            height: 40,
                                            backgroundColor: '#244157',
                                            borderRadius: 5,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Base.Text
                                            style={{ color: 'white' }}
                                        >
                                            신청
                                </Base.Text>
                                    </Base.Button>
                                </View>

                            </View>

                            <Base.Text
                                style={{ marginLeft: 20, fontSize: 22 }}
                            >
                                근무정보
                        </Base.Text>
                            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#eeeeee', marginVertical: 10 }}></View>

                            <Base.Text style={{ marginLeft: 20, marginTop: 10, fontSize: 15 }}>
                                근무위치
                        </Base.Text>
                            <Base.Text style={{ marginLeft: 20, fontSize: 15, color: '#62a8dc' }}>
                                {Info[0].address}
                            </Base.Text>
                            <View
                                style={{
                                    height: 150,
                                    backgroundColor: '#ffffff',
                                    elevation: 5,
                                    marginLeft: 20,
                                    marginRight: 20,
                                    marginBottom: 10,
                                    borderRadius: 10

                                }}
                            >
                                <WebView
                                    // source={{ uri: 'https://map.kakao.com/link/map/우리회사,37.402056,127.108212' }}
                                    source={{ uri: 'https://member-37712.web.app/' }}
                                    injectedJavaScript={injectedJavaScript}
                                />

                            </View>
                            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#C0C0C0', marginVertical: 10 }}></View>
                            <Base.Text style={{ marginLeft: 20, fontSize: 15 }}>
                                시급
                        </Base.Text>

                            <Base.Text style={{ marginLeft: 20, marginBottom: 10, fontSize: 15, color: '#62a8dc' }}>
                                {Info[0].wage} 원
                        </Base.Text>
                            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#C0C0C0', marginVertical: 10 }}></View>
                            <Base.Text style={{ marginLeft: 20, fontSize: 15 }}>
                                상세 내용
                        </Base.Text>

                            <View
                                style={{
                                    height: 100,
                                    backgroundColor: '#ffffff',
                                    elevation: 5,
                                    marginLeft: 20,
                                    marginRight: 20,
                                    marginBottom: 10,
                                    borderRadius: 4

                                }}
                            >
                                <Base.Text style={{ fontSize: 15, marginLeft: 10, marginTop: 10 }}>
                                    {Info[0].content}
                                </Base.Text>
                            </View>

                        </>
                    }

                </Base.BaseView>

            </ScrollView >
        </>
    )
}

export default CoInfoScreen

const styles = StyleSheet.create({
    textinput: {
        color: Color.text.base,
        width: '100%', paddingHorizontal: 20,
        backgroundColor: Color.INPUT, borderRadius: 25, height: 50, marginTop: 20
    },
    contentInput: {
        height: 100
    }
})
