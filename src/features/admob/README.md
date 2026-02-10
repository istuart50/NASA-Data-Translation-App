# AdMob Integration Guide (2026 Compliance)

This module provides a complete Google AdMob integration with IAB TCF v2.3 consent framework compliance.

## ✅ What's Included

- **ConsentProvider**: UMP SDK integration with automatic consent flow
- **BannerAd**: Reusable banner ad component with safe area support
- **useInterstitialAd**: Hook for managing interstitial ads with interval controls
- **useConsent**: Access consent state anywhere in the app

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install react-native-google-mobile-ads
npx expo install expo-build-properties
```

### 2. Update app.json

Replace the placeholder IDs in `app.json` with your actual AdMob App IDs:

```json
{
  "plugins": [
    [
      "react-native-google-mobile-ads",
      {
        "androidAppId": "ca-app-pub-YOUR_ACTUAL_ID~YOUR_APP_ID",
        "iosAppId": "ca-app-pub-YOUR_ACTUAL_ID~YOUR_APP_ID"
      }
    ]
  ]
}
```

### 3. Rebuild the App

```bash
npx expo prebuild --clean
npx expo run:android
```

## 📱 Usage Examples

### Banner Ad

```tsx
import { BannerAd, SafeAreaBannerAd } from '@/src/features/admob';

// Basic banner ad
export default function HomeScreen() {
  return (
    <View>
      <Text>Your content here</Text>

      <BannerAd
        unitId="ca-app-pub-xxx/yyy"
        size="BANNER"
        onAdLoaded={() => console.log('Ad loaded')}
        onAdFailedToLoad={(error) => console.log('Ad failed', error)}
      />
    </View>
  );
}

// Bottom banner with safe area (recommended)
export default function BottomBanner() {
  return (
    <View className="flex-1">
      <ScrollView>
        {/* Your content */}
      </ScrollView>

      <SafeAreaBannerAd unitId="ca-app-pub-xxx/yyy" />
    </View>
  );
}
```

### Interstitial Ad

```tsx
import { useInterstitialAd } from '@/src/features/admob';

export default function GameScreen() {
  const { showAd, isReady } = useInterstitialAd({
    unitId: 'ca-app-pub-xxx/zzz',
    minInterval: 180000, // 3 minutes between ads
    onAdDismissed: () => {
      console.log('User closed the ad');
      // Continue with your flow
    },
  });

  const handleLevelComplete = () => {
    // Save progress
    saveProgress();

    // Show ad (only if enough time has passed)
    showAd();

    // Navigate to next level
    router.push('/level-2');
  };

  return (
    <View>
      <Button onPress={handleLevelComplete}>
        Complete Level {isReady && '(Ad Ready)'}
      </Button>
    </View>
  );
}
```

### Check Consent Status

```tsx
import { useConsent } from '@/src/features/admob';

export default function PrivacySettings() {
  const { status, canRequestAds, requestConsent, resetConsent } = useConsent();

  return (
    <View>
      <Text>Consent Status: {status}</Text>
      <Text>Can Show Ads: {canRequestAds ? 'Yes' : 'No'}</Text>

      <Button onPress={requestConsent}>
        Update Consent Preferences
      </Button>

      {__DEV__ && (
        <Button onPress={resetConsent}>
          Reset Consent (Dev Only)
        </Button>
      )}
    </View>
  );
}
```

## 🎯 Ad Placement Best Practices

### ✅ DO
- Place banner ads at natural breaks (between content sections)
- Use SafeAreaBannerAd for bottom placements
- Show interstitial ads after meaningful actions (level complete, article finish)
- Respect the minimum interval (3-5 minutes between interstitials)
- Clearly label all ads with "Ad" or "Sponsored"

### ❌ DON'T
- Place ads directly next to buttons or interactive elements
- Show interstitial ads during active gameplay or critical user flows
- Trigger ads on every screen navigation
- Hide or disguise the "Ad" label
- Show ads before consent is obtained

## 📊 Ad Unit IDs

### Development (Test Ads)
- Banner: Automatically uses `TestIds.BANNER`
- Interstitial: Automatically uses `TestIds.INTERSTITIAL`

### Production
1. Go to [AdMob Console](https://apps.admob.com/)
2. Create ad units for your app
3. Copy the unit IDs (format: `ca-app-pub-xxx/yyy`)
4. Replace placeholders in your code

## 🔒 app-ads.txt Setup

```typescript
import { generateAppAdsTxt } from '@/src/features/admob/utils/app-ads-txt';

// Generate the content
const content = generateAppAdsTxt('ca-app-pub-1234567890123456');

// Save to: https://yourdomain.com/app-ads.txt
```

See [app-ads-txt.ts](./utils/app-ads-txt.ts) for detailed instructions.

## 🧪 Testing Consent Flow

### Test in Development

The consent flow is automatically configured for EEA geography in `__DEV__` mode:

```typescript
<ConsentProvider debug={true}>
  {/* Your app */}
</ConsentProvider>
```

### Test States
1. **First launch**: Consent form should appear
2. **Consent granted**: Ads should load
3. **Consent denied**: No ads should appear
4. **Reset consent**: Use `resetConsent()` in dev mode

### Verify Compliance
- ✅ Consent form appears before ads
- ✅ No data collection before consent
- ✅ Ads respect consent choice
- ✅ User can change preferences

## 🌍 Geographic Coverage

The UMP SDK automatically handles consent for:
- 🇪🇺 European Economic Area (EEA)
- 🇬🇧 United Kingdom
- 🇨🇭 Switzerland
- 🇺🇸 US states with privacy laws (California, Virginia, Colorado, etc.)

## 📱 Platform Support

| Platform | Banner Ads | Interstitial | Consent |
|----------|-----------|--------------|---------|
| Android  | ✅        | ✅           | ✅      |
| iOS      | ✅        | ✅           | ✅      |
| Web      | ❌        | ❌           | ❌      |

## 🐛 Troubleshooting

### Ads not showing?
1. Check consent status: `useConsent().canRequestAds`
2. Verify ad unit IDs are correct
3. Check console for error messages
4. Ensure you've run `npx expo prebuild`

### Consent form not appearing?
1. Enable debug mode: `<ConsentProvider debug={true}>`
2. Reset consent: `useConsent().resetConsent()` (dev only)
3. Check you're testing in a supported region

### Build errors?
1. Run `npx expo prebuild --clean`
2. Verify `expo-build-properties` is installed
3. Check `android.minSdkVersion` is >= 21

## 📚 Additional Resources

- [AdMob Quick Start](https://developers.google.com/admob/android/quick-start)
- [UMP SDK Documentation](https://developers.google.com/admob/ump/android/quick-start)
- [IAB TCF v2.3 Spec](https://iabeurope.eu/tcf-2-0/)
- [react-native-google-mobile-ads](https://docs.page/invertase/react-native-google-mobile-ads)
