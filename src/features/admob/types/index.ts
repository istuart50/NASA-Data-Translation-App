// src/features/admob/types/index.ts

import { AdsConsentStatus } from 'react-native-google-mobile-ads';

export interface ConsentState {
  status: AdsConsentStatus | null;
  isLoading: boolean;
  canRequestAds: boolean;
  error: Error | null;
}

export interface ConsentContextValue extends ConsentState {
  requestConsent: () => Promise<void>;
  resetConsent: () => Promise<void>;
}

export interface BannerAdProps {
  /**
   * AdMob unit ID for the banner ad.
   * Uses TestIds.BANNER in __DEV__ mode automatically.
   */
  unitId?: string;

  /**
   * Size of the banner ad
   * @default 'BANNER'
   */
  size?: 'BANNER' | 'LARGE_BANNER' | 'MEDIUM_RECTANGLE' | 'FULL_BANNER' | 'LEADERBOARD';

  /**
   * Callback when ad fails to load
   */
  onAdFailedToLoad?: (error: Error) => void;

  /**
   * Callback when ad successfully loads
   */
  onAdLoaded?: () => void;

  /**
   * Custom styles for the container
   */
  containerClassName?: string;
}

export interface InterstitialAdConfig {
  /**
   * AdMob unit ID for the interstitial ad.
   * Uses TestIds.INTERSTITIAL in __DEV__ mode automatically.
   */
  unitId?: string;

  /**
   * Minimum time (in milliseconds) between interstitial ad displays
   * @default 180000 (3 minutes)
   */
  minInterval?: number;

  /**
   * Callback when ad is dismissed
   */
  onAdDismissed?: () => void;

  /**
   * Callback when ad fails to show
   */
  onAdFailedToShow?: (error: Error) => void;
}
