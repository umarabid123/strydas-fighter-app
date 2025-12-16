import { Colors } from "@/constant";
import { Image, StyleSheet, View } from "react-native";
import AppText from "./AppText";

export default function Tag({ text, icon }: { text: string; icon?: any }) {
    return (
        <View style={styles.tag}>
            <AppText text={text} fontSize={16} color={Colors.white} />
            {icon && <Image source={icon} style={styles.tagIcon} />}
        </View>
    );
}

const styles = StyleSheet.create({
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    tagIcon: {
        width: 24,
        height: 24,
    },
});

