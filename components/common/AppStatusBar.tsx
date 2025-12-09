import React from 'react';
import { StatusBar, useColorScheme, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppStatusBarProps {
  barStyle?: 'light-content' | 'dark-content' | 'default';
  backgroundColor?: string;
  translucent?: boolean;
}

export default function AppStatusBar({
  barStyle,
  backgroundColor = 'transparent',
  translucent = true,
}: AppStatusBarProps) {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const finalBarStyle = barStyle || (colorScheme === 'dark' ? 'light-content' : 'dark-content');

  return (
    <>
      <StatusBar
        barStyle={finalBarStyle}
        backgroundColor={Platform.OS === 'android' ? 'transparent' : backgroundColor}
        translucent={translucent}
      />
      {Platform.OS === 'ios' && translucent && (
        <View
          style={{
            height: insets.top,
          }}
        />
      )}
    </>
  );
}

