import CarouselItem from '@/components/CarouselItem'
import React from 'react'
import { Dimensions, FlatList, Platform, ScrollView, StyleSheet, View } from 'react-native'
import AppText from '../components/common/AppText'
import EventCard, { MatchItem } from '../components/common/EventCard'
import Header from '../components/common/Header'
import SearchSection from '../components/common/SearchSection'
import { Colors } from '../constant'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', title: 'Muay Thai', color: '#B67584' },
  { id: '2', title: 'MMA', color: '#AFA0AA' },
  { id: '3', title: 'Kickboxing', color: '#B67584' },
];

const EVENTS = [
  {
    id: '1',
    title: 'KOMBA FC 1.0',
    date: 'October 11, 2025',
    image: require('../assets/images/event-card-img.png'), // Placeholder or actual image
    matches: [
      {
        id: 'm1',
        tags: ['Muay Thai', 'Pro', '63,5 kg'],
        status: 'can_apply',
      },
      {
        id: 'm2',
        tags: ['Muay Thai', 'Amateur', '63,5 kg'],
        status: 'cannot_apply',
      }
    ]
  },
  {
    id: '2',
    title: 'ADFC 4.0 - Zaman vs Lail...',
    date: 'October 11, 2025',
    image: require('../assets/images/featured-card.png'), // Using another image for variety if available, otherwise reuse
    matches: [
      {
        id: 'm3',
        tags: ['Muay Thai', 'Amateur', '63,5 kg'],
        status: 'cannot_apply',
      },
      {
        id: 'm4',
        tags: ['Muay Thai', 'Amateur', '63,5 kg'],
        status: 'cannot_apply',
      }
    ]
  }
];

const carouselData = [
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



export default function EventScreen() {
  return (
    <View style={styles.container}>
      <Header
        isBack={true}
        onNotificationPress={() => { }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Section */}
        <SearchSection
          title="Events"
          subtitle="Browser fighters and events world wide."
          containerStyle={{ paddingHorizontal: 0, marginBottom: 20 }}
          searchBarStyle={{ width: 'auto', flex: 1, maxWidth: '100%' }}
        // Adjust search section to match the specific layout if needed
        />

        {/* Categories */}
        <View style={{ height: 220, marginBottom: 24 }}>
          <FlatList
            data={carouselData}
            horizontal
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: 0 }}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => (
              <CarouselItem item={item} />
            )}
          />
        </View>

        {/* Browse All */}
        <View style={styles.browseAllContainer}>
          <AppText
            text="Browse all"
            fontSize={16}
            fontName="CircularStd-Medium"
            color={Colors.textSecondary}
            style={{ marginBottom: 12 }}
          />

          {EVENTS.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              date={event.date}
              imageSource={event.image}
              matches={event.matches as MatchItem[]}
            />
          ))}
        </View>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    backgroundColor: Colors.black,
    height: SCREEN_HEIGHT,
    paddingTop: Platform.OS === 'ios' ? 0 : 20
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesContent: {
    gap: 12,
  },
  categoryCard: {
    width: 140,
    height: 140,
    borderRadius: 16,
    justifyContent: 'flex-end',
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  categoryTitle: {
    zIndex: 1,
  },
  browseAllContainer: {
    marginTop: 8,
  },

})