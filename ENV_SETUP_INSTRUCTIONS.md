# Environment Variables Setup

Create a `.env` file in your project root directory with the following content:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://uzlsculvxymwwvrouxse.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6bHNjdWx2eHltd3d2cm91eHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMDQ5MDYsImV4cCI6MjA4MTg4MDkwNn0.91k1GWCRc3bYiXl6vlKFZstyKc54Xygity5P42Fq4Es
```

## Important Notes:

1. **Do NOT commit the `.env` file** - it contains sensitive credentials
2. The `.env` file should be added to `.gitignore` (it already is)
3. For production, you should use your own Supabase project credentials
4. Currently using anon/public keys - for production implement proper authentication with RLS policies

## To create your own Supabase project:

1. Go to https://supabase.com
2. Create a new project
3. Run the SQL migration from `SUPABASE_SETUP.md` to set up the database schema
4. Copy your project URL and anon key to the `.env` file

## TypeScript Setup

The project uses TypeScript for type safety. All database types are defined in:
- `lib/types.ts`

## Services

All database operations are handled through services in:
- `services/profileService.ts`

This provides a clean separation between UI and data layer.
