import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useTheme } from 'react-native-paper';

import LearningScreen from '../screens/learning/LearningScreen';
import Problem6Screen from '../screens/learning/Problem6Screen';

export type LearningStackParamList = {
  LearningHome: undefined;
  Problem6: undefined;
};

const Stack = createNativeStackNavigator<LearningStackParamList>();

export default function LearningStackNavigator() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="LearningHome"
        component={LearningScreen}
        options={{
          title: 'Learning Modules',
          headerShown: false, // Tab navigator already shows header
        }}
      />
      <Stack.Screen
        name="Problem6"
        component={Problem6Screen}
        options={{
          title: 'Problem #6 Workspace',
          headerShown: true,
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
}