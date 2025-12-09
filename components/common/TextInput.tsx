import React, { useState } from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constant';
import AppText from './AppText';


export default function CustomInputField({
  label,
  placeholder,
  keyboardType,
  secureTextEntry,
  type = 'text',
  containerStyle,
  inputStyle,
  labelStyle,
  numberOfLines,
  value,
  onChangeText,
}: {
  label?: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  type?: string;
  containerStyle?: object;
  inputStyle?: object;
  labelStyle?: object;
  numberOfLines?: number;
  value?: string;
  onChangeText?: (text: string) => void;
}) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const [secureText, setSecureText] = useState(secureTextEntry || type === 'password');
  const isPassword = type === 'password' || secureTextEntry;
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <AppText
          text={label}
          fontSize={Typography.fontSize.sm}
          fontName="CircularStd-Medium"
          color={colors.text}
          style={[styles.label, labelStyle]}
        />
      )}
      <View style={[styles.inputContainer, { backgroundColor: 'rgba(255, 255, 255, 0.08)' }]}>
        <TextInput
          style={[styles.input, inputStyle, { color: colors.textTertiary }]}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          keyboardType={keyboardType}
          secureTextEntry={isPassword ? secureText : false}
          multiline={numberOfLines ? numberOfLines > 1 : false}
          value={value}
          onChangeText={onChangeText}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.iconButton}>
            <AppText
              text={secureText ? '👁️' : '👁️‍🗨️'}
              fontSize={Typography.fontSize.lg}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}

        {type === 'search' && (
          <TouchableOpacity style={styles.iconButton}>
            <AppText
              text="🔍"
              fontSize={Typography.fontSize.lg}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
        {type === 'calender' && (
          <TouchableOpacity style={styles.iconButton}>
            <AppText
              text="📅"
              fontSize={Typography.fontSize.lg}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
        {type === 'watch' && (
          <TouchableOpacity style={styles.iconButton}>
            <AppText
              text="🕐"
              fontSize={Typography.fontSize.lg}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: Spacing.xs,
    letterSpacing: 0.24,
  },
  inputContainer: {
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
    position: 'relative',
  },
  input: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.light,
    padding: 0,
    letterSpacing: 0.28,
    flex: 1,
  },
  iconButton: {
    position: 'absolute',
    right: Spacing.lg,
    top: Spacing.md,
    padding: Spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
