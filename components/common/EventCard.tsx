import React from "react";
import { Image, ImageSourcePropType, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constant";
import AppText from "./AppText";

export interface MatchItem {
    id: string;
    tags: string[];
    status: 'can_apply' | 'cannot_apply';
    avatar?: ImageSourcePropType;
}

interface EventCardProps {
    title: string;
    date: string;
    imageSource: ImageSourcePropType;
    matches: MatchItem[];
    onPress?: () => void;
}

export default function EventCard({
    title,
    date,
    imageSource,
    matches,
    onPress,
}: EventCardProps) {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={imageSource} style={styles.eventImage} resizeMode="cover" />
                <View style={styles.headerInfo}>
                    <AppText
                        text={title}
                        fontSize={18}
                        fontName="CircularStd-Bold"
                        color={Colors.white}
                    />
                    <AppText
                        text={date}
                        fontSize={14}
                        fontName="CircularStd-Book"
                        color={Colors.textSecondary}
                        style={{ marginTop: 2 }}
                    />
                </View>
            </View>

            {/* Matches List */}
            <View style={styles.matchesContainer}>
                {matches.map((match) => (
                    <View key={match.id}>
                        <View style={styles.separator} />
                        <View style={styles.matchRow}>
                            {/* Avatar */}
                            <View style={styles.avatarContainer}>
                                {match.avatar ? (
                                    <Image source={match.avatar} style={styles.avatar} />
                                ) : (
                                    <Image source={require('../../assets/images/user-avatar-icon.png')} style={styles.avatar} />
                                )}
                            </View>

                            {/* Details */}
                            <View style={styles.matchDetails}>
                                {/* Tags */}
                                <View style={styles.tagsRow}>
                                    {match.tags.map((tag, i) => (
                                        <View key={i} style={styles.tag}>
                                            <AppText
                                                text={tag}
                                                fontSize={16}
                                                fontName="CircularStd-Medium"
                                                color={Colors.textSecondary}
                                            />
                                        </View>
                                    ))}
                                </View>

                                {/* Status */}
                                <TouchableOpacity style={styles.statusRow}>
                                    <Image
                                        source={match.status === 'can_apply'
                                            ? require('../../assets/images/check-icon.png')
                                            : require('../../assets/images/cross-icon.png')
                                        }
                                        style={styles.statusIcon}
                                        resizeMode="contain"
                                    />
                                    <AppText
                                        text={match.status === 'can_apply' ? "You can apply" : "You can't apply"}
                                        fontSize={14}
                                        fontName="CircularStd-Medium"
                                        color={match.status === 'can_apply' ? Colors.green : "#D14A4A"}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    eventImage: {
        width: 80,
        height: 80,
        borderRadius: 6,
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    matchesContainer: {
        gap: 0,
    },
    matchRow: {
        flexDirection: 'row',
        paddingVertical: 12,
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    avatarContainer: {
        marginRight: 12,
        justifyContent: 'flex-start',
        paddingTop: 0,
    },
    avatar: {
        width: 47,
        height: 47,
        borderRadius: 20,
    },
    matchDetails: {
        flex: 1,
        gap: 6,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    tag: {
        backgroundColor: '#353535',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statusIcon: {
        width: 12,
        height: 12,
    },
});
