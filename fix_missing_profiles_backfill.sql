-- Backfill missing profiles for existing auth users
-- This fixes the "violates foreign key constraint" error by ensuring every auth user has a corresponding profile row.

INSERT INTO public.profiles (id, email)
SELECT id, email
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
