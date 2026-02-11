import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MeshGradientBackground from '../components/common/MeshGradientBackground';
import { useColorScheme } from '../hooks/use-color-scheme';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { setupAuthListener, checkOnboardingStatus } from '../services/authService';

// Create context for authentication state
interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: User | null;
  session: Session | null;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const colorScheme = useColorScheme();

  const baseTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const transparentTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: 'transparent',
    },
  };

  useEffect(() => {
    // Check initial session on app load
    const initializeAuth = async () => {
      console.log('LOG: initializeAuth started');
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('LOG: Error fetching session:', error);
        }

        const session = data?.session;
        console.log('LOG: Session retrieved:', session ? 'Session found' : 'No session');

        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          console.log('LOG: User already logged in:', session.user.email);
          setIsAuthenticated(true);

          // Check if user has completed onboarding
          const onboardingComplete = await checkOnboardingStatus(session.user.id);
          console.log('LOG: Onboarding status:', onboardingComplete);
          setHasCompletedOnboarding(onboardingComplete);
        } else {
          console.log('LOG: No active user session on init');
        }
      } catch (err) {
        console.error('LOG: initializeAuth threw error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('Auth state changed:', _event, session?.user?.email);
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          setIsAuthenticated(true);
          
          // Check onboarding status for logged in users
          const onboardingComplete = await checkOnboardingStatus(session.user.id);
          setHasCompletedOnboarding(onboardingComplete);
        } else {
          setIsAuthenticated(false);
          setHasCompletedOnboarding(false);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <MeshGradientBackground />
        {/* Optionally Add AppLoader or Splash Screen logic here */}
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <MeshGradientBackground />
        <AuthContext.Provider value={{ 
          isAuthenticated, 
          setIsAuthenticated,
          user,
          session,
          hasCompletedOnboarding,
          setHasCompletedOnboarding,
        }}>
          <NavigationContainer theme={transparentTheme}>
            {isAuthenticated && hasCompletedOnboarding ? <AppNavigator /> : <AuthNavigator />}
          </NavigationContainer>
        </AuthContext.Provider>
      </View>
    </SafeAreaProvider>
  );
};

export default RootNavigator;