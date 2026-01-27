# Features Implemented

## Events / Home
- **Create Event Sheet**:
    - **New Fields for Event Types**:
        - Added **Event Type** selector (Fight Night vs Tournament).
        - Added **Sport** selector (MMA, Muay Thai, Boxing).
        - Added **Level** selector (Amateur, Professional).
        - Updated `createEvent` payload to include `type`, `status` (default: 'draft'), `sport`, and `level`.
        - Added form validation for Sport and Level.
    - Added Missing Fields: Website URL, Instagram URL, and Ticket URL inputs.
    - Improved styling and organization.
- **Create Match**:
    - Implemented "Create Match" form directly in `Home.tsx` bottom sheet.
        - Includes fields: Select Event, Sport Type, Match Type, Weight Class, Description.
        - Uses `SelectPicker`.
        - Calls `createMatch` service.
        - **Refined Design**: Updated styles to match `CreateEventSheet`, fixed spacing and width issues.
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
