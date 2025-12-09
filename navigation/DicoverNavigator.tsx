import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppSetting from '../screens/AppSetting';
import DiscoverScreen from '../screens/DiscoverScreen';
import EventDetail from '../screens/EventDetail';
import EventScreen from '../screens/EventScreen';
import FighterProfileScreen from '../screens/FighterProfileScreen';
import FighterScreen from '../screens/FighterScreen';
import GiveFeedback from '../screens/GiveFeedback';
import MedicalPaper from '../screens/MedicalPaper';
import Menu from '../screens/Menu';
import OrganizerScreen from '../screens/OrganizerScreen';

const Stack = createNativeStackNavigator();

const DiscoverNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Discover"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Discover" component={DiscoverScreen} />
      <Stack.Screen name="Event" component={EventScreen} />
      <Stack.Screen name="EventDetail" component={EventDetail} />
      <Stack.Screen name="FighterScreen" component={FighterScreen} />
      <Stack.Screen name="OrganizerScreen" component={OrganizerScreen} />
      <Stack.Screen name="FighterProfileScreen" component={FighterProfileScreen} />
      <Stack.Screen name="Menu" component={Menu} />
      <Stack.Screen name="AppSetting" component={AppSetting} />
      <Stack.Screen name="MedicalPaper" component={MedicalPaper} />
      <Stack.Screen name="Feedback" component={GiveFeedback} />
    </Stack.Navigator>
  );
};

export default DiscoverNavigator;
