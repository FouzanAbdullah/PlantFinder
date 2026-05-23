import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import GardenScreen from '../screens/GardenScreen';
import ResultScreen from '../screens/ResultScreen';
import DetailScreen from '../screens/DetailScreen';
import type { RootStackParamList, TabParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    HomeTab: '📷',
    GardenTab: '🌿',
  };
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icons[name]}</Text>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: '#2D6A4F',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#E0F0E8' },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Camera' }} />
      <Tab.Screen name="GardenTab" component={GardenScreen} options={{ title: 'My Garden' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#2D6A4F' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Plant Analysis' }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Plant Detail' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
