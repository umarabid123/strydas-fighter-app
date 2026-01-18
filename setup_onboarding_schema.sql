-- 1) Fan Profiles
create table if not exists public.fan_profiles (
  user_id uuid references public.profiles(id) on delete cascade not null primary key,
  allow_notifications boolean default false,
  allow_location boolean default false
);

-- 2) Fighter Profiles
create table if not exists public.fighter_profiles (
  user_id uuid references public.profiles(id) on delete cascade not null primary key,
  country text,
  height_cm integer,
  weight_kg numeric,
  weight_range text,
  gym text,
  record_w integer default 0,
  record_l integer default 0,
  record_d integer default 0
);

-- 3) Fighter Sports
create table if not exists public.fighter_sports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  sport text not null
);

-- 4) Fighter Matches
create table if not exists public.fighter_matches (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  opponent_name text,
  event_name text,
  match_date date,
  division text,
  sport text,
  result text check (result in ('win', 'loss', 'draw'))
);

-- 5) Contact Information
create table if not exists public.contact_information (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  full_name text,
  phone text,
  email text,
  organisation text
);

-- 6) Organizer Profiles
create table if not exists public.organizer_profiles (
  user_id uuid references public.profiles(id) on delete cascade not null primary key,
  job_title text,
  organisation text
);

-- 7) Managed Fighters
create table if not exists public.managed_fighters (
  id uuid default gen_random_uuid() primary key,
  organizer_id uuid references public.profiles(id) on delete cascade not null,
  fighter_id uuid references public.profiles(id) on delete cascade not null
);

-- Enable RLS on all tables
alter table public.fan_profiles enable row level security;
alter table public.fighter_profiles enable row level security;
alter table public.fighter_sports enable row level security;
alter table public.fighter_matches enable row level security;
alter table public.contact_information enable row level security;
alter table public.organizer_profiles enable row level security;
alter table public.managed_fighters enable row level security;

-- Simple "Users can manage their own data" policies
-- (You can refine these later, but this enables the app to work)

-- FAN PROFILES
create policy "Users can all on own fan_profile" on fan_profiles for all using (auth.uid() = user_id);

-- FIGHTER PROFILES
create policy "Users can all on own fighter_profile" on fighter_profiles for all using (auth.uid() = user_id);

-- FIGHTER SPORTS
create policy "Users can all on own fighter_sports" on fighter_sports for all using (auth.uid() = user_id);

-- FIGHTER MATCHES
create policy "Users can all on own fighter_matches" on fighter_matches for all using (auth.uid() = user_id);

-- CONTACT INFO
create policy "Users can all on own contact_info" on contact_information for all using (auth.uid() = user_id);

-- ORGANIZER PROFILES
create policy "Users can all on own organizer_profile" on organizer_profiles for all using (auth.uid() = user_id);

-- MANAGED FIGHTERS
create policy "Users can all on own managed_fighters" on managed_fighters for all using (auth.uid() = organizer_id);
