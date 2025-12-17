import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppSetting from '../screens/AppSetting';
import GiveFeedback from '../screens/GiveFeedback';
import Home from '../screens/Home';

import MedicalPaper from '../screens/MedicalPaper';

const Stack = createNativeStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={Home} />

      <Stack.Screen name="AppSetting" component={AppSetting} />
      <Stack.Screen name="MedicalPaper" component={MedicalPaper} />
      <Stack.Screen name="Feedback" component={GiveFeedback} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
