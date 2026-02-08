# Feature Compliance Review Template

Use this template when planning or implementing new features to ensure App Store compliance.

---

## Feature Name: [Feature Name]

**Date:** [YYYY-MM-DD]
**Developer:** [Name]
**Target Release:** [Version X.X.X]

---

## 1. Feature Description

### What does this feature do?
[Describe the feature in 2-3 sentences]

### User Flow
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Technical Implementation
- [ ] UI Components needed
- [ ] Backend/API changes
- [ ] Third-party SDKs/libraries
- [ ] Permissions required

---

## 2. Data Collection & Privacy

### Does this feature collect user data?
- [ ] Yes → Continue to section 2.1
- [ ] No → Skip to section 3

### 2.1 Data Collected
- [ ] Personal information (name, email, phone)
- [ ] Location data
  - [ ] Precise location
  - [ ] Background location
  - [ ] Reason: _________________
- [ ] Photos/Camera access
  - [ ] Reason: _________________
- [ ] Contacts
  - [ ] Reason: _________________
- [ ] Health data
  - [ ] Reason: _________________
- [ ] Usage analytics
  - [ ] What data: _________________
  - [ ] Analytics provider: _________________
- [ ] Other: _________________

### 2.2 Data Usage
How will this data be used?
- [ ] App functionality
- [ ] Analytics/improvements
- [ ] Advertising/targeting
- [ ] Sharing with third parties
- [ ] Other: _________________

### 2.3 Privacy Policy Update Required?
- [ ] Yes → What needs to be added: _________________
- [ ] No

### 2.4 Consent Required?
- [ ] Yes → Consent mechanism: _________________
- [ ] No

---

## 3. Permissions Required

### iOS Permissions (Info.plist keys)
- [ ] NSCameraUsageDescription: "_________________"
- [ ] NSPhotoLibraryUsageDescription: "_________________"
- [ ] NSLocationWhenInUseUsageDescription: "_________________"
- [ ] NSLocationAlwaysUsageDescription: "_________________"
- [ ] NSMicrophoneUsageDescription: "_________________"
- [ ] NSContactsUsageDescription: "_________________"
- [ ] NSCalendarsUsageDescription: "_________________"
- [ ] NSUserTrackingUsageDescription: "_________________"
- [ ] Other: _________________

### Android Permissions (AndroidManifest.xml)
- [ ] CAMERA: "_________________"
- [ ] ACCESS_FINE_LOCATION: "_________________"
- [ ] ACCESS_COARSE_LOCATION: "_________________"
- [ ] READ_EXTERNAL_STORAGE: "_________________"
- [ ] WRITE_EXTERNAL_STORAGE: "_________________"
- [ ] READ_CONTACTS: "_________________"
- [ ] RECORD_AUDIO: "_________________"
- [ ] Other: _________________

### Permission Justification
For each permission, provide user-facing explanation:
1. _________________
2. _________________

---

## 4. Monetization & Payments

### Does this feature involve payments?
- [ ] Yes → Continue to 4.1
- [ ] No → Skip to section 5

### 4.1 Payment Type
- [ ] In-App Purchase (digital goods/services)
  - [ ] Consumable
  - [ ] Non-consumable
  - [ ] Auto-renewable subscription
  - [ ] Non-renewing subscription
- [ ] External payment (physical goods only)
- [ ] Free

### 4.2 Subscription Details (if applicable)
- [ ] Subscription duration: _________________
- [ ] Free trial offered: Yes / No
  - Duration: _________________
- [ ] Clear terms displayed: Yes / No
- [ ] Cancellation instructions: Yes / No
- [ ] Restore purchases implemented: Yes / No

### 4.3 Compliance Check
- [ ] iOS: Using StoreKit for digital goods
- [ ] Android: Using Google Play Billing for digital goods
- [ ] No external payment links for digital content

---

## 5. Content & Safety

### Does this feature include user-generated content?
- [ ] Yes → Continue to 5.1
- [ ] No → Skip to section 6

### 5.1 User-Generated Content Moderation
- [ ] Pre-moderation (review before publishing)
- [ ] Post-moderation (review after publishing)
- [ ] AI/automated filtering
- [ ] User reporting system
- [ ] User blocking system
- [ ] Content removal process documented

### 5.2 Age Appropriateness
- [ ] Safe for all ages (4+)
- [ ] Requires age restriction
  - Minimum age: _________________
  - Reason: _________________

### 5.3 Objectionable Content Risk
- [ ] Low (no UGC, no risky content)
- [ ] Medium (UGC with moderation)
- [ ] High (UGC, controversial topics)

### 5.4 Health/Medical Claims
- [ ] Feature makes health or medical claims
  - [ ] Disclaimer included
  - [ ] Not diagnosing or treating conditions
  - [ ] Encourages consulting healthcare professional

---

## 6. Third-Party Integrations

### Does this feature use third-party SDKs or APIs?
- [ ] Yes → List below
- [ ] No → Skip to section 7

### 6.1 Third-Party Services
| Service/SDK | Purpose | Data Shared | Privacy Policy URL |
|-------------|---------|-------------|-------------------|
| Example SDK | Analytics | Device ID, events | https://... |
|             |         |             |                   |
|             |         |             |                   |

