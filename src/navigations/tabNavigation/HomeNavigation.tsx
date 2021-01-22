import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import HomeScreen from '~/screens/auth/home/HomeScreen'
const Stack = createStackNavigator<HomeParamList>();

const HomeNavigation = () => {
    return (
        <Stack.Navigator
            headerMode='none'
            screenOptions={{
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
        >
            <Stack.Screen name='HomeScreen' component={HomeScreen}  />
          
        </Stack.Navigator>
    )
}

export default HomeNavigation
