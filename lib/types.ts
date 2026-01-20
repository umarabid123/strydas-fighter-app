// Database Types
export type UserRole = 'fan' | 'fighter' | 'organizer';

export interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: string;
  country?: string;
  profile_image_url?: string;
  allow_notifications: boolean;
  allow_location: boolean;
  role: UserRole;
  
  // Fighter-specific
  weight_division?: number;
  weight_range?: number;
  height?: number;
  gym?: string;
  division?: string;
  
  // Organizer-specific
  job_title?: string;
  organisation?: string;
  
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  profile_id: string;
  platform: string;
  url: string;
  created_at: string;
}

export interface ContactInfo {
  id: string;
  profile_id: string;
  contact_type: string;
  contact_value: string;
  created_at: string;
}

export interface SportsRecord {
  id: string;
  profile_id: string;
  sport_name: string;
  wins: number;
  losses: number;
  draws: number;
  created_at: string;
  updated_at: string;
}

export interface FighterManaged {
  id: string;
  organizer_id: string;
  fighter_id: string;
  relationship_type: string;
  created_at: string;
}

export interface SportOfInterest {
  id: string;
  profile_id: string;
  sport_name: string;
  created_at: string;
}

// Complete profile data with relations
export interface ProfileWithRelations extends Profile {
  social_links?: SocialLink[];
  contact_info?: ContactInfo[];
  sports_records?: SportsRecord[];
  fighters_managed?: FighterManaged[];
  sports_of_interest?: SportOfInterest[];
}

// Event and Match Types
export interface Event {
  id: string;
  organizer_id: string;
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  address?: string;
  city?: string;
  country?: string;
  image_url?: string;
  website_url?: string;
  instagram_url?: string;
  ticket_url?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  event_id: string;
  sport_type: string;
  match_type: string;
  weight_class?: string;
  description?: string;
  status: string;
  fighter_a_id?: string;
  fighter_b_id?: string;
  created_at: string;
  updated_at: string;
}

export interface EventApplication {
  id: string;
  match_id: string;
  fighter_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  applied_at: string;
  updated_at: string;
}

export interface EventWithMatches extends Event {
  matches?: Match[];
  organizer?: Profile;
}

export interface MatchWithApplications extends Match {
  applications?: EventApplication[];
  fighter_a?: Profile;
  fighter_b?: Profile;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  address?: string;
  city?: string;
  country?: string;
  image_url?: string;
  website_url?: string;
  instagram_url?: string;
  ticket_url?: string;
  tags?: string[];
}

export interface CreateMatchInput {
  event_id: string;
  sport_type: string;
  match_type: string;
  weight_class?: string;
  description?: string;
}
