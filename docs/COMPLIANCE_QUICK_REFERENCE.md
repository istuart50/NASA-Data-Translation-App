# App Store Compliance Quick Reference

Quick answers to common compliance questions for mobile app developers.

---

## 🔍 Quick Decision Trees

### Should I use In-App Purchase or external payment?

```
Is it a digital good/service?
├─ Yes: Use In-App Purchase (REQUIRED on iOS)
│   ├─ App features
│   ├─ Digital content
│   ├─ Subscriptions
│   └─ Virtual currency
│
└─ No: Can use external payment
    ├─ Physical goods
    ├─ Real-world services
    └─ Person-to-person payments
```

### Do I need App Tracking Transparency (ATT)?

```
Does my app track users?
├─ Yes: Implement ATT prompt
│   ├─ Tracking across apps/websites
│   ├─ Sharing data with data brokers
│   ├─ Targeted advertising based on user activity
│   └─ Profiling users across different properties
│
└─ No: ATT not required
    ├─ First-party analytics only
    ├─ Fraud detection
    ├─ User-initiated data sharing
    └─ Contextual advertising (no targeting)
```

### Do I need a privacy policy?

```
YES - ALWAYS required for:
├─ Apps collecting any user data
├─ Apps with user accounts
├─ Apps with analytics
├─ Apps with ads
└─ Apps targeting children

Must include:
├─ What data is collected
├─ How data is used
├─ Who data is shared with
├─ How to request deletion
└─ Contact information
```

---

## 📱 Platform-Specific Rules

### iOS vs Android Payment Requirements

| Scenario | iOS | Android |
|----------|-----|---------|
| Digital content unlock | ✅ IAP Required | ✅ Google Play Billing Required |
| Subscription to app features | ✅ IAP Required | ✅ Google Play Billing Required |
| Physical goods (e.g., pizza) | ⚠️ External OK | ⚠️ External OK |
| Reader apps (content consumed elsewhere) | ✅ External OK (with restrictions) | ✅ External OK |
| Person-to-person payments (e.g., Venmo) | ⚠️ External OK | ⚠️ External OK |
| Real-world services (e.g., Uber) | ⚠️ External OK | ⚠️ External OK |

### Age Ratings

| Content | iOS Age | Android Age |
|---------|---------|-------------|
| No restricted content | 4+ | Everyone |
| Mild cartoon violence | 9+ | Everyone 10+ |
| Realistic violence | 12+ | Teen |
| Frequent violence | 17+ | Mature 17+ |
| Gambling with real money | 17+ | Mature 17+ (with restrictions) |
| Unrestricted web access | 17+ | Teen+ |

---

## ⚠️ Common Rejection Reasons

### Top 10 iOS Rejection Reasons

1. **Guideline 2.1 - App Completeness**
   - ❌ Placeholder content, "Coming Soon" sections
   - ✅ Fully functional app with all features working

2. **Guideline 4.3 - Spam**
   - ❌ Creating multiple similar apps
   - ✅ Single app with unique value proposition

3. **Guideline 5.1.1 - Privacy**
   - ❌ Missing privacy policy or incorrect privacy labels
   - ✅ Complete privacy policy + accurate App Privacy details

4. **Guideline 2.3.1 - Accurate Metadata**
   - ❌ Screenshots showing features not in app
   - ✅ Screenshots showing actual app functionality

5. **Guideline 3.1.1 - In-App Purchase**
   - ❌ External payment for digital goods
   - ✅ Using StoreKit for digital goods

6. **Guideline 2.5.2 - Software Requirements**
   - ❌ Using private APIs
   - ✅ Only using public, documented APIs

7. **Guideline 4.2 - Minimum Functionality**
   - ❌ Just a website wrapper
   - ✅ Native app experience with unique value

8. **Guideline 5.1.2 - Data Use and Sharing**
   - ❌ Collecting unnecessary user data
   - ✅ Minimal data collection with clear purpose

9. **Guideline 1.4 - Physical Harm**
   - ❌ Medical advice without disclaimers
   - ✅ Health info with "consult doctor" disclaimer

10. **Guideline 3.1.2 - Subscriptions**
    - ❌ Unclear subscription terms or no restore
    - ✅ Clear terms + restore purchases button

### Top 10 Android Rejection Reasons

1. **Privacy Policy Missing**
   - ❌ No privacy policy link in Play Console
   - ✅ Privacy policy URL accessible and comprehensive

2. **Data Safety Form Incomplete**
   - ❌ Missing or inaccurate data safety information
   - ✅ Complete data safety form matching actual app behavior

