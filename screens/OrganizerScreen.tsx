import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import AppButton from '../components/common/AppButton';
import AppText from '../components/common/AppText';
import Header from '../components/common/Header';
import InfoRow from '../components/common/InfoRow';
import FighterCard from '../components/FighterCard';
import { Colors } from '../constant';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function OrganizerScreen() {
    const navigation = useNavigation<any>();
    const fighters = [
        {
            id: "1",
            fighterName: "Jaspar Landal",
            fighterImage: require("../assets/images/event-card-img.png"),
            fighterFlag: require("../assets/images/flag-icon.png"),
            discipline: "Muay Thai",
            fightRecord: "12-4-0",
            weightClass: "63,5 kg",
        },
        {
            id: "2",
            fighterName: "Jaspar Landal",
            fighterImage: require("../assets/images/event-card-img.png"),
            fighterFlag: require("../assets/images/flag-icon.png"),
            discipline: "Muay Thai",
            fightRecord: "12-4-0",
            weightClass: "63,5 kg",
        },
        {
            id: "3",
            fighterName: "Jaspar Landal",
            fighterImage: require("../assets/images/event-card-img.png"),
            fighterFlag: require("../assets/images/flag-icon.png"),
            discipline: "Muay Thai",
            fightRecord: "12-4-0",
            weightClass: "63,5 kg",
        },
        {
            id: "4",
            fighterName: "Jaspar Landal",
            fighterImage: require("../assets/images/event-card-img.png"),
            fighterFlag: require("../assets/images/flag-icon.png"),
            discipline: "Muay Thai",
            fightRecord: "12-4-0",
            weightClass: "63,5 kg",
        },
        {
            id: "5",
            fighterName: "Jaspar Landal",
            fighterImage: require("../assets/images/event-card-img.png"),
            fighterFlag: require("../assets/images/flag-icon.png"),
            discipline: "Muay Thai",
            fightRecord: "12-4-0",
            weightClass: "63,5 kg",
        },
    ];


    return (
        <View style={styles.container}>
            <Header isBack={true} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={require('../assets/images/profile-img.png')}
                            style={styles.avatar}
                        />
                    </View>
                    <AppText text="Organizor" fontSize={14} color={Colors.light.success} style={styles.roleText} />
                    <AppText text="Youssef Assouik" fontSize={32} color={Colors.white} style={styles.nameText} />
                    <AppText text="XFC Management" fontSize={16} color={Colors.white} style={styles.orgText} />

                    <View style={styles.badgeContainer}>
                        <AppText text="DEN" fontSize={16} color={Colors.white} />
                        <Image source={require('../assets/images/flag-icon.png')} style={styles.flagIcon} />
                    </View>

                    <AppButton
                        text="Contact"
                        btnStyle={styles.contactButton}
                        textStyle={styles.contactButtonText}
                    />
                </View>

                <View style={styles.divider} />

                {/* Info Section */}
                <View style={styles.infoSection}>
                    <InfoRow label="Age" value="20 years" />
                    <InfoRow label="Phone" value="+45 20 30 50 60" />
                    <InfoRow label="Whatsapp" value="+45 20 30 50 60" />
                    <InfoRow label="Email" value="youssef@assouikgym.dk" />
                    <InfoRow label="Gender" value="Male" />
                    <InfoRow label="Country">
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Image source={require('../assets/images/flag-icon.png')} style={styles.flagIconSmall} />
                            <AppText text="Denmark" fontSize={16} color={Colors.textSecondary} />
                        </View>
                    </InfoRow>
                </View>

                <View style={styles.dividerBottom} />

                {/* Fighters Section */}
                <View style={styles.fightersSection}>
                    <AppText text="Fighters (8)" fontSize={18} color={Colors.white} style={styles.sectionTitle} />
                    <FlatList
                        data={fighters}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                        renderItem={({ item }) => (
                            <FighterCard
                                fighterName={item.fighterName}
                                fighterImage={item.fighterImage}
                                fighterFlag={item.fighterFlag}
                                discipline={item.discipline}
                                fightRecord={item.fightRecord}
                                weightClass={item.weightClass}
                            />
                        )}
                    />
                </View>

                <View style={styles.divider} />

                {/* Links Section */}
                <View style={styles.linksSection}>
                    <AppText text="Youssef's links" fontSize={24} color={Colors.white} style={styles.sectionTitle} />
                    <View style={styles.linksContainer}>
                        <AppButton text="Website" btnStyle={styles.linkButton} textStyle={styles.linkButtonText} />
                        <AppButton text="Instagram" btnStyle={styles.linkButton} textStyle={styles.linkButtonText} />
                        <AppButton text="Buy tickets" btnStyle={styles.linkButton} textStyle={styles.linkButtonText} onPress={() => (navigation.navigate('FighterProfileScreen'))} />
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
        borderWidth: 2,
        borderColor: '#333'
    },
    avatar: {
        width: 120,
        height: 120,
    },
    roleText: {
        marginBottom: 8,
        fontWeight: '600',
    },
    nameText: {
        marginBottom: 8,
        fontWeight: '700',
        textAlign: 'center',
    },
    orgText: {
        marginBottom: 16,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        marginBottom: 24,
    },
    flagIcon: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    contactButton: {
        backgroundColor: Colors.white,
        width: '100%',
        borderRadius: 100,
        paddingVertical: 16,
    },
    contactButtonText: {
        color: Colors.black,
        fontWeight: '700',
        fontSize: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 32,
    },
    dividerBottom: {
        height: 1,
        backgroundColor: '#333',
        marginBottom: 32,
        marginTop: 75,

    },
    infoSection: {
        paddingHorizontal: 20,
        gap: 24,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoLabel: {
        fontWeight: '600',
        width: 100,
    },
    infoValue: {
        flex: 1,
        textAlign: 'left', // Or right if preferred, design looks left-aligned column
    },
    flagIconSmall: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    fightersSection: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        marginBottom: 24,
        fontWeight: '700',
    },
    linksSection: {
        paddingHorizontal: 20,
    },
    linksContainer: {
        gap: 12,
    },
    linkButton: {
        backgroundColor: Colors.white,
        width: '100%',
        borderRadius: 100,
        marginTop: 0,
        paddingVertical: 16,
    },
    linkButtonText: {
        color: Colors.black,
        fontWeight: '700',
        fontSize: 16,
    },
});
