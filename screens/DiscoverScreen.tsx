import CarouselItem from '@/components/CarouselItem';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import AppButton from '../components/common/AppButton';
import AppLoader from '../components/common/AppLoader';
import AppText from '../components/common/AppText';
import Header from '../components/common/Header';
import SearchSection from '../components/common/SearchSection';
import EventCard from '../components/EventCard';
import FighterCard from '../components/FighterCard';
import { Colors } from '../constant';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function DiscoverScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const carouselData = [ // Renamed from 'data' to 'carouselData'
    {
      id: '1',
      title: 'Events',
      image: require('../assets/images/event-card-img.png'),
      avatars: [
        require('../assets/images/profile-image-icon.png'),
        require('../assets/images/flag-icon.png'), // Using available small icons as placeholder for avatars
      ]
    },
    {
      id: '2',
      title: 'Fighters',
      image: require('../assets/images/event-card-img.png'),
      avatars: [
        require('../assets/images/profile-image-icon.png'),
      ]
    },
    {
      id: '3',
      title: 'Gyms',
      image: require('../assets/images/event-card-img.png'),
      avatars: [
        require('../assets/images/profile-image-icon.png'),
        require('../assets/images/flag-icon.png'),
      ]
    },
  ];


  const events = [
    {
      id: '1',
      title: 'Muay Thai Showdown',
      subtitle: 'Bangkok Arena • 24 Nov',
      image: require('../assets/images/event-card-img.png'),
    },
    {
      id: '2',
      title: 'Championship Night',
      subtitle: 'London Stadium • 12 Dec',
      image: require('../assets/images/event-card-img.png'),
    },
    {
      id: '3',
      title: 'Glory Clash',
      subtitle: 'Dubai Dome • 29 Dec',
      image: require('../assets/images/event-card-img.png'),
    },
    {
      id: '4',
      title: 'Glory Clash',
      subtitle: 'Dubai Dome • 29 Dec',
      image: require('../assets/images/event-card-img.png'),
    },
  ];

  const fighters = [
    {
      id: "1",
      fighterName: "Jaspar Landal",
      fighterImage: require("../assets/images/event-card-img.png"),
      fighterFlag: require("../assets/images/flag-icon.png"),
      discipline: "Muay Thai",
      fightRecord: "12-4-0",
      countryCode: "DEN",
      weightClass: "63.5 kg",
    },
    {
      id: "2",
      fighterName: "Ethan Carter",
      fighterImage: require("../assets/images/event-card-img.png"),
      fighterFlag: require("../assets/images/flag-icon.png"),
      discipline: "Kickboxing",
      fightRecord: "10-2-1",
      countryCode: "USA",
      weightClass: "70 kg",
    },
    {
      id: "3",
      fighterName: "Leo Marshall",
      fighterImage: require("../assets/images/event-card-img.png"),
      fighterFlag: require("../assets/images/flag-icon.png"),
      discipline: "Boxing",
      fightRecord: "15-1-0",
      countryCode: "GBR",
      weightClass: "75 kg",
    },
  ];
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchSection title='Discover' subtitle='Browser fighters and events world wide.' />

        <View style={{ height: 220 }}>
          <FlatList
            data={carouselData} // Changed to carouselData
            horizontal
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: 20, marginTop: 40 }}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />} // Changed width from 8 to 12
            renderItem={({ item }) => (
              <CarouselItem item={item} />
            )}
          />
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 30, paddingBottom: 40 }}>
          <AppText
            text="Events soon 👀"
            fontSize={16}
            color={'#FFFFFFCC'}
            style={{ fontWeight: 500 }}
          />

          <FlatList
            data={events}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingTop: 16 }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item }) => (
              <EventCard
                title={item.title}
                subtitle={item.subtitle}
                image={item.image}
                containerStyle={styles.cardSpacing}
                onPress={() => navigation.navigate('EventDetail')}
              />
            )}
          />
          <AppButton text='Browse events' btnStyle={{ backgroundColor: 'transparant', borderWidth: 1, borderColor: "#FFFFFF80", borderRadius: 50, width: "auto", paddingHorizontal: 32, paddingVertical: 17 }} onPress={() => navigation.navigate('Event')} />
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <AppText
            text="Popular fighters 🔥"
            fontSize={16}
            color={'#FFFFFFCC'}
            style={{ fontWeight: 500 }}
          />

          <FlatList
            data={fighters}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={{
              paddingTop: 20
            }}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            renderItem={({ item }) => (
              <FighterCard
                fighterName={item.fighterName}
                fighterImage={item.fighterImage}
                fighterFlag={item.fighterFlag}
                countryCode={item.countryCode}
                discipline={item.discipline}
                fightRecord={item.fightRecord}
                weightClass={item.weightClass}
                onPress={() => navigation.navigate('FighterProfileScreen')}
              />
            )}
          />
          <AppButton text='Browse fighters' btnStyle={{ backgroundColor: 'transparant', borderWidth: 1, borderColor: "#FFFFFF80", borderRadius: 50, width: "auto", paddingHorizontal: 32, paddingVertical: 17 }}
            onPress={() => navigation.navigate('FighterScreen')} />
        </View>
      </ScrollView>
      <AppLoader isLoading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    width: SCREEN_WIDTH,
    paddingTop: Platform.OS === 'ios' ? 0 : 20
  },
  cardSpacing: {
    marginBottom: 0,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4, // Align with text baseline visually
  },
  avatarMini: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#C20027', // Match the gradient bottom roughly or just white/transparent? Design shows white border. Actually maybe orange/red border to blend? Design shows white border on avatars. Let's use white for now.
    backgroundColor: '#ccc',
  },
});
