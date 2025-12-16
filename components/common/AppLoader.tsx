import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../../constant';

interface AppLoaderProps {
    isLoading: boolean;
    color?: string;
}

const AppLoader = ({ isLoading, color = Colors.textSecondary }: AppLoaderProps) => {
    if (!isLoading) return null;

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={color} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 999,
    },
});

export default AppLoader;
