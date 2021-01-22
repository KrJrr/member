import React, { FC, useMemo } from 'react';
import {
    View as RnView, ViewProps, StyleSheet,
    ActivityIndicator, KeyboardAvoidingView, Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import Color from '~/common/Color'

const View: FC<ViewProps> = ({style, ...props}) => {
    return (
        <RnView 
            style={[style]}
             {...props}
        />
    )
}

export const BaseView: FC<ViewProps>  = props => 
{
    return(
        <View style={[styles.baseView, props.style]}>
            {props.children}
        </View>
    )
    
}

export const FlexView: FC<ViewProps> = props => (
    <View style={[styles.flex, props.style]}>
        {props.children}
    </View>
)


const styles = StyleSheet.create({
    baseView: { flex: 1, backgroundColor: Color.background.primary },
    flex: { flex: 1 },
})