import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import AppText from './AppText';
import { Colors } from '../../constant';

type Props = {
    label: string;
    value?: string;
    children?: React.ReactNode;
    labelStyle?: TextStyle | any;
    containerStyle?: ViewStyle;
};

const InfoRow = ({ label, value, children, labelStyle, containerStyle }: Props) => {
    return (
        <View style={styles.profileRow}>
            <View style={styles.labelContainer}>
                <AppText
                    text={label}
                    fontSize={14}
                    color={Colors.white}
                    style={[styles.rowLabel, labelStyle]}
                />
            </View>
            <View style={styles.valueContainer}>
                {value ? (
                    <AppText text={value} fontSize={16} color={Colors.textSecondary} style={{ fontWeight: 300 }} />
                ) : (
                    children
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
    },
    labelContainer: {
        width: 120, // Fixed width for alignment
        marginRight: 24, // Gap between label and value
        alignItems: 'flex-start',
    },
    rowLabel: {
        fontWeight: '600',
    },
    valueContainer: {
        flex: 1,
    },
});

export default InfoRow;
