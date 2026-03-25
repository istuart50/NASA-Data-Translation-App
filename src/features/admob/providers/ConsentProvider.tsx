// src/features/admob/providers/ConsentProvider.tsx

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  AdsConsent,
  AdsConsentStatus,
  AdsConsentDebugGeography,
  mobileAds,
} from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';
import type { ConsentContextValue, ConsentState } from '../types';

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

interface ConsentProviderProps {
  children: React.ReactNode;
  /**
   * Enable debug mode for testing consent flow
   * Uses EEA geography in development
   */
  debug?: boolean;
}

export const ConsentProvider: React.FC<ConsentProviderProps> = ({
  children,
  debug = __DEV__
}) => {
  const [state, setState] = useState<ConsentState>({
    status: null,
    isLoading: true,
    canRequestAds: false,
    error: null,
  });

  /**
   * Initialize the consent information and check current status
   */
  const initializeConsent = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Configure debug settings if enabled
      if (debug && __DEV__) {
        await AdsConsent.setDebugGeography(AdsConsentDebugGeography.EEA);
        // Add test device ID if needed
        // await AdsConsent.addTestDevices(['YOUR_TEST_DEVICE_ID']);
      }

      // Request consent information update
      const consentInfo = await AdsConsent.requestInfoUpdate();

      console.log('[AdMob Consent] Consent info updated:', {
        status: consentInfo.status,
        isConsentFormAvailable: consentInfo.isConsentFormAvailable,
      });

      // Determine if we can request ads based on consent status
      const canRequestAds =
        consentInfo.status === AdsConsentStatus.OBTAINED ||
        consentInfo.status === AdsConsentStatus.NOT_REQUIRED;

      setState({
        status: consentInfo.status,
        isLoading: false,
        canRequestAds,
        error: null,
      });

      // Load and present consent form if required
      if (
        consentInfo.isConsentFormAvailable &&
        consentInfo.status === AdsConsentStatus.REQUIRED
      ) {
        await loadAndPresentConsentForm();
      } else if (canRequestAds) {
        // Initialize Mobile Ads SDK only after consent is obtained or not required
        await mobileAds().initialize();
        console.log('[AdMob] SDK initialized - Ads can be requested');
      }
    } catch (error) {
      console.error('[AdMob Consent] Initialization error:', error);
      setState({
        status: null,
        isLoading: false,
        canRequestAds: false,
        error: error as Error,
      });
    }
  }, [debug]);

  /**
   * Load and present the consent form to the user
   */
  const loadAndPresentConsentForm = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const formResult = await AdsConsent.loadAndShowConsentFormIfRequired();

      console.log('[AdMob Consent] Form result:', {
        status: formResult.status,
      });

      const canRequestAds =
        formResult.status === AdsConsentStatus.OBTAINED ||
        formResult.status === AdsConsentStatus.NOT_REQUIRED;

      setState({
        status: formResult.status,
        isLoading: false,
        canRequestAds,
        error: null,
      });

      // Initialize SDK after consent is obtained
      if (canRequestAds) {
        await mobileAds().initialize();
        console.log('[AdMob] SDK initialized after consent');
      }
    } catch (error) {
      console.error('[AdMob Consent] Form presentation error:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
    }
  }, []);

  /**
   * Manually request consent (for privacy settings screen)
   */
  const requestConsent = useCallback(async () => {
    await loadAndPresentConsentForm();
  }, [loadAndPresentConsentForm]);

  /**
   * Reset consent for testing purposes
   * WARNING: Only use in development
   */
  const resetConsent = useCallback(async () => {
    if (!__DEV__) {
      console.warn('[AdMob Consent] Reset only allowed in development');
      return;
    }

    try {
      await AdsConsent.reset();
      console.log('[AdMob Consent] Consent reset successfully');
      await initializeConsent();
    } catch (error) {
      console.error('[AdMob Consent] Reset error:', error);
    }
  }, [initializeConsent]);

  // Initialize consent on mount
  useEffect(() => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      initializeConsent();
    } else {
      // Web platform - no consent required
      setState({
        status: AdsConsentStatus.NOT_REQUIRED,
        isLoading: false,
        canRequestAds: false, // No ads on web
        error: null,
      });
    }
  }, [initializeConsent]);

  const value: ConsentContextValue = {
    ...state,
    requestConsent,
    resetConsent,
  };

  return (
    <ConsentContext.Provider value={value}>
      {children}
    </ConsentContext.Provider>
  );
};

/**
 * Hook to access consent state and methods
 * @throws Error if used outside ConsentProvider
 */
export const useConsent = (): ConsentContextValue => {
  const context = useContext(ConsentContext);

  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }

  return context;
};
