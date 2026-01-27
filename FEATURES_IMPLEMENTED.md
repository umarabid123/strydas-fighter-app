# Features Implemented

## Events / Home
- **Create Event Sheet**:
    - Removed match creation logic from this sheet (single responsibility).
    - Checks inputs and calls `createEvent`. Logging added for debugging.
    - Improved "Description" field style (smaller font, better spacing).
    - **Added Missing Fields**: Website URL, Instagram URL, and Ticket URL inputs are now available in the form.
- **Create Match**:
    - Implemented "Create Match" form directly in `Home.tsx` bottom sheet.
        - Includes fields: Select Event, Sport Type, Match Type, Weight Class, Description.
        - Uses `SelectPicker` to choose from user's existing events.
        - Calls `createMatch` service.
- **Navigation**:
    - Fixed TypeScript errors related to `navigation.navigate`.

## Sports Records Integration
- **MatchSheet Update**: Connected `MatchSheet` to save logic. It now returns match data.
- **OnboardingFighter Update**: 
    - Added `fighterRecords` state to aggregate wins/losses/draws.
    - Added `handleMatchSave` to aggregate incoming matches.
    - Updated `handleComplete` to iterate over `fighterRecords` and save them to `sports_records` table using `sportsRecordsService`.
    - Updated UI to show a dynamic total record (Wins/Losses/Draws) based on added matches.

## Fighter Onboarding
- **Sports You Compete In**: 
    - Implemented `SportsSheet` integration in `OnboardingFighter.tsx`.
    - Added ability to add, view, and remove sports (chips).
    - Connected saving logic to `sportsOfInterestService`.
- **Division Enum Fix**:
    - Updated `DivisionEnum` values to lowercase (`pro`, `semi-pro`, `amateur`) to match database expectations.
    - Updated UI labels to auto-capitalize these values for display.
