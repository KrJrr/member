import React, { FC, useMemo } from 'react';
import {
    Text as T, TextProps
} from 'react-native';

export const Text: FC<TextProps> = ({ children, style, ...props }) => {

    return (
        <T
            style={[style]}
            {...props}
        >
            {children}
        </T>
    )
}