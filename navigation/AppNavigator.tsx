import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import AppStatusBar from '../components/common/AppStatusBar';
import AppSetting from '../screens/AppSetting';
import GiveFeedback from '../screens/GiveFeedback';
import MedicalPaper from '../screens/MedicalPaper';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
      <AppStatusBar barStyle="light-content" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' }
        }}
        initialRouteName="Main"
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="AppSetting" component={AppSetting} />
        <Stack.Screen name="MedicalPaper" component={MedicalPaper} />
        <Stack.Screen name="Feedback" component={GiveFeedback} />
      </Stack.Navigator>
    </View>
  );
};

export default AppNavigator;
