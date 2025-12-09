import React from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View
} from 'react-native';
import { BorderRadius, Colors, DESIGN_HEIGHT, DESIGN_WIDTH, Spacing, Typography } from '../../constant';
import AppButton from './AppButton';
import AppText from './AppText';
import CustomIconButton from './CustomIconButton';
import Divider from './Divider';
import MeshGradientBackground from './MeshGradientBackground';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


interface SocialAuthFormProps {
  title: string;
  subtitle: string;
  email: string;
  onEmailChange: (email: string) => void;
  onNext: () => void;
  showProgressBar?: boolean;
  progressPercentage?: number;
  buttonText?: string;
  buttonOpacity?: number;
  inputLabelFontSize?: number;
  inputFontSize?: number;
  inputLetterSpacing?: number;
  socialButtonHeight?: number;
  socialButtonPadding?: number;
  socialButtonTextSize?: number;
  titleContainerMarginBottom?: number;
  titleContainerMarginTop?: number;
}

export default function SocialAuthForm({
  title,
  subtitle,
  email,
  onEmailChange,
  onNext,
  showProgressBar = false,
  progressPercentage = 0,
  buttonText = 'Next',
  buttonOpacity = 0.5,
  inputLabelFontSize = Typography.fontSize.sm,
  inputFontSize = Typography.fontSize.md,
  inputLetterSpacing = 0.28,
  socialButtonHeight = 51,
  socialButtonPadding = Spacing.lg,
  socialButtonTextSize = Typography.fontSize.md,
  titleContainerMarginBottom = Spacing.xxl,
  titleContainerMarginTop = 0,
}: SocialAuthFormProps) {
  const handleGoogleAuth = () => {
    console.log('Google auth');
  };

  const handleAppleAuth = () => {
    console.log('Apple auth');
  };

  const handleFacebookAuth = () => {
    console.log('Facebook auth');
  };

  return (
    <View style={styles.container}>
      <MeshGradientBackground />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Progress Bar - Optional */}
        {showProgressBar && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground} />
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title and Description */}
          <View style={[styles.titleContainer, { marginBottom: titleContainerMarginBottom, marginTop: titleContainerMarginTop }]}>
            <AppText
              text={title}
              fontSize={Typography.fontSize.xxl}
              fontName="CircularStd-Medium"
              color={Colors.white}
              textAlign="center"
              style={styles.title}
            />
            <AppText
              text={subtitle}
              fontSize={Typography.fontSize.md}
              fontName="CircularStd-Book"
              color={Colors.textSecondary}
              textAlign="center"
              style={styles.subtitle}
            />
          </View>

          {/* Content Container */}
          <View>
            {/* Social Login Buttons */}
            <View style={styles.socialButtonsContainer}>
              <CustomIconButton
                text="Continue with Google"
                source={require('../../assets/images/google-icon.png')}
                btnStyle={[styles.socialButton, { height: socialButtonHeight, paddingHorizontal: socialButtonPadding }]}
                textStyle={[styles.socialButtonText, { fontSize: socialButtonTextSize }]}
                iconStyle={styles.socialIcon}
                onPress={handleGoogleAuth}
              />
              <CustomIconButton
                text="Continue with Apple"
                source={require('../../assets/images/apple-icon.png')}
                btnStyle={[styles.socialButton, { height: socialButtonHeight, paddingHorizontal: socialButtonPadding }]}
                textStyle={[styles.socialButtonText, { fontSize: socialButtonTextSize }]}
                iconStyle={styles.socialIcon}
                onPress={handleAppleAuth}
              />
              <CustomIconButton
                text="Continue with Facebook"
                source={require('../../assets/images/facebook-icon.png')}
                btnStyle={[styles.socialButton, { height: socialButtonHeight, paddingHorizontal: socialButtonPadding }]}
                textStyle={[styles.socialButtonText, { fontSize: socialButtonTextSize }]}
                iconStyle={styles.socialIcon}
                onPress={handleFacebookAuth}
              />
            </View>

            {/* Divider */}
            <Divider />

            {/* Email Input */}
            <View style={[styles.inputContainer]}>
              <AppText
                text="E-mail"
                fontSize={inputLabelFontSize}
                fontName="CircularStd-Medium"
                color={Colors.white}
                style={styles.inputLabel}
              />
              <TextInput
                style={[styles.input, { fontSize: inputFontSize, letterSpacing: inputLetterSpacing }]}
                placeholder="your@email.com"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={onEmailChange}
              />
            </View>
          </View>
        </ScrollView>

        {/* Next Button - Positioned absolutely at bottom */}
        <AppButton
          text={buttonText}
          onPress={onNext}
          btnStyle={[styles.nextButton, { opacity: buttonOpacity }]}
          textStyle={styles.nextButtonText}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  keyboardView: {
    flex: 1,
  },
  progressContainer: {
    position: 'absolute',
    top: (60 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
    left: (SCREEN_WIDTH - (196.5 / DESIGN_WIDTH) * SCREEN_WIDTH) / 2,
    width: (196.5 / DESIGN_WIDTH) * SCREEN_WIDTH,
    height: 4,
    borderRadius: 30,
    zIndex: 10,
  },
  progressBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 30,
  },
  scrollView: {
    flex: 1,
    marginTop: (70 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
  },
  scrollContent: {
    paddingHorizontal: (20 / DESIGN_WIDTH) * SCREEN_WIDTH,
    paddingBottom: (200 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
  },
  titleContainer: {
    width: (329 / DESIGN_WIDTH) * SCREEN_WIDTH,
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'center',
  },
  title: {
    width: '100%',
    letterSpacing: -0.48,
  },
  subtitle: {
    width: '100%',
  },
  socialButtonsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BorderRadius.sm,
    backgroundColor: 'transparent',
  },
  socialButtonText: {
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
    minHeight: 51, // Match button height
  },
  inputLabel: {
    letterSpacing: 0.24,
  },
  input: {
    fontWeight: Typography.fontWeight.light,
    color: 'rgba(255, 255, 255, 0.5)',
    padding: 0,
  },
  nextButton: {
    position: 'absolute',
    bottom: (83 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
    left: (SCREEN_WIDTH - (120 / DESIGN_WIDTH) * SCREEN_WIDTH) / 2,
    width: (120 / DESIGN_WIDTH) * SCREEN_WIDTH,
    minWidth: 120,
    height: 51,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.lg,
  },
  nextButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.black,
  },
});

