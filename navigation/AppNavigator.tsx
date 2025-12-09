import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AppStatusBar from '../components/common/AppStatusBar';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <>
      <AppStatusBar barStyle="light-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Main">
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </>
  );
};

export default AppNavigator;
