import React from "react"
import { StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from "react-native"
import { Colors, Spacing, Typography } from "../../constant"
import AppText from "./AppText"

interface ProfileInputProps {
  label: string
  placeholder?: string
  value?: string
  onChangeText?: (text: string) => void
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad"
  editable?: boolean
  onPress?: () => void
}

export default function ProfileInput({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  editable = true,
  onPress,
}: ProfileInputProps) {
  const colorScheme = useColorScheme()
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light

  return (
    <View style={styles.container}>
      <AppText
        text={label}
        fontSize={Typography.fontSize.md}
        fontName="CircularStd-Medium"
        color={colors.white}
        style={styles.label}
      />
      {editable ? (
        <TextInput
          style={[styles.input, { color: colors.textTertiary }]}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
        />
      ) : (
        <TouchableOpacity style={styles.inputContainer} onPress={onPress}>
          <AppText
            text={value || placeholder || "-"}
            fontSize={Typography.fontSize.xl}
            fontName="CircularStd-Book"
            color={value ? colors.textTertiary : "rgba(255, 255, 255, 0.5)"}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.15)",
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  label: {
    letterSpacing: 0.28,
    fontWeight: 500
  },
  input: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.light,
    padding: 0,
  },
  inputContainer: {
    padding: 0,
  },
})

