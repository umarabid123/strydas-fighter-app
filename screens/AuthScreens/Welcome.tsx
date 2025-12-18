import React from "react"
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  TouchableOpacity,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NavigationProp } from "@react-navigation/native"
import { Colors, Spacing, Typography, BorderRadius, DESIGN_WIDTH, DESIGN_HEIGHT } from "../../constant"
import AppText from "../../components/common/AppText"
import AppButton from "../../components/common/AppButton"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

interface WelcomeProps {
  onContinue?: () => void
  onSkip?: () => void
}

export default function Welcome({ onContinue, onSkip }: WelcomeProps) {
  const colorScheme = useColorScheme()
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light

  const handleContinue = () => {
    // Navigate to next screen or home
    console.log("Continue to setup profile")
    if (onContinue) {
      onContinue()
    }
    // navigation?.navigate("Home")
  }

  const handleSkip = () => {
    // Skip and go to home
    console.log("Skip profile setup")
    if (onSkip) {
      onSkip()
    }
    // navigation?.navigate("Home")
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground} />
          <View style={styles.progressFill} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              Great! Let's setup your profile to benefit from{" "}
              <Text style={styles.brandText}>STRYDA</Text>.
            </Text>
          </View>

          {/* Character Illustration and Background Vector */}
          <View style={styles.illustrationContainer}>
          {/* Background Vector/S Logo */}
          <View style={styles.vectorContainer}>
            {/* Placeholder for vector - you can add the actual image here */}
            <View style={styles.vectorPlaceholder} />
          </View>

          {/* Character Image */}
          <View style={styles.characterContainer}>
            {/* Placeholder for character image - you can add the actual image here */}
            <View style={styles.characterPlaceholder} />
          </View>
        </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <AppButton
            text="Yes! Let's do it"
            onPress={handleContinue}
            btnStyle={styles.continueButton}
            textStyle={styles.continueButtonText}
          />
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <AppText
              text="I'll do it later"
              fontSize={Typography.fontSize.lg}
              fontName="CircularStd-Medium"
              color={colors.text}
              textAlign="center"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.black,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  keyboardView: {
    flex: 1,
  },
  progressContainer: {
    position: "absolute",
    top: (43 / DESIGN_HEIGHT) * SCREEN_HEIGHT, // 5.02% from top
    left: (SCREEN_WIDTH - (196.5 / DESIGN_WIDTH) * SCREEN_WIDTH) / 2,
    width: (196.5 / DESIGN_WIDTH) * SCREEN_WIDTH,
    height: 4,
    borderRadius: 30,
    zIndex: 10,
  },
  progressBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 30,
  },
  progressFill: {
    position: "absolute",
    left: 0,
    width: `${(98 / 196.5) * 100}%`, // 98px out of 196.5px (50%)
    height: "100%",
    backgroundColor: Colors.white,
    borderRadius: 30,
  },
  scrollView: {
    flex: 1,
    marginTop: (70 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
  },
  scrollContent: {
    paddingHorizontal: (32 / DESIGN_WIDTH) * SCREEN_WIDTH,
    paddingBottom: (200 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
    alignItems: "center",
  },
  titleContainer: {
    width: (329 / DESIGN_WIDTH) * SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontFamily: "CircularStd-Medium",
    textAlign: "center",
    letterSpacing: -0.48,
  },
  brandText: {
    fontFamily: "CircularStd-Bold",
    fontStyle: "italic",
    fontWeight: Typography.fontWeight.bold,
  },
  illustrationContainer: {
    width: "100%",
    height: (340 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xxl,
  },
  vectorContainer: {
    position: "absolute",
    left: (85 / DESIGN_WIDTH) * SCREEN_WIDTH,
    top: 0,
    width: (221 / DESIGN_WIDTH) * SCREEN_WIDTH,
    height: (305 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
    opacity: 0.3,
  },
  vectorPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: BorderRadius.md,
  },
  characterContainer: {
    position: "absolute",
    left: (SCREEN_WIDTH - (176 / DESIGN_WIDTH) * SCREEN_WIDTH) / 2,
    top: (40 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
    width: (176 / DESIGN_WIDTH) * SCREEN_WIDTH,
    height: (340 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
  },
  characterPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: BorderRadius.md,
  },
  actionsContainer: {
    position: "absolute",
    bottom: (75 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
    left: (SCREEN_WIDTH - (120 / DESIGN_WIDTH) * SCREEN_WIDTH) / 2,
    width: (120 / DESIGN_WIDTH) * SCREEN_WIDTH,
    minWidth: 120,
    alignItems: "center",
    gap: Spacing.lg,
  },
  continueButton: {
    width: "100%",
    height: 51,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.lg,
  },
  continueButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.black,
  },
  skipButton: {
    paddingVertical: Spacing.sm,
  },
})

