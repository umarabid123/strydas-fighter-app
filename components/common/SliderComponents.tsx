import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../constant';

export const Thumb = memo(() => {
    return <View style={styles.thumb} />;
});

export const Rail = memo(() => {
    return <View style={styles.rail} />;
});

export const RailSelected = memo(() => {
    return <View style={styles.railSelected} />;
});

const styles = StyleSheet.create({
    thumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    rail: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    railSelected: {
        height: 4,
        backgroundColor: Colors.white,
        borderRadius: 2,
    },
});
