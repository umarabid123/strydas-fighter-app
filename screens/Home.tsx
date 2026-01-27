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

import { CreateEventSheet } from '../components/common/EventsSheets';
import ProfileInput from '../components/common/ProfileInput';
import SelectPicker from '../components/common/SelectPicker';
import { createMatch } from '../services/eventService';

const Home = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetType, setSheetType] = useState<'match' | 'event' | null>(null);
  const [showCreateEventSheet, setShowCreateEventSheet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [myMatches, setMyMatches] = useState<any[]>([]);

  // Match Creation State
  const [matchSport, setMatchSport] = useState('');
  const [matchTypeInput, setMatchTypeInput] = useState('');
  const [matchWeight, setMatchWeight] = useState('');
  const [matchDesc, setMatchDesc] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [showEventPicker, setShowEventPicker] = useState(false);

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
    setShowCreateEventSheet(true);
  };

  const handleCreateMatch = async () => {
    if (!selectedEventId) {
      alert('Please select an event first');
      return;
    }
    if (!matchSport || !matchTypeInput) {
      alert('Please fill in Sport Type and Match Type');
      return;
    }

    setIsLoading(true);
    try {
      await createMatch({
        event_id: selectedEventId,
        sport_type: matchSport,
        match_type: matchTypeInput,
        weight_class: matchWeight,
        description: matchDesc
      });
      alert('Match created successfully!');
      setSheetVisible(false);
      // Reset form
      setMatchSport('');
      setMatchTypeInput('');
      setMatchWeight('');
      setMatchDesc('');
      setSelectedEventId('');
    } catch (error: any) {
      alert(error.message || 'Failed to create match');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EventDetail', { eventId } as never);
  };

  const eventOptions = userEvents.map(e => ({ label: e.title, value: e.id }));

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
                onPress={() => {/* TODO: Navigate to match detail */ }}
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
            <AppButton
              text="Create Event"
              onPress={handleCreateEvent}
              textStyle={{ color: Colors.black, fontSize: 16 }}
            />
          </View>
        ) : (
          <View style={styles.sheetContent}>
            <View style={{ gap: 16, paddingBottom: 20 }}>
              <ProfileInput
                label="Select Event *"
                placeholder="Choose an event"
                value={userEvents.find(e => e.id === selectedEventId)?.title || ''}
                editable={false}
                onPress={() => setShowEventPicker(true)}
              />
              <ProfileInput
                label="Sport Type *"
                placeholder="Muay Thai, MMA"
                value={matchSport}
                onChangeText={setMatchSport}
              />
              <ProfileInput
                label="Match Type *"
                placeholder="Amateur, Pro"
                value={matchTypeInput}
                onChangeText={setMatchTypeInput}
              />
              <ProfileInput
                label="Weight Class"
                placeholder="63.5 kg"
                value={matchWeight}
                onChangeText={setMatchWeight}
              />
              <ProfileInput
                label="Description"
                placeholder="Description"
                value={matchDesc}
                onChangeText={setMatchDesc}
                multiline
                height={100}
              />
              <AppButton
                text="Create Match"
                onPress={handleCreateMatch}
                textStyle={{ color: Colors.black, fontSize: 16 }}
              />
            </View>
          </View>
        )}
      </CustomBottomSheet>

      <SelectPicker
        visible={showEventPicker}
        onClose={() => setShowEventPicker(false)}
        title="Select Event"
        options={eventOptions}
        selectedValue={selectedEventId}
        onSelect={(val) => setSelectedEventId(val)}
      />

      {user?.id && (
        <CreateEventSheet
          visible={showCreateEventSheet}
          onClose={() => setShowCreateEventSheet(false)}
          userId={user.id}
          onEventCreated={loadData}
        />
      )}

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
