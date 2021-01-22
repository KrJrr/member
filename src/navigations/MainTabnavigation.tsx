import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeNavigation from './tabNavigation/HomeNavigation';
import ProfileNavigation from './tabNavigation/ProfileNavigation';
import Icon from '~/common/Icon';

const MainTab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigation = () => {
    return (
        <MainTab.Navigator
            initialRouteName='HomeNavigation'
        >
            <MainTab.Screen
                name='HomeNavigation'
                component={HomeNavigation}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({color, size}) => (
                        <Icon.AntDesign name='home' color={color} size={size}/>
                    )
                }}
            />
            <MainTab.Screen
                name='ProfileNavigation'
                component={ProfileNavigation}
                options={{
                    tabBarLabel: 'MyInfo',
                    tabBarIcon: ({color, size}) => (
                        <Icon.AntDesign name='profile' color={color} size={size}/>
                    )
                }}
            />

        </MainTab.Navigator >
    )
}
export default MainTabNavigation;