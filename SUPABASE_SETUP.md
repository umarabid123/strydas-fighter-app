# Supabase Integration for STRYDAS Fighter App

## Overview
This project has been integrated with Supabase for backend services including database storage and authentication. The database schema uses explicit columns instead of JSONB for better type safety and query performance.

## Database Schema

### Main Tables

#### `profiles`
Core user profile table with explicit columns for all user types (fan, fighter, organizer).

**Columns:**
- `id` (UUID, Primary Key)
- `email` (TEXT, Unique, Required)
- `first_name` (TEXT, Optional)
- `last_name` (TEXT, Optional)
- `date_of_birth` (DATE, Optional)
- `gender` (TEXT, Optional)
- `country` (TEXT, Optional)
- `profile_image_url` (TEXT, Optional)
- `allow_notifications` (BOOLEAN, Default: false)
- `allow_location` (BOOLEAN, Default: false)
- `role` (ENUM: fan|fighter|organizer, Default: fan)
- `weight_division` (DECIMAL, Fighter-specific, in kg)
- `weight_range` (DECIMAL, Fighter-specific, +/- range in kg)
- `height` (INTEGER, Fighter-specific, in cm)
- `gym` (TEXT, Fighter-specific)
- `division` (TEXT, Fighter-specific: Pro/Amateur)
- `job_title` (TEXT, Organizer-specific)
- `organisation` (TEXT, Organizer-specific)
- `onboarding_completed` (BOOLEAN, Default: false)
- `created_at` (TIMESTAMPTZ, Auto-generated)
- `updated_at` (TIMESTAMPTZ, Auto-updated)

#### `social_links`
Stores social media links for profiles.

**Columns:**
- `id` (UUID, Primary Key)
- `profile_id` (UUID, Foreign Key → profiles.id)
- `platform` (TEXT, Required: Instagram, Facebook, Twitter, etc.)
- `url` (TEXT, Required)
- `created_at` (TIMESTAMPTZ, Auto-generated)

#### `contact_info`
Stores contact information for profiles.

**Columns:**
- `id` (UUID, Primary Key)
- `profile_id` (UUID, Foreign Key → profiles.id)
- `contact_type` (TEXT, Required: whatsapp, email, phone, etc.)
- `contact_value` (TEXT, Required)
- `created_at` (TIMESTAMPTZ, Auto-generated)

#### `sports_records`
Stores fight/match records per sport for fighters.

**Columns:**
- `id` (UUID, Primary Key)
- `profile_id` (UUID, Foreign Key → profiles.id)
- `sport_name` (TEXT, Required: Muay Thai, K-1, Boxing, MMA, etc.)
- `wins` (INTEGER, Default: 0)
- `losses` (INTEGER, Default: 0)
- `draws` (INTEGER, Default: 0)
- `created_at` (TIMESTAMPTZ, Auto-generated)
- `updated_at` (TIMESTAMPTZ, Auto-updated)

#### `fighters_managed`
Manages relationships between organizers and fighters.

**Columns:**
- `id` (UUID, Primary Key)
- `organizer_id` (UUID, Foreign Key → profiles.id)
- `fighter_id` (UUID, Foreign Key → profiles.id)
- `relationship_type` (TEXT, Default: 'manager')
- `created_at` (TIMESTAMPTZ, Auto-generated)

**Unique Constraint:** (organizer_id, fighter_id)

#### `sports_of_interest`
Stores sports that fans are interested in.

**Columns:**
- `id` (UUID, Primary Key)
- `profile_id` (UUID, Foreign Key → profiles.id)
- `sport_name` (TEXT, Required)
- `created_at` (TIMESTAMPTZ, Auto-generated)

