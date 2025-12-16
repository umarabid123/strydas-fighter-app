import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    Dimensions,
    FlatList,
    Platform,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import CarouselItem from '../components/CarouselItem';
import AppText from '../components/common/AppText';
import Header from '../components/common/Header';
import SearchSection from '../components/common/SearchSection';
import FighterCard from '../components/FighterCard';
import { Colors } from '../constant';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


export default function FighterScreen() {
    const navigation = useNavigation<any>()
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
        {
            id: "6",
            fighterName: "Jaspar Landal",
            fighterImage: require("../assets/images/event-card-img.png"),
            fighterFlag: require("../assets/images/flag-icon.png"),
            discipline: "Muay Thai",
            fightRecord: "12-4-0",
            weightClass: "63,5 kg",
        },
    ];
    const categories = [
        {
            id: "1",
            title: "Muay Thai",
            image: require("../assets/images/event-card-img.png"),
        },
        {
            id: "2",
            title: "Boxing",
            image: require("../assets/images/event-card-img.png"),
        },
        {
            id: "3",
            title: "Kickboxing",
            image: require("../assets/images/event-card-img.png"),
        },
    ];

    return (
        <View style={styles.container}>
            <Header isBack={true} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <SearchSection
                    title="Fighters"
                    subtitle="Browser fighters and events world wide."
                    placeholder="Search"
                />

                <View style={styles.categoriesContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
                        {categories.map((item) => <CarouselItem item={item} />)}
                    </ScrollView>
                </View>

                <View style={styles.listContainer}>
                    <AppText text="Browse all" fontSize={16} color={Colors.textSecondary} style={styles.sectionTitle} />
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
                                onPress={() => navigation.navigate('FighterProfileScreen')}
                            />
                        )}
                    />
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
    categoriesContainer: {
        marginTop: 24,
    },
    categoriesScroll: {
        paddingHorizontal: 20,
        gap: 12,
    },
    categoryCard: {
        width: 160,
        height: 160,
        borderRadius: 16,
        overflow: 'hidden',
    },
    gradientContainer: {
        flex: 1,
        position: 'relative',
        justifyContent: 'flex-end',
        padding: 16,
    },
    svg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    categoryTitle: {
        fontWeight: '600',
        zIndex: 1,
    },
    listContainer: {
        paddingHorizontal: 20,
        marginTop: 32,
        paddingBottom: 40,
    },
    sectionTitle: {
        marginBottom: 16,
    },
});
