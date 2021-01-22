import React, { FC, useCallback, useState } from 'react'
import { StyleSheet, ScrollView, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Base from '~/common/base'
import { openCropPicker } from '~/common/ImagePicker'
import FastImage from 'react-native-fast-image';

import Color from '~/common/Color'

import { API_SMS } from '~/api'
import { appType, getAppName } from '~/../CONFIG'

import Icon from '~/common/Icon';

import { ReduxState, setMyAccount, setTemporaryAccount, changeScene } from '~/store'

import { db, serverTimestamp } from '~/common/functions';
import auth from '@react-native-firebase/auth';

import storage from '@react-native-firebase/storage';

import SimpleStore from '~/common/SimpleStore';
import ImageResizer from 'react-native-image-resizer';

type Props = {
    navigation: StackNavigationProp<UnauthParamList, 'Join_Staff'>
}

const Join_Staff: FC<Props> = ({ navigation }) => {
    const dispatch = useDispatch();

    const { temporaryAccount } = useSelector((state: ReduxState) => state.unauth);

    const [phoneNumber, setPhoneNumber] = useState('');
    const [image, setImage] = useState('')
    const [verifyChk, setVerifyChk] = useState(false)
    const [username, setUserName] = useState('');
    const [certificationCode, setCertificationCode] = useState('');

    const [chkName, setChkName] = useState(false)
    const [chkAdress, setChkAdress] = useState(false)
    const [chkPhoneNumber, setChkPhoneNumber] = useState(false)
    const [chkVertifyNumber, setchkVertifyNumber] = useState(false)

    const openGallery = useCallback(() => {
        openCropPicker(1080, 1080).then(img => {
            if (img) {
                ImageResizer.createResizedImage(img.path, 200, 200, 'JPEG', 100)
                    .then(response => {
                        //여기 들어오기 전에 검사해서 들어온거라 사실 상관없는데 에러때문에 써줌
                        img.width = response.width;
                        img.height = response.height;
                        img.path = response.uri;

                        setImage(img.path)
                    }).catch(err => {
                    })
            }
        })
    }, [])

    const certificationButton = useCallback(async () => {

        let regExp = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;

        if (regExp.test(phoneNumber)) {
            API_SMS({
                appName: getAppName(),
                appType: appType,
                phoneNumber: phoneNumber
            }).then(res => {
                // console.log(res)
                if (res.isSuccess) {
                    dispatch(setTemporaryAccount({ phoneNumber: phoneNumber }))
                    setVerifyChk(true)
                }
                else {
                    if (res.error === 'over try') {
                        Alert.alert('인증 가능한 횟수를 초과하였습니다. 고객센터에 문의해주세요.');
                    } else {
                        console.log(res.error);
                    }
                }
            })
        } else {
            Alert.alert('번호', '알맞은 번호를 입력해주세요')
        }

    }, [phoneNumber])

    const singInButton = useCallback(() => {

        if (username === '') {
            return setChkName(true)
        } else
            setChkName(false)

        if (temporaryAccount.address === undefined) {
            return setChkAdress(true)
        } else
            setChkAdress(false)

        if (phoneNumber === '') {
            return setChkPhoneNumber(true)
        } else
            setChkPhoneNumber(false)

        if (certificationCode === '') {
            return setchkVertifyNumber(true)
        } else
            setchkVertifyNumber(false)

        const certificationRef = db.doc(`Certification/${appType}_${temporaryAccount.phoneNumber}`)
        //동시 접속 할수 없게 하기위해
        db.runTransaction(async t => {
            const certificationDoc = await t.get(certificationRef)

            if (certificationDoc.exists) {
                const certificationData = certificationDoc.data() as CertificationDB

                if (certificationData.tryCertificateCount >= 3) {
                    throw new Error('over try')
                } else if (certificationCode === certificationData.certificationCode) {
                    t.delete(certificationRef)
                } else {
                    //인증실패
                    t.update(certificationRef, {
                        tryCertificateCount: certificationData.tryCertificateCount + 1
                    })

                    return false;
                }
                return true
            } else {
                throw new Error('no data')
            }
        }).then((isSuccess: boolean) => {
            if (isSuccess) {
                db.collection('Account')
                    .where('appType', '==', appType)
                    .where('phoneNumber', '==', temporaryAccount.phoneNumber)
                    .limit(1)
                    .get()
                    .then(snapshots => {
                        if (snapshots.empty) {
                            //신규가입일때
                            createAccount();
                            dispatch(changeScene('Auth'))
                        } else {
                            //이미 계정이 있을때
                            Alert.alert('이미 가입된 번호가 있습니다.')
                        }
                    })
            } else {
                Alert.alert('잘못된 인증번호')
            }

        }).catch(err => {
            if (err.message === 'no data') {
                return Alert.alert('인증 정보 없음')
            } else if (err.message === 'over try') {
                return Alert.alert('인증시도 초과 ')
            }
        })


    }, [username, temporaryAccount.address, phoneNumber, certificationCode])

    const createAccount = async () => {
        try {
            //firebase 계정 생성, 비번은 임시로 설정
            const credential = await auth().createUserWithEmailAndPassword(appType + temporaryAccount.phoneNumber + '@member.com', 'KrJrr87')

            const uid = credential.user.uid

            const checkUniqueId = await db.collection('PhoneNumber').doc(temporaryAccount.phoneNumber).get();
            if (!checkUniqueId.exists) {
                db.collection('PhoneNumber').doc(appType + '_' + temporaryAccount.phoneNumber).set({
                    createAt: serverTimestamp()
                })
            }

            if (image) {
                const name = 'account_' + Base.createKeyByTime();
                const ref = storage().ref().child(`Account/${uid}/${name}.jpg`);
                await ref.putFile(image);

                const downloadUrl = await ref.getDownloadURL();

                const img: UserImage = {
                    uri: downloadUrl,
                    width: 200,
                    height: 200,
                    name: name,
                    createAt: serverTimestamp(),
                    id: name
                }

                const accountData = accountList(temporaryAccount, uid, img)

                await SimpleStore.save<LoginInfoCache>('loginInfoCache', {
                    phoneNumber: temporaryAccount.phoneNumber!,
                    uid: uid
                })

                await db.collection('Account').doc(uid).set(accountData);
                dispatch(setMyAccount(accountData))
            }
            else {

                const accountData = accountList(temporaryAccount, uid, Object())

                await SimpleStore.save<LoginInfoCache>('loginInfoCache', {
                    phoneNumber: temporaryAccount.phoneNumber!,
                    uid: uid
                })

                await db.collection('Account').doc(uid).set(accountData);
                dispatch(setMyAccount(accountData))
            }
        } catch (err) {
            console.log(err)
        }
    }

    const accountList = (temporaryAccount: Partial<AccountDB>, uid: string, img: UserImage) => {
        const accountData: AccountDB = {
            state: 'login',
            id: uid,
            jobType: temporaryAccount.jobType!,
            name: username,
            phoneNumber: temporaryAccount.phoneNumber!,
            longitude: temporaryAccount.longitude!,
            latitude: temporaryAccount.latitude!,
            address: temporaryAccount.address!,
            image: img,
            recruitList: [],
        }

        return accountData
    }

    return (
        <ScrollView
            keyboardShouldPersistTaps='always'
        >
            <Base.CenterButton
                onPress={openGallery}
                style={styles.image}
            >
                {image != '' ?
                    <FastImage
                        source={{ uri: image }}
                        style={styles.fastImg}
                    />
                    :
                    <Icon.MaterialIcons name='add' size={30} color={Color.PLACEHOLDER} />
                }
            </Base.CenterButton>

            <Base.TextInput
                placeholder='이름'
                onBlur={() => {
                    if (username === '') {
                        setChkName(true)
                    } else {
                        setChkName(false)
                    }
                }}
                value={username}
                onChangeText={setUserName}
                style={styles.textinput}
                placeholderTextColor={Color.PLACEHOLDER}
                maxLength={100}
            />
            { chkName &&
                <Base.Text style={{ color: 'red', paddingHorizontal: 20 }} >이름을 입력해주세요.</Base.Text>
            }

            <Base.Button
                style={styles.Button}
                onPress={() => {
                    setChkAdress(false)
                    navigation.navigate('Join_Address')
                    // address()
                }}
            >
                <Base.Text style={{ color: chkAdress ? 'red' : 'white', paddingHorizontal: 20, }}>
                    {temporaryAccount.address ?
                        temporaryAccount.address
                        :
                        chkAdress ? '주소를 입력해주세요!!' :
                            '주소찾기'
                    }
                </Base.Text>
            </Base.Button>

            <Base.BaseView
                style={{ flexDirection: 'row', justifyContent: 'space-between', }}
            >
                <Base.TextInput
                    placeholder={`'-'없이 숫자만 입력`}
                    onBlur={() => {
                        if (phoneNumber === '') {
                            setChkPhoneNumber(true)
                        } else {
                            setChkPhoneNumber(false)
                        }
                    }}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType='number-pad'
                    style={{ width: '60%', paddingHorizontal: 20, color: Color.text.base }}
                    placeholderTextColor={Color.PLACEHOLDER}
                    maxLength={11}
                />
                <Base.Button
                    onPress={certificationButton}
                    style={{
                        paddingHorizontal: 30, justifyContent: 'center', backgroundColor: '#62a8dc'
                        , borderRadius: 5
                    }}
                >
                    <Base.Text style={{ color: 'white' }}>인증 요청</Base.Text>
                </Base.Button>
            </Base.BaseView>
            { chkPhoneNumber &&
                <Base.Text style={{ color: 'red', paddingHorizontal: 20 }} >전화번호를 입력해주세요.</Base.Text>
            }

            {verifyChk &&
                <Base.TextInput
                    placeholder='인증번호를 입력해주세요.'
                    value={certificationCode}
                    onChangeText={setCertificationCode}
                    keyboardType='number-pad'
                    style={styles.textinput}
                    placeholderTextColor={Color.PLACEHOLDER}
                    maxLength={6}
                />
            }

            { chkVertifyNumber &&
                <Base.Text style={{ color: 'red', paddingHorizontal: 20 }} >인증번호를 입력해주세요.</Base.Text>
            }

            <Base.Button
                style={styles.Button}
                onPress={singInButton}
            >
                <Base.Text style={{ color: 'white', paddingHorizontal: 20, }}>가입하기</Base.Text>
            </Base.Button>

        </ScrollView>

    )
}

export default Join_Staff

const styles = StyleSheet.create({
    image: {
        width: 120, height: 120, borderRadius: 30, backgroundColor: 'white', marginTop: 20, alignSelf: 'center'
    },
    fastImg: {
        width: 120, height: 120, borderRadius: 30, backgroundColor: 'white', alignSelf: 'center'
    },

    textinput: {
        color: Color.text.base,
        width: '100%', paddingHorizontal: 20,
        backgroundColor: 'white', borderRadius: 10, height: 50, marginTop: 20
    },

    Button: {
        alignSelf: 'center',
        width: '100%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        backgroundColor: '#62a8dc',
        marginTop: 20,
        marginBottom: 20
    },
})