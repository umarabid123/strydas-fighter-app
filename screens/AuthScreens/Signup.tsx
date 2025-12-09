import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import SocialAuthForm from '../../components/common/SocialAuthForm';

interface SignUpProps {
  onNext?: () => void;
}

export default function SignUp({ onNext }: SignUpProps) {
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState('');

  const handleNext = () => {
    console.log('Next:', { email });
    navigation.navigate('Verify');
    if (onNext) {
      onNext();
    }
  };

  return (
    <SocialAuthForm
      title="Create account."
      subtitle="Unlock the benefits of a digital hub."
      email={email}
      onEmailChange={setEmail}
      onNext={handleNext}
    />
  );
}
