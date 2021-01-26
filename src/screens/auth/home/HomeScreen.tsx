import React, { FC, useCallback, useState, useMemo, useEffect , useRef} from 'react'
import { AccessibilityInfo, Alert, FlatList, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import * as Base from '~/common/base'
import { StackNavigationProp } from '@react-navigation/stack';

import { ReduxState, addRecruitList, setTemporaryAccount2, setTemporaryAccount, loadHomeDataAsync } from '~/store';
import { useSelector, useDispatch } from 'react-redux';
import Color from '~/common/Color'
import { db, getFirestoreArrayDataWithQuery, getDocumentDataWithPath } from '~/common/functions';
import { appType } from 'CONFIG';

import _, { head } from 'lodash'
import update from 'immutability-helper';
import { dispatch } from 'rxjs/internal/observable/pairs';

import messaging from '@react-native-firebase/messaging';

import Carousel from 'react-native-snap-carousel';

import storage from '@react-native-firebase/storage';
import BitSwiper from 'react-native-bit-swiper';
import Icon from '~/common/Icon';
import SimpleStore from '~/common/SimpleStore';

import AppManager from './AppManager';
import { cos } from 'react-native-reanimated';
import { retryWhen } from 'rxjs/operators';

type Props = {
    navigation: StackNavigationProp<HomeParamList, 'HomeScreen'>
}

const HomeScreen: FC<Props> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { myAccount } = useSelector((state: ReduxState) => state.auth);
    const { recruitData, bannerData } = useSelector((state: ReduxState) => state.home);

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const RecruitButton = useCallback(() => {
        navigation.navigate('RecruitScreen')
    }, [])

    useEffect(() => {
        dispatch(loadHomeDataAsync(true))
       
        setTimeout(() => {
            updateAccountInfo()
        }, 4000);
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

            const loginInfoCache = await SimpleStore.get<LoginInfoCache>('loginInfoCache');
            console.log('loginInfoCache', loginInfoCache)
            console.log(myAccount)

            db.doc(`Account/${loginInfoCache?.uid}`).update(data)
        }

        //     db.doc(`Account/${myAccount?.id}`).update(data)

    }

    //기업 개인 등록 리스트
    const dataCeo = useMemo(() => {
        return myAccount?.recruitList
    }, [myAccount?.recruitList])

    //기업 전체 리스트
    const dataStaff = useMemo(() => {
        return recruitData
    }, [recruitData])

    //이미지 리스트
    const dataBanner = useMemo(() => {
        return bannerData
    }, [bannerData])

    const renderHeader = () => {
        return (
            <>
                {/* <Carousel
                layout={"default"}
                data={dataBanner}
                sliderWidth={windowWidth}
                itemWidth={windowWidth}
                inactiveSlideScale={0.95}
                renderItem={(item) => {
                    return (
                        <FastImage
                            source={{uri:item.item.uri}}
                            style={{width: windowWidth, height:200}}
                        />
                    )
                }}
                loop={true}
                // enableMomentum={true}
                autoplay={true}
                // autoplayDelay={500}
                // autoplayInterval={2500}
                // autoplay={true}
            // onSnapToItem={index => this.setState({ activeIndex: index })} 
            /> */}


                <BitSwiper
                    items={dataBanner}
                    // loop={true}
                    autoplay={true}
                    itemWidth={windowWidth}
                    autoplayDelay={2000}
                    onItemRender={(item: any) => {
                        return (
                            <FastImage
                                source={{ uri: item.uri }}
                                style={{ width: windowWidth, height: 150 }}
                            />
                        )
                    }}
                />

                {myAccount?.jobType === 'ceo' ?
                    <>
                        <Base.CenterButton
                            style={{ height: 150, backgroundColor: '#244157', margin: 20, borderRadius: 20 }}
                            onPress={RecruitButton}
                        >
                            <Icon.AntDesign name='plus' size={30} color={'white'} />
                            <Base.Text
                                style={{ color: 'white', fontSize: 20 }}
                            >
                                알바 등록
                            </Base.Text>

                        </Base.CenterButton>

                        <Base.Text style={{ marginLeft: 20, marginBottom: 10, fontSize: 20 }}>등록한 알바</Base.Text>
                        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#C0C0C0', marginVertical: 10 }}></View>

                    </>
                    :
                    <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#C0C0C0', marginVertical: 10 }}></View>

                }
            </>
        )
    }

    const renderItem = useCallback(({ item }) => {
        return (
            <View style={{ marginBottom: 5 }}>
                {myAccount?.jobType === 'ceo' ?
                    <>
                        <TouchableOpacity style={styles.lineList}
                            activeOpacity={0.9}
                            onPress={() => {
                                navigation.navigate('CoInfoScreen', {
                                    uid: myAccount.id, id: item.id
                                })
                            }}
                        >
                            <View style={{ marginRight: 10, marginLeft: 10 }}>
                                {!myAccount.image ?
                                    <Icon.AntDesign name='exclamationcircleo' size={30} />
                                    :
                                    <FastImage
                                        source={{ uri: myAccount.image?.uri }}
                                        style={{ width: 70, height: 70, borderRadius: 20, }}
                                    />
                                }
                            </View>
                            <View
                                style={{ flexDirection: 'column' }}
                            >
                                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.title}</Text>
                                <Text style={{ color: '#62a8dc' }}>시급 : {item.wage}</Text>

                            </View>

                            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', marginRight: 20 }}>
                                <Text>자세히보기</Text>
                            </View>

                        </TouchableOpacity>
                    </>
                    :
                    <>
                        <TouchableOpacity style={styles.lineList}
                            activeOpacity={0.9}
                            onPress={() => {
                                navigation.navigate('CoInfoScreen', {
                                    uid: item.uid, id: item.id
                                })
                            }}
                        >
                            <View style={{ marginRight: 10, marginLeft: 10 }}>
                                {item.uri === '' ?
                                    <Icon.AntDesign name='exclamationcircleo' size={30} />
                                    :
                                    <FastImage
                                        source={{ uri: item.uri }}
                                        style={{ width: 70, height: 70, borderRadius: 20, }}
                                    />
                                }
                            </View>

                            <View
                                style={{ flexDirection: 'column' }}
                            >
                                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.title}</Text>
                                <Text style={{ color: '#62a8dc' }}>시급 : {item.wage}</Text>

                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 20 }}>
                                <Text>자세히보기</Text>
                            </View>
                        </TouchableOpacity>
                    </>
                }

            </View>
        )
    }
        , []);

        const refreshing = useRef(false);
    const onRefresh = () => {
        dispatch(loadHomeDataAsync(true))
    }
    return (
        <Base.BaseView>

            {myAccount?.jobType === 'ceo' ?
                <FlatList
                    keyExtractor={item => item.id}
                    data={dataCeo}
                    renderItem={renderItem}
                    ListHeaderComponent={renderHeader}
                // onRefresh={onRefresh}
                // refreshing={refreshing.current}
                />
                :
                <FlatList
                    keyExtractor={item => item.id}
                    data={dataStaff}
                    renderItem={renderItem}
                    ListHeaderComponent={renderHeader}
                    onRefresh={onRefresh}
                    refreshing={refreshing.current}
                />
            }
        </Base.BaseView >
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    text: {
        fontSize: 30
    },
    view: {
        color: Color.text.base,
        width: '100%', paddingHorizontal: 20,
        backgroundColor: Color.INPUT, borderRadius: 5, marginTop: 15
    },
    lineList: {
        flexDirection: 'row', borderBottomColor: '#C0C0C0', borderBottomWidth: StyleSheet.hairlineWidth, height: 80, alignItems: 'center',
    },

})
