import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Header from '../components/common/Header';
import AppText from '../components/common/AppText';
import AppButton from '../components/common/AppButton';
import TextInput from '../components/common/TextInput';
import AppLoader from '../components/common/AppLoader';
import { useAuth } from '../navigation';
import { createEvent, createMatch } from '../services/eventService';
import { CreateMatchInput } from '../lib/types';
import { Colors } from '../constant';

interface MatchForm extends CreateMatchInput {
  id: string;
}

const CreateEventScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();

  // Event fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [eventTime, setEventTime] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [ticketUrl, setTicketUrl] = useState('');

  // Match fields
  const [matches, setMatches] = useState<MatchForm[]>([]);
  const [currentMatch, setCurrentMatch] = useState<CreateMatchInput>({
    sport_type: '',
    match_type: '',
    weight_class: '',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEventDate(selectedDate);
    }
  };

  const addMatch = () => {
    if (!currentMatch.sport_type || !currentMatch.match_type) {
      Alert.alert('Error', 'Please fill in sport type and match type');
      return;
    }

    const newMatch: MatchForm = {
      ...currentMatch,
      id: Date.now().toString(),
    };

    setMatches([...matches, newMatch]);
    setCurrentMatch({
      sport_type: '',
      match_type: '',
      weight_class: '',
      description: '',
    });
  };

  const removeMatch = (matchId: string) => {
    setMatches(matches.filter(m => m.id !== matchId));
  };

  const handleSubmit = async () => {
    if (!title) {
      Alert.alert('Error', 'Please enter event title');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to create an event');
      return;
    }

    setIsLoading(true);

    try {
      // Create event
      const event = await createEvent(user.id, {
        title,
        description,
        event_date: eventDate.toISOString(),
        event_time: eventTime,
        address,
        city,
        country,
        image_url: imageUrl,
        website_url: websiteUrl,
        instagram_url: instagramUrl,
        ticket_url: ticketUrl,
        tags: [], // Can be enhanced later
      });

      // Create matches
      if (matches.length > 0) {
        for (const match of matches) {
          await createMatch({
            event_id: event.id,
            ...match,
          });
        }
      }

      Alert.alert(
        'Success',
        'Event created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Create Event" isBack={true} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <AppText
          text="Event Details"
          fontSize={20}
          color={Colors.white}
          style={styles.sectionTitle}
        />

        <TextInput
          placeholder="Event Title"
          value={title}
          onChangeText={setTitle}
          containerStyle={styles.input}
        />

        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          containerStyle={styles.input}
        />

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <AppText
            text={eventDate.toLocaleDateString()}
            color={Colors.textSecondary}
            fontSize={16}
          />
          <AppText text="Select Date" color={Colors.light.success} fontSize={14} />
        </TouchableOpacity>

        {showDatePicker && (
          <View style={{ marginTop: 10 }}>
            <DateTimePicker
              value={eventDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          </View>
        )}

        <TextInput
          placeholder="Event Time (e.g., 17:00 PM CEST)"
          value={eventTime}
          onChangeText={setEventTime}
          containerStyle={styles.input}
        />

        <TextInput
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          containerStyle={styles.input}
        />

        <TextInput
          placeholder="City"
          value={city}
          onChangeText={setCity}
          containerStyle={styles.input}
        />

        <TextInput
          placeholder="Country"
          value={country}
          onChangeText={setCountry}
          containerStyle={styles.input}
        />

        <TextInput
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChangeText={setImageUrl}
          containerStyle={styles.input}
        />

        <TextInput
          placeholder="Website URL (optional)"
          value={websiteUrl}
          onChangeText={setWebsiteUrl}
          containerStyle={styles.input}
        />

        <TextInput
          placeholder="Instagram URL (optional)"
          value={instagramUrl}
          onChangeText={setInstagramUrl}
          containerStyle={styles.input}
        />

        <TextInput
          placeholder="Ticket URL (optional)"
          value={ticketUrl}
          onChangeText={setTicketUrl}
          containerStyle={styles.input}
        />

        {/* Matches Section */}
        <View style={styles.divider} />
        <AppText
          text="Matches"
          fontSize={20}
          color={Colors.white}
          style={styles.sectionTitle}
        />

        <AppText
          text="Add matches to your event"
          color={Colors.textSecondary}
          fontSize={14}
          style={{ marginBottom: 16 }}
        />

        <TextInput
          placeholder="Sport Type (e.g., Muay Thai, MMA)"
          value={currentMatch.sport_type}
          onChangeText={(text) =>
            setCurrentMatch({ ...currentMatch, sport_type: text })
          }
          containerStyle={styles.input}
        />

        <TextInput
          placeholder="Match Type (e.g., Amateur, Pro)"
          value={currentMatch.match_type}
          onChangeText={(text) =>
            setCurrentMatch({ ...currentMatch, match_type: text })
          }
          containerStyle={styles.input}
        />

        <TextInput
          placeholder="Weight Class (e.g., 63.5 kg)"
          value={currentMatch.weight_class}
          onChangeText={(text) =>
            setCurrentMatch({ ...currentMatch, weight_class: text })
          }
          containerStyle={styles.input}
        />

        <TextInput
          placeholder="Match Description (optional)"
          value={currentMatch.description}
          onChangeText={(text) =>
            setCurrentMatch({ ...currentMatch, description: text })
          }
          containerStyle={styles.input}
        />

        <AppButton
          text="+ Add Match"
          onPress={addMatch}
          btnStyle={styles.addMatchButton}
          textStyle={styles.addMatchButtonText}
        />

        {/* Display added matches */}
        {matches.length > 0 && (
          <View style={styles.matchesList}>
            <AppText
              text={`${matches.length} match${matches.length > 1 ? 'es' : ''} added`}
              color={Colors.textSecondary}
              fontSize={14}
              style={{ marginBottom: 12 }}
            />
            {matches.map((match) => (
              <View key={match.id} style={styles.matchItem}>
                <AppText
                  text={`${match.sport_type} • ${match.match_type}`}
                  color={Colors.white}
                  fontSize={14}
                  style={{ flex: 1 }}
                />
                {match.weight_class && (
                  <AppText
                    text={match.weight_class}
                    color={Colors.textSecondary}
                    fontSize={12}
                  />
                )}
                <TouchableOpacity onPress={() => removeMatch(match.id)}>
                  <AppText text="Remove" color={Colors.light.success} fontSize={12} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <AppButton
          text="Create Event"
          onPress={handleSubmit}
          btnStyle={styles.submitButton}
          textStyle={styles.submitButtonText}
        />
      </ScrollView>

      <AppLoader isLoading={isLoading} />
    </View>
  );
};

import DateTimePicker from '@react-native-community/datetimepicker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 16,
    fontWeight: '600',
  },
  input: {
    marginBottom: 16,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#353535',
    marginVertical: 24,
  },
  addMatchButton: {
    backgroundColor: '#353535',
    width: '100%',
    marginBottom: 24,
    borderRadius: 100,
    paddingVertical: 16,
  },
  addMatchButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  matchesList: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  submitButton: {
    backgroundColor: Colors.light.success,
    width: '100%',
    marginBottom: 32,
    borderRadius: 100,
    paddingVertical: 16,
  },
  submitButtonText: {
    color: Colors.black,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CreateEventScreen;
