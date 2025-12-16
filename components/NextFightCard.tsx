import React from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '../constant';
import AppText from './common/AppText';

interface NextFightCardProps {
    title: string;
    date: string;
    image: any;
    containerStyle?: ViewStyle;
}

export default function NextFightCard({ title, date, image, containerStyle }: NextFightCardProps) {
    return (
        <View style={[styles.container, containerStyle]}>
            <Image source={image} style={styles.image} resizeMode="contain" />
            <View style={styles.textContainer}>
                <AppText text={title} fontSize={18} color={Colors.white} style={styles.title} />
                <AppText text={date} fontSize={14} color={Colors.textSecondary} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#262a2b',
        padding: 8,
        borderRadius: 12,
        gap: 16,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 6,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontWeight: 600,
        marginBottom: 4,
    },
});
