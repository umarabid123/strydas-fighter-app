# Features Implemented
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
    - Updated `DivisionEnum` values to lowercase (`pro`, `semi-pro`, `amateur`) to match database expectations and resolve "invalid input value" error.
    - Updated UI labels to auto-capitalize these values for display.

## Complete Profile
- **Social Links & Sports**: 
    - (Previously completed) Implemented sheets and saving logic for both sections.
