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

  const handleNext = async () => {
    if (isLoading) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Check if user exists first to prevent re-signup
      const profile = await authService.checkUserExists(trimmedEmail);
      if (profile) {
        setIsLoading(false);
        alert('User already exists. Please log in instead.');
        // Optionally redirect to Login: navigation.navigate('Login');
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
        alert(result.error || 'Failed to send verification code. Please try again.');
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error('Error in handleNext:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <>
      <SocialAuthForm
        title="Create account."
        subtitle="Unlock the benefits of a digital hub."
        email={email}
        onEmailChange={setEmail}
        onNext={handleNext}
        showProgressBar
        titleContainerMarginBottom={60}
      />
      <AppLoader isLoading={isLoading} />
    </>
  );
}
