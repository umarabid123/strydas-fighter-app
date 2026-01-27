import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  useColorScheme,
} from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constant';
import AppText from './AppText';

interface SelectPickerOption<T = string> {
  label: string;
  value: T;
}

interface SelectPickerProps<T = string> {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: (string | SelectPickerOption<T>)[];
  selectedValue?: T;
  onSelect: (value: T) => void;
}

export default function SelectPicker<T = string>({
  visible,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
}: SelectPickerProps<T>) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const handleSelect = (value: T) => {
    onSelect(value);
    onClose();
  };

  const getLabel = (item: string | SelectPickerOption<T>): string => {
    if (typeof item === 'string') return item;
    return item.label;
  };

  const getValue = (item: string | SelectPickerOption<T>): T => {
    if (typeof item === 'string') return item as unknown as T;
    return item.value;
  };

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

          {options.length > 0 ? (
            <FlatList
              data={options}
              keyExtractor={(item, index) => `${getValue(item)}-${index}`}
              renderItem={({ item }) => {
                const value = getValue(item);
                const label = getLabel(item);
                const isSelected = value === selectedValue;
                return (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      isSelected && styles.optionSelected,
                    ]}
                    onPress={() => handleSelect(value)}
                    activeOpacity={0.7}
                  >
                    <AppText
                      text={label}
                      fontSize={Typography.fontSize.xl}
                      fontName={isSelected ? 'CircularStd-Medium' : 'CircularStd-Book'}
                      color={isSelected ? colors.white : colors.textTertiary}
                    />
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <AppText
                          text="✓"
                          fontSize={Typography.fontSize.sm}
                          fontName="CircularStd-Medium"
                          color={Colors.black}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <AppText
                text="No options available"
                fontSize={Typography.fontSize.md}
                fontName="CircularStd-Book"
                color={colors.textTertiary}
                textAlign="center"
              />
            </View>
          )}
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
    maxHeight: '70%',
    minHeight: '50%',
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
  list: {
    flex: 1,
    width: '100%',
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  optionSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
});

