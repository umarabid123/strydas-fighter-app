import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { createContext, useContext, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MeshGradientBackground from '../components/common/MeshGradientBackground';
import { useColorScheme } from '../hooks/use-color-scheme';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

// Create context for authentication state
interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within RootNavigator');
  }
  return context;
};

const RootNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const colorScheme = useColorScheme();

  const baseTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const transparentTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: 'transparent',
    },
  };

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <MeshGradientBackground />
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
          <NavigationContainer theme={transparentTheme}>
            {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
          </NavigationContainer>
        </AuthContext.Provider>
      </View>
    </SafeAreaProvider>
  );
};

export default RootNavigator;