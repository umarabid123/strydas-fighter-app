import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import CarouselItem from '../components/CarouselItem';
import AppButton from '../components/common/AppButton';
import AppText from '../components/common/AppText';
import Header from '../components/common/Header';
import SearchSection from '../components/common/SearchSection';
import EventCard from '../components/EventCard';
import FighterCard from '../components/FighterCard';
import { Colors } from '../constant';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function DiscoverScreen() {
  const data = [
    { id: '1', image: require('../assets/images/caraousal-icon.png') },
    { id: '2', image: require('../assets/images/caraousal-icon.png') },
    { id: '3', image: require('../assets/images/caraousal-icon.png') },
    { id: '4', image: require('../assets/images/caraousal-icon.png') },
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
        <SearchSection />

        <View style={{ height: 220 }}>
          <FlatList
            data={data}
            horizontal
            scrollEnabled={true} // 👈 important (ScrollView handles scrolling)
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: 20, marginTop: 40 }}
            ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
            renderItem={({ item }) => (
              <CarouselItem
                imageSource={item.image}
                size={173}
                borderRadius={16}
              />
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
});
