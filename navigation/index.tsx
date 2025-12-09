import React, { useState, createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

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

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <NavigationContainer>
          {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
};

export default RootNavigator;