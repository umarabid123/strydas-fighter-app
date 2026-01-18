import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import SocialAuthForm from '../../components/common/SocialAuthForm';

import AppLoader from '../../components/common/AppLoader';
import { supabase } from '@/lib/supabase';

interface SignUpProps {
  onNext?: () => void;
}

export default function SignUp({ onNext }: SignUpProps) {
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    setErrorMessage('');

    if (!email) {
      setErrorMessage('Please enter email');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        setErrorMessage('User already exists. Please log in.');
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      // OTP sent successfully → navigate
      navigation.navigate('Verify', { email });

    } catch (err) {
      setErrorMessage('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <SocialAuthForm
        title="Create account."
        subtitle="Unlock the benefits of a digital hub."
        email={email}
        onEmailChange={(text) => {
          setEmail(text);
          if (errorMessage) setErrorMessage('');
        }}
        onNext={handleNext}
        showProgressBar
        titleContainerMarginBottom={60}
        error={errorMessage}
      />
      <AppLoader isLoading={isLoading} />
    </>
  );
}
