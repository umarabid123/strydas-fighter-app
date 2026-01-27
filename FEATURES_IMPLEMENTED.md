# Features Implemented

## Contact Info Storage
- **Onboarding Sheets**: Updated `ContactSheet` to return collected data.
- **Fighter & Organizer Onboarding**: 
    - Captured contact data (Name, Phone, Email, Organization).
    - Saved data to `contact_info` table upon profile completion.
    - Added visual feedback for added contact info.

## Sports of Interest & Social Links
- **Onboarding Sheets**:
    - Created `SportsSheet` for selecting/adding sports.
    - Created `SocialLinkSheet` for structured social link addition (Platform selection + URL).
- **Complete Profile Screen**:
    - Integrated `SportsSheet` and `SocialLinkSheet`.
    - Implemented UI to display selected sports (as chips) and social links.
    - Updated `saveProfile` logic to persist:
        - `sports_of_interest` table (for sports).
        - `social_links` table (for social media).

## Minor Fixes
- Removed email address from subtitle on OTP Verify screen for cleaner UI.
- Fixed `DivisionEnum` usage in Fighter Onboarding to default correctly.

These changes ensure a more comprehensive and robust profile setup flow for all user roles.
