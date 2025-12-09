import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Colors, Spacing, Typography } from '../../constant'
import AppText from './AppText'

export default function Divider() {
  return (
    <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <AppText
              text="Or continue with"
              fontSize={Typography.fontSize.md}
              fontName="CircularStd-Book"
              color={Colors.textSecondary}
              style={styles.dividerText}
            />
            <View style={styles.dividerLine} />
          </View>
  )
}

const styles = StyleSheet.create({
      dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: Spacing.xxl,
        gap: 10,
      },
      dividerLine: {
        flex: 1,
        height: 2,
        backgroundColor: Colors.grayBlack,
      },
      dividerText: {
        marginHorizontal: 10,
      },
})