drop extension if exists "pg_net";

create type "public"."division_enum" as enum ('amateur', 'pro');

create type "public"."gender_enum" as enum ('male', 'female', 'other');

create type "public"."user_role" as enum ('fan', 'fighter', 'organizer');


  create table "public"."contact_info" (
    "id" uuid not null default gen_random_uuid(),
    "profile_id" uuid,
    "created_at" timestamp with time zone default now(),
    "full_name" text not null,
    "phone" text not null,
    "email" text,
    "organisation" text
      );


alter table "public"."contact_info" enable row level security;


  create table "public"."event_applications" (
    "id" uuid not null default gen_random_uuid(),
    "match_id" uuid,
    "fighter_id" uuid,
    "status" text default 'pending'::text,
    "applied_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "category_id" uuid
      );


alter table "public"."event_applications" enable row level security;


  create table "public"."events" (
    "id" uuid not null default gen_random_uuid(),
    "organizer_id" uuid,
    "title" text not null,
    "description" text,
    "event_date" timestamp with time zone not null,
    "event_time" text,
    "address" text,
    "city" text,
    "country" text,
    "image_url" text,
    "website_url" text,
    "instagram_url" text,
    "ticket_url" text,
    "tags" text[] default '{}'::text[],
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "type" text,
    "status" text default 'draft'::text,
    "sport" text,
    "level" text
      );


