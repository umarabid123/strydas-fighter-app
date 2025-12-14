import { useNavigation } from '@react-navigation/native';
import React from 'react';
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


const Tag = ({ text, icon }: { text: string; icon?: any }) => (
    <View style={styles.tag}>
        <AppText text={text} fontSize={14} color={Colors.white} />
        {icon && <Image source={icon} style={styles.tagIcon} />}
    </View>
);

const ProfileRow = ({ label, value, children, labelStyle }: any) => (
    <View style={styles.profileRow}>
        <View style={styles.labelContainer}>
            <AppText
                text={label}
                fontSize={16}
                color={Colors.white}
                style={[styles.rowLabel, labelStyle]}
            />
        </View>
        <View style={styles.valueContainer}>
            {value ? (
                <AppText text={value} fontSize={16} color={Colors.textSecondary} style={{ fontWeight: '400' }} />
            ) : (
                children
            )}
        </View>
    </View>
);

export default function MyProfile() {
    const navigation = useNavigation<any>()
    return (
        <View style={styles.container}>
            <Header isBack={true} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={require('../assets/images/event-card-img.png')}
                            style={styles.avatar}
                        />
                    </View>
                    <AppText text="Muay Thai · MMA" fontSize={14} color={Colors.textSecondary} style={styles.roleText} />
                    <AppText text="Jaspar Landal" fontSize={32} color={Colors.white} style={styles.nameText} />
                    <AppText text="IFMA World Champion 2025" fontSize={16} color={Colors.textSecondary} style={styles.orgText} />

                    <View style={styles.tagsRow}>
                        <Tag text="12-4-0" />
                        <Tag text="63,5 kg" />
                        <Tag text="DEN" icon={require('../assets/images/flag-icon.png')} />
                        <Tag text="Muay Thai" />
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
                    <ProfileRow label="Age" value="20 years" />
                    <ProfileRow label="Weight" value="59,0 kg  ± 2,0 kg" />
                    <ProfileRow label="Division" value="Pro" />
                    <ProfileRow label="Height" value="172 cm" />

                    <ProfileRow label="Muay Thai" value="12W – 4L – 0D" labelStyle={styles.statLabel} />
                    <ProfileRow label="K-1" value="3W – 0L – 0D" labelStyle={styles.statLabel} />
                    <ProfileRow label="Boxing" value="0W – 0L – 0D" labelStyle={styles.statLabel} />

                    <ProfileRow label="Gender" value="Male" />
                    <ProfileRow label="Country">
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Image source={require('../assets/images/flag-icon.png')} style={styles.flagIconSmall} />
                            <AppText text="Denmark" fontSize={16} color={Colors.textSecondary} />
                        </View>
                    </ProfileRow>
                    <ProfileRow label="Gym" value="Extreme Muay Thai" />
                </View>

                <View style={styles.divider} />

                {/* Manager Section */}
                <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('OrganizerScreen')}>
                    <AppText text="Manager" fontSize={18} color={Colors.white} style={styles.sectionTitle} />
                    <View style={styles.managerCard}>
                        <Image source={require('../assets/images/profile-img.png')} style={styles.managerAvatar} />
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <AppText text="Youssef Assouik" fontSize={18} color={Colors.white} style={{ fontWeight: '600' }} />
                                <Image source={require('../assets/images/flag-icon.png')} style={styles.flagIconSmall} />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <AppText text="Assouik Gym" fontSize={14} color={Colors.textSecondary} style={styles.managerTag} />
                                {/* <Image source={require('../assets/images/whatsapp-icon.png')} style={styles.socialIcon} />
                                <Image source={require('../assets/images/email-icon.png')} style={styles.socialIcon} /> */}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

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
                    <AppText text="Jaspar's links" fontSize={24} color={Colors.white} style={styles.sectionTitle} />
                    <View style={styles.linksContainer}>
                        <AppButton text="Website" btnStyle={styles.linkButton} textStyle={styles.linkButtonText} />
                        <AppButton text="Instagram" btnStyle={styles.linkButton} textStyle={styles.linkButtonText} />
                        <AppButton text="Buy tickets" btnStyle={styles.linkButton} textStyle={styles.linkButtonText} />
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
        paddingTop: Platform.OS === 'ios' ? 0 : 20
    },
    scrollContent: {
        paddingBottom: 40,
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
        fontWeight: '500',
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
        paddingHorizontal: 12,
        paddingVertical: 6,
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
        borderRadius: 8,
        overflow: 'hidden',
    },
    socialIcon: {
        width: 24,
        height: 24,
        marginLeft: 8,
    },
    linksContainer: {
        gap: 12,
    },
    linkButton: {
        backgroundColor: Colors.white,
        width: '100%',
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
