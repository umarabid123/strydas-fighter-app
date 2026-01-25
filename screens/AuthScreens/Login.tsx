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

  const handleNext = async () => {
    if (isLoading) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.signUpWithOTP(trimmedEmail);

      setIsLoading(false);

      if (result.success) {
        // Navigate to Verify screen with email
        console.log('OTP sent successfully to existing user');
        navigation.navigate('Verify', {
          email: trimmedEmail,
          isNewUser: result.isNewUser ?? false
        });
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
        title="Log In"
        subtitle="Unlock the benefits of a digital hub."
        email={email}
        onEmailChange={setEmail}
        onNext={handleNext}
      />
      <AppLoader isLoading={isLoading} />
    </>
  );
}
