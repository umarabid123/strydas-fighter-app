"use client"

import { View, StyleSheet, Dimensions, Switch } from "react-native"
import { Colors, DESIGN_WIDTH } from '../constant'
import { Typography } from "../constant/typography"
import { Spacing } from "../constant/spacing"
import { useState } from "react"
import AppText from "./common/AppText"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

interface NotificationToggleProps {
  title: string
  subtitle: string
  onToggle?: (enabled: boolean) => void
  initialValue?: boolean
}

export default function NotificationToggle({
  title,
  subtitle,
  onToggle,
  initialValue = false,
}: NotificationToggleProps) {
  const [isEnabled, setIsEnabled] = useState(initialValue)

  const handleToggle = (value: boolean) => {
    setIsEnabled(value)
    onToggle?.(value)
  }

  return (
    <View style={styles.container}>
      <View style={styles.textSection}>
        <AppText text={title} fontSize={Typography.fontSize.xl} fontName="CircularStd-Medium" color={Colors.white} />
        <AppText
          text={subtitle}
          fontSize={Typography.fontSize.md}
          fontName="CircularStd-Book"
          color={Colors.darkGray}
        />
      </View>

      <Switch
        style={styles.switch}
        trackColor={{ false: Colors.whiteOpacity20, true: Colors.successGreenAlt }}
        thumbColor={isEnabled ? Colors.white : Colors.whiteOpacity50}
        ios_backgroundColor={Colors.whiteOpacity20}
        onValueChange={handleToggle}
        value={isEnabled}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    paddingHorizontal: (16 / DESIGN_WIDTH) * SCREEN_WIDTH,
    paddingVertical: (16 / DESIGN_WIDTH) * SCREEN_WIDTH,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteOpacity10,
  },
  textSection: {
    flex: 1,
    gap: Spacing.xs,
  },
  switch: {
    marginLeft: Spacing.md,
  },
})
