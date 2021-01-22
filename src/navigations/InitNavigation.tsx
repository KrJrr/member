import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import InitScreen from '~/screens/init/InitScreen';

const InitStack = createStackNavigator<InitStackParamList>();

const InitNavigation = () => (
    <InitStack.Navigator screenOptions={{
        headerShown: false,
    }}
    >
        <InitStack.Screen name='InitScreen' component={InitScreen} />
    </InitStack.Navigator>
)

export default InitNavigation;