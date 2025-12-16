import { Image, StyleSheet, View } from 'react-native';
import { Colors } from '../../constant';
import AppText from './AppText';

interface LookingForListItemProps {
    avatar?: any; // Allow requiring images
    tags: string[];
    status: 'can_apply' | 'cannot_apply';
    weight: string;
    customStyle?: any;
}

export default function LookingForListItem({
    avatar,
    tags,
    status,
    weight,
    customStyle
}: LookingForListItemProps) {
    const isCanApply = status === 'can_apply';

    return (
        <View style={[styles.container, customStyle]}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
                {avatar ? (
                    <Image source={avatar} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, { backgroundColor: Colors.darkGray3 }]} >
                        <Image source={require('../../assets/images/profile.png')} style={styles.avatar} />
                    </View>
                )}
            </View>

            <View style={styles.contentContainer}>
                {/* Tags Row */}
                <View style={styles.tagsRow}>
                    {tags.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                            <AppText text={tag} fontSize={14} color={Colors.white} />
                        </View>
                    ))}
                    <View style={styles.tag}>
                        <AppText text={weight} fontSize={14} color={Colors.white} />
                    </View>
                </View>

                {/* Status Row */}
                <View style={styles.statusRow}>
                    {isCanApply ? (
                        // <Check size={14} color={Colors.light.success} {...({} as any)} />
                        <Image source={require('../../assets/images/check-icon.png')} style={styles.statusIcon} />
                    ) : (
                        <Image source={require('../../assets/images/cross-icon.png')} style={styles.statusIcon} />
                    )}
                    <AppText
                        text={isCanApply ? 'You can apply' : "You can't apply"}
                        fontSize={14}
                        color={isCanApply ? Colors.successGreen : Colors.errorRed}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.darkGray3,
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    contentContainer: {
        flex: 1,
        gap: 6,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        backgroundColor: Colors.whiteOpacity20,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusIcon: {
        width: 14,
        height: 14,
    },
});
