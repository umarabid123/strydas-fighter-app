# Contact Info Storage Implementation

## Overview
Implemented logic to store Contact Information in the `contact_info` table during the onboarding flow for Fighters and Organizers.

## Changes

### 1. `components/common/OnboardingSheets.tsx`
- Added `onSave` prop to `ContactSheet` component.
- Updated `ContactSheet` to call `onSave` with the form data (fullName, phone, email, org) when the "Save & close" button is pressed.

### 2. `screens/AuthScreens/OnboardingFighter.tsx`
- Added `contactData` state to store the contact information locally.
- Updated `ContactSheet` usage to handle `onSave` and update state.
- Added visual feedback (display name/phone) when contact info is added.
- Updated `handleComplete` to iterate through the `contactData` and save each field as a separate record in the `contact_info` table using `contactInfoService`.
  - Maps `fullName` -> `contact_type: 'name'`
  - Maps `phone` -> `contact_type: 'phone'`
  - Maps `email` -> `contact_type: 'email'`
  - Maps `org` -> `contact_type: 'organization'`

### 3. `screens/AuthScreens/OnboardingOrganizer.tsx`
- Implemented the same logic as `OnboardingFighter.tsx`:
  - Added `contactData` state.
  - Updated `ContactSheet` usage.
  - Added visual feedback.
  - Updated `handleComplete` to save to `contact_info` table.

## Data Structure
The `contact_info` table will store each piece of contact information as a generic type-value pair linked to the user's profile:

| contact_type | contact_value |
|--------------|---------------|
| name | John Doe |
| phone | +1234567890 |
| email | john@example.com |
| organization | Keddles Gym |

This ensures all collected data is persisted to the database.
