import { Search, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Image, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../constant';
import AppButton from './AppButton';
import AppText from './AppText';
import CustomBottomSheet from './CustomBottomSheet';
import ProfileInput from './ProfileInput';
import SelectPicker from './SelectPicker';

// Mock data for Fighters
const AVAILABLE_FIGHTERS = [
    { id: '1', name: 'Jaspar Landal', record: '12-4-0', country: 'DEN', flag: require('../../assets/images/flag-icon.png'), sport: 'Muay Thai', avatar: require('../../assets/images/profile-image-icon.png') },
    { id: '2', name: 'Niclas R. Larsen', record: '24-8-1', country: 'DEN', flag: require('../../assets/images/flag-icon.png'), sport: 'MMA', avatar: require('../../assets/images/profile-image-icon.png') },
    { id: '3', name: 'Kristoffer Björgskog', record: '12-4-0', country: 'DEN', flag: require('../../assets/images/flag-icon.png'), sport: 'Muay Thai', avatar: require('../../assets/images/profile-image-icon.png') },
    { id: '4', name: 'Kristoffer Björgskog', record: '12-4-0', country: 'DEN', flag: require('../../assets/images/flag-icon.png'), sport: 'Muay Thai', avatar: require('../../assets/images/profile-image-icon.png') },
];

export const ContactSheet = ({ visible, onClose, onSave }: { visible: boolean; onClose: () => void; onSave?: (data: { fullName: string; phone: string; email: string; org: string }) => void }) => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [org, setOrg] = useState('');

    const handleSave = () => {
        if (!fullName.trim() || !phone.trim()) {
            alert('Please enter Full Name and Phone number.');
            return;
        }

        if (onSave) {
            onSave({
                fullName: fullName.trim(),
                phone: phone.trim(),
                email: email.trim(),
                org: org.trim()
            });
        }
        onClose();
    };

    return (
        <CustomBottomSheet
            visible={visible}
            onClose={onClose}
            title="Contact Person"
            contentStyle={styles.sheetContent}
        >
            <View style={styles.form}>
                <ProfileInput
                    label="Full Name *"
                    placeholder="John Doe"
                    value={fullName}
                    onChangeText={setFullName}
                />
                <ProfileInput
                    label="Phone *"
                    placeholder="+45 12 34 56 78"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />
                <ProfileInput
                    label="Email (optional)"
                    placeholder="john@example.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <ProfileInput
                    label="Organisation (optional)"
                    placeholder="Keddles Gym"
                    value={org}
                    onChangeText={setOrg}
                />
            </View>
            <View style={styles.footer}>
                <AppButton
                    text="Save & close"
                    onPress={handleSave}
                    btnStyle={styles.saveButton}
                    textStyle={styles.saveButtonText}
                />
            </View>
        </CustomBottomSheet>
    );
};

import { DivisionEnum } from '../../lib/types';
const DIVISION_OPTIONS = Object.values(DivisionEnum).map(div => ({
    label: div.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
    value: div
}));
const SPORT_OPTIONS = ['Muay Thai', 'MMA', 'Kickboxing', 'Boxing'];
const RESULT_OPTIONS = ['Won', 'Lost', 'Draw', 'No Contest'];


import DatePickerModal from './DatePickerModal';
import { MonthNames } from '../../constant';

export const MatchSheet = ({ visible, onClose, onSave }: { visible: boolean; onClose: () => void; onSave: (match: { date: Date; opponent: string; event: string; division: string; sport: string; result: string }) => void }) => {
    const [date, setDate] = useState('');
    const [matchDate, setMatchDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [opponent, setOpponent] = useState('');
    const [event, setEvent] = useState('');

    const [division, setDivision] = useState('');
    const [sport, setSport] = useState('');
    const [result, setResult] = useState('');

    const [pickerType, setPickerType] = useState<'none' | 'division' | 'sport' | 'result'>('none');

    const handleSelect = (value: string) => {
        if (pickerType === 'division') setDivision(value);
        if (pickerType === 'sport') setSport(value);
        if (pickerType === 'result') setResult(value);
        setPickerType('none');
    };

    const handleSave = () => {
        if (!date || !opponent.trim() || !event.trim() || !sport || !result) {
            alert('Please fill in all required fields');
            return;
        }
        onSave({
            date: matchDate,
            opponent: opponent.trim(),
            event: event.trim(),
            division,
            sport,
            result
        });
        // Reset form
        setOpponent('');
        setEvent('');
        setDivision('');
        setSport('');
        setResult('');
        setDate('');
        setMatchDate(new Date());
        onClose();
    };

    const getOptions = () => {
        if (pickerType === 'division') return DIVISION_OPTIONS;
        if (pickerType === 'sport') return SPORT_OPTIONS;
        if (pickerType === 'result') return RESULT_OPTIONS;
        return [];
    };

    // ... (rest of getPickerTitle, formatDate, handleDateChange)

    const getPickerTitle = () => {
        if (pickerType === 'division') return 'Select Division';
        if (pickerType === 'sport') return 'Select Sport';
        if (pickerType === 'result') return 'Select Result';
        return '';
    };

    const formatDate = (date: Date): string => {
        const month = MonthNames[date.getMonth()];
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            setMatchDate(selectedDate);
            setDate(formatDate(selectedDate));
        }
    };

    return (
        <CustomBottomSheet
            visible={visible}
            onClose={onClose}
            title="Add match"
            contentStyle={styles.sheetContent}
        >
            <View style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                >
                    <View style={styles.form}>
                        <ProfileInput
                            label="Date of match *"
                            placeholder="Select Date"
                            value={date}
                            editable={false}
                            onPress={() => setShowDatePicker(true)}
                        />
                        <ProfileInput
                            label="Name of opponent *"
                            placeholder="Name"
                            value={opponent}
                            onChangeText={setOpponent}
                        />
                        <ProfileInput
                            label="Name of event *"
                            placeholder="Event Name"
                            value={event}
                            onChangeText={setEvent}
                        />

                        <ProfileInput
                            label="Division"
                            placeholder="Select"
                            value={division}
                            editable={false}
                            onPress={() => setPickerType('division')}
                        />
                        <ProfileInput
                            label="Sport *"
                            placeholder="Select"
                            value={sport}
                            editable={false}
                            onPress={() => setPickerType('sport')}
                        />
                        <ProfileInput
                            label="Result *"
                            placeholder="Select"
                            value={result}
                            editable={false}
                            onPress={() => setPickerType('result')}
                        />
                    </View>
                </ScrollView>
                <View style={[styles.footer, { paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 40 : 20, backgroundColor: 'transparent' }]}>
                    <AppButton
                        text="Add match"
                        onPress={handleSave}
                        btnStyle={styles.saveButton}
                        textStyle={styles.saveButtonText}
                    />
                </View>
            </View>

            <SelectPicker
                visible={pickerType !== 'none'}
                onClose={() => setPickerType('none')}
                title={getPickerTitle()}
                options={getOptions()}
                onSelect={handleSelect}
                selectedValue={
                    pickerType === 'division' ? division :
                        pickerType === 'sport' ? sport :
                            pickerType === 'result' ? result : undefined
                }
            />

            <DatePickerModal
                visible={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                title="Select Date of Match"
                value={matchDate}
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1990, 0, 1)}
            />
        </CustomBottomSheet>
    );
};

export const AddFighterSheet = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFighters, setSelectedFighters] = useState<string[]>([]);
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const handleAddFighter = (id: string) => {
        if (!selectedFighters.includes(id)) {
            setSelectedFighters([...selectedFighters, id]);
        }
    };

    const handleRemoveFighter = (id: string) => {
        setSelectedFighters(selectedFighters.filter(fighterId => fighterId !== id));
    };

    // Filter available fighters excluding already selected ones
    const availableList = AVAILABLE_FIGHTERS.filter(f => !selectedFighters.includes(f.id));
    const selectedList = AVAILABLE_FIGHTERS.filter(f => selectedFighters.includes(f.id));

    return (
        <CustomBottomSheet
            visible={visible}
            onClose={onClose}
            title="Add fighters"
            contentStyle={styles.sheetContentFull}
            sheetStyle={{ minHeight: 'auto', maxHeight: '90%' }}
        >
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Search color={"#00000099"} size={24} />
                <TextInput
                    style={[styles.searchInput, { color: colors.white }]}
                    placeholder="Search"
                    placeholderTextColor={"#00000099"}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Available Fighters List (Flex 1 to take remaining space) */}
            <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
                {availableList.map(fighter => (
                    <View key={fighter.id} style={styles.fighterRow}>
                        <View style={styles.fighterInfoLeft}>
                            <TouchableOpacity style={styles.addButtonList} onPress={() => handleAddFighter(fighter.id)}>
                                <AppText text="Add" style={{ fontWeight: 600 }} fontSize={Typography.fontSize.sm} fontName="CircularStd-Bold" color={Colors.black} />
                            </TouchableOpacity>
                            <Image source={fighter.avatar} style={styles.fighterAvatar} />
                            <View>
                                <AppText text={fighter.name} style={{ fontWeight: 600 }} fontSize={Typography.fontSize.xl} fontName="CircularStd-Bold" color={colors.white} />
                                <View style={styles.fighterMetaRow}>
                                    <View style={styles.tag}>
                                        <AppText text={fighter.record} fontSize={Typography.fontSize.lg} color={colors.white} />
                                    </View>
                                    <View style={styles.tag}>
                                        <AppText text={fighter.country} fontSize={Typography.fontSize.lg} color={colors.white} />
                                        <Image source={fighter.flag} style={styles.flagIcon} />
                                    </View>
                                    <View style={styles.tag}>
                                        <AppText text={fighter.sport} fontSize={Typography.fontSize.lg} color={colors.white} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Selected Fighters Section (Bottom) */}
            {selectedList.length > 0 && (
                <View>
                    <View style={styles.separator} />
                    <View>
                        <FlatList
                            data={selectedList}
                            keyExtractor={(item: { id: string }) => item.id}
                            contentContainerStyle={{
                                paddingHorizontal: 20,
                                paddingTop: 24,
                                paddingBottom: 10,
                                gap: 16
                            }}
                            renderItem={({ item: fighter }: { item: typeof AVAILABLE_FIGHTERS[0] }) => (
                                <View style={styles.fighterRow}>
                                    <View style={styles.fighterInfoLeft}>
                                        <TouchableOpacity style={styles.removeButtonList} onPress={() => handleRemoveFighter(fighter.id)}>
                                            <X color={"#E05D58"} size={12} />
                                        </TouchableOpacity>
                                        <Image source={fighter.avatar} style={styles.fighterAvatar} />
                                        <View>
                                            <AppText text={fighter.name} style={{ fontWeight: 600 }} fontSize={Typography.fontSize.xl} fontName="CircularStd-Bold" color={colors.white} />
                                            <View style={styles.fighterMetaRow}>
                                                <View style={styles.tag}>
                                                    <AppText text={fighter.record} fontSize={Typography.fontSize.lg} color={colors.white} />
                                                </View>
                                                <View style={styles.tag}>
                                                    <AppText text={fighter.country} fontSize={Typography.fontSize.lg} color={colors.white} />
                                                    <Image source={fighter.flag} style={styles.flagIcon} />
                                                </View>
                                                <View style={styles.tag}>
                                                    <AppText text={fighter.sport} fontSize={Typography.fontSize.lg} color={colors.white} />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                </View>
            )}

            <View style={styles.footer}>
                <AppButton
                    text="Save & close"
                    onPress={onClose}
                    btnStyle={styles.saveButton}
                    textStyle={styles.saveButtonText}
                />
            </View>
        </CustomBottomSheet>
    );
};


const SOCIAL_PLATFORMS = ['Instagram', 'Facebook', 'Twitter', 'TikTok', 'YouTube', 'Website', 'Other'];

export const SocialLinkSheet = ({ visible, onClose, onSave }: { visible: boolean; onClose: () => void; onSave: (link: { platform: string; url: string }) => void }) => {
    const [platform, setPlatform] = useState('');
    const [url, setUrl] = useState('');
    const [showPlatformPicker, setShowPlatformPicker] = useState(false);

    const handleSave = () => {
        if (platform && url) {
            onSave({ platform, url });
            setPlatform('');
            setUrl('');
            onClose();
        } else {
            alert('Please select a platform and enter a URL');
        }
    };

    return (
        <CustomBottomSheet
            visible={visible}
            onClose={onClose}
            title="Add Social Link"
            contentStyle={styles.sheetContent}
        >
            <View style={styles.form}>
                <ProfileInput
                    label="Platform *"
                    placeholder="Select Platform"
                    value={platform}
                    editable={false}
                    onPress={() => setShowPlatformPicker(true)}
                />
                <ProfileInput
                    label="URL / Username *"
                    placeholder="https://..."
                    value={url}
                    onChangeText={setUrl}
                />
            </View>
            <View style={styles.footer}>
                <AppButton
                    text="Add Link"
                    onPress={handleSave}
                    btnStyle={styles.saveButton}
                    textStyle={styles.saveButtonText}
                />
            </View>

            <SelectPicker
                visible={showPlatformPicker}
                onClose={() => setShowPlatformPicker(false)}
                title="Select Platform"
                options={SOCIAL_PLATFORMS.map(p => ({ label: p, value: p }))}
                onSelect={(val) => setPlatform(val)}
                selectedValue={platform}
            />
        </CustomBottomSheet>
    );
};

export const SportsSheet = ({ visible, onClose, onSave }: { visible: boolean; onClose: () => void; onSave: (sport: string) => void }) => {
    const [sport, setSport] = useState('');

    const INTEREST_OPTIONS = ['Muay Thai', 'MMA', 'Kickboxing', 'Boxing', 'BJJ', 'Wrestling', 'Karate', 'Judo'];

    const handleSave = () => {
        if (sport && sport.trim()) {
            onSave(sport.trim());
            setSport('');
            onClose();
        } else {
            alert('Please select or enter a sport.');
        }
    };

    return (
        <CustomBottomSheet
            visible={visible}
            onClose={onClose}
            title="Add Sport"
            contentStyle={styles.sheetContent}
        >
            <View style={styles.form}>
                <ProfileInput
                    label="Sport *"
                    placeholder="Select or Type Sport"
                    value={sport}
                    onChangeText={setSport}
                />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {INTEREST_OPTIONS.map(s => (
                        <TouchableOpacity
                            key={s}
                            style={[
                                styles.tag,
                                { backgroundColor: sport === s ? Colors.white : '#303030' }
                            ]}
                            onPress={() => setSport(s)}
                        >
                            <AppText
                                text={s}
                                fontSize={Typography.fontSize.sm}
                                color={sport === s ? Colors.black : Colors.white}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View style={styles.footer}>
                <AppButton
                    text="Add Sport"
                    onPress={handleSave}
                    btnStyle={styles.saveButton}
                    textStyle={styles.saveButtonText}
                />
            </View>
        </CustomBottomSheet>
    );
};

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
    },
    form: {
        gap: Spacing.lg,
        paddingBottom: 40,
        paddingHorizontal: 20 // Added padding back since contentStyle removed it
    },
    footer: {
        alignItems: 'center',
        paddingBottom: 20,
        paddingTop: 20,
    },
    saveButton: {
        backgroundColor: Colors.white,
        borderRadius: 100,
        paddingHorizontal: 32,
        paddingVertical: 17
    },
    saveButtonText: {
        color: Colors.black,
        fontWeight: '600',
    },
    // Add Fighter Sheet Styles
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        marginHorizontal: 20,
        marginBottom: 24,
        height: 50,
    },
    searchInput: {
        flex: 1,
        marginLeft: Spacing.sm,
        fontSize: Typography.fontSize.md,
        fontFamily: 'CircularStd-Book',
        color: Colors.black,
    },
    listContainer: {
        maxHeight: 288,
        flexGrow: 0,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 24,
        gap: 16,
    },
    fighterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    fighterInfoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        flex: 1,
    },
    fighterAvatar: {
        width: 60,
        height: 60,
        borderRadius: 25,
    },
    fighterMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginTop: 4,
    },
    tag: {
        backgroundColor: '#303030',
        borderRadius: 99,
        paddingHorizontal: 6,
        paddingVertical: 2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    flagIcon: {
        width: 12,
        height: 8,
    },
    addButtonList: {
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        paddingVertical: 7.5,
        borderRadius: 50,
    },
    removeButtonList: {
        width: 32,
        height: 32,
        borderRadius: 99,
        backgroundColor: '#302324', // Dark red background
        justifyContent: 'center',
        alignItems: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: 25
    }
});
