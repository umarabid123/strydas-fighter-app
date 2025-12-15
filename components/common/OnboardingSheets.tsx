import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Spacing } from '../../constant';
import AppButton from './AppButton';
import CustomBottomSheet from './CustomBottomSheet';
import ProfileInput from './ProfileInput';
import SelectPicker from './SelectPicker';

export const ContactSheet = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [org, setOrg] = useState('');

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
                    placeholder="+45 12 34 56 78"
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
                    onPress={onClose}
                    btnStyle={styles.saveButton}
                    textStyle={styles.saveButtonText}
                />
            </View>
        </CustomBottomSheet>
    );
};

const DIVISION_OPTIONS = ['Amateur', 'Semi-Pro', 'Pro'];
const SPORT_OPTIONS = ['Muay Thai', 'MMA', 'Kickboxing', 'Boxing'];
const RESULT_OPTIONS = ['Won', 'Lost', 'Draw', 'No Contest'];


export const MatchSheet = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const [date, setDate] = useState('Aug 04, 2025');
    const [opponent, setOpponent] = useState('+45 12 34 56 78');
    const [event, setEvent] = useState('+45 12 34 56 78');
    // Using simple inputs for selects for now, or ProfileInput with non-editable + value to adhere to design "Select" look

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

    const getOptions = () => {
        if (pickerType === 'division') return DIVISION_OPTIONS;
        if (pickerType === 'sport') return SPORT_OPTIONS;
        if (pickerType === 'result') return RESULT_OPTIONS;
        return [];
    };

    const getPickerTitle = () => {
        if (pickerType === 'division') return 'Select Division';
        if (pickerType === 'sport') return 'Select Sport';
        if (pickerType === 'result') return 'Select Result';
        return '';
    };

    return (
        <CustomBottomSheet
            visible={visible}
            onClose={onClose}
            title="Add match"
            contentStyle={styles.sheetContent}
        >
            <View style={styles.form}>
                <ProfileInput
                    label="Date of match *"
                    placeholder="Select Date"
                    value={date}
                    onChangeText={setDate}
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
                    label="Sport"
                    placeholder="Select"
                    value={sport}
                    editable={false}
                    onPress={() => setPickerType('sport')}
                />
                <ProfileInput
                    label="Result"
                    placeholder="Select"
                    value={result}
                    editable={false}
                    onPress={() => setPickerType('result')}
                />
            </View>
            <View style={styles.footer}>
                <AppButton
                    text="Add match"
                    onPress={onClose}
                    btnStyle={styles.saveButton}
                    textStyle={styles.saveButtonText}
                />
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
        </CustomBottomSheet>
    );
};

const styles = StyleSheet.create({
    sheetContent: {
        justifyContent: 'flex-start',
        alignItems: 'stretch', // Align items to stretch to fill width
        paddingTop: 20,
    },
    form: {
        gap: Spacing.lg,
        paddingBottom: 40,
    },
    footer: {
        alignItems: 'center',
        paddingBottom: 20
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
    }
});
