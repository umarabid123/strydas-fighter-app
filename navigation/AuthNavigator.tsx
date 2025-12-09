import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppStatusBar from '../components/common/AppStatusBar';
import Intro from '../screens/Intro/Intro';
import Login from '../screens/AuthScreens/Login';
import SignUp from '../screens/AuthScreens/Signup';
import Verify from '../screens/AuthScreens/Verify';
import CompleteProfile from '../screens/AuthScreens/CompleteProfile';
import OnboardingFan from '../screens/AuthScreens/OnboardingFan';
import OnboardingFighter from '../screens/AuthScreens/OnboardingFighter';
import OnboardingOrganizer from '../screens/AuthScreens/OnboardingOrganizer';
import OnboardingRoles from '../screens/AuthScreens/OnboardingRoles';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <>
      <AppStatusBar barStyle="light-content" />
      <Stack.Navigator
        initialRouteName="Intro"
        screenOptions={{ headerShown: false }}
      >
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Verify" component={Verify} />
      <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
      <Stack.Screen name="OnboardingRoles" component={OnboardingRoles} />
      <Stack.Screen name="OnboardingFan" component={OnboardingFan} />
      <Stack.Screen name="OnboardingFighter" component={OnboardingFighter} />
      <Stack.Screen name="OnboardingOrganizer" component={OnboardingOrganizer} />
    </Stack.Navigator>
    </>
  );
};

export default AuthNavigator;
