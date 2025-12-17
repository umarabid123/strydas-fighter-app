import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import AppStatusBar from '../components/common/AppStatusBar';
import DrawerNavigator from './DrawerNavigator';

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
        <Stack.Screen name="Main" component={DrawerNavigator} />
      </Stack.Navigator>
    </View>
  );
};

export default AppNavigator;
