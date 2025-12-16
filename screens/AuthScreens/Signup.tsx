import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import SocialAuthForm from '../../components/common/SocialAuthForm';

import AppLoader from '../../components/common/AppLoader';

interface SignUpProps {
  onNext?: () => void;
}

export default function SignUp({ onNext }: SignUpProps) {
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
      if (onNext) {
        onNext();
      }
    }, 1500);
  };

  return (
    <>
      <SocialAuthForm
        title="Create account."
        subtitle="Unlock the benefits of a digital hub."
        email={email}
        onEmailChange={setEmail}
        onNext={handleNext}
      />
      <AppLoader isLoading={isLoading} />
    </>
  );
}
