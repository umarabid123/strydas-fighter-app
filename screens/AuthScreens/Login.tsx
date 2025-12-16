import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import SocialAuthForm from '../../components/common/SocialAuthForm';

import AppLoader from '../../components/common/AppLoader';

interface LoginProps {
  onSignUpPress?: () => void;
}

export default function Login({ onSignUpPress }: LoginProps) {
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Next:', { email });
      navigation.navigate('Verify');
    }, 1500);
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
