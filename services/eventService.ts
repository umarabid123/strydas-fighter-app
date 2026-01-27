import { supabase } from '../lib/supabase';
import {
  Event,
  Match,
  EventApplication,
  EventWithMatches,
  MatchWithApplications,
  CreateEventInput,
  CreateMatchInput,
} from '../lib/types';

// Event Operations
export const createEvent = async (
  organizerId: string,
  eventData: CreateEventInput
): Promise<Event> => {
  console.log('Creating event for organizer:', organizerId, 'with data:', eventData);
  const { data, error } = await supabase
    .from('events')
    .insert({
      organizer_id: organizerId,
      ...eventData,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw error;
  }
  console.log('Event created successfully:', data);
  return data;
};

export const getEventById = async (eventId: string): Promise<EventWithMatches | null> => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      matches (*),
      organizer:profiles!events_organizer_id_fkey (
        id,
        first_name,
        last_name,
        profile_image_url,
        job_title,
        organisation
      )
    `)
    .eq('id', eventId)
    .single();

  if (error) throw error;
  return data;
};

export const getAllEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const getEventsByOrganizer = async (
  organizerId: string
): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('organizer_id', organizerId)
    .order('event_date', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const updateEvent = async (
  eventId: string,
  eventData: Partial<CreateEventInput>
): Promise<Event> => {
  const { data, error } = await supabase
    .from('events')
    .update({
      ...eventData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', eventId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) throw error;
};

// Match Operations
export const createMatch = async (
  matchData: CreateMatchInput
): Promise<Match> => {
  const { data, error } = await supabase
    .from('matches')
    .insert(matchData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getMatchesByEventId = async (
  eventId: string
): Promise<Match[]> => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const getMatchById = async (
  matchId: string
): Promise<MatchWithApplications | null> => {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      applications:event_applications (*),
      fighter_a:profiles!matches_fighter_a_id_fkey (
        id,
        first_name,
        last_name,
        profile_image_url
      ),
      fighter_b:profiles!matches_fighter_b_id_fkey (
        id,
        first_name,
        last_name,
        profile_image_url
      )
    `)
    .eq('id', matchId)
    .single();

  if (error) throw error;
  return data;
};

export const updateMatch = async (
  matchId: string,
  matchData: Partial<CreateMatchInput & { status: string }>
): Promise<Match> => {
  const { data, error } = await supabase
    .from('matches')
    .update({
      ...matchData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', matchId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteMatch = async (matchId: string): Promise<void> => {
  const { error } = await supabase
    .from('matches')
    .delete()
    .eq('id', matchId);

  if (error) throw error;
};

// Event Application Operations
export const applyForMatch = async (
  matchId: string,
  fighterId: string
): Promise<EventApplication> => {
  const { data, error } = await supabase
    .from('event_applications')
    .insert({
      match_id: matchId,
      fighter_id: fighterId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getApplicationsForFighter = async (
  fighterId: string
): Promise<EventApplication[]> => {
  const { data, error } = await supabase
    .from('event_applications')
    .select(`
      *,
      match:matches (
        *,
        event:events (*)
      )
    `)
    .eq('fighter_id', fighterId)
    .order('applied_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getApplicationsForEvent = async (
  eventId: string
): Promise<EventApplication[]> => {
  const { data, error } = await supabase
    .from('event_applications')
    .select(`
      *,
      match:matches (*),
      fighter:profiles (
        id,
        first_name,
        last_name,
        profile_image_url,
        weight_division,
        gym,
        sports_records
      )
    `)
    .in('match_id',
      (await getMatchesByEventId(eventId)).map(m => m.id)
    )
    .order('applied_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: 'accepted' | 'rejected'
): Promise<EventApplication> => {
  const { data, error } = await supabase
    .from('event_applications')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', applicationId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const hasFighterAppliedForMatch = async (
  matchId: string,
  fighterId: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('event_applications')
    .select('id')
    .eq('match_id', matchId)
    .eq('fighter_id', fighterId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return false; // No rows returned
    throw error;
  }
  return !!data;
};

// Subscribe to event changes (real-time)
export const subscribeToEvent = (
  eventId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`event:${eventId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'events',
        filter: `id=eq.${eventId}`,
      },
      callback
    )
    .subscribe();
};

// Subscribe to matches for an event (real-time)
export const subscribeToEventMatches = (
  eventId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`event:${eventId}:matches`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'matches',
        filter: `event_id=eq.${eventId}`,
      },
      callback
    )
    .subscribe();
};
