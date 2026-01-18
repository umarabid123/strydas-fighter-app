import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import AppLoader from '../../components/common/AppLoader';
import AppText from '../../components/common/AppText';
import { BorderRadius, Colors, DESIGN_HEIGHT, DESIGN_WIDTH, Spacing, Typography } from '../../constant';
import { supabase } from '@/lib/supabase';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../../navigation';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VerifyProps {
  onVerifyComplete?: () => void;
}

export default function Verify({ onVerifyComplete }: VerifyProps) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const route = useRoute();
  const { setIsAuthenticated } = useAuth();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const params = route.params as any;
  const email = params?.email;
  const isProfileComplete = params?.isProfileComplete;

  const handleCodeChange = async (text: string, index: number) => {
    setErrorMessage('')
    // Allow only ONE digit
    const value = text.replace(/[^0-9]/g, '').slice(-1)

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Move focus forward
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when last digit entered
    if (value && index === 5) {
      const fullCode = newCode.join('')

      if (fullCode.length !== 6) return

      try {
        setIsLoading(true)

        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token: fullCode,
          type: 'email',
        })

        if (error) {
          setErrorMessage('Invalid or expired code')
          return
        }

        // ✅ Logged in successfully
        if (isProfileComplete) {
          setIsAuthenticated(true);
        } else {
          navigation.replace('CompleteProfile');
        }
        onVerifyComplete?.()

      } catch (err) {
        setErrorMessage('Something went wrong')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleResend = async () => {
    if (resendCountdown > 0) return;

    if (!email) {
      alert('Email not found');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });

      if (error) {
        alert(error.message);
      } else {
        alert('Code resent successfully');
        setResendCountdown(60);
      }
    } catch (err) {
      alert('Something went wrong');
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
                text="Enter the 6 digits sent to your inbox."
                fontSize={Typography.fontSize.md}
                fontName="CircularStd-Book"
                color={Colors.textSecondary}
                textAlign="center"
                style={styles.subtitle}
              />
            </View>

            {/* Code Input Fields */}
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
                    keyboardType="default"
                    autoCapitalize="characters"
                    maxLength={1}
                    selectTextOnFocus
                  />
                </View>
              ))}
            </View>
            {errorMessage ? (
              <AppText
                text={errorMessage}
                fontSize={Typography.fontSize.sm}
                fontName="CircularStd-Book"
                color={Colors.errorRed}
                textAlign="center"
                style={{ marginTop: Spacing.sm }}
              />
            ) : null}
          </View>
          {/* Resend Section */}
          <View style={styles.resendContainer}>
            <AppText
              text="Didn't recieve any e-mail?"
              fontSize={Typography.fontSize.md}
              fontName="CircularStd-Book"
              color={Colors.textSecondary}
              textAlign="center"
              style={styles.resendText}
            />
            <TouchableOpacity
              style={[
                styles.resendButton,
                resendCountdown > 0 && { opacity: 0.5 }
              ]}
              onPress={handleResend}
              activeOpacity={0.8}
              disabled={resendCountdown > 0}
            >
              <AppText
                text={resendCountdown > 0 ? `Resend code (${resendCountdown}s)` : "Resend code"}
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
    width: `${(49 / 196.5) * 100}%`,
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
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  codeInputWrapper: {
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    minWidth: (48 / DESIGN_WIDTH) * SCREEN_WIDTH,
    minHeight: (48 / DESIGN_WIDTH) * SCREEN_WIDTH,
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
    fontSize: Typography.fontSize.xl,
    fontFamily: 'Inter',
    fontWeight: Typography.fontWeight.normal,
    color: Colors.white,
    textAlign: 'center',
    width: '100%',
    padding: 0,
  },
  resendContainer: {
    marginTop: 'auto', // 🔥 pushes the button to bottom
    width: (329 / DESIGN_WIDTH) * SCREEN_WIDTH,
    alignItems: 'center',
    gap: Spacing.xl,
    // paddingBottom: (32 / DESIGN_HEIGHT) * SCREEN_HEIGHT,
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
