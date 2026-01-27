import React, { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, CountryOptions, Spacing, Typography } from '../../constant';
import { CreateMatchInput, CountryEnum, EventType, EventStatus } from '../../lib/types';
import { createEvent, createMatch } from '../../services/eventService';
import AppButton from './AppButton';
import AppText from './AppText';
import CustomBottomSheet from './CustomBottomSheet';
import ProfileInput from './ProfileInput';
import SelectPicker from './SelectPicker';
import { MatchSheet } from './OnboardingSheets';

const EventTypeOptions = [
    { label: 'Fight Night', value: 'fight_night' },
    { label: 'Tournament', value: 'tournament' }
];

const SportOptions = [
    { label: 'MMA', value: 'MMA' },
    { label: 'Muay Thai', value: 'Muay Thai' },
    { label: 'Boxing', value: 'Boxing' }
];

const LevelOptions = [
    { label: 'Amateur', value: 'Amateur' },
    { label: 'Professional', value: 'Professional' }
];

interface CreateEventSheetProps {
    visible: boolean;
    onClose: () => void;
    userId: string;
    onEventCreated?: () => void;
}

export const CreateEventSheet = ({ visible, onClose, userId, onEventCreated }: CreateEventSheetProps) => {
    // Event fields
    const [eventType, setEventType] = useState<string>('fight_night');
    const [showTypePicker, setShowTypePicker] = useState(false);
    const [sport, setSport] = useState('');
    const [showSportPicker, setShowSportPicker] = useState(false);
    const [level, setLevel] = useState('');
    const [showLevelPicker, setShowLevelPicker] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [eventTime, setEventTime] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState<string>('');
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [instagramUrl, setInstagramUrl] = useState('');
    const [ticketUrl, setTicketUrl] = useState('');

    // Match fields
    const [matches, setMatches] = useState<CreateMatchInput[]>([]);
    const [showMatchSheet, setShowMatchSheet] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setEventDate(selectedDate);
        }
    };

    const handleMatchSave = (match: { date: Date; opponent: string; event: string; division: string; sport: string; result: string }) => {
        // Transform the Onboarding match format to CreateMatchInput format if needed.
        // Wait, CreateMatchInput is: { event_id: string; sport_type: string; match_type: string; weight_class?: string; description?: string; }
        // The MatchSheet returns: { date, opponent, event, division, sport, result }
        // The user said "separate add match bottom sheet for add match as show in home page".
        // The CreateEventScreen uses: sport_type, match_type, weight_class, description.
        // The MatchSheet in Onboarding is for PAST matches (result, opponent).
        // For CREATING an event, we are adding matches to the schedule.
        // So I probably need a DIFFERENT MatchSheet for Create Event, or adapt the existing one?
        // The user said "separate add match bottom sheet for add match".
        // Let's assume I need a simplified "Add Match to Event" sheet.
        // Or I can use a new inline form here? No, user said "separate add match bottom sheet".
        // Let's create an `AddMatchToEventSheet` inside this file for simplicity or use a simplified Match form.

        // Actually, let's look at `CreateEventScreen`'s match fields: Sport Type, Match Type, Weight Class, Description.
        // The `MatchSheet` in `OnboardingSheets` has: Opponent, EventName, Division, Sport, Result.
        // These are quite different. Onboarding is "History". Create Event is "Scheduling".
        // I will create a `ScheduleMatchSheet` for this purpose.
    };

    const handleScheduleMatch = (match: Omit<CreateMatchInput, 'event_id'>) => {
        setMatches([...matches, { ...match, event_id: '' }]); // event_id will be filled later
    };

    const handleSubmit = async () => {
        if (!title) {
            alert('Please enter event title');
            return;
        }
        if (!sport) {
            alert('Please select a sport');
            return;
        }
        if (!level) {
            alert('Please select a level');
            return;
        }

        setIsLoading(true);

        try {
            // Create event
            const event = await createEvent(userId, {
                title,
                description,
                event_date: eventDate.toISOString(),
                event_time: eventTime,
                address,
                city,
                country,
                type: eventType as EventType,
                status: 'draft',
                sport,
                level,
                image_url: imageUrl,
                website_url: websiteUrl,
                instagram_url: instagramUrl,
                ticket_url: ticketUrl,
                tags: [],
            });

            // Create matches
            if (matches.length > 0) {
                for (const match of matches) {
                    await createMatch({
                        ...match,
                        event_id: event.id,
                    });
                }
            }

            alert('Event created successfully!');
            if (onEventCreated) onEventCreated();

            // Reset form
            setTitle('');
            setDescription('');
            setMatches([]);
            onClose();

        } catch (error: any) {
            alert(error.message || 'Failed to create event');
        } finally {
            setIsLoading(false);
        }
    };

    const removeMatch = (index: number) => {
        const newMatches = [...matches];
        newMatches.splice(index, 1);
        setMatches(newMatches);
    };

    return (
        <CustomBottomSheet
            visible={visible}
            onClose={onClose}
            title="Create Event"
            contentStyle={styles.sheetContentFull}
        >
            <ScrollView contentContainerStyle={styles.form}>
                <ProfileInput
                    label="Event Type *"
                    placeholder="Select Type"
                    value={EventTypeOptions.find(o => o.value === eventType)?.label || 'Fight Night'}
                    editable={false}
                    onPress={() => setShowTypePicker(true)}
                />

                <ProfileInput
                    label="Sport *"
                    placeholder="Select Sport"
                    value={SportOptions.find(o => o.value === sport)?.label || ''}
                    editable={false}
                    onPress={() => setShowSportPicker(true)}
                />

                <ProfileInput
                    label="Level *"
                    placeholder="Select Level"
                    value={LevelOptions.find(o => o.value === level)?.label || ''}
                    editable={false}
                    onPress={() => setShowLevelPicker(true)}
                />

                <ProfileInput
                    label="Event Title *"
                    placeholder="Event Title"
                    value={title}
                    onChangeText={setTitle}
                />

                <ProfileInput
                    label="Description"
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    height={100}
                />

                <View>
                    {/* Date Picker Trigger (using ProfileInput style) */}
                    <ProfileInput
                        label="Date *"
                        placeholder={eventDate.toLocaleDateString()}
                        value={eventDate.toLocaleDateString()}
                        editable={false}
                        onPress={() => setShowDatePicker(true)}
                    />
                    {showDatePicker && (
                        <DateTimePicker
                            value={eventDate}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                </View>

                <ProfileInput
                    label="Time"
                    placeholder="17:00 PM CEST"
                    value={eventTime}
                    onChangeText={setEventTime}
                />

                <ProfileInput
                    label="Address"
                    placeholder="Address"
                    value={address}
                    onChangeText={setAddress}
                />

                <ProfileInput
                    label="City"
                    placeholder="City"
                    value={city}
                    onChangeText={setCity}
                />

                <ProfileInput
                    label="Country"
                    placeholder="Select Country"
                    value={country}
                    editable={false}
                    onPress={() => setShowCountryPicker(true)}
                />

                <ProfileInput
                    label="Website URL (optional)"
                    placeholder="https://..."
                    value={websiteUrl}
                    onChangeText={setWebsiteUrl}
                />

                <ProfileInput
                    label="Instagram URL (optional)"
                    placeholder="https://instagram.com/..."
                    value={instagramUrl}
                    onChangeText={setInstagramUrl}
                />

                <ProfileInput
                    label="Ticket URL (optional)"
                    placeholder="https://..."
                    value={ticketUrl}
                    onChangeText={setTicketUrl}
                />

                <ProfileInput
                    label="Image URL (optional)"
                    placeholder="https://..."
                    value={imageUrl}
                    onChangeText={setImageUrl}
                />

            </ScrollView>

            <View style={styles.footer}>
                <AppButton
                    text="Create Event"
                    onPress={handleSubmit}
                    btnStyle={styles.saveButton}
                    textStyle={styles.saveButtonText}
                />
            </View>

            <SelectPicker
                visible={showCountryPicker}
                onClose={() => setShowCountryPicker(false)}
                title="Select Country"
                options={CountryOptions}
                selectedValue={country}
                onSelect={(val) => setCountry(val)}
            />

            <SelectPicker
                visible={showTypePicker}
                onClose={() => setShowTypePicker(false)}
                title="Select Event Type"
                options={EventTypeOptions}
                selectedValue={eventType}
                onSelect={(val) => setEventType(val)}
            />

            <SelectPicker
                visible={showSportPicker}
                onClose={() => setShowSportPicker(false)}
                title="Select Sport"
                options={SportOptions}
                selectedValue={sport}
                onSelect={(val) => setSport(val)}
            />

            <SelectPicker
                visible={showLevelPicker}
                onClose={() => setShowLevelPicker(false)}
                title="Select Level"
                options={LevelOptions}
                selectedValue={level}
                onSelect={(val) => setLevel(val)}
            />

        </CustomBottomSheet>
    );
};

// Internal component for scheduling matches (different fields than history MatchSheet)
export const CreateMatchSheet = ({ visible, onClose, onSave }: { visible: boolean; onClose: () => void; onSave: (match: Omit<CreateMatchInput, 'event_id'>) => void }) => {
    const [sportType, setSportType] = useState('');
    const [matchType, setMatchType] = useState('');
    const [weightClass, setWeightClass] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = () => {
        if (!sportType || !matchType) {
            alert('Please fill in Sport Type and Match Type');
            return;
        }
        onSave({
            sport_type: sportType,
            match_type: matchType,
            weight_class: weightClass,
            description
        });
        setSportType('');
        setMatchType('');
        setWeightClass('');
        setDescription('');
        onClose();
    };

    return (
        <CustomBottomSheet
            visible={visible}
            onClose={onClose}
            title="Add Match to Event"
            contentStyle={styles.sheetContent}
        >
            <View style={styles.form}>
                <ProfileInput
                    label="Sport Type *"
                    placeholder="Muay Thai, MMA"
                    value={sportType}
                    onChangeText={setSportType}
                />
                <ProfileInput
                    label="Match Type *"
                    placeholder="Amateur, Pro"
                    value={matchType}
                    onChangeText={setMatchType}
                />
                <ProfileInput
                    label="Weight Class"
                    placeholder="63.5 kg"
                    value={weightClass}
                    onChangeText={setWeightClass}
                />
                <ProfileInput
                    label="Description"
                    placeholder="Optional description"
                    value={description}
                    onChangeText={setDescription}
                />
            </View>
            <View style={styles.footer}>
                <AppButton
                    text="Add Match"
                    onPress={handleSave}
                    btnStyle={styles.saveButton}
                    textStyle={styles.saveButtonText}
                />
            </View>
        </CustomBottomSheet>
    );
}

const styles = StyleSheet.create({
    sheetContent: {
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        paddingTop: 20,
    },
    sheetContentFull: {
        paddingTop: 20,
        paddingHorizontal: 0,
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        height: '90%'
    },
    form: {
        gap: Spacing.lg,
        paddingBottom: 40,
        paddingHorizontal: 20
    },
    footer: {
        alignItems: 'center',
        paddingBottom: 40,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    saveButton: {
        backgroundColor: Colors.white,
        borderRadius: 100,
        paddingHorizontal: 32,
        paddingVertical: 17,
        width: '100%'
    },
    saveButtonText: {
        color: Colors.black,
        fontWeight: '600',
    },
    sectionContainer: {
        gap: 12
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    addMatchButton: {
        backgroundColor: '#303030',
        borderRadius: 100,
        paddingVertical: 12,
        width: '100%'
    },
    addMatchButtonText: {
        color: Colors.white,
        fontWeight: '600',
        fontSize: 14
    },
    matchItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 12,
        borderRadius: 8
    }
});
