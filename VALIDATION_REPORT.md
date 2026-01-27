# Event Creation Flow Validation Report

## 1. Current State Analysis

### Database Schema (`lib/types.ts`)
*   **Events Table**:
    *   ✅ Basic fields present (`title`, `description`, `date`, `location`).
    *   ❌ **Missing**: `type` (Fight Night / Tournament), `sport`, `level`, `status`.
*   **Matches Table**:
    *   ✅ Basic fields present (`sport_type`, `match_type`, `weight_class`, `status`).
    *   ✅ Linked to Event.
*   **Event Applications**:
    *   ✅ Linked to Match (`match_id`).
    *   ❌ **Gap**: Tournament registration usually happens at the **Event** or **Category** level, not specific Matches (matches are generated later in brackets). Current schema requires a `match_id` to apply.

### Frontend Flow (`Home.tsx` & `EventsSheets.tsx`)
*   **Event Creation**: Generic form. No option to select "Fight Night" or "Tournament".
*   **Match Creation**: Separated from Event creation (User creates Event, then creates Matches).
*   **Validation**:
    *   Basic form validation exists.
    *   No checks for "At least 1 match before publishing".
    *   No constraints on Gender/Weight/Level matching (logic not visible in frontend service).

## 2. Identified Gaps & Missing Logic

### A. Event Structure
*   **Missing Field**: `event_type` enum (`FIGHT_NIGHT`, `TOURNAMENT`).
*   **Missing Field**: `status` enum (`DRAFT`, `PUBLISHED`, `COMPLETED`, `CANCELLED`).
    *   *Why*: Needed to allow drafting an event with matches before it goes live to fighters.

### B. Fight Night Logic
*   **Match Flow**: The "OPEN → PENDING → CONFIRMED" state transitions need to be strictly enforced in the service layer.
    *   *Current*: `createMatch` makes a match. `applyForMatch` exists. `updateApplicationStatus` exists.
    *   *Gap*: No automatic trigger to update `Match.status` or assign `fighter_a/b` when an application is accepted.

### C. Tournament Logic (Major Gap)
*   **Categories**: Tournaments need "Categories" (e.g., "Male - 70kg - Amateur"), not pre-made Matches.
*   **Registration**: Fighters need to register for a **Category**, not a Match.
    *   *Current schema* forces application to a `match_id`.
*   **Brackets**: No logic exists to generate brackets from registrations.

### D. Validation Rules
*   **Duplicate**: `hasFighterAppliedForMatch` handles duplication per match.
*   **Constraints**: No check to see if a fighter's profile (`weight`, `gender`) matches the target Match/Category.

## 3. Recommendations for Production-Ready Flow

### Step 1: Database Updates (SQL & Types)
1.  **Modify `Events`**:
    *   Add `type`: `'fight_night' | 'tournament'`
    *   Add `status`: `'draft' | 'upcoming' | 'live' | 'completed'`
    *   Add `sport`: `'mma' | 'muay_thai' | 'boxing'`
2.  **Create `TournamentCategories` Table** (For Tournaments):
    *   `id`, `event_id`, `gender`, `weight_class`, `experience_level`.
3.  **Update `EventApplications`**:
    *   Make `match_id` nullable.
    *   Add `category_id` (nullable, foreign key to `TournamentCategories`).
    *   *Logic*: Application is either for a Match (Fight Night) or a Category (Tournament).

### Step 2: API & Service Flow
*   **Create Event**:
    *   Accept `type` in input. Default `status` to `DRAFT`.
*   **Publish Event**:
    *   New endpoint/function to flip `status` to `UPCOMING`.
    *   **Validation**: Check if `FIGHT_NIGHT` has >= 1 match, or `TOURNAMENT` has >= 1 category.
*   **Match Application**:
    *   Check Fighter Profile vs Match Requirements (Weight/Gender) before inserting application.

### Step 3: Frontend State Management
1.  **Event Type Selection**:
    *   First step of creation: "Select Event Type".
2.  **Conditional Forms**:
    *   **Fight Night**: Show "Add Match" UI.
    *   **Tournament**: Show "Add Category" UI (Weight/Gender/Level selectors).
3.  **Publish Button**:
    *   Only enable once requirements are met.

### Step 4: Refined Match Confirmation Logic (Fight Night)
*   When Promoter accepts an application:
    1.  If Match slot A is empty -> Assign Fighter A.
    2.  If Match slot A is full, slot B is empty -> Assign Fighter B.
    3.  If both full -> Update Match Status to `CONFIRMED`, Reject other pending applications (optional).
