// src/features/admob/examples/ExampleScreen.tsx

import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaBannerAd, useInterstitialAd, useConsent } from '../index';

/**
 * Example implementation showing proper AdMob integration
 *
 * This screen demonstrates:
 * - Banner ad at the bottom with safe area
 * - Interstitial ad on task completion
 * - Consent status display
 * - Proper ad spacing and labeling
 */
export default function ExampleScreen() {
  const [taskCount, setTaskCount] = useState(0);

  // Interstitial ad setup
  const { showAd, isReady, timeUntilNextAd } = useInterstitialAd({
    unitId: 'ca-app-pub-xxx/zzz', // Replace with your ID
    minInterval: 180000, // 3 minutes
    onAdDismissed: () => {
      console.log('User dismissed the ad');
    },
  });

  // Consent status
  const { canRequestAds, status } = useConsent();

  const handleTaskComplete = () => {
    // Increment task counter
    setTaskCount((prev) => prev + 1);

    // Show interstitial ad after every 3rd task
    if (taskCount % 3 === 2 && isReady) {
      showAd();
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-primary-500 px-4 py-6 pt-12">
        <Text className="text-2xl font-bold text-white">
          Climate Tasks
        </Text>
        <Text className="text-sm text-primary-100 mt-1">
          Complete tasks to earn points
        </Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4 py-6">
        {/* Consent Status Card (Dev Only) */}
        {__DEV__ && (
          <View className="bg-neutral-100 rounded-lg p-4 mb-4 border border-neutral-300">
            <Text className="text-xs font-semibold text-neutral-600 mb-2">
              DEV: Ad Status
            </Text>
            <Text className="text-sm text-neutral-700">
              Consent: {status || 'Loading...'}
            </Text>
            <Text className="text-sm text-neutral-700">
              Can Show Ads: {canRequestAds ? 'Yes ✅' : 'No ❌'}
            </Text>
            <Text className="text-sm text-neutral-700">
              Interstitial Ready: {isReady ? 'Yes ✅' : 'No ⏳'}
            </Text>
            {timeUntilNextAd > 0 && (
              <Text className="text-xs text-neutral-500 mt-1">
                Next ad in: {Math.ceil(timeUntilNextAd / 1000)}s
              </Text>
            )}
          </View>
        )}

        {/* Task Counter */}
        <View className="bg-secondary-50 rounded-lg p-6 mb-6 items-center">
          <Text className="text-4xl font-bold text-secondary-600">
            {taskCount}
          </Text>
          <Text className="text-sm text-neutral-600 mt-2">
            Tasks Completed
          </Text>
        </View>

        {/* Task List */}
        <View className="space-y-3 mb-4">
          {[1, 2, 3, 4, 5].map((task) => (
            <View
              key={task}
              className="bg-white border border-neutral-200 rounded-lg p-4"
            >
              <Text className="text-base font-medium text-neutral-800 mb-2">
                Task #{task}: Reduce Energy Usage
              </Text>
              <Text className="text-sm text-neutral-600 mb-3">
                Turn off lights when leaving rooms
              </Text>

              {/* Complete Button - Note: NOT next to ads */}
              <Pressable
                onPress={handleTaskComplete}
                className="bg-primary-500 py-3 px-4 rounded-lg active:bg-primary-600"
              >
                <Text className="text-white font-semibold text-center">
                  Mark Complete
                </Text>
              </Pressable>
            </View>
          ))}
        </View>

        {/* Info about ads */}
        <View className="bg-neutral-50 rounded-lg p-4 mb-4">
          <Text className="text-xs text-neutral-600">
            💡 Tip: An interstitial ad will appear after every 3 completed
            tasks (minimum 3 minutes between ads).
          </Text>
        </View>

        {/* Spacer to prevent content from being hidden behind banner */}
        <View className="h-16" />
      </ScrollView>

      {/* Bottom Banner Ad - Fixed at bottom with safe area */}
      <SafeAreaBannerAd
        unitId="ca-app-pub-xxx/yyy" // Replace with your ID
        size="BANNER"
        onAdLoaded={() => console.log('Banner loaded')}
        onAdFailedToLoad={(error) => console.log('Banner failed:', error)}
      />
    </View>
  );
}
