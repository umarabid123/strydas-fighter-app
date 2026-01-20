import { useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EmptyState from '../components/EmptyState';
import AppLoader from '../components/common/AppLoader';
import AppText from '../components/common/AppText';
import CustomBottomSheet from '../components/common/CustomBottomSheet';
import Header from '../components/common/Header';
import { Colors } from '../constant';
import { useAuth } from '../navigation';
import { getEventsByOrganizer } from '../services/eventService';
import { Event } from '../lib/types';

const Home = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetType, setSheetType] = useState<'match' | 'event' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [myMatches, setMyMatches] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      if (user?.id) {
        // Load user's events if they're an organizer
        const events = await getEventsByOrganizer(user.id);
        setUserEvents(events);

        // TODO: Load user's matches if they're a fighter
        // This will require additional service calls when matches feature is implemented
      }
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openSheet = (type: 'match' | 'event') => {
    setSheetType(type);
    setSheetVisible(true);
  };

  const handleCreateEvent = () => {
    setSheetVisible(false);
    navigation.navigate('CreateEvent' as never);
  };

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EventDetail', { eventId } as never);
  };

  return (
    <View style={[styles.container]}>
      <Header title='Home' />

      {/* My Matches Section */}
      {myMatches.length === 0 ? (
        <EmptyState
          title="My matches"
          subtitle='You have no matches yet.'
          buttonLabel='Browse'
          customStyle={{ marginBottom: 12, marginTop: 14 }}
          onButtonPress={() => openSheet('match')}
        />
      ) : (
        <View style={{ marginTop: 14 }}>
          <View style={styles.sectionHeader}>
            <AppText text="My matches" fontSize={18} color={Colors.white} fontName="CircularStd-Bold" />
          </View>
          <FlatList
            data={myMatches}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.matchItem}
                onPress={() => {/* TODO: Navigate to match detail */}}
              >
                <AppText text={item.title} color={Colors.white} fontSize={16} />
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* My Events Section */}
      {userEvents.length === 0 ? (
        <EmptyState
          title="My events"
          subtitle='You have no events yet.'
          buttonLabel='Create event'
          onButtonPress={() => handleCreateEvent()}
        />
      ) : (
        <View style={{ marginTop: 24 }}>
          <View style={styles.sectionHeader}>
            <AppText text="My events" fontSize={18} color={Colors.white} fontName="CircularStd-Bold" />
            <TouchableOpacity onPress={() => handleCreateEvent()}>
              <AppText text="+ Create" color={Colors.light.success} fontSize={14} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={userEvents}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.eventItem}
                onPress={() => handleEventPress(item.id)}
              >
                <AppText
                  text={item.title}
                  color={Colors.white}
                  fontSize={16}
                  fontName="CircularStd-Medium"
                />
                <AppText
                  text={new Date(item.event_date).toLocaleDateString()}
                  color={Colors.textSecondary}
                  fontSize={14}
                  style={{ marginTop: 4 }}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <CustomBottomSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        title={sheetType === 'match' ? 'Create Matches' : 'Create event'}
      >
        {sheetType === 'event' ? (
          <View style={styles.sheetContent}>
            <AppText
              text="Create your own event"
              color={Colors.white}
              fontSize={16}
              textAlign="center"
              style={{ marginBottom: 20 }}
            />
            <AppText
              text="Add event details, matches, and manage applications from fighters around the world."
              color={Colors.textSecondary}
              fontSize={14}
              textAlign="center"
              style={{ marginBottom: 30 }}
            />
            {/* Create Event Button would be added here */}
            <AppButton onPress={handleCreateEvent}>
              <AppText text="Create Event" color={Colors.black} fontSize={16} />
            </AppButton>
          </View>
        ) : (
          <AppText
            text="TODO\nMatches field"
            color={Colors.white}
            fontSize={32}
            fontName="CircularStd-Bold"
            textAlign="center"
            style={{ marginTop: 50 }}
          />
        )}
      </CustomBottomSheet>
      <AppLoader isLoading={isLoading} />
    </View>
  );
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

import AppButton from '../components/common/AppButton';

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 0
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
  matchItem: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 150,
  },
  eventItem: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 200,
  },
  sheetContent: {
    padding: 20,
  },
});
