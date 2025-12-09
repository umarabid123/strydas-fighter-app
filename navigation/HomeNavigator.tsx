import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Menu from '../screens/Menu';
import AppSetting from '../screens/AppSetting';
import Home from '../screens/Home';
import MedicalPaper from '../screens/MedicalPaper';
import GiveFeedback from '../screens/GiveFeedback';

const Stack = createNativeStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Menu" component={Menu} />
      <Stack.Screen name="AppSetting" component={AppSetting} />
      <Stack.Screen name="MedicalPaper" component={MedicalPaper} />
      <Stack.Screen name="Feedback" component={GiveFeedback} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
