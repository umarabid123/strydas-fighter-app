import type { NavigationProp, RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import AppLoader from '../../components/common/AppLoader';
import AppText from '../../components/common/AppText';
import { BorderRadius, Colors, DESIGN_HEIGHT, DESIGN_WIDTH, Spacing, Typography } from '../../constant';
import { authService, checkOnboardingStatus } from '../../services/authService';
import { profileService } from '../../services/profileService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type VerifyRouteParams = {
  email: string;
  isNewUser: boolean;
};

interface VerifyProps {
  onVerifyComplete?: () => void;
}

export default function Verify({ onVerifyComplete }: VerifyProps) {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<{ params: VerifyRouteParams }>>();
  const { email, isNewUser } = route.params || { email: '', isNewUser: false };

  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const [code, setCode] = useState(['', '', '', '', '', '']); // 6 digits
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleCodeChange = (text: string, index: number) => {
    const sanitizedText = text.replace(/[^0-9]/g, '');

    // Handle clear
    if (sanitizedText.length === 0) {
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
      return;
    }

    // Handle paste (multiple characters)
    if (sanitizedText.length > 1) {
      const newCode = [...code];
      const chars = sanitizedText.split('');
      let lastUpdatedIndex = index;

      for (let i = 0; i < chars.length; i++) {
        const targetIndex = index + i;
        if (targetIndex < 6) {
          newCode[targetIndex] = chars[i];
          lastUpdatedIndex = targetIndex;
        }
      }

      setCode(newCode);

      const fullCode = newCode.join('');
      if (fullCode.length === 6) {
        handleVerify(fullCode);
        inputRefs.current[5]?.blur();
      } else if (lastUpdatedIndex < 5) {
        inputRefs.current[lastUpdatedIndex + 1]?.focus();
      }
      return;
    }

    // Handle single character
    const newCode = [...code];
    newCode[index] = sanitizedText;
    setCode(newCode);

    // Auto-focus next input
    if (sanitizedText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    if (newCode.every(digit => digit !== '')) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (fullCode: string) => {
    if (isLoading) return;

    if (!email) {
      alert('Email address missing. Please go back and try again.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.verifyOTP(email, fullCode);

      if (result.success) {
        console.log('Verification successful');

        if (result.isNewUser) {
          // New user - go to complete profile
          navigation.navigate('CompleteProfile');
        } else {
          // Existing user - check profile status
          const profile = await profileService.getProfileById(result.user?.id || '');

          if (profile?.onboarding_completed) {
            // Onboarding done - go to Home/Welcome
            navigation.navigate('Welcome');
          } else if (!profile?.first_name) {
            // Profile incomplete (step 1)
            navigation.navigate('CompleteProfile');
          } else {
            // Profile step 1 done, go to role selection (step 2)
            navigation.navigate('OnboardingRoles');
          }
        }

        if (onVerifyComplete) {
          onVerifyComplete();
        }
      } else {
        setIsLoading(false);
        // Show error to user
        alert(result.error || 'Invalid verification code. Please check and try again.');
        // Clear the code inputs
        setCode(['', '', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error('Error verifying OTP:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleResend = async () => {
    if (isLoading) return;

    if (!email) {
      alert('Email address missing. Please go back and try again.');
      return;
    }

    try {
      const result = await authService.resendOTP(email);

      if (result.success) {
        alert('A new verification code has been sent to your email.');
        console.log('OTP resent successfully');
      } else {
        alert(result.error || 'Failed to resend code. Please try again.');
      }
    } catch (error: any) {
      console.error('Error resending OTP:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground} />
          <View style={[styles.progressFill, { width: isNewUser ? '50%' : '33%' }]} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title and Description */}
          <View>
            <View style={styles.titleContainer}>
              <AppText
                text="Enter your code"
                fontSize={Typography.fontSize.xxl}
                fontName="CircularStd-Medium"
                color={colors.white}
                textAlign="center"
                style={styles.title}
              />
              <AppText
                text="Enter the 6-digit code sent to your email."
                fontSize={Typography.fontSize.md}
                fontName="CircularStd-Book"
                color={Colors.textSecondary}
                textAlign="center"
                style={styles.subtitle}
              />
            </View>

            {/* Code Input Fields - Now 6 digits */}
            <View style={styles.codeContainer}>
              {code.map((digit, index) => (
                <View
                  key={index}
                  style={[
                    styles.codeInputWrapper,
                    digit && styles.codeInputFilled,
                    index === code.findIndex(c => c === '') &&
                    styles.codeInputActive,
                  ]}
                >
                  <TextInput
                    ref={ref => {
                      inputRefs.current[index] = ref;
                    }}
                    style={styles.codeInput}
                    value={digit}
                    onChangeText={text => handleCodeChange(text, index)}
                    onKeyPress={({ nativeEvent }) =>
                      handleKeyPress(nativeEvent.key, index)
                    }
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    maxLength={6} // Allow pasting long strings
                    selectTextOnFocus
                    secureTextEntry={false}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Resend Section */}
          <View style={styles.resendContainer}>
            <AppText
              text="Didn't receive any e-mail?"
              fontSize={Typography.fontSize.md}
              fontName="CircularStd-Book"
              color={Colors.textSecondary}
              textAlign="center"
              style={styles.resendText}
            />
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResend}
              activeOpacity={0.8}
            >
              <AppText
                text="Resend code"
                fontSize={Typography.fontSize.md}
                fontName="CircularStd-Medium"
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <AppLoader isLoading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor: Colors.black,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  keyboardView: {
    flex: 1,
  },
  progressContainer: {
    position: 'absolute',
    top: (60 / DESIGN_HEIGHT) * SCREEN_HEIGHT, // 7.04% from top
    left: (SCREEN_WIDTH - (196.5 / DESIGN_WIDTH) * SCREEN_WIDTH) / 2,
    width: (196.5 / DESIGN_WIDTH) * SCREEN_WIDTH,
    height: 4,
    borderRadius: 30,
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
    width: '33%', // Changed from 49 to 33 for better visual
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 30,
  },
  scrollView: {
    flexGrow: 0.9,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: (32 / DESIGN_WIDTH) * SCREEN_WIDTH,
    marginTop: 62,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    width: (329 / DESIGN_WIDTH) * SCREEN_WIDTH,
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 60,
    marginTop: 32,
  },
  title: {
    width: '100%',
    letterSpacing: -0.48,
  },
  subtitle: {
    width: '100%',
  },
  codeContainer: {
    width: (329 / DESIGN_WIDTH) * SCREEN_WIDTH,
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl,
  },
  codeInputWrapper: {
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    width: (44 / DESIGN_WIDTH) * SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeInputFilled: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  codeInputActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  codeInput: {
    fontSize: Typography.fontSize.xxl,
    fontFamily: 'Inter',
    fontWeight: Typography.fontWeight.normal,
    color: Colors.white,
    textAlign: 'center',
    width: '100%',
    padding: 0,
  },
  resendContainer: {
    marginTop: 'auto', // Pushes button to bottom
    width: (329 / DESIGN_WIDTH) * SCREEN_WIDTH,
    alignItems: 'center',
    gap: Spacing.xl,
  },
  resendText: {
    width: '100%',
  },
  resendButton: {
    width: '100%',
    height: 51,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: BorderRadius.full,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
  },
});