3. **Inappropriate Content**
   - ❌ Content doesn't match age rating
   - ✅ Age-appropriate content or correct rating

4. **Deceptive Behavior**
   - ❌ Misleading claims or hidden fees
   - ✅ Transparent pricing and accurate descriptions

5. **Malware or Security Issues**
   - ❌ Security vulnerabilities or suspicious code
   - ✅ Secure implementation, code obfuscation

6. **Intellectual Property Violation**
   - ❌ Using trademarked content without permission
   - ✅ Original or properly licensed content

7. **Permissions Abuse**
   - ❌ Requesting unnecessary permissions
   - ✅ Only requesting needed permissions with rationale

8. **Ads Policy Violation**
   - ❌ Deceptive ads, no close button
   - ✅ Clearly labeled ads with proper controls

9. **Payment Policy Violation**
   - ❌ Bypassing Google Play Billing for digital goods
   - ✅ Using Google Play Billing correctly

10. **Families Policy Violation**
    - ❌ Targeting kids without proper compliance
    - ✅ COPPA compliance if targeting children

---

## 🛡️ Privacy Compliance Checklist

### GDPR (EU Users)

- [ ] Privacy policy in plain language
- [ ] User consent before data collection
- [ ] Right to access personal data
- [ ] Right to delete personal data
- [ ] Right to data portability
- [ ] Data breach notification plan
- [ ] DPO appointed (if required)
- [ ] Legal basis for data processing documented

### COPPA (US Children Under 13)

