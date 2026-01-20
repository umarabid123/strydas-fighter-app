
import {
    Dimensions,
    Image,
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import AppButton from '../components/common/AppButton';
import AppText from '../components/common/AppText';
import Header from '../components/common/Header';
import AppLoader from '../components/common/AppLoader';
import LookingForListItem from '../components/common/LookingForListItem';
import { Colors } from '../constant';
import { getEventById } from '../services/eventService';
import { EventWithMatches, Match } from '../lib/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function EventDetail() {
    const route = useRoute();
    const navigation = useNavigation();
    const { eventId } = route.params as { eventId: string };
    const [event, setEvent] = useState<EventWithMatches | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadEventData();
    }, [eventId]);

    const loadEventData = async () => {
        try {
            setIsLoading(true);
            const eventData = await getEventById(eventId);
            setEvent(eventData);
        } catch (error) {
            console.error('Error loading event:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <Header isBack={true} />
                <AppLoader isLoading={true} />
            </View>
        );
    }

    if (!event) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <Header isBack={true} />
                <View style={styles.contentContainer}>
                    <AppText text="Event not found" color={Colors.white} fontSize={18} />
                </View>
            </View>
        );
    }

    const formattedDate = new Date(event.event_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero Section */}
                <ImageBackground
                    source={
                        event.image_url
                            ? { uri: event.image_url }
                            : require('../assets/images/event-detail-img.png')
                    }
                    style={styles.heroImage}
                    resizeMode="cover"
                >
                    <View style={styles.headerOverlay}>
                        <Header isBack={true} />
                    </View>
                    <View />
                </ImageBackground>

                <View style={styles.contentContainer}>
                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                        <View style={styles.tagsRow}>
                            {event.tags.map((tag: string, index: number) => (
                                <React.Fragment key={tag}>
                                    <AppText text={tag} color={Colors.light.success} fontSize={14} />
                                    {index < event.tags!.length - 1 && (
                                        <AppText text=" • " color={Colors.textSecondary} fontSize={14} />
                                    )}
                                </React.Fragment>
                            ))}
                        </View>
                    )}

                    {/* Title */}
                    <AppText
                        text={event.title}
                        fontSize={32}
                        style={styles.title}
                        color={Colors.white}
                        fontName="CircularStd-Bold"
                    />

                    {/* Date & Time */}
                    <View style={styles.infoSection}>
                        <AppText text="Date" color={Colors.white} fontSize={16} style={styles.label} />
                        <AppText text={formattedDate} color={Colors.textSecondary} fontSize={16} />
                        {event.event_time && (
                            <AppText text={event.event_time} color={Colors.textSecondary} fontSize={16} />
                        )}
                    </View>

                    {/* Address */}
                    {event.address && (
                        <View style={styles.infoSection}>
                            <AppText text="Address" color={Colors.white} fontSize={16} style={styles.label} />
                            <AppText
                                text={`${event.address}${event.city ? `, ${event.city}` : ''}${event.country ? `, ${event.country}` : ''}`}
                                color={Colors.textSecondary}
                                fontSize={16}
                            />
                        </View>
                    )}

                    {/* Description */}
                    {event.description && (
                        <View>
                            <AppText
                                text={event.description}
                                color={Colors.textSecondary}
                                fontSize={16}
                                style={{ lineHeight: 22, marginTop: 32 }}
                            />
                        </View>
                    )}

                    {/* Organizer */}
                    {event.organizer && (
                        <View style={styles.organizerSection}>
                            <Image
                                source={
                                    event.organizer.profile_image_url
                                        ? { uri: event.organizer.profile_image_url }
                                        : require('../assets/images/profile-img.png')
                                }
                                style={styles.organizerAvatar}
                            />
                            <View>
                                <AppText
                                    text={`${event.organizer.first_name || ''} ${event.organizer.last_name || ''}`}
                                    color={Colors.white}
                                    fontSize={18}
                                    style={{ fontWeight: 600 }}
                                />
                                <AppText
                                    text={`${event.organizer?.organisation || event.organizer.job_title || 'Organizer'}`}
                                    color={Colors.textSecondary}
                                    fontSize={13}
                                />
                            </View>
                        </View>
                    )}

                    {/* Looking For Section (Matches) */}
                    {event.matches && event.matches.length > 0 && (
                        <View style={[styles.section, { marginBottom: 0 }]}>
                            <AppText
                                text="Looking for"
                                fontSize={24}
                                color={Colors.white}
                                style={styles.sectionTitle}
                            />
                            <View style={styles.lookingForList}>
                                {event.matches.map((match: Match, index: number) => (
                                    <LookingForListItem
                                        key={match.id}
                                        tags={[match.sport_type, match.match_type]}
                                        weight={match.weight_class || ''}
                                        status="can_apply"
                                        customStyle={{
                                            borderBottomWidth: index === event.matches!.length - 1 ? 0 : undefined
                                        }}
                                    />
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Apply Section */}
                    <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.darkGray3 }}>
                        <AppButton
                            text="Apply"
                            btnStyle={styles.applyButton}
                            textStyle={styles.applyButtonText}
                            onPress={() => {
                                // TODO: Implement apply functionality
                                console.log('Apply for event');
                            }}
                        />
                    </View>

                    {/* More Links Section */}
                    <View style={styles.section}>
                        <AppText
                            text="More links"
                            fontSize={24}
                            color={Colors.white}
                            style={[styles.sectionTitle, { marginTop: 32 }]}
                        />
                        <View style={styles.linksContainer}>
                            {event.website_url && (
                                <AppButton
                                    text="Website"
                                    btnStyle={styles.linkButton}
                                    textStyle={styles.linkButtonText}
                                    onPress={() => {
                                        // TODO: Open website
                                        console.log('Open website:', event.website_url);
                                    }}
                                />
                            )}
                            {event.instagram_url && (
                                <AppButton
                                    text="Instagram"
                                    btnStyle={styles.linkButton}
                                    textStyle={styles.linkButtonText}
                                    onPress={() => {
                                        // TODO: Open Instagram
                                        console.log('Open Instagram:', event.instagram_url);
                                    }}
                                />
                            )}
                            {event.ticket_url && (
                                <AppButton
                                    text="Buy tickets"
                                    btnStyle={styles.linkButton}
                                    textStyle={styles.linkButtonText}
                                    onPress={() => {
                                        // TODO: Open ticket URL
                                        console.log('Buy tickets:', event.ticket_url);
                                    }}
                                />
                            )}
                            {!event.website_url && !event.instagram_url && !event.ticket_url && (
                                <AppText text="No links available" color={Colors.textSecondary} fontSize={14} />
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    heroImage: {
        width: SCREEN_WIDTH,
        height: 300,
        justifyContent: 'space-between',
    },
    headerOverlay: {
        paddingTop: 0,
    },
    contentContainer: {
        paddingHorizontal: 16,
        marginTop: 24
    },
    tagsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        marginBottom: 24,
        fontWeight: 600,
    },
    infoSection: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 4,
        fontWeight: '600',
    },
    readMore: {
        fontWeight: '700',
        marginTop: 8,
    },
    organizerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 32,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.darkGray3,
        paddingBottom: 32
    },
    organizerAvatar: {
        width: 60,
        height: 60,
        borderRadius: 66,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 16,
        fontWeight: 600,
    },
    lookingForList: {
        backgroundColor: Colors.darkGray1,
        borderRadius: 12,
        paddingTop: 16,
        gap: 8,
    },
    applyButton: {
        backgroundColor: Colors.light.success,
        width: '100%',
        marginBottom: 32,
        borderRadius: 100,
        paddingVertical: 16
    },
    applyButtonText: {
        color: Colors.black,
        fontWeight: 600,
        fontSize: 16,
    },
    linksContainer: {
        gap: 12,
    },
    linkButton: {
        backgroundColor: Colors.white,
        width: '100%',
        marginTop: 0,
        borderRadius: 100,
        paddingVertical: 16
    },
    linkButtonText: {
        color: Colors.black,
        fontWeight: 600,
        fontSize: 16,
    },
});
