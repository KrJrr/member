import React, { useEffect, useState } from 'react';
import {
    NavigationContainer, NavigationState,
    NavigationContainerRef
} from '@react-navigation/native';
import { useSelector } from 'react-redux';
import InitNavigation from '~/navigations/InitNavigation'
import UnauthNavigation from '~/navigations/UnauthNavigation'
import AuthNavigation from '~/navigations/AuthNavigation'
import { ReduxState } from '~/store';

const RootNavigation = () => {

    const { sceneState } = useSelector((state: ReduxState) => state.scene);
    const renderNavigation = () => {
        if (sceneState === 'Init')
            return <InitNavigation />
        else if (sceneState === 'Unauth')
            return <UnauthNavigation />
        else if (sceneState === 'Auth') {
            return <AuthNavigation />
        }
    }
    return (
        <NavigationContainer>
            {renderNavigation()}
        </NavigationContainer>
    )
}


export default RootNavigation