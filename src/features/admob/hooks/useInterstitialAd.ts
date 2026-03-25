// src/features/admob/hooks/useInterstitialAd.ts

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';
import { useConsent } from '../providers/ConsentProvider';
import type { InterstitialAdConfig } from '../types';

const DEFAULT_MIN_INTERVAL = 3 * 60 * 1000; // 3 minutes

/**
 * Hook for managing Interstitial Ads with 2026 compliance
 *
 * Features:
 * - Automatic consent checking
 * - Minimum interval enforcement (prevents ad fatigue)
 * - Preloading for instant display
 * - Test ads in development
 *
 * @example
 * ```tsx
 * const { showAd, isReady } = useInterstitialAd({
 *   unitId: 'ca-app-pub-xxx/yyy',
 *   minInterval: 180000, // 3 minutes
 *   onAdDismissed: () => console.log('Ad closed'),
 * });
 *
 * // Show ad after user completes a task
 * const handleTaskComplete = async () => {
 *   await saveTask();
 *   showAd(); // Will only show if interval has passed
 * };
 * ```
 */
export const useInterstitialAd = (config: InterstitialAdConfig = {}) => {
  const {
    unitId,
    minInterval = DEFAULT_MIN_INTERVAL,
    onAdDismissed,
    onAdFailedToShow,
  } = config;

  const { canRequestAds } = useConsent();
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const adRef = useRef<InterstitialAd | null>(null);
  const lastShownRef = useRef<number>(0);

  // Determine the ad unit ID
  const adUnitId = __DEV__
    ? TestIds.INTERSTITIAL
    : unitId || 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ'; // Replace with your production ID

  /**
   * Load the interstitial ad
   */
  const loadAd = useCallback(() => {
    if (!canRequestAds || Platform.OS === 'web') {
      return;
    }

    if (isLoading || isReady) {
      return; // Already loading or loaded
    }

    try {
      setIsLoading(true);

      const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: false, // Handled by UMP consent
      });

      // Event: Ad loaded successfully
      interstitial.addAdEventListener(AdEventType.LOADED, () => {
        console.log('[AdMob Interstitial] Ad loaded');
        setIsReady(true);
        setIsLoading(false);
      });

      // Event: Ad dismissed by user
      interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('[AdMob Interstitial] Ad closed');
        setIsReady(false);
        lastShownRef.current = Date.now();
        onAdDismissed?.();

        // Preload next ad
        setTimeout(() => loadAd(), 1000);
      });

      // Event: Ad failed to load
      interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
        console.warn('[AdMob Interstitial] Load error:', error);
        setIsReady(false);
        setIsLoading(false);

        // Retry after 30 seconds
        setTimeout(() => loadAd(), 30000);
      });

      adRef.current = interstitial;
      interstitial.load();
    } catch (error) {
      console.error('[AdMob Interstitial] Setup error:', error);
      setIsLoading(false);
    }
  }, [adUnitId, canRequestAds, isLoading, isReady, onAdDismissed]);

  /**
   * Show the interstitial ad with interval checking
   */
  const showAd = useCallback(() => {
    if (!canRequestAds || Platform.OS === 'web') {
      console.log('[AdMob Interstitial] Ads not available');
      return;
    }

    // Check minimum interval
    const timeSinceLastAd = Date.now() - lastShownRef.current;
    if (timeSinceLastAd < minInterval) {
      const remainingTime = Math.ceil((minInterval - timeSinceLastAd) / 1000);
      console.log(
        `[AdMob Interstitial] Too soon. Wait ${remainingTime}s before showing next ad`
      );
      return;
    }

    if (!isReady || !adRef.current) {
      console.log('[AdMob Interstitial] Ad not ready yet');
      return;
    }

    try {
      adRef.current.show();
    } catch (error) {
      console.error('[AdMob Interstitial] Show error:', error);
      onAdFailedToShow?.(error as Error);
      setIsReady(false);

      // Reload ad
      setTimeout(() => loadAd(), 1000);
    }
  }, [canRequestAds, isReady, minInterval, onAdFailedToShow, loadAd]);

  // Load ad when consent is obtained
  useEffect(() => {
    if (canRequestAds && Platform.OS !== 'web') {
      loadAd();
    }

    return () => {
      // Cleanup
      if (adRef.current) {
        adRef.current = null;
      }
    };
  }, [canRequestAds, loadAd]);

  return {
    /**
     * Show the interstitial ad (respects minimum interval)
     */
    showAd,

    /**
     * Whether the ad is loaded and ready to show
     */
    isReady,

    /**
     * Whether the ad is currently loading
     */
    isLoading,

    /**
     * Time (in ms) until the next ad can be shown
     */
    timeUntilNextAd: Math.max(
      0,
      minInterval - (Date.now() - lastShownRef.current)
    ),
  };
};
