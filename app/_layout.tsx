import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name='onboardings/login' options={{headerShown : false}} />
        <Stack.Screen name='onboardings/registration' options={{headerShown : false}} />
        <Stack.Screen name='onboardings/referal' options={{headerShown : false}} />
        <Stack.Screen name='onboardings/signin-other' options={{headerShown : false}} />
        <Stack.Screen name='onboardings/mobile_verify' options={{headerShown : false}} />
        <Stack.Screen name='onboardings/forgot_password'options={{headerShown:false}}/>
        <Stack.Screen name='dashboard/dashboard' options={{headerShown:false}}/>
        <Stack.Screen name='dashboard/notification' options={{headerShown:false}}/>
        <Stack.Screen name='dashboard/search' options={{headerShown:false}}/>
        <Stack.Screen name='explore/courses' options={{headerShown:false}}/>
        <Stack.Screen name='explore/courseoverview' options={{headerShown:false}}/>
        <Stack.Screen name='explore/courseoverviewdetails' options={{headerShown:false}}/>
        <Stack.Screen name='explore/coursepackage' options={{headerShown:false}}/>
        
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
