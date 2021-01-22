import React from 'react'
import * as Base from '~/common/base'
import RootNavigation from '~/navigations/RootNavigation'

import { StyleSheet, Text, View } from 'react-native'

const AppNavigator = () => {
    return (
        <Base.BaseView>
            <RootNavigation />
        </Base.BaseView>
    )
}

export default AppNavigator

