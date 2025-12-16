import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
  type ViewStyle,
} from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../constant';
import AppText from './AppText';

interface ToggleProps {
  label: string;
  subtitle?: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  containerStyle?: ViewStyle;
  labelStyle?: any;
  subtitleStyle?: any;
  layout?: 'row' | 'column';
}

export default function Toggle({
  label,
  subtitle,
  value,
  onToggle,
  containerStyle,
  subtitleStyle,
  labelStyle,
  layout = 'row',
}: ToggleProps) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const thumbPosition = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(thumbPosition, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, thumbPosition]);

  const thumbLeft = thumbPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 44],
  });

  const thumbColor = thumbPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.white, Colors.black],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.content, layout === 'column' && { flexDirection: 'column', alignItems: 'flex-start', gap: 20 }]}>
        <View style={[styles.textContainer, layout === 'column' && { flex: 0, width: '100%' }]}>
          <AppText
            text={label}
            fontSize={Typography.fontSize.md}
            fontName="CircularStd-Medium"
            color={colors.white}
            style={[styles.label, labelStyle]}
          />
          {subtitle && (
            <AppText
              text={subtitle}
              fontSize={Typography.fontSize.md}
              fontName="CircularStd-Book"
              color="#FFFFFFCC"
              style={[styles.subtitle, subtitleStyle]}
            />
          )}
        </View>
        <TouchableOpacity
          style={[styles.toggleSwitch, value && styles.toggleSwitchEnabled]}
          onPress={() => onToggle(!value)}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.toggleThumb,
              {
                left: thumbLeft,
                backgroundColor: thumbColor,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    paddingBottom: Spacing.md,
  },
  content: {
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  textContainer: {
    flex: 1,
    gap: 4, // 4px gap between label and subtitle
  },
  label: {
    letterSpacing: 0.28,
  },
  subtitle: {
    letterSpacing: 0.28,
    fontWeight: 300
  },
  toggleSwitch: {
    width: 80,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    position: 'relative',
  },
  toggleSwitchEnabled: {
    backgroundColor: Colors.white,
  },
  toggleThumb: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    top: 4,
    // backgroundColor is animated, so not set here
  },
});