alter table "public"."events" enable row level security;


  create table "public"."fighters_managed" (
    "id" uuid not null default gen_random_uuid(),
    "organizer_id" uuid,
    "fighter_id" uuid,
    "relationship_type" text default 'manager'::text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."fighters_managed" enable row level security;


  create table "public"."matches" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid,
    "sport_type" text not null,
    "match_type" text not null,
    "weight_class" text,
    "description" text,
    "status" text default 'open'::text,
    "fighter_a_id" uuid,
    "fighter_b_id" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."matches" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null default gen_random_uuid(),
    "email" text not null,
    "first_name" text,
    "last_name" text,
    "date_of_birth" date,
    "gender" public.gender_enum,
    "country" text,
    "profile_image_url" text,
    "allow_notifications" boolean default false,
    "allow_location" boolean default false,
    "role" public.user_role default 'fan'::public.user_role,
    "weight_division" numeric(5,2),
    "weight_range" numeric(3,1),
    "height" integer,
    "gym" text,
    "division" public.division_enum,
    "job_title" text,
    "organisation" text,
    "onboarding_completed" boolean default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."profiles" enable row level security;


  create table "public"."social_links" (
    "id" uuid not null default gen_random_uuid(),
    "profile_id" uuid,
    "platform" text not null,
    "url" text not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."social_links" enable row level security;


  create table "public"."sports_of_interest" (
    "id" uuid not null default gen_random_uuid(),
    "profile_id" uuid,
    "sport_name" text not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."sports_of_interest" enable row level security;


  create table "public"."sports_records" (
    "id" uuid not null default gen_random_uuid(),
    "profile_id" uuid,
    "sport_name" text not null,
    "wins" integer default 0,
    "losses" integer default 0,
    "draws" integer default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."sports_records" enable row level security;


  create table "public"."tournament_categories" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "gender" text not null,
    "weight_class" text not null,
    "sport" text,
    "level" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."tournament_categories" enable row level security;

CREATE UNIQUE INDEX contact_info_pkey ON public.contact_info USING btree (id);

CREATE UNIQUE INDEX event_applications_match_id_fighter_id_key ON public.event_applications USING btree (match_id, fighter_id);

CREATE UNIQUE INDEX event_applications_pkey ON public.event_applications USING btree (id);

CREATE UNIQUE INDEX events_pkey ON public.events USING btree (id);

CREATE UNIQUE INDEX fighters_managed_organizer_id_fighter_id_key ON public.fighters_managed USING btree (organizer_id, fighter_id);

CREATE UNIQUE INDEX fighters_managed_pkey ON public.fighters_managed USING btree (id);

CREATE INDEX idx_event_applications_fighter_id ON public.event_applications USING btree (fighter_id);

CREATE INDEX idx_event_applications_match_id ON public.event_applications USING btree (match_id);

CREATE INDEX idx_events_event_date ON public.events USING btree (event_date);

CREATE INDEX idx_events_organizer_id ON public.events USING btree (organizer_id);

CREATE INDEX idx_matches_event_id ON public.matches USING btree (event_id);

CREATE INDEX idx_matches_status ON public.matches USING btree (status);

CREATE INDEX idx_profiles_country ON public.profiles USING btree (country);

CREATE INDEX idx_profiles_email ON public.profiles USING btree (email);

CREATE INDEX idx_profiles_role ON public.profiles USING btree (role);

CREATE UNIQUE INDEX matches_pkey ON public.matches USING btree (id);

CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX social_links_pkey ON public.social_links USING btree (id);

CREATE UNIQUE INDEX sports_of_interest_pkey ON public.sports_of_interest USING btree (id);

CREATE UNIQUE INDEX sports_of_interest_profile_id_sport_name_key ON public.sports_of_interest USING btree (profile_id, sport_name);

CREATE UNIQUE INDEX sports_records_pkey ON public.sports_records USING btree (id);

CREATE UNIQUE INDEX tournament_categories_pkey ON public.tournament_categories USING btree (id);

CREATE UNIQUE INDEX unique_contact_per_profile ON public.contact_info USING btree (profile_id);

alter table "public"."contact_info" add constraint "contact_info_pkey" PRIMARY KEY using index "contact_info_pkey";

alter table "public"."event_applications" add constraint "event_applications_pkey" PRIMARY KEY using index "event_applications_pkey";

alter table "public"."events" add constraint "events_pkey" PRIMARY KEY using index "events_pkey";

alter table "public"."fighters_managed" add constraint "fighters_managed_pkey" PRIMARY KEY using index "fighters_managed_pkey";

alter table "public"."matches" add constraint "matches_pkey" PRIMARY KEY using index "matches_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."social_links" add constraint "social_links_pkey" PRIMARY KEY using index "social_links_pkey";

alter table "public"."sports_of_interest" add constraint "sports_of_interest_pkey" PRIMARY KEY using index "sports_of_interest_pkey";

alter table "public"."sports_records" add constraint "sports_records_pkey" PRIMARY KEY using index "sports_records_pkey";

alter table "public"."tournament_categories" add constraint "tournament_categories_pkey" PRIMARY KEY using index "tournament_categories_pkey";

alter table "public"."contact_info" add constraint "contact_info_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."contact_info" validate constraint "contact_info_profile_id_fkey";

alter table "public"."contact_info" add constraint "phone_length_check" CHECK ((length(phone) >= 7)) not valid;

alter table "public"."contact_info" validate constraint "phone_length_check";

alter table "public"."contact_info" add constraint "unique_contact_per_profile" UNIQUE using index "unique_contact_per_profile";

alter table "public"."event_applications" add constraint "application_target_check" CHECK ((((match_id IS NOT NULL) AND (category_id IS NULL)) OR ((match_id IS NULL) AND (category_id IS NOT NULL)))) not valid;

alter table "public"."event_applications" validate constraint "application_target_check";

alter table "public"."event_applications" add constraint "event_applications_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.tournament_categories(id) ON DELETE CASCADE not valid;

alter table "public"."event_applications" validate constraint "event_applications_category_id_fkey";

alter table "public"."event_applications" add constraint "event_applications_fighter_id_fkey" FOREIGN KEY (fighter_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."event_applications" validate constraint "event_applications_fighter_id_fkey";

alter table "public"."event_applications" add constraint "event_applications_match_id_fighter_id_key" UNIQUE using index "event_applications_match_id_fighter_id_key";

alter table "public"."event_applications" add constraint "event_applications_match_id_fkey" FOREIGN KEY (match_id) REFERENCES public.matches(id) ON DELETE CASCADE not valid;

alter table "public"."event_applications" validate constraint "event_applications_match_id_fkey";

alter table "public"."events" add constraint "events_organizer_id_fkey" FOREIGN KEY (organizer_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."events" validate constraint "events_organizer_id_fkey";

alter table "public"."events" add constraint "events_status_check" CHECK ((status = ANY (ARRAY['draft'::text, 'upcoming'::text, 'live'::text, 'completed'::text, 'cancelled'::text]))) not valid;

alter table "public"."events" validate constraint "events_status_check";

alter table "public"."events" add constraint "events_type_check" CHECK ((type = ANY (ARRAY['fight_night'::text, 'tournament'::text]))) not valid;

alter table "public"."events" validate constraint "events_type_check";

alter table "public"."fighters_managed" add constraint "fighters_managed_fighter_id_fkey" FOREIGN KEY (fighter_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."fighters_managed" validate constraint "fighters_managed_fighter_id_fkey";

alter table "public"."fighters_managed" add constraint "fighters_managed_organizer_id_fighter_id_key" UNIQUE using index "fighters_managed_organizer_id_fighter_id_key";

alter table "public"."fighters_managed" add constraint "fighters_managed_organizer_id_fkey" FOREIGN KEY (organizer_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."fighters_managed" validate constraint "fighters_managed_organizer_id_fkey";

alter table "public"."matches" add constraint "matches_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."matches" validate constraint "matches_event_id_fkey";

alter table "public"."matches" add constraint "matches_fighter_a_id_fkey" FOREIGN KEY (fighter_a_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."matches" validate constraint "matches_fighter_a_id_fkey";

alter table "public"."matches" add constraint "matches_fighter_b_id_fkey" FOREIGN KEY (fighter_b_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."matches" validate constraint "matches_fighter_b_id_fkey";

alter table "public"."profiles" add constraint "profiles_email_key" UNIQUE using index "profiles_email_key";

alter table "public"."social_links" add constraint "social_links_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."social_links" validate constraint "social_links_profile_id_fkey";

alter table "public"."sports_of_interest" add constraint "sports_of_interest_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."sports_of_interest" validate constraint "sports_of_interest_profile_id_fkey";

alter table "public"."sports_of_interest" add constraint "sports_of_interest_profile_id_sport_name_key" UNIQUE using index "sports_of_interest_profile_id_sport_name_key";

alter table "public"."sports_records" add constraint "sports_records_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."sports_records" validate constraint "sports_records_profile_id_fkey";

alter table "public"."tournament_categories" add constraint "tournament_categories_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."tournament_categories" validate constraint "tournament_categories_event_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;

exception
  when others then
    -- Never block auth signup
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."contact_info" to "anon";

grant insert on table "public"."contact_info" to "anon";

grant references on table "public"."contact_info" to "anon";

grant select on table "public"."contact_info" to "anon";

grant trigger on table "public"."contact_info" to "anon";

grant truncate on table "public"."contact_info" to "anon";

grant update on table "public"."contact_info" to "anon";

grant delete on table "public"."contact_info" to "authenticated";

grant insert on table "public"."contact_info" to "authenticated";

grant references on table "public"."contact_info" to "authenticated";

grant select on table "public"."contact_info" to "authenticated";

grant trigger on table "public"."contact_info" to "authenticated";

grant truncate on table "public"."contact_info" to "authenticated";

grant update on table "public"."contact_info" to "authenticated";

grant delete on table "public"."contact_info" to "service_role";

grant insert on table "public"."contact_info" to "service_role";

grant references on table "public"."contact_info" to "service_role";

grant select on table "public"."contact_info" to "service_role";

grant trigger on table "public"."contact_info" to "service_role";

grant truncate on table "public"."contact_info" to "service_role";

grant update on table "public"."contact_info" to "service_role";

grant delete on table "public"."event_applications" to "anon";

grant insert on table "public"."event_applications" to "anon";

grant references on table "public"."event_applications" to "anon";

grant select on table "public"."event_applications" to "anon";

grant trigger on table "public"."event_applications" to "anon";

grant truncate on table "public"."event_applications" to "anon";

grant update on table "public"."event_applications" to "anon";

grant delete on table "public"."event_applications" to "authenticated";

grant insert on table "public"."event_applications" to "authenticated";

grant references on table "public"."event_applications" to "authenticated";

grant select on table "public"."event_applications" to "authenticated";

grant trigger on table "public"."event_applications" to "authenticated";

grant truncate on table "public"."event_applications" to "authenticated";

grant update on table "public"."event_applications" to "authenticated";

grant delete on table "public"."event_applications" to "service_role";

grant insert on table "public"."event_applications" to "service_role";

grant references on table "public"."event_applications" to "service_role";

grant select on table "public"."event_applications" to "service_role";

grant trigger on table "public"."event_applications" to "service_role";

grant truncate on table "public"."event_applications" to "service_role";

grant update on table "public"."event_applications" to "service_role";

grant delete on table "public"."events" to "anon";

grant insert on table "public"."events" to "anon";

grant references on table "public"."events" to "anon";

grant select on table "public"."events" to "anon";

grant trigger on table "public"."events" to "anon";

grant truncate on table "public"."events" to "anon";

grant update on table "public"."events" to "anon";

grant delete on table "public"."events" to "authenticated";

grant insert on table "public"."events" to "authenticated";

grant references on table "public"."events" to "authenticated";

grant select on table "public"."events" to "authenticated";

grant trigger on table "public"."events" to "authenticated";

grant truncate on table "public"."events" to "authenticated";

grant update on table "public"."events" to "authenticated";

grant delete on table "public"."events" to "service_role";

grant insert on table "public"."events" to "service_role";

grant references on table "public"."events" to "service_role";

grant select on table "public"."events" to "service_role";

grant trigger on table "public"."events" to "service_role";

grant truncate on table "public"."events" to "service_role";

grant update on table "public"."events" to "service_role";

grant delete on table "public"."fighters_managed" to "anon";

grant insert on table "public"."fighters_managed" to "anon";

grant references on table "public"."fighters_managed" to "anon";

grant select on table "public"."fighters_managed" to "anon";

grant trigger on table "public"."fighters_managed" to "anon";

grant truncate on table "public"."fighters_managed" to "anon";

grant update on table "public"."fighters_managed" to "anon";

grant delete on table "public"."fighters_managed" to "authenticated";

grant insert on table "public"."fighters_managed" to "authenticated";

grant references on table "public"."fighters_managed" to "authenticated";

grant select on table "public"."fighters_managed" to "authenticated";

grant trigger on table "public"."fighters_managed" to "authenticated";

grant truncate on table "public"."fighters_managed" to "authenticated";

grant update on table "public"."fighters_managed" to "authenticated";

grant delete on table "public"."fighters_managed" to "service_role";

grant insert on table "public"."fighters_managed" to "service_role";

grant references on table "public"."fighters_managed" to "service_role";

grant select on table "public"."fighters_managed" to "service_role";

grant trigger on table "public"."fighters_managed" to "service_role";

grant truncate on table "public"."fighters_managed" to "service_role";

grant update on table "public"."fighters_managed" to "service_role";

grant delete on table "public"."matches" to "anon";

grant insert on table "public"."matches" to "anon";

grant references on table "public"."matches" to "anon";

grant select on table "public"."matches" to "anon";

grant trigger on table "public"."matches" to "anon";

grant truncate on table "public"."matches" to "anon";

grant update on table "public"."matches" to "anon";

grant delete on table "public"."matches" to "authenticated";

grant insert on table "public"."matches" to "authenticated";

grant references on table "public"."matches" to "authenticated";

grant select on table "public"."matches" to "authenticated";

grant trigger on table "public"."matches" to "authenticated";

grant truncate on table "public"."matches" to "authenticated";

grant update on table "public"."matches" to "authenticated";

grant delete on table "public"."matches" to "service_role";

grant insert on table "public"."matches" to "service_role";

grant references on table "public"."matches" to "service_role";

grant select on table "public"."matches" to "service_role";

grant trigger on table "public"."matches" to "service_role";

grant truncate on table "public"."matches" to "service_role";

grant update on table "public"."matches" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."social_links" to "anon";

grant insert on table "public"."social_links" to "anon";

grant references on table "public"."social_links" to "anon";

grant select on table "public"."social_links" to "anon";

grant trigger on table "public"."social_links" to "anon";

grant truncate on table "public"."social_links" to "anon";

grant update on table "public"."social_links" to "anon";

grant delete on table "public"."social_links" to "authenticated";

grant insert on table "public"."social_links" to "authenticated";

grant references on table "public"."social_links" to "authenticated";

grant select on table "public"."social_links" to "authenticated";

grant trigger on table "public"."social_links" to "authenticated";

grant truncate on table "public"."social_links" to "authenticated";

grant update on table "public"."social_links" to "authenticated";

grant delete on table "public"."social_links" to "service_role";

grant insert on table "public"."social_links" to "service_role";

grant references on table "public"."social_links" to "service_role";

grant select on table "public"."social_links" to "service_role";

grant trigger on table "public"."social_links" to "service_role";

grant truncate on table "public"."social_links" to "service_role";

grant update on table "public"."social_links" to "service_role";

grant delete on table "public"."sports_of_interest" to "anon";

grant insert on table "public"."sports_of_interest" to "anon";

grant references on table "public"."sports_of_interest" to "anon";

grant select on table "public"."sports_of_interest" to "anon";

grant trigger on table "public"."sports_of_interest" to "anon";

grant truncate on table "public"."sports_of_interest" to "anon";

grant update on table "public"."sports_of_interest" to "anon";

grant delete on table "public"."sports_of_interest" to "authenticated";

grant insert on table "public"."sports_of_interest" to "authenticated";

grant references on table "public"."sports_of_interest" to "authenticated";

grant select on table "public"."sports_of_interest" to "authenticated";

grant trigger on table "public"."sports_of_interest" to "authenticated";

grant truncate on table "public"."sports_of_interest" to "authenticated";

grant update on table "public"."sports_of_interest" to "authenticated";

grant delete on table "public"."sports_of_interest" to "service_role";

grant insert on table "public"."sports_of_interest" to "service_role";

grant references on table "public"."sports_of_interest" to "service_role";

grant select on table "public"."sports_of_interest" to "service_role";

grant trigger on table "public"."sports_of_interest" to "service_role";

grant truncate on table "public"."sports_of_interest" to "service_role";

grant update on table "public"."sports_of_interest" to "service_role";

grant delete on table "public"."sports_records" to "anon";

grant insert on table "public"."sports_records" to "anon";

grant references on table "public"."sports_records" to "anon";

grant select on table "public"."sports_records" to "anon";

grant trigger on table "public"."sports_records" to "anon";

grant truncate on table "public"."sports_records" to "anon";

grant update on table "public"."sports_records" to "anon";

grant delete on table "public"."sports_records" to "authenticated";

grant insert on table "public"."sports_records" to "authenticated";

grant references on table "public"."sports_records" to "authenticated";

grant select on table "public"."sports_records" to "authenticated";

grant trigger on table "public"."sports_records" to "authenticated";

grant truncate on table "public"."sports_records" to "authenticated";

grant update on table "public"."sports_records" to "authenticated";

grant delete on table "public"."sports_records" to "service_role";

grant insert on table "public"."sports_records" to "service_role";

grant references on table "public"."sports_records" to "service_role";

grant select on table "public"."sports_records" to "service_role";

grant trigger on table "public"."sports_records" to "service_role";

grant truncate on table "public"."sports_records" to "service_role";

grant update on table "public"."sports_records" to "service_role";

grant delete on table "public"."tournament_categories" to "anon";

grant insert on table "public"."tournament_categories" to "anon";

grant references on table "public"."tournament_categories" to "anon";

grant select on table "public"."tournament_categories" to "anon";

grant trigger on table "public"."tournament_categories" to "anon";

grant truncate on table "public"."tournament_categories" to "anon";

grant update on table "public"."tournament_categories" to "anon";

grant delete on table "public"."tournament_categories" to "authenticated";

grant insert on table "public"."tournament_categories" to "authenticated";

grant references on table "public"."tournament_categories" to "authenticated";

grant select on table "public"."tournament_categories" to "authenticated";

grant trigger on table "public"."tournament_categories" to "authenticated";

grant truncate on table "public"."tournament_categories" to "authenticated";

grant update on table "public"."tournament_categories" to "authenticated";

grant delete on table "public"."tournament_categories" to "service_role";

grant insert on table "public"."tournament_categories" to "service_role";

grant references on table "public"."tournament_categories" to "service_role";

grant select on table "public"."tournament_categories" to "service_role";

grant trigger on table "public"."tournament_categories" to "service_role";

grant truncate on table "public"."tournament_categories" to "service_role";

grant update on table "public"."tournament_categories" to "service_role";


  create policy "Contact info manageable by profile owner"
  on "public"."contact_info"
  as permissive
  for all
  to public
using (true);



  create policy "Contact info viewable by profile owner"
  on "public"."contact_info"
  as permissive
  for select
  to public
using (true);



  create policy "Fighters can create applications"
  on "public"."event_applications"
  as permissive
  for insert
  to public
with check ((auth.uid() = fighter_id));



  create policy "Fighters can view their own applications"
  on "public"."event_applications"
  as permissive
  for select
  to public
using ((auth.uid() = fighter_id));



  create policy "Organizers can delete applications for their events"
  on "public"."event_applications"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM (public.matches m
     JOIN public.events e ON ((e.id = m.event_id)))
  WHERE ((m.id = event_applications.match_id) AND (e.organizer_id = auth.uid())))));



  create policy "Organizers can update applications for their events"
  on "public"."event_applications"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM (public.matches m
     JOIN public.events e ON ((e.id = m.event_id)))
  WHERE ((m.id = event_applications.match_id) AND (e.organizer_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM (public.matches m
     JOIN public.events e ON ((e.id = m.event_id)))
  WHERE ((m.id = event_applications.match_id) AND (e.organizer_id = auth.uid())))));



  create policy "Organizers can view applications for their events"
  on "public"."event_applications"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM (public.matches m
     JOIN public.events e ON ((e.id = m.event_id)))
  WHERE ((m.id = event_applications.match_id) AND (e.organizer_id = auth.uid())))));



  create policy "Anyone can view events"
  on "public"."events"
  as permissive
  for select
  to public
using (true);



  create policy "Organizers can create their own events"
  on "public"."events"
  as permissive
  for insert
  to public
with check ((auth.uid() = organizer_id));



  create policy "Organizers can delete their own events"
  on "public"."events"
  as permissive
  for delete
  to public
using ((auth.uid() = organizer_id));



  create policy "Organizers can update their own events"
  on "public"."events"
  as permissive
  for update
  to public
using ((auth.uid() = organizer_id))
with check ((auth.uid() = organizer_id));



  create policy "Fighters managed manageable by organizer"
  on "public"."fighters_managed"
  as permissive
  for all
  to public
using (true);



  create policy "Fighters managed viewable by everyone"
  on "public"."fighters_managed"
  as permissive
  for select
  to public
using (true);



  create policy "Anyone can view matches"
  on "public"."matches"
  as permissive
  for select
  to public
using (true);



  create policy "Organizers can create matches for their events"
  on "public"."matches"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.events
  WHERE ((events.id = matches.event_id) AND (events.organizer_id = auth.uid())))));



  create policy "Organizers can delete matches for their events"
  on "public"."matches"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.events
  WHERE ((events.id = matches.event_id) AND (events.organizer_id = auth.uid())))));



  create policy "Organizers can update matches for their events"
  on "public"."matches"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.events
  WHERE ((events.id = matches.event_id) AND (events.organizer_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM public.events
  WHERE ((events.id = matches.event_id) AND (events.organizer_id = auth.uid())))));



  create policy "Public profiles are viewable by everyone"
  on "public"."profiles"
  as permissive
  for select
  to public
