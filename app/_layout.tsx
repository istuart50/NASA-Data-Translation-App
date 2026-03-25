import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="learning-games"
          options={{ title: 'Learning Games' }}
        />
        <Stack.Screen
          name="nasa-search"
          options={{ title: 'NASA Data Search' }}
        />
        <Stack.Screen
          name="nasa-article"
          options={{ title: 'Explore Resource' }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
