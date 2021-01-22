import React, {FC, useState } from 'react'
import { Alert, StyleSheet, Text, View, ScrollView } from 'react-native'
import * as Base from '~/common/base'
import { useSelector, useDispatch } from 'react-redux';
import { ReduxState, setMyAccount } from '~/store'
import FastImage from 'react-native-fast-image';
import Color from '~/common/Color'
import { db, serverTimestamp, Timestamp } from '~/common/functions';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
    navigation: StackNavigationProp<AuthParamList>
}

const RecruitScreen: FC<Props> = ({navigation}) => {
    const dispatch = useDispatch();
    const { myAccount } = useSelector((state: ReduxState) => state.auth);

    const [title, setTitle] = useState('')
    const [wage, setWage] = useState('')
    const [content, setContent] = useState('')

    const onAddRecruit = () => {
        if (title === '') {
            return Alert.alert('제목', '제목 입력해')
        } else if (wage === '') {
            return Alert.alert('시급', '시급 입력해')
        }

        const accountRef = db.doc(`Account/${myAccount?.id}`)
        db.runTransaction(async t => {
            const accountDoc = await t.get(accountRef)
            if (accountDoc.exists) {
                const ac = accountDoc.data() as AccountDB

                let id = 0
                if(ac.recruitList.length === 0){
                    // console.log(ac.recruitList)
                    id = id++
                } else {
                    id = ac.recruitList.length
                }

                const newRecruit: RecruitItem = {
                    id: id + '',
                    title: title,
                    wage: wage,
                    content: content,
                    startAt: Timestamp.now(),
                }
                ac.recruitList = [...ac.recruitList, newRecruit]
                // console.log(ac.recruitList)

                t.update(accountRef, {
                    recruitList: ac.recruitList
                })

                return ac
            }
        }).then((ac:AccountDB) => {
            dispatch(setMyAccount(ac))

            navigation.navigate('MainTabNavigation')
        })
    }


    return (
        <Base.BaseView>
            <ScrollView>
                {myAccount?.image &&
                    <FastImage
                        source={{ uri: myAccount.image.uri }}
                        style={{ width: 150, height: 150 }}
                    />
                }

                {/* <Base.Text>구분 : {myAccount?.jobType === 'ceo' ? '사업자' : '구직자'}</Base.Text> */}
                <Base.Text>회사 : {myAccount?.co_name}</Base.Text>
                <Base.Text>업주명 : {myAccount?.name}</Base.Text>
                <Base.Text>주소 : {myAccount?.address}</Base.Text>

                <Base.TextInput
                    placeholder='제목 입력하세요.'
                    value={title}
                    onChangeText={setTitle}
                    style={styles.textinput}
                    placeholderTextColor={Color.PLACEHOLDER}
                    maxLength={100}
                />

                <Base.TextInput
                    placeholder='시급을 입력하세요.'
                    value={wage}
                    onChangeText={setWage}
                    keyboardType='number-pad'
                    style={styles.textinput}
                    placeholderTextColor={Color.PLACEHOLDER}
                    maxLength={9}
                />
                <Base.TextInput
                    placeholder='상세내용 입력하세요.'
                    value={content}
                    onChangeText={setContent}
                    style={[styles.textinput, styles.contentInput]}
                    placeholderTextColor={Color.PLACEHOLDER}
                    maxLength={200}
                    multiline={true}
                />

                <Base.Button
                    onPress={onAddRecruit}
                >
                    <Base.Text>등록하기</Base.Text>
                </Base.Button>
            </ScrollView>


        </Base.BaseView>
    )
}

export default RecruitScreen

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
