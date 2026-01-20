import CarouselItem from '@/components/CarouselItem'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Dimensions, FlatList, Platform, ScrollView, StyleSheet, View } from 'react-native'
import AppText from '../components/common/AppText'
import EventCard, { MatchItem } from '../components/common/EventCard'
import Header from '../components/common/Header'
import SearchSection from '../components/common/SearchSection'
import { Colors } from '../constant'
import AppLoader from '../components/common/AppLoader'
import { getAllEvents, getMatchesByEventId, hasFighterAppliedForMatch } from '../services/eventService'
import { Event, Match } from '../lib/types'
import { useAuth } from '../navigation'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', title: 'Muay Thai', color: '#B67584' },
  { id: '2', title: 'MMA', color: '#AFA0AA' },
  { id: '3', title: 'Kickboxing', color: '#B67584' },
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
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [eventsWithMatches, setEventsWithMatches] = useState<any[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const eventsData = await getAllEvents();

      // Load matches for each event
      const eventsDataWithMatches = await Promise.all(
        eventsData.map(async (event: Event) => {
          const matches = await getMatchesByEventId(event.id);

          // Determine if user can apply for each match
          const matchesWithStatus = await Promise.all(
            matches.map(async (match: Match) => {
              let canApply = 'cannot_apply';
              if (user?.id) {
                const hasApplied = await hasFighterAppliedForMatch(match.id, user.id);
                canApply = hasApplied ? 'cannot_apply' : 'can_apply';
              }

              return {
                id: match.id,
                tags: [match.sport_type, match.match_type, match.weight_class].filter(Boolean),
                status: canApply,
              };
            })
          );

          return {
            ...event,
            image: event.image_url ? { uri: event.image_url } : require('../assets/images/event-card-img.png'),
            date: new Date(event.event_date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }),
            matches: matchesWithStatus,
          };
        })
      );

      setEventsWithMatches(eventsDataWithMatches);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EventDetail', { eventId });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header
          isBack={true}
          onNotificationPress={() => { }}
        />
        <AppLoader isLoading={true} />
      </View>
    );
  }

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
              <CarouselItem
                item={item}
                onPress={() => {
                  if (item.title === 'Events') {
                    // Already on Events screen
                    console.log('Already on Events');
                  } else if (item.title === 'Fighters') {
                    navigation.navigate('FighterScreen');
                  } else if (item.title === 'Gyms') {
                    // Navigate to Gyms screen when available
                    console.log('Navigate to Gyms');
                  }
                }}
              />
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

          {eventsWithMatches.length === 0 ? (
            <AppText
              text="No events available"
              color={Colors.textSecondary}
              fontSize={14}
              style={{ textAlign: 'center', paddingVertical: 40 }}
            />
          ) : (
            eventsWithMatches.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                date={event.date}
                imageSource={event.image}
                matches={event.matches as MatchItem[]}
                onPress={() => handleEventPress(event.id)}
              />
            ))
          )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  categoryTitle: {
    zIndex: 1,
  },
  browseAllContainer: {
    marginTop: 8,
  },

})
