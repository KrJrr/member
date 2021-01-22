import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'

import MainTabNavigation from '~/navigations/MainTabnavigation'
import RecruitScreen from '~/screens/auth/home/RecruitScreen'
import CoInfoScreen from '~/screens/auth/home/CoInfoScreen'

const Stack = createStackNavigator<AuthParamList>();

const AuthNavigation = () => {

    return (
        <Stack.Navigator 
            headerMode='none'
            screenOptions={{
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
        >
            <Stack.Screen name='MainTabNavigation' component={MainTabNavigation} />
            <Stack.Screen name='RecruitScreen' component={RecruitScreen} />
            <Stack.Screen name='CoInfoScreen' component={CoInfoScreen} />
        </Stack.Navigator>
    )
}


export default AuthNavigation;