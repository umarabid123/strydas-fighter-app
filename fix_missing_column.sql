-- 1. Add 'updated_at' column if it's missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'updated_at') THEN
        ALTER TABLE public.profiles ADD COLUMN updated_at timestamp with time zone;
    END IF;
END $$;

-- 2. Force a schema cache reload (fixes "schema cache" errors)
NOTIFY pgrst, 'reload schema';