**Unique Constraint:** (profile_id, sport_name)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://uzlsculvxymwwvrouxse.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6bHNjdWx2eHltd3d2cm91eHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMDQ5MDYsImV4cCI6MjA4MTg4MDkwNn0.91k1GWCRc3bYiXl6vlKFZstyKc54Xygity5P42Fq4Es
```

Note: These credentials are currently set to public access. For production, you should:
1. Implement proper authentication
2. Set up stricter RLS policies
3. Use service role keys only on the backend

## Project Structure

```
/
├── lib/
│   ├── supabase.ts          # Supabase client initialization
│   └── types.ts             # TypeScript type definitions
├── services/
│   └── profileService.ts     # Database service layer
├── screens/
│   ├── AuthScreens/
│   │   ├── CompleteProfile.tsx       # Basic profile completion
│   │   ├── OnboardingFan.tsx        # Fan-specific onboarding
│   │   ├── OnboardingFighter.tsx    # Fighter-specific onboarding
│   │   └── OnboardingOrganizer.tsx  # Organizer-specific onboarding
│   └── MyProfile.tsx        # Profile display screen
└── .env                     # Environment variables (not in git)
```

## Services API

### Profile Service (`services/profileService.ts`)

#### `profileService`
- `createProfile(profile)` - Create a new profile
- `getProfileById(id)` - Get profile with all relations
- `getProfileByEmail(email)` - Get profile by email
- `updateProfile(id, updates)` - Update profile
- `updateBasicInfo(id, data)` - Update basic info (name, DOB, etc.)
- `updateFanProfile(id, data)` - Update fan-specific fields
- `updateFighterProfile(id, data)` - Update fighter-specific fields
- `updateOrganizerProfile(id, data)` - Update organizer-specific fields
- `completeOnboarding(id)` - Mark onboarding as complete

#### `socialLinksService`
- `addSocialLink(link)` - Add a social link
- `getSocialLinksByProfileId(profileId)` - Get all social links
- `deleteSocialLink(id)` - Delete a social link
- `updateSocialLink(id, updates)` - Update a social link

#### `contactInfoService`
- `addContactInfo(info)` - Add contact info
- `getContactInfoByProfileId(profileId)` - Get all contact info
- `deleteContactInfo(id)` - Delete contact info

#### `sportsRecordsService`
- `addSportsRecord(record)` - Add a sports record
- `getSportsRecordsByProfileId(profileId)` - Get all sports records
- `updateSportsRecord(id, updates)` - Update a sports record

#### `fightersManagedService`
- `addFighterManaged(relation)` - Add a fighter-organizer relationship
- `getFightersByOrganizerId(organizerId)` - Get all fighters managed by organizer
- `removeFighterManaged(organizerId, fighterId)` - Remove relationship

#### `sportsOfInterestService`
- `addSportOfInterest(sport)` - Add a sport of interest
- `getSportsOfInterestByProfileId(profileId)` - Get all sports of interest
- `removeSportOfInterest(profileId, sportName)` - Remove sport of interest

## Usage Examples

### Creating a Profile
```typescript
import { profileService } from '../services/profileService';

const newProfile = await profileService.createProfile({
  email: 'user@example.com',
  first_name: 'John',
  last_name: 'Doe',
  role: 'fighter'
});
```

### Updating Fighter Profile
```typescript
await profileService.updateFighterProfile(profileId, {
  weight_division: 63.5,
  weight_range: 2.0,
  height: 172,
  gym: 'Keddles Gym',
  division: 'Pro'
});
```

### Adding Sports Records
```typescript
await sportsRecordsService.addSportsRecord({
  profile_id: profileId,
  sport_name: 'Muay Thai',
  wins: 12,
  losses: 4,
  draws: 0
});
```

### Loading Profile with Relations
```typescript
const profile = await profileService.getProfileById(profileId);
console.log(profile.first_name);
console.log(profile.social_links);
console.log(profile.sports_records);
```

## TODO Items

The following items are marked as TODO in the code and need to be implemented:

1. **Authentication Integration**
   - Replace `'default-profile-id'` with actual profile ID from auth context
   - Implement proper authentication flow using Supabase Auth
   - Store user session securely

2. **Image Upload**
   - Implement profile image upload to Supabase Storage
   - Update `profile_image_url` after upload
   - Handle image compression and optimization

3. **Contact Info Integration**
   - Implement ContactSheet to return actual contact data
   - Save contact info to database
   - Display contact info in profile

4. **Match Records Integration**
   - Implement MatchSheet to return actual match data
   - Save sports records to database
   - Display sports records in profile

5. **Organizer-Fighter Relations**
   - Implement AddFighterSheet to return actual fighter data
   - Save organizer-fighter relationships
   - Display managed fighters in organizer profile

6. **Sports of Interest**
   - Implement UI for adding sports of interest
   - Save sports of interest for fans
   - Filter events based on sports of interest

7. **Error Handling**
   - Implement proper error handling across all services
   - Show user-friendly error messages
   - Implement retry logic for failed requests

8. **RLS Policies**
   - Review and tighten RLS policies for production
   - Implement proper authentication-based policies
   - Ensure users can only access their own data

## Testing

To test the integration:

1. Ensure the `.env` file is properly configured
2. Run the app: `yarn start`
3. Navigate through the onboarding flow
4. Check the Supabase dashboard to verify data is being saved

## Production Checklist

Before deploying to production:

- [ ] Implement proper authentication (Supabase Auth)
- [ ] Tighten RLS policies
- [ ] Use service role keys only on backend
- [ ] Implement proper error handling and logging
- [ ] Add data validation on both client and server
- [ ] Implement rate limiting
- [ ] Set up proper backup strategy
- [ ] Implement database migrations for production
- [ ] Add monitoring and alerting
- [ ] Perform security audit
- [ ] Test all flows thoroughly
- [ ] Document API endpoints
- [ ] Set up CI/CD pipeline

## Support

For issues or questions:
1. Check the Supabase dashboard for any errors
2. Review the logs in the console
3. Check network requests in the browser/dev tools
4. Refer to Supabase documentation: https://supabase.com/docs
