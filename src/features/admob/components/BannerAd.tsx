// src/features/admob/components/BannerAd.tsx

import React, { useState, useCallback } from 'react';
import { View, Text, Platform } from 'react-native';
import { BannerAd as RNBannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useConsent } from '../providers/ConsentProvider';
import type { BannerAdProps } from '../types';

/**
 * Reusable Banner Ad Component with 2026 compliance
 *
 * Features:
 * - Automatic consent checking
 * - Test ads in development
 * - Graceful error handling
 * - Safe area support
 * - Clear "Ad" label for transparency
 */
export const BannerAd: React.FC<BannerAdProps> = ({
  unitId,
  size = 'BANNER',
  onAdFailedToLoad,
  onAdLoaded,
  containerClassName = '',
}) => {
  const { canRequestAds, status } = useConsent();
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState<Error | null>(null);

  // Determine the ad unit ID
  const adUnitId = __DEV__
    ? TestIds.BANNER
    : unitId || 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY'; // Replace with your production ID

  // Map size string to BannerAdSize
  const getSizeConstant = useCallback(() => {
    switch (size) {
      case 'LARGE_BANNER':
        return BannerAdSize.LARGE_BANNER;
      case 'MEDIUM_RECTANGLE':
        return BannerAdSize.MEDIUM_RECTANGLE;
      case 'FULL_BANNER':
        return BannerAdSize.FULL_BANNER;
      case 'LEADERBOARD':
        return BannerAdSize.LEADERBOARD;
      case 'BANNER':
      default:
        return BannerAdSize.BANNER;
    }
  }, [size]);

  const handleAdLoaded = useCallback(() => {
    setAdLoaded(true);
    setAdError(null);
    onAdLoaded?.();
    console.log('[AdMob Banner] Ad loaded successfully');
  }, [onAdLoaded]);

  const handleAdFailedToLoad = useCallback((error: Error) => {
    setAdLoaded(false);
    setAdError(error);
    onAdFailedToLoad?.(error);
    console.warn('[AdMob Banner] Failed to load:', error.message);
  }, [onAdFailedToLoad]);

  // Don't render ads if:
  // 1. Not on mobile platform
  // 2. Consent not obtained
  // 3. Ad failed to load
  if (Platform.OS === 'web') {
    return null;
  }

  if (!canRequestAds) {
    console.log('[AdMob Banner] Cannot request ads. Consent status:', status);
    return null;
  }

  if (adError && !adLoaded) {
    // Collapse the ad space when no ad is available
    return null;
  }

  return (
    <View className={`items-center justify-center bg-neutral-50 ${containerClassName}`}>
      {/* "Ad" Label for Transparency */}
      <View className="absolute top-1 left-2 z-10 bg-neutral-200 px-2 py-0.5 rounded">
        <Text className="text-xs text-neutral-600 font-medium">Ad</Text>
      </View>

      <RNBannerAd
        unitId={adUnitId}
        size={getSizeConstant()}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false, // Handled by UMP consent
        }}
        onAdLoaded={handleAdLoaded}
        onAdFailedToLoad={handleAdFailedToLoad}
      />

      {/* Development indicator */}
      {__DEV__ && (
        <View className="absolute bottom-1 right-2 bg-warning-500 px-2 py-0.5 rounded">
          <Text className="text-xs text-white font-bold">TEST AD</Text>
        </View>
      )}
    </View>
  );
};

/**
 * Safe Area Banner Ad Component
 *
 * Ensures the banner doesn't overlap with Android navigation bar
 * Ideal for bottom-of-screen placements
 */
export const SafeAreaBannerAd: React.FC<BannerAdProps> = (props) => {
  return (
    <View className="bg-neutral-50 pb-safe">
      <BannerAd {...props} />
    </View>
  );
};
