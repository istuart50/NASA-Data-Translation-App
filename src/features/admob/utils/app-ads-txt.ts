// src/features/admob/utils/app-ads-txt.ts

/**
 * Generate app-ads.txt content for your developer website
 *
 * IMPORTANT: This file must be hosted at:
 * https://yourdomain.com/app-ads.txt
 *
 * Replace YOUR_PUBLISHER_ID with your actual AdMob publisher ID
 * (found in AdMob dashboard under Account > Settings > Account Information)
 *
 * @param publisherId - Your AdMob publisher ID (ca-app-pub-XXXXXXXXXXXXXXXX)
 * @returns Content for app-ads.txt file
 */
export function generateAppAdsTxt(publisherId: string): string {
  return `# app-ads.txt for Climate App
# Last updated: ${new Date().toISOString().split('T')[0]}
#
# This file verifies authorized digital sellers for in-app advertising.
# Required by Google AdMob for 2026 compliance.
#
# Learn more: https://support.google.com/admob/answer/9787416

# Google AdMob
google.com, ${publisherId}, DIRECT, f08c47fec0942fa0

# Additional ad networks (if applicable)
# Add entries for any mediation partners you use
# Format: domain, publisher_id, RELATIONSHIP, TAG_ID

# Example mediation networks:
# facebook.com, YOUR_FB_PLACEMENT_ID, RESELLER, c3e20eee3f780d68
# applovin.com, YOUR_APPLOVIN_ID, RESELLER, 1234567890
`;
}

/**
 * Example usage instructions
 */
export const APP_ADS_TXT_INSTRUCTIONS = `
## How to Set Up app-ads.txt

### Step 1: Get Your Publisher ID
1. Go to AdMob Dashboard
2. Click "Account" → "Settings" → "Account Information"
3. Copy your Publisher ID (format: ca-app-pub-XXXXXXXXXXXXXXXX)

### Step 2: Generate the File
\`\`\`typescript
import { generateAppAdsTxt } from '@/src/features/admob/utils/app-ads-txt';

const content = generateAppAdsTxt('ca-app-pub-1234567890123456');
console.log(content);
\`\`\`

### Step 3: Host the File
1. Create a file named "app-ads.txt" with the generated content
2. Upload it to your website's root directory
3. It must be accessible at: https://yourdomain.com/app-ads.txt
4. Verify it loads correctly in your browser

### Step 4: Update AdMob
1. Go to AdMob Dashboard
2. Navigate to "Settings" → "App Settings"
3. Add your website URL
4. AdMob will verify the app-ads.txt file within 24 hours

### Important Notes
- The file MUST be at the root domain (not a subdomain)
- Use plain text encoding (UTF-8)
- Ensure proper HTTP headers (Content-Type: text/plain)
- Update the file if you add new ad networks or mediation partners
`;