### 6.2 SDK Compliance
For each SDK:
- [ ] Privacy policy reviewed
- [ ] GDPR compliant
- [ ] COPPA compliant (if targeting kids)
- [ ] No known policy violations
- [ ] Updated to latest version

---

## 7. Platform-Specific Concerns

### iOS-Specific Issues

#### App Tracking Transparency (ATT)
- [ ] Feature tracks users across apps/websites
  - [ ] ATT prompt implemented
  - [ ] Works without tracking consent

#### Sign in with Apple
- [ ] Feature includes third-party login (Google, Facebook)
  - [ ] "Sign in with Apple" also offered

#### Other iOS Concerns
- [ ] Uses private APIs: Yes / No
- [ ] Background location usage justified: Yes / No / N/A
- [ ] Push notification usage justified: Yes / No / N/A

### Android-Specific Issues

#### Data Safety
- [ ] Data safety form update required
  - [ ] What changed: _________________

#### Target API Level
- [ ] Compatible with latest Android API (34+)
- [ ] Tested on Android 14+

#### Other Android Concerns
- [ ] Requires dangerous permissions: Yes / No
  - [ ] Runtime permission requests implemented
- [ ] Background service usage justified: Yes / No / N/A

---

## 8. Compliance Assessment

### ✅ Apple App Store Compliance

| Guideline | Status | Notes |
|-----------|--------|-------|
| 1.0 Safety | ✅ ⚠️ ❌ | |
| 2.0 Performance | ✅ ⚠️ ❌ | |
| 3.0 Business | ✅ ⚠️ ❌ | |
| 4.0 Design | ✅ ⚠️ ❌ | |
| 5.0 Legal | ✅ ⚠️ ❌ | |

### 🤖 Google Play Store Compliance

| Policy Area | Status | Notes |
|-------------|--------|-------|
| Content Policies | ✅ ⚠️ ❌ | |
| Privacy & Security | ✅ ⚠️ ❌ | |
| Monetization & Ads | ✅ ⚠️ ❌ | |
| Families Policy | ✅ ⚠️ ❌ N/A | |
| Technical Requirements | ✅ ⚠️ ❌ | |

---

## 9. Required Actions

### Before Implementation
- [ ] Privacy policy update drafted
- [ ] Permission descriptions written
- [ ] User consent flow designed
- [ ] Compliance issues addressed

### During Implementation
- [ ] Permission requests at appropriate time
- [ ] Error handling for denied permissions
- [ ] User education about feature benefits
- [ ] Analytics events properly named

### Before Release
- [ ] Feature tested on multiple devices
- [ ] Privacy policy updated and published
- [ ] App Store/Play Store metadata updated
- [ ] Age rating reviewed
- [ ] Review notes prepared (if needed)

---

## 10. Risk Assessment

### Overall Compliance Risk
- [ ] 🟢 Low Risk - Fully compliant, no concerns
- [ ] 🟡 Medium Risk - Minor modifications needed
- [ ] 🔴 High Risk - Significant compliance issues

### Rejection Risk Factors
List any factors that could lead to rejection:
1. _________________
2. _________________

### Mitigation Strategies
How to reduce rejection risk:
1. _________________
2. _________________

---

## 11. Documentation Requirements

### User-Facing Documentation
- [ ] Help article for new feature
- [ ] FAQ entries
- [ ] Tutorial/onboarding

### Legal Documentation
- [ ] Privacy policy section
- [ ] Terms of service update (if needed)
- [ ] COPPA addendum (if targeting kids)

### Internal Documentation
- [ ] Technical implementation docs
- [ ] Data flow diagram
- [ ] Security review completed

---

## 12. Testing Checklist

### Functional Testing
- [ ] Feature works as expected
- [ ] Handles edge cases gracefully
- [ ] Error messages are user-friendly
- [ ] Offline behavior defined

### Compliance Testing
- [ ] Permission requests work correctly
- [ ] Consent flow works correctly
- [ ] Data collection is minimal
- [ ] Privacy controls work correctly

### Platform Testing
- [ ] Tested on iOS (latest version)
- [ ] Tested on iOS (minimum supported version)
- [ ] Tested on Android (latest version)
- [ ] Tested on Android (minimum supported version)
- [ ] Tested on tablets
- [ ] Tested on different screen sizes

---

## 13. Review & Approval

### Internal Review
- [ ] Engineer review completed
- [ ] Design review completed
- [ ] Legal/compliance review completed
- [ ] Product manager approval

### Stakeholder Sign-Off
- [ ] Engineering lead: _________________ (Date: _______)
- [ ] Design lead: _________________ (Date: _______)
- [ ] Legal/compliance: _________________ (Date: _______)
- [ ] Product manager: _________________ (Date: _______)

---

## 14. Post-Launch Monitoring

### Metrics to Monitor
- [ ] Feature adoption rate
- [ ] Permission grant rate
- [ ] User complaints/support tickets
- [ ] App store rating impact
- [ ] Rejection/removal notices

### Compliance Monitoring
- [ ] Privacy policy remains accurate
- [ ] SDK updates don't introduce violations
- [ ] User data handling remains compliant
- [ ] New regulations reviewed quarterly

---

## 15. Notes & Additional Context

[Add any additional context, concerns, or notes about this feature's compliance]

---

**Template Version:** 1.0
**Last Updated:** 2026-02-08
