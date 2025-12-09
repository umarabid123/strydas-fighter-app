
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
import AppButton from '../components/common/AppButton';
import AppText from '../components/common/AppText';
import Header from '../components/common/Header';

import LookingForListItem from '../components/common/LookingForListItem';
import { Colors } from '../constant';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function EventDetail() {

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero Section */}
                <ImageBackground
                    source={require('../assets/images/event-detail-img.png')} // Using existing image as placeholder
                    style={styles.heroImage}
                    resizeMode="cover"
                >
                    <View style={styles.headerOverlay}>
                        <Header isBack={true} />
                    </View>
                    {/* Gradient Overlay (Simulated with background color opacity) */}
                    <View style={styles.heroOverlay} />
                </ImageBackground>

                <View style={styles.contentContainer}>
                    {/* Tags */}
                    <View style={styles.tagsRow}>
                        <AppText text="Muay Thai" color={Colors.light.success} fontSize={12} />
                        <AppText text=" • " color={Colors.textSecondary} fontSize={12} />
                        <AppText text="MMA" color={Colors.light.success} fontSize={12} />
                    </View>

                    {/* Title */}
                    <AppText
                        text="Unite Championship 09: Crossing Borders"
                        fontSize={32}
                        style={styles.title}
                        color={Colors.white}
                        fontName="CircularStd-Bold"
                    />

                    {/* Date & Time */}
                    <View style={styles.infoSection}>
                        <AppText text="Date" color={Colors.white} fontSize={16} style={styles.label} />
                        <AppText text="Saturday 11. October 2025" color={Colors.textSecondary} fontSize={16} />
                        <AppText text="17.00 PM CEST" color={Colors.textSecondary} fontSize={16} />
                    </View>

                    {/* Address */}
                    <View style={styles.infoSection}>
                        <AppText text="Address" color={Colors.white} fontSize={16} style={styles.label} />
                        <AppText
                            text="Utsiktsvägen 10, 216 30 Limhamn"
                            color={Colors.textSecondary}
                            fontSize={16}
                        />
                    </View>

                    {/* Description */}
                    <View>
                        <AppText
                            text="Out blue plz cleanse vinyl. 8-bit twee mi typewriter party ennui tile. Gatekeep mumblecore plant haven't ennui. Beard praxis jianbing authentic heirloom. Xoxo butcher heirloom ethical listicle..."
                            color={Colors.textSecondary}
                            fontSize={16}
                            style={{ lineHeight: 22, marginTop: 32 }}
                        />
                        <TouchableOpacity>
                            <AppText text="Read more" color={Colors.white} fontSize={16} style={styles.readMore} />
                        </TouchableOpacity>
                    </View>

                    {/* Organizer */}
                    <View style={styles.organizerSection}>
                        <Image
                            source={require('../assets/images/profile-img.png')}
                            style={styles.organizerAvatar}
                        />
                        <View>
                            <AppText text="Steffen Weise" color={Colors.white} fontSize={18} style={{ fontWeight: 600 }} />
                            <AppText
                                text="UNITE Championship / Mikenta"
                                color={Colors.textSecondary}
                                fontSize={13}
                            />
                        </View>
                    </View>

                    {/* Looking For Section */}
                    <View style={[styles.section, { marginBottom: 0 }]}>
                        <AppText text="Looking for" fontSize={24} color={Colors.white} style={styles.sectionTitle} />
                        <View style={styles.lookingForList}>
                            <LookingForListItem
                                tags={['Muay Thai', 'Amateur']}
                                weight="63,5 kg"
                                status="cannot_apply"
                            />
                            <LookingForListItem
                                tags={['Muay Thai', 'Pro']}
                                weight="63,5 kg"
                                status="can_apply"
                                customStyle={{
                                    borderBottomWidth: 0
                                }}
                            />
                        </View>
                    </View>

                    {/* Apply Section */}
                    <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.darkGray3 }}>
                        <AppButton
                            text="Apply"
                            btnStyle={styles.applyButton}
                            textStyle={styles.applyButtonText}
                            onPress={() => { }}
                        />
                    </View>
                    {/* More Links Section */}
                    <View style={styles.section}>
                        <AppText text="More links" fontSize={24} color={Colors.white} style={[styles.sectionTitle, { marginTop: 32 }]} />
                        <View style={styles.linksContainer}>
                            <AppButton
                                text="Website"
                                btnStyle={styles.linkButton}
                                textStyle={styles.linkButtonText}
                                onPress={() => { }}
                            />
                            <AppButton
                                text="Instagram"
                                btnStyle={styles.linkButton}
                                textStyle={styles.linkButtonText}
                                onPress={() => { }}
                            />
                            <AppButton
                                text="Buy tickets"
                                btnStyle={styles.linkButton}
                                textStyle={styles.linkButtonText}
                                onPress={() => { }}
                            />
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
        paddingTop: 0, // Header handles its own padding
    },
    heroOverlay: {
        height: 100,
        backgroundColor: Colors.black, // Note: linear-gradient won't work in RN without a library, using solid color
        // fallback
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
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
        borderRadius: 100
    },
    linkButtonText: {
        color: Colors.black,
        fontWeight: 600,
        fontSize: 16,
    },
});
