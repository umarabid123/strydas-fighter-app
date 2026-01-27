import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  useColorScheme,
} from 'react-native';
// cspell:ignore datetimepicker
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Spacing, Typography, BorderRadius } from '../../constant';
import AppText from './AppText';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  value: Date;
  onChange: (event: any, selectedDate?: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
}

export default function DatePickerModal({
  visible,
  onClose,
  title,
  value,
  onChange,
  maximumDate,
  minimumDate,
}: DatePickerModalProps) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      if (event.type === 'set' && selectedDate) {
        onChange(event, selectedDate);
      }
      onClose();
    } else {
      onChange(event, selectedDate);
    }
  };

  const handleDone = () => {
    onClose();
  };

  // On Android, show native picker outside modal
  if (Platform.OS === 'android' && visible) {
    return (
      <DateTimePicker
        value={value}
        mode="date"
        display="default"
        onChange={handleDateChange}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
      />
    );
  }

  // On iOS, show modal with spinner picker
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={[styles.sheet, { backgroundColor: Colors.black }]}>
          <View style={styles.header}>
            <AppText
              text={title}
              fontSize={Typography.fontSize.lg}
              fontName="CircularStd-Medium"
              color={colors.white}
              style={styles.title}
              textAlign="center"
            />
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <AppText
                text="×"
                fontSize={Typography.fontSize.xxl}
                fontName="CircularStd-Medium"
                color={colors.white}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.pickerWrapper}>
            <View style={styles.iosPickerContainer}>
              <DateTimePicker
                value={value}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                textColor={Colors.white}
                themeVariant="dark" // Important for iOS dark mode
                style={styles.iosPicker}
                locale="en_GB" // Force locale if needed, or stick to default
              />
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={handleDone}
            >
              <AppText
                text="Done"
                fontSize={Typography.fontSize.md}
                fontName="CircularStd-Medium"
                color={Colors.black}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  sheet: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingBottom: Spacing.xxl,
    width: '100%',
    zIndex: 1,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  title: {
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerWrapper: {
    width: '100%',
    paddingHorizontal: Spacing.xl,
  },
  iosPickerContainer: {
    width: '100%',
    height: 216,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iosPicker: {
    width: '100%',
    height: 216,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  doneButton: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

