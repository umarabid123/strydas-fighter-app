import { supabase } from '../lib/supabase';
import {
  Profile,
  SocialLink,
  ContactInfo,
  SportsRecord,
  FighterManaged,
  SportOfInterest,
  ProfileWithRelations
} from '../lib/types';

// Profile CRUD operations
export const profileService = {
  // Upload profile image
  async uploadProfileImage(userId: string, fileUri: string): Promise<string> {
    try {
      // 1. Create a FormData object properly for React Native
      const formData = new FormData();

      // We need to infer the file type from the extension
      const fileExt = fileUri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const mimeType = fileExt === 'png' ? 'image/png' : 'image/jpeg';

      // @ts-ignore - React Native's FormData expects these specific fields for file uploads
      formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: mimeType,
      });

      // 2. Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, formData, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) throw error;

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  },

  // Create a new profile
  async createProfile(profile: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get profile by ID
  async getProfileById(id: string): Promise<ProfileWithRelations | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        social_links (*),
        contact_info (*),
        sports_records (*),
        sports_of_interest (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Get profile by email
  async getProfileByEmail(email: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Update profile
  async updateProfile(id: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error(`Profile with ID ${id} not found. Please complete your profile first.`);
      }
      throw error;
    }
    return data;
  },

  // Update basic profile info (first_name, last_name, date_of_birth, gender, country, profile_image_url)
  async updateBasicInfo(id: string, data: {
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    gender?: import('../lib/types').GenderEnum;
    country?: import('../lib/types').CountryEnum;
    profile_image_url?: string;
  }) {
    return this.updateProfile(id, data);
  },

  // Update fan profile
  async updateFanProfile(id: string, data: {
    allow_notifications?: boolean;
    allow_location?: boolean;
  }) {
    return this.updateProfile(id, data);
  },

  // Update fighter profile
  async updateFighterProfile(id: string, data: {
    weight_division?: number;
    weight_range?: number;
    height?: number;
    gym?: string;
    division?: import('../lib/types').DivisionEnum;
  }) {
    return this.updateProfile(id, data);
  },

  // Update organizer profile
  async updateOrganizerProfile(id: string, data: {
    job_title?: string;
    organisation?: string;
  }) {
    return this.updateProfile(id, data);
  },

  // Mark onboarding as complete
  async completeOnboarding(id: string) {
    return this.updateProfile(id, { onboarding_completed: true });
  }
};

// Social Links operations
export const socialLinksService = {
  async addSocialLink(link: Omit<SocialLink, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('social_links')
      .insert(link)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSocialLinksByProfileId(profileId: string) {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('profile_id', profileId);

    if (error) throw error;
    return data;
  },

  async deleteSocialLink(id: string) {
    const { error } = await supabase
      .from('social_links')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateSocialLink(id: string, updates: Partial<SocialLink>) {
    const { data, error } = await supabase
      .from('social_links')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Contact Info operations
export const contactInfoService = {
  async addContactInfo(info: Omit<ContactInfo, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('contact_info')
      .insert(info)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getContactInfoByProfileId(profileId: string) {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .eq('profile_id', profileId);

    if (error) throw error;
    return data;
  },

  async deleteContactInfo(id: string) {
    const { error } = await supabase
      .from('contact_info')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Sports Records operations
export const sportsRecordsService = {
  async addSportsRecord(record: Omit<SportsRecord, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('sports_records')
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSportsRecordsByProfileId(profileId: string) {
    const { data, error } = await supabase
      .from('sports_records')
      .select('*')
      .eq('profile_id', profileId);

    if (error) throw error;
    return data;
  },

  async updateSportsRecord(id: string, updates: Partial<SportsRecord>) {
    const { data, error } = await supabase
      .from('sports_records')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Fighters Managed operations
export const fightersManagedService = {
  async addFighterManaged(relation: Omit<FighterManaged, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('fighters_managed')
      .insert(relation)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getFightersByOrganizerId(organizerId: string) {
    const { data, error } = await supabase
      .from('fighters_managed')
      .select(`
        *,
        fighter:profiles!fighters_managed_fighter_id_fkey (*)
      `)
      .eq('organizer_id', organizerId);

    if (error) throw error;
    return data;
  },

  async removeFighterManaged(organizerId: string, fighterId: string) {
    const { error } = await supabase
      .from('fighters_managed')
      .delete()
      .eq('organizer_id', organizerId)
      .eq('fighter_id', fighterId);

    if (error) throw error;
  }
};

// Sports of Interest operations
export const sportsOfInterestService = {
  async addSportOfInterest(sport: Omit<SportOfInterest, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('sports_of_interest')
      .insert(sport)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSportsOfInterestByProfileId(profileId: string) {
    const { data, error } = await supabase
      .from('sports_of_interest')
      .select('*')
      .eq('profile_id', profileId);

    if (error) throw error;
    return data;
  },

  async removeSportOfInterest(profileId: string, sportName: string) {
    const { error } = await supabase
      .from('sports_of_interest')
      .delete()
      .eq('profile_id', profileId)
      .eq('sport_name', sportName);

    if (error) throw error;
  }
};
