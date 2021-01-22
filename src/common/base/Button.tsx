import React, { useRef, useEffect, FC, memo, useCallback, useMemo } from 'react';
import {
    TouchableOpacity, TouchableOpacityProps, StyleSheet,
    GestureResponderEvent,
} from 'react-native';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

export const Button: FC<TouchableOpacityProps> = ({ onPress, style, ...props }) => {
    const click$ = useRef(new Subject<GestureResponderEvent>());
    useEffect(() => {
        const unsub = click$.current.pipe(
            throttleTime(500)
        ).subscribe(
            onPress
        );
        return () => {
            if (unsub) unsub.unsubscribe();
        }
    }, [onPress]);
    const onClick = useCallback((event: GestureResponderEvent) => {
        click$.current.next(event);
    }, []);

    return (
        <TouchableOpacity
            style={[style]}
            {...props}
            onPress={onClick}
        />
    )
}

export const CenterButton: FC<TouchableOpacityProps> = props => (
    <Button
        {...props}
        style={[styles.centerView, props.style]}>
        {props.children}
    </Button>
)

const styles = StyleSheet.create({
    centerView: { alignItems: 'center', justifyContent: 'center' },
    rowView: { flexDirection: 'row', alignItems: 'center' },
})