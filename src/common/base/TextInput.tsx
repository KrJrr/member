import React, {
    FC, forwardRef, useRef,
    ForwardRefRenderFunction, useImperativeHandle
} from 'react';

import {
    TextInput as RNTextInput, TextInputProps, StyleSheet, FlatList
} from 'react-native';

// export type InputProps = {
//     focus: () => void;
// }

export type Ref = RNTextInput;

export const TextInput = forwardRef<Ref, TextInputProps>((props, ref) => {
    return (
        <RNTextInput
            ref={ref}
            {...props}
            style={[props.style, styles.baseStyle]}
        />
    )
});


const styles = StyleSheet.create({
    baseStyle: {
    }
})