import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import SocialAuthForm from '../../components/common/SocialAuthForm';
import AppLoader from '../../components/common/AppLoader';
import { authService } from '../../services/authService';

interface SignUpProps {
  onNext?: () => void;
}

export default function SignUp({ onNext }: SignUpProps) {
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (error) setError('');
  };

  const handleNext = async () => {
    if (isLoading) return;
    setError('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Check if user exists first to prevent re-signup
      const profile = await authService.checkUserExists(trimmedEmail);
      // Only block if the user has actually completed onboarding
      if (profile && profile.onboarding_completed) {
        setIsLoading(false);
        setError('An account with this email already exists. Please sign in instead.');
        return;
      }

      const result = await authService.signUpWithOTP(trimmedEmail);

      setIsLoading(false);

      if (result.success) {
        // Navigate to Verify screen with email
        console.log('OTP sent successfully');
        navigation.navigate('Verify', {
          email: trimmedEmail,
          isNewUser: true // We know they are new here
        });

        if (onNext) {
          onNext();
        }
      } else {
        // Show error to user
        setError(result.error || 'Failed to send verification code. Please try again.');
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error('Error in handleNext:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <>
      <SocialAuthForm
        title="Create account."
        subtitle="Unlock the benefits of a digital hub."
        email={email}
        onEmailChange={handleEmailChange}
        onNext={handleNext}
        showProgressBar
        titleContainerMarginBottom={60}
        error={error}
      />
      <AppLoader isLoading={isLoading} />
    </>
  );
}
