import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="generate-image" options={{ title: "Generate Image" }} />
      <Tabs.Screen name="upload-image" options={{ title: "Upload Image" }} />
      <Tabs.Screen name="generate-and-search" options={{ title: "Gen + Search" }} />
    </Tabs>
  );
}
