

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


import { useColorScheme } from '@/hooks/use-color-scheme';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';



export default function RootLayout() {
  const colorScheme = useColorScheme();


  return (
  
   <SafeAreaProvider>
  <GestureHandlerRootView style={{ flex: 1 ,}}>
   <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }} edges={["top","bottom"]}>
      
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
        <StatusBar style="light" backgroundColor="#000" />
      </ThemeProvider>

    </SafeAreaView>
  </GestureHandlerRootView>
</SafeAreaProvider>
  
    
  );
}