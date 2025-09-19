import { FontAwesome5 } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { Text } from 'react-native';

import { Settings as SettingsIcon } from '@/components/ui/icons';
import { useAuth, useIsFirstTime } from '@/lib';

export default function TabLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);
  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  if (status === 'signOut') {
    return <Redirect href="/login" />;
  }

  // reusable header component
  const HeaderTitle = ({ text }: { text: string }) => (
    <Text
      style={{
        fontFamily: 'SedgwickAve',
        fontSize: 24,
        color: '#d4af37',
        textAlign: 'center',
      }}
    >
      {text}
    </Text>
  );

  // reusable tab title component
  const TabTitle = ({ text }: { text: string }) => {
    const isFocused = useIsFocused();
    return (
      <Text
        style={{
          fontFamily: 'roboto',
          fontSize: 14,
          lineHeight: 14,
          color: isFocused ? '#d4af37' : '#FFFFFF', // gold if active, white if inactive
        }}
      >
        {text}
      </Text>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#d4af37',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarStyle: {
          backgroundColor: '#000000', // tab bar background
        },
        headerStyle: {
          backgroundColor: '#000000', // header background
        },
        headerTintColor: '#d4af37',
        headerTitle: () => <HeaderTitle text="college camp connect" />,
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: () => <TabTitle text="Camps" />,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name={'school'} size={20} color={color} />
          ),
          tabBarButtonTestID: 'feed-tab',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: () => <TabTitle text="Settings" />,
          headerShown: false,
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tabs>
  );
}
