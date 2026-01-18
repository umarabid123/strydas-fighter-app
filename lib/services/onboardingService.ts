import { supabase } from '@/lib/supabase';

// --- Types ---

export interface ProfileData {
  first_name: string;
  last_name: string;
    email?: string; // Added email for upsert robustness
  dob?: string;
  gender?: string;
  country?: string;
}

export type UserRole = 'fan' | 'fighter' | 'organizer';

export interface FanProfileData {
  allow_notifications: boolean;
  allow_location: boolean;
}

export interface FighterProfileData {
  country?: string;
  height_cm?: number;
  weight_kg?: number;
  weight_range?: string;
  gym?: string;
  record_w?: number;
  record_l?: number;
  record_d?: number;
}

export interface FighterMatchData {
  opponent_name: string;
  event_name: string;
  match_date: string; // YYYY-MM-DD
  division: string;
  sport: string;
  result: 'win' | 'loss' | 'draw';
}

export interface ContactInfoData {
  full_name: string;
  phone: string;
  email: string;
  organisation?: string;
}

export interface OrganizerProfileData {
  job_title: string;
  organisation: string;
}

// --- Service Functions ---

/**
 * Step 1: Complete Account
 * Saves first_name and last_name to the profiles table.
 * Uses upsert to ensure profile exists even if trigger failed.
 */
export const updateBasicProfile = async (userId: string, data: ProfileData) => {
    // We include 'id' for upsert to work on the Primary Key
  const { error } = await supabase
    .from('profiles')
      .upsert({ id: userId, ...data, updated_at: new Date() });

  if (error) {
    console.error('Error updating basic profile:', error);
    throw new Error(error.message);
  }
};

/**
 * Step 2: Role Selection
 * Saves the user's role to the profiles table.
 */
export const setUserRole = async (userId: string, role: UserRole) => {
  const { error } = await supabase
    .from('profiles')
    .update({ role, updated_at: new Date() })
    .eq('id', userId);

  if (error) {
    console.error('Error setting user role:', error);
    throw new Error(error.message);
  }
};

/**
 * Step 3A: Fan Onboarding
 * Creates or updates the fan_profiles table.
 */
export const saveFanProfile = async (userId: string, data: FanProfileData) => {
  const { error } = await supabase
    .from('fan_profiles')
    .upsert({ user_id: userId, ...data });

  if (error) {
    console.error('Error saving fan profile:', error);
    throw new Error(error.message);
  }
};

/**
 * Step 3B: Fighter Onboarding - Basic Info
 */
export const saveFighterProfile = async (userId: string, data: FighterProfileData) => {
  const { error } = await supabase
    .from('fighter_profiles')
    .upsert({ user_id: userId, ...data });

  if (error) {
    console.error('Error saving fighter profile:', error);
    throw new Error(error.message);
  }
};

/**
 * Step 3B: Fighter Onboarding - Sports
 * Replaces existing sports for the user with the new list.
 */
export const saveFighterSports = async (userId: string, sports: string[]) => {
  // 1. Delete existing sports to avoid duplicates/stale data
  const { error: deleteError } = await supabase
    .from('fighter_sports')
    .delete()
    .eq('user_id', userId);

  if (deleteError) throw new Error(deleteError.message);

  // 2. Insert new sports
  if (sports.length > 0) {
    const rows = sports.map((sport) => ({ user_id: userId, sport }));
    const { error: insertError } = await supabase
      .from('fighter_sports')
      .insert(rows);

    if (insertError) throw new Error(insertError.message);
  }
};

/**
 * Step 3B: Fighter Onboarding - Add a Match
 */
export const addFighterMatch = async (userId: string, match: FighterMatchData) => {
  const { error } = await supabase
    .from('fighter_matches')
    .insert({ user_id: userId, ...match });

  if (error) {
    console.error('Error adding match:', error);
    throw new Error(error.message);
  }
};

/**
 * Step 3B & 3C: Contact Information
 */
export const saveContactInfo = async (userId: string, data: ContactInfoData) => {
  // We strictly link one contact info record per user for this onboarding
  // Note: If you need multiple, remove the onConflict logic/ID check logic.
  // Here we assume 1:1 for the profile context.
  
  // First check if one exists to grab ID, or just upsert based on user_id if we added a unique constraint.
  // Since user_id isn't PK in schema, we delete old or insert new.
  
  // Strategy: Delete old, Insert new (Simulated upsert for 1:1 relationship without PK constraint on user_id)
  await supabase.from('contact_information').delete().eq('user_id', userId);
  
  const { error } = await supabase
    .from('contact_information')
    .insert({ user_id: userId, ...data });

  if (error) {
    console.error('Error saving contact info:', error);
    throw new Error(error.message);
  }
};

/**
 * Step 3C: Organizer Onboarding
 */
export const saveOrganizerProfile = async (userId: string, data: OrganizerProfileData) => {
  const { error } = await supabase
    .from('organizer_profiles')
    .upsert({ user_id: userId, ...data });

  if (error) {
    console.error('Error saving organizer profile:', error);
    throw new Error(error.message);
  }
};

/**
 * Step 4: Completion
 * Marks the user's onboarding as complete.
 */
export const completeOnboarding = async (userId: string) => {
  const { error } = await supabase
    .from('profiles')
    .update({ onboarding_completed: true, updated_at: new Date() })
    .eq('id', userId);

  if (error) {
    console.error('Error completing onboarding:', error);
    throw new Error(error.message);
  }
};

/**
 * Step 3C: Managed Fighters
 * Replaces existing managed fighters.
 */
export const saveManagedFighters = async (organizerId: string, fighterIds: string[]) => {
  // 1. Delete existing
  const { error: deleteError } = await supabase
    .from('managed_fighters')
    .delete()
    .eq('organizer_id', organizerId);

  if (deleteError) throw new Error(deleteError.message);

  // 2. Insert new
  if (fighterIds.length > 0) {
    const rows = fighterIds.map((fid) => ({ organizer_id: organizerId, fighter_id: fid }));
    
    const { error: insertError } = await supabase
      .from('managed_fighters')
      .insert(rows);

    if (insertError) throw new Error(insertError.message);
  }
};
