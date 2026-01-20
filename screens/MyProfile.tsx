import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import AppButton from '../components/common/AppButton';
import AppText from '../components/common/AppText';
import Header from '../components/common/Header';
import NextFightCard from '../components/NextFightCard';
import { Colors } from '../constant';
import { profileService, fightersManagedService } from '../services/profileService';
import { ProfileWithRelations } from '../lib/types';


const Tag = ({ text, icon }: { text: string; icon?: any }) => (
    <View style={styles.tag}>
        <AppText text={text} fontSize={16} color={Colors.white} />
        {icon && <Image source={icon} style={styles.tagIcon} />}
    </View>
);

const ProfileRow = ({ label, value, children, labelStyle }: any) => (
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

export default function MyProfile() {
    const navigation = useNavigation<any>()
    const [profile, setProfile] = useState<ProfileWithRelations | null>(null);
    const [managedFighters, setManagedFighters] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            // TODO: Get profile ID from auth context or storage
            const profileId = 'default-profile-id'; // Replace with actual profile ID
            const data = await profileService.getProfileById(profileId);
            setProfile(data);

            // If profile is an organizer, load managed fighters
            if (data?.role === 'organizer') {
                const fighters = await fightersManagedService.getFightersByOrganizerId(profileId);
                setManagedFighters(fighters);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <AppText text="Loading..." color={Colors.white} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header isBack={true} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        {profile?.profile_image_url ? (
                            <Image
                                source={{ uri: profile.profile_image_url }}
                                style={styles.avatar}
                            />
                        ) : (
                            <Image
                                source={require('../assets/images/event-card-img.png')}
                                style={styles.avatar}
                            />
                        )}
                    </View>
                    <AppText 
                        text={`${profile?.first_name || ''} ${profile?.last_name || ''}`} 
                        fontSize={32} 
                        color={Colors.white} 
                        style={styles.nameText} 
                    />
                    {profile?.division && (
                        <AppText 
                            text={`${profile.division}`} 
                            fontSize={16} 
                            color={Colors.textSecondary} 
                            style={styles.orgText} 
                        />
                    )}

                    <View style={styles.tagsRow}>
                        {profile?.sports_records && profile.sports_records.length > 0 && (
                            <>
                                {profile.sports_records.map((record) => (
                                    <Tag 
                                        key={record.id}
                                        text={`${record.wins}-${record.losses}-${record.draws}`} 
                                    />
                                ))}
                            </>
                        )}
                        {profile?.weight_division && (
                            <Tag text={`${profile.weight_division} kg`} />
                        )}
                        {profile?.country && (
                            <Tag text={profile.country} icon={require('../assets/images/flag-icon.png')} />
                        )}
                        {profile?.sports_records && profile.sports_records.length > 0 && (
                            <Tag text={profile.sports_records[0].sport_name} />
                        )}
                    </View>

                    <AppButton
                        text="Edit profile"
                        btnStyle={styles.editButton}
                        textStyle={styles.editButtonText}
                    />
                </View>

                <View style={styles.divider} />

                {/* Info Section */}
                <View style={styles.infoSection}>
                    {profile?.date_of_birth && (
                        <ProfileRow 
                            label="Age" 
                            value={`${new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()} years`} 
                        />
                    )}
                    {profile?.weight_division && profile.weight_range && (
                        <ProfileRow 
                            label="Weight" 
                            value={`${profile.weight_division} kg  ± ${profile.weight_range} kg`} 
                        />
                    )}
                    {profile?.division && (
                        <ProfileRow label="Division" value={profile.division} />
                    )}
                    {profile?.height && (
                        <ProfileRow label="Height" value={`${profile.height} cm`} />
                    )}

                    {profile?.sports_records && profile.sports_records.length > 0 && (
                        <>
                            {profile.sports_records.map((record) => (
                                <ProfileRow 
                                    key={record.id}
                                    label={record.sport_name} 
                                    value={`${record.wins}W – ${record.losses}L – ${record.draws}D`} 
                                    labelStyle={styles.statLabel} 
                                />
                            ))}
                        </>
                    )}

                    {profile?.gender && (
                        <ProfileRow label="Gender" value={profile.gender} />
                    )}
                    {profile?.country && (
                        <ProfileRow label="Country">
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Image source={require('../assets/images/flag-icon.png')} style={styles.flagIconSmall} />
                                <AppText text={profile.country} fontSize={16} color={Colors.textSecondary} />
                            </View>
                        </ProfileRow>
                    )}
                    {profile?.gym && (
                        <ProfileRow label="Gym" value={profile.gym} />
                    )}
                </View>

                <View style={styles.divider} />

                {/* Manager Section - Show if profile is an organizer with managed fighters */}
                {profile?.role === 'organizer' && managedFighters.length > 0 && (
                    <>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('OrganizerScreen')}>
                            <AppText text="Manager" fontSize={18} color={Colors.white} style={styles.sectionTitle} />
                            {/* Display organizer info from managed fighters */}
                            {managedFighters.map((relation) => (
                                <View key={relation.id} style={styles.managerCard}>
                                    <Image source={require('../assets/images/profile-img.png')} style={styles.managerAvatar} />
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingBottom: 8 }}>
                                            <AppText 
                                                text={`${relation.fighter?.first_name || ''} ${relation.fighter?.last_name || ''}`}
                                                fontSize={18} 
                                                color={Colors.white} 
                                                style={{ fontWeight: '600' }} 
                                            />
                                            {relation.fighter?.country && (
                                                <Image source={require('../assets/images/flag-icon.png')} style={styles.flagIconSmall} />
                                            )}
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <AppText 
                                                text={relation.relationship_type} 
                                                fontSize={14} 
                                                color={Colors.textSecondary} 
                                                style={styles.managerTag} 
                                            />
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </TouchableOpacity>
                    </>
                )}

                <View style={styles.divider} />

                {/* Next Fights Section */}
                <View style={styles.section}>
                    <AppText text="Next Fights" fontSize={18} color={Colors.white} style={styles.sectionTitle} />
                    <NextFightCard
                        title="ADFC 4.0 – Zaman vs Lai..."
                        date="Oct 11, 2025"
                        image={require('../assets/images/next-card-img.png')} // Placeholder for logo
                    />
                </View>

                <View style={styles.divider} />

                {/* Links Section */}
                <View style={styles.section}>
                    <AppText text={`${profile?.first_name || ''}'s links`} fontSize={24} color={Colors.white} style={styles.sectionTitle} />
                    <View style={styles.linksContainer}>
                        {profile?.social_links && profile.social_links.length > 0 ? (
                            profile.social_links.map((link) => (
                                <AppButton 
                                    key={link.id}
                                    text={link.platform} 
                                    btnStyle={styles.linkButton} 
                                    textStyle={styles.linkButtonText} 
                                />
                            ))
                        ) : (
                            <>
                                <AppButton text="Website" btnStyle={styles.linkButton} textStyle={styles.linkButtonText} />
                                <AppButton text="Instagram" btnStyle={styles.linkButton} textStyle={styles.linkButtonText} />
                                <AppButton text="Buy tickets" btnStyle={styles.linkButton} textStyle={styles.linkButtonText} />
                            </>
                        )}
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: Platform.OS === 'ios' ? 0 : 20
    },
    scrollContent: {
        paddingBottom: 100,
    },
    profileSection: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    avatarContainer: {
        marginBottom: 16,
        borderRadius: 60,
        overflow: 'hidden',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    roleText: {
        marginBottom: 8,
    },
    nameText: {
        marginBottom: 4,
        fontWeight: '700',
        textAlign: 'center',
    },
    orgText: {
        marginBottom: 24,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 24,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
        gap: 6,
    },
    tagIcon: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    editButton: {
        backgroundColor: Colors.successGreenAlt,
        width: '100%',
        borderRadius: 100,
    },
    editButtonText: {
        color: Colors.black,
        fontWeight: '700',
        fontSize: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 32,
    },
    infoSection: {
        paddingHorizontal: 20,
        gap: 24,
    },
    statLabel: {
        backgroundColor: '#2C2C2C', // Dark grey background
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20, // Rounded corners
        overflow: 'hidden',
        textAlign: 'center',
        fontWeight: '600',
    },
    flagIconSmall: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    section: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        marginBottom: 24,
        fontWeight: '700',
    },
    managerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    managerAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    managerTag: {
        backgroundColor: '#333',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 99,
        overflow: 'hidden',
    },
    socialIcon: {
        width: 16,
        height: 16
    },
    linksContainer: {
        gap: 12,
    },
    linkButton: {
        backgroundColor: Colors.white,
        width: '100%',
        paddingVertical: 16,
        borderRadius: 100,
        marginTop: 0,
    },
    linkButtonText: {
        color: Colors.black,
        fontWeight: '700',
        fontSize: 16,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
    },
    labelContainer: {
        width: 120,
        marginRight: 24,
        alignItems: 'flex-start',
    },
    rowLabel: {
        fontWeight: '600',
    },
    valueContainer: {
        flex: 1,
    },
});
