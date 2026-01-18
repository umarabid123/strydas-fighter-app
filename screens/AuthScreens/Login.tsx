import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import SocialAuthForm from '../../components/common/SocialAuthForm';

import AppLoader from '../../components/common/AppLoader';
import { supabase } from '@/lib/supabase';

interface LoginProps {
  onSignUpPress?: () => void;
}

export default function Login({ onSignUpPress }: LoginProps) {
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setErrorMessage('');
    if (!email) {
      setErrorMessage('Enter your email');
      return;
    }

    try {
      setIsLoading(true);

      // Check if user exists and profile status
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('email', email)
        .single();

      if (profileError || !profile) {
        setErrorMessage('Account not found. Please sign up.');
        return;
      }

      const isProfileComplete = !!profile.first_name;

      const { error } = await supabase.auth.signInWithOtp({
        email,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }
      // OTP sent → go to Verify screen
      navigation.navigate('Verify', { email, isProfileComplete });

    } catch (err) {
      setErrorMessage('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SocialAuthForm
        title="Log In"
        subtitle="Unlock the benefits of a digital hub."
        email={email}
        onEmailChange={(text) => {
          setEmail(text);
          if (errorMessage) setErrorMessage('');
        }}
        onNext={handleSignIn}
        error={errorMessage}
      />
      <AppLoader isLoading={isLoading} />
    </>
  );
}
