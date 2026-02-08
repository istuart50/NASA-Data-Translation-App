// src/features/admob/index.ts

// Providers
export { ConsentProvider, useConsent } from './providers/ConsentProvider';

// Components
export { BannerAd, SafeAreaBannerAd } from './components/BannerAd';

// Hooks
export { useInterstitialAd } from './hooks/useInterstitialAd';

// Types
export type {
  ConsentState,
  ConsentContextValue,
  BannerAdProps,
  InterstitialAdConfig,
} from './types';
