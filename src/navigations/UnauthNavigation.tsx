import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';


import SingInUpScreen from '~/screens/unauth/SingInUpScreen'

import Join_SignIn from '~/screens/unauth/Join_SignIn'
import Join_SignUp from '~/screens/unauth/Join_SignUp'

import Join_Ceo from '~/screens/unauth/Join_Ceo'
import Join_Staff from '~/screens/unauth/Join_Staff'

import Join_Address from '~/screens/unauth/Join_Address'


const Stack = createStackNavigator<UnauthParamList>();

const UnauthNavigation = () => (
    <Stack.Navigator 
        initialRouteName = 'SingInUpScreen'
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
    >
        <Stack.Screen name ='SingInUpScreen' component={SingInUpScreen} options={{headerShown:false}} />

        <Stack.Screen name ='Join_SignIn' component={Join_SignIn} options={{title:'로그인', headerTitleAlign:'center'}}/> 
        <Stack.Screen name ='Join_SignUp' component={Join_SignUp} options={{title:'회원가입', headerTitleAlign:'center'}} />

        <Stack.Screen name ='Join_Ceo' component={Join_Ceo} options={{title:'기업 회원가입', headerTitleAlign:'center'}}/>
        <Stack.Screen name ='Join_Staff' component={Join_Staff} options={{title:'개인 회원가입', headerTitleAlign:'center'}}/>

        <Stack.Screen name ='Join_Address' component={Join_Address} options={{title:'주소 찾기', headerTitleAlign:'center'}}/>

    </Stack.Navigator>
)


export default UnauthNavigation