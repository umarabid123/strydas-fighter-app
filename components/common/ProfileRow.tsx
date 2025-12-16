import { Colors } from "@/constant";
import { StyleSheet, View } from "react-native";
import AppText from "./AppText";

export default function ProfileRow({ label, value, children, labelStyle }: any) {
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
                    <AppText text={value} fontSize={16} color={Colors.white} style={{ fontWeight: '300' }} />
                ) : (
                    children
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    labelContainer: {
        flex: 1,
    },
    rowLabel: {
        fontWeight: '300',
    },
    valueContainer: {
        flex: 1,
    },
});