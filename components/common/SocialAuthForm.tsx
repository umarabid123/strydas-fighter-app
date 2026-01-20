import React from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { BorderRadius, Colors, DESIGN_HEIGHT, DESIGN_WIDTH, Spacing, Typography } from '../../constant';
import AppButton from './AppButton';
import AppText from './AppText';
import CustomIconButton from './CustomIconButton';
import Divider from './Divider';
import { authService } from '../../services/authService';

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
}: SocialAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const result = await authService.signInWithGoogle();
      
      if (result.success) {
        console.log('Google auth successful');
        // Note: OAuth flow requires callback handling
        // The auth state will be handled by the auth listener
      } else {
        alert(result.error || 'Failed to sign in with Google');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    setIsLoading(true);
    try {
      const result = await authService.signInWithApple();
      
      if (result.success) {
        console.log('Apple auth successful');
        // Note: OAuth flow requires callback handling
      } else {
        alert(result.error || 'Failed to sign in with Apple');
      }
    } catch (error) {
      console.error('Apple auth error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookAuth = async () => {
    setIsLoading(true);
    try {
      const result = await authService.signInWithFacebook();
      
      if (result.success) {
        console.log('Facebook auth successful');
        // Note: OAuth flow requires callback handling
      } else {
        alert(result.error || 'Failed to sign in with Facebook');
      }
    } catch (error) {
      console.error('Facebook auth error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
          style={[styles.scrollView, {}]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title and Description */}
          <View style={[styles.titleContainer, { marginBottom: titleContainerMarginBottom }]}>
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
                disabled={isLoading}
              />
              <CustomIconButton
                text="Continue with Apple"
                source={require('../../assets/images/apple-icon.png')}
                btnStyle={[styles.socialButton, { height: socialButtonHeight, paddingHorizontal: socialButtonPadding }]}
                textStyle={[styles.socialButtonText, { fontSize: socialButtonTextSize }]}
                iconStyle={styles.socialIcon}
                onPress={handleAppleAuth}
                disabled={isLoading}
              />
              <CustomIconButton
                text="Continue with Facebook"
                source={require('../../assets/images/facebook-icon.png')}
                btnStyle={[styles.socialButton, { height: socialButtonHeight, paddingHorizontal: socialButtonPadding }]}
                textStyle={[styles.socialButtonText, { fontSize: socialButtonTextSize }]}
                iconStyle={styles.socialIcon}
                onPress={handleFacebookAuth}
                disabled={isLoading}
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
                editable={!isLoading}
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
    width: '100%',
  },
  keyboardView: {
    flex: 1,
  },
  progressContainer: {
    position: 'absolute',
    top: '7%', // approx 60/852
    left: '25%', // (100% - 50%) / 2
    width: '50%', // 196.5/393
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
  },
  scrollContent: {
    paddingHorizontal: '5%', // 20/393
    paddingBottom: '25%', // 200/852 approx, ensuring enough space for button
    paddingTop: '15%', // 100/852 approx 11.7% -> increased slightly for safety
    flexGrow: 1,
  },
  titleContainer: {
    width: '84%', // 329/393
    maxWidth: 500, // Limit width on large screens
    alignItems: 'center',
    gap: Spacing.sm,
    alignSelf: 'center',
  },
  title: {
    width: '100%',
    letterSpacing: -0.48,
    lineHeight: 32,
  },
  subtitle: {
    width: '100%',
    opacity: 0.8,
    lineHeight: 22,
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
    borderRadius: BorderRadius.md,
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
    paddingVertical: 12,
    gap: 4,
    height: 64,
    justifyContent: 'center',
  },
  inputLabel: {
    letterSpacing: 0.24,
    opacity: 0.8,
  },
  input: {
    fontWeight: Typography.fontWeight.light,
    color: 'rgba(255, 255, 255, 0.8)',
    padding: 0,
    height: 24,
  },
  nextButton: {
    position: 'absolute',
    bottom: '6%', // 50/852
    alignSelf: 'center', // Replaces left calculation
    width: '30%', // 120/393
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