- [ ] Verifiable parental consent before data collection
- [ ] No behavioral advertising to children
- [ ] Minimal data collection (only what's necessary)
- [ ] Data security measures implemented
- [ ] Parental access to child's data
- [ ] Parental ability to delete child's data
- [ ] No conditioning participation on extra data collection
- [ ] Privacy policy specifically for parents

### CCPA (California Users)

- [ ] Privacy policy disclosure of data collection
- [ ] "Do Not Sell My Personal Information" link (if applicable)
- [ ] User can request data deletion
- [ ] User can request data disclosure
- [ ] No discrimination for exercising privacy rights
- [ ] Annual privacy disclosures

---

## 💰 Monetization Compliance

### In-App Purchase Requirements

#### iOS
```typescript
// ✅ Correct - Using StoreKit
import { useIAP } from 'expo-in-app-purchases';

const { purchaseItem } = useIAP();
await purchaseItem('premium_feature');
```

```typescript
// ❌ Wrong - External payment for digital goods
window.open('https://yoursite.com/buy-premium');
```

#### Android
```typescript
// ✅ Correct - Using Google Play Billing
import { useIAP } from 'expo-in-app-purchases';

const { purchaseItem } = useIAP();
await purchaseItem('premium_feature');
```

### Subscription Disclosure Requirements

Must clearly display:
- [ ] Subscription price and duration
- [ ] Free trial length (if applicable)
- [ ] Auto-renewal notice
- [ ] How to cancel
- [ ] Where to manage subscription
- [ ] Link to terms of service
- [ ] Link to privacy policy

Example:
```
Premium Subscription: $9.99/month

• 7-day free trial
• Auto-renews monthly at $9.99
• Cancel anytime in Settings
• [Terms of Service] [Privacy Policy]
```

---

## 🔐 Permission Best Practices

### iOS Permission Descriptions (Info.plist)

Must be **user-friendly** and explain **why** you need access:

#### ❌ Bad Examples
```xml
<!-- Too technical -->
<key>NSCameraUsageDescription</key>
<string>This app requires camera access to function properly.</string>

<!-- Generic -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location.</string>
```

#### ✅ Good Examples
```xml
<!-- Clear benefit to user -->
<key>NSCameraUsageDescription</key>
<string>Take photos of your climate actions to share with the community and track your progress.</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>Your location helps us show local climate events and calculate your carbon footprint from transportation.</string>
```

### Android Permission Rationale

Show **before** requesting permission:

```typescript
// ✅ Good - Explain first, then request
const requestCameraPermission = async () => {
  // Show explanation dialog
  await showDialog({
    title: 'Camera Access Needed',
    message: 'Take photos of your climate actions to track progress and earn rewards.',
    actions: ['Allow', 'Not Now']
  });

  // Then request permission
  const { status } = await Camera.requestCameraPermissionsAsync();
};
```

---

## 📊 Data Collection Guidelines

### What Requires Disclosure

| Data Type | Must Disclose? | Privacy Policy? | App Store Label? |
|-----------|----------------|-----------------|------------------|
| User's name | ✅ Yes | ✅ Required | ✅ Yes |
| Email address | ✅ Yes | ✅ Required | ✅ Yes |
| Device ID | ✅ Yes | ✅ Required | ✅ Yes |
| Advertising ID | ✅ Yes | ✅ Required | ✅ Yes |
| Precise location | ✅ Yes | ✅ Required | ✅ Yes |
| Approximate location | ✅ Yes | ✅ Required | ✅ Yes |
| Crash logs | ✅ Yes | ✅ Required | ⚠️ If linked to user |
| Anonymous analytics | ⚠️ Depends | ✅ Recommended | ⚠️ If linked to user |
| IP address (automatic) | ✅ Yes | ✅ Required | ⚠️ If stored |

### Minimal Data Collection

Only collect what you **need** for functionality:

#### ❌ Over-collection
```typescript
// Don't ask for precise location if approximate is enough
await Location.requestForegroundPermissionsAsync();
const location = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.Highest // ❌ Too precise
});
```

#### ✅ Minimal collection
```typescript
// Use approximate location for weather/climate data
const location = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.Low // ✅ Just enough
});
```

---

## 🎯 Ads Compliance (AdMob)

### Required Implementations for 2026

- ✅ UMP SDK consent framework (GDPR/CCPA)
- ✅ Ads clearly labeled ("Ad" or "Sponsored")
- ✅ `delayAppMeasurementInit: true` in config
- ✅ No ads before consent obtained
- ✅ User can change ad preferences
- ✅ Test ads in development mode
- ✅ app-ads.txt file hosted on website

### Ad Placement Rules

#### ✅ Allowed
- Natural breaks in content
- Bottom of screen (with safe area)
- After completing tasks
- Between levels/sections
- Clearly separated from content

#### ❌ Not Allowed
- Covering navigation buttons
- Disguised as content
- No close button on interstitials
- More frequent than every 3 minutes (interstitials)
- During active user interaction

---

## 🧒 Kids Apps (Under 13)

### Additional Requirements

#### iOS
- [ ] No third-party analytics
- [ ] No third-party advertising
- [ ] No links out of the app (or use parental gate)
- [ ] No in-app purchases (or use parental gate)
- [ ] Age-appropriate content only
- [ ] COPPA-compliant privacy policy
- [ ] Verifiable parental consent for data collection

#### Android (Designed for Families)
- [ ] Target audience declaration
- [ ] Teacher-approved designation (if claiming)
- [ ] Age-appropriate content
- [ ] COPPA compliance
- [ ] Privacy policy specific to kids
- [ ] No interest-based advertising
- [ ] SafeSearch enabled for web content

### Parental Gate Example
```typescript
// Simple math problem gate for external links
const openExternalLink = async (url: string) => {
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);

  const answer = await prompt(`What is ${num1} + ${num2}?`);

  if (parseInt(answer) === num1 + num2) {
    Linking.openURL(url);
  }
};
```

---

## 📝 Before Submission Checklist

### 🍎 iOS Pre-Submission
- [ ] Privacy policy URL added
- [ ] App Privacy labels completed
- [ ] ATT implemented (if tracking)
- [ ] All features fully functional
- [ ] Screenshots show actual app
- [ ] Test on oldest supported iOS version
- [ ] No private API usage
- [ ] Support URL works
- [ ] Restore purchases works (if IAP)

### 🤖 Android Pre-Submission
- [ ] Privacy policy URL added
- [ ] Data safety form completed
- [ ] Targeting API level 34+
- [ ] 64-bit libraries included
- [ ] Permissions have runtime requests
- [ ] Content rating questionnaire completed
- [ ] Screenshots updated
- [ ] Google Play Billing implemented (if needed)
- [ ] app-ads.txt verified (if using ads)

---

## 🆘 Emergency Contacts & Resources

### If Your App Gets Rejected

1. **Read the rejection reason carefully**
2. **Review the specific guideline mentioned**
3. **Fix the issue (don't just appeal)**
4. **Test the fix thoroughly**
5. **Respond in Resolution Center with what you fixed**
6. **Resubmit**

### Appeal Process

Only appeal if:
- You believe the rejection is incorrect
- You have evidence the app is compliant
- The guideline interpretation is unclear

Don't appeal if:
- You just disagree with the rule
- You want an exception
- The violation is clear

### Help Resources

- **iOS:** App Review Support: https://developer.apple.com/contact/app-store/
- **Android:** Play Console Help: https://support.google.com/googleplay/android-developer/
- **Privacy:** IAPP Resources: https://iapp.org/
- **Legal:** Consult with app privacy lawyer for complex cases

---

**Last Updated:** 2026-02-08
**Version:** 1.0
