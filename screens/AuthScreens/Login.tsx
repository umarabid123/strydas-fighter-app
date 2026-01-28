import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import SocialAuthForm from '../../components/common/SocialAuthForm';
import AppLoader from '../../components/common/AppLoader';
import { authService } from '../../services/authService';

interface LoginProps {
  onSignUpPress?: () => void;
}

export default function Login({ onSignUpPress }: LoginProps) {
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
      // Check if user exists first to prevent login for non-existent users
      const profile = await authService.checkUserExists(trimmedEmail);
      if (!profile) {
        setIsLoading(false);
        setError('No account found with this email. Please create an account first.');
        return;
      }

      const result = await authService.signUpWithOTP(trimmedEmail);

      setIsLoading(false);

      if (result.success) {
        // Navigate to Verify screen with email
        console.log('OTP sent successfully to existing user');
        navigation.navigate('Verify', {
          email: trimmedEmail,
          isNewUser: false // We know they exist
        });
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
        title="Log In"
        subtitle="Unlock the benefits of a digital hub."
        email={email}
        onEmailChange={handleEmailChange}
        onNext={handleNext}
        error={error}
      />
      <AppLoader isLoading={isLoading} />
    </>
  );
}