using (true);



  create policy "Users can insert their own profile"
  on "public"."profiles"
  as permissive
  for insert
  to public
with check (true);



  create policy "Users can update their own profile"
  on "public"."profiles"
  as permissive
  for update
  to public
using (true);



  create policy "Social links manageable by profile owner"
  on "public"."social_links"
  as permissive
  for all
  to public
using (true);



  create policy "Social links viewable by profile owner"
  on "public"."social_links"
  as permissive
  for select
  to public
using (true);



  create policy "Sports of interest manageable by profile owner"
  on "public"."sports_of_interest"
  as permissive
  for all
  to public
using (true);



  create policy "Sports of interest viewable by everyone"
  on "public"."sports_of_interest"
  as permissive
  for select
  to public
using (true);



  create policy "Sports records manageable by profile owner"
  on "public"."sports_records"
  as permissive
  for all
  to public
using (true);



  create policy "Sports records viewable by everyone"
  on "public"."sports_records"
  as permissive
  for select
  to public
using (true);



  create policy "Organizers can delete categories for their events"
  on "public"."tournament_categories"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.events
  WHERE ((events.id = tournament_categories.event_id) AND (events.organizer_id = auth.uid())))));



  create policy "Organizers can insert categories for their events"
  on "public"."tournament_categories"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.events
  WHERE ((events.id = tournament_categories.event_id) AND (events.organizer_id = auth.uid())))));



  create policy "Organizers can update categories for their events"
  on "public"."tournament_categories"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.events
  WHERE ((events.id = tournament_categories.event_id) AND (events.organizer_id = auth.uid())))));



  create policy "Public categories are viewable by everyone"
  on "public"."tournament_categories"
  as permissive
  for select
  to public
using (true);


CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sports_records_updated_at BEFORE UPDATE ON public.sports_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


  create policy "Allow authenticated updates"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using ((bucket_id = 'avatars'::text));



  create policy "Allow authenticated uploads"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'avatars'::text));



  create policy "Allow public downloads"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'avatars'::text));



