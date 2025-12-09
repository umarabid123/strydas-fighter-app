import React from 'react';
import { Platform, StatusBar, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


interface AppStatusBarProps {
  barStyle?: 'light-content' | 'dark-content' | 'default';
  backgroundColor?: string;
  translucent?: boolean;
}

export default function AppStatusBar({
  barStyle,
  backgroundColor = '#000',
  translucent = true,
}: AppStatusBarProps) {
  const colorScheme = useColorScheme();

  const finalBarStyle = barStyle || (colorScheme === 'dark' ? 'light-content' : 'dark-content');
  const insets = useSafeAreaInsets();
  return (
    <>
      <StatusBar
        barStyle={finalBarStyle}
        backgroundColor={backgroundColor}
        translucent={translucent}
      />
      {Platform.OS === 'ios' && translucent && (
        <View
          style={{
            height: insets.top,
            backgroundColor: backgroundColor,
          }}
        />
      )}
    </>
  );
}

