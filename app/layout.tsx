import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Index from './index';
import WelcomeScreen from './welcome';
import { RootStackParamList } from '@/types/types';

const Stack = createStackNavigator<RootStackParamList>();

// Flog for development to force Welcome Screen Appear
const SHOW_WELCOME_SCREEN = true;

function App() {
  const [firstLaunch, setFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      if (SHOW_WELCOME_SCREEN) {
        setFirstLaunch(true);
        return;
      }
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched === null) {
        setFirstLaunch(true);
        await AsyncStorage.setItem('hasLaunched', 'true');
      } else {
        setFirstLaunch(false);
      }
    };
    checkFirstLaunch();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {firstLaunch ? (
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
        ) : (
          <Stack.Screen name="Index" component={Index} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
