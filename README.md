# 🥊 STRYDAS Fighter App

A cross-platform mobile application for fighters, fans, and event organizers — built with **Expo (React Native)** and powered by **Supabase**.

---

## � Table of Contents

- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Supabase Setup](#-supabase-setup)
- [Running the App](#-running-the-app)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Key Features](#-key-features)
- [Troubleshooting](#-troubleshooting)

---

## 🛠 Tech Stack

| Layer        | Technology                             |
|-------------|----------------------------------------|
| Framework    | [Expo](https://expo.dev) (SDK 54)      |
| Language     | TypeScript                             |
| Navigation   | React Navigation (Stack + Bottom Tabs + Drawer) |
| Backend      | [Supabase](https://supabase.com) (Database + Auth + Storage) |
| Styling      | React Native StyleSheet + Expo Linear Gradient |
| Icons        | Expo Vector Icons + Lucide React Native |

---

## ✅ Prerequisites

Make sure you have the following installed **before** cloning:

| Tool                | Minimum Version | Install Link                                         |
|---------------------|-----------------|------------------------------------------------------|
| Node.js             | 18.x or later   | https://nodejs.org                                   |
| Yarn                | 1.x (Classic)   | `npm install -g yarn`                                |
| Expo CLI            | Latest          | `npm install -g expo-cli`                            |
| Expo Go (mobile)    | Latest          | [iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) |

> **Optional for native builds:** Xcode (macOS only) for iOS simulator, or Android Studio for Android emulator.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_ORG/strydas-fighter-app.git
cd strydas-fighter-app
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your Supabase credentials (see [Environment Variables](#-environment-variables) below).

### 4. Start the development server

```bash
yarn start
```

Scan the QR code with **Expo Go** on your phone, or press:
- `i` — open iOS Simulator
- `a` — open Android Emulator
- `w` — open in Web browser

---

## 🔑 Environment Variables

All environment variables are prefixed with `EXPO_PUBLIC_` so they are accessible client-side in Expo.

Create your `.env` file from the example template:

```bash
cp .env.example .env
```

| Variable                      | Description                          | Where to find it                                   |
|-------------------------------|--------------------------------------|----------------------------------------------------|
| `EXPO_PUBLIC_SUPABASE_URL`    | Your Supabase project URL            | Supabase Dashboard → Project Settings → API        |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key           | Supabase Dashboard → Project Settings → API        |

### Example `.env`

```env
EXPO_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`. Only commit `.env.example`.

---

## 🗄 Supabase Setup

If you are setting up a **fresh Supabase project** (not using the shared dev project):

1. Go to [https://supabase.com](https://supabase.com) and create a new project.
2. Navigate to **SQL Editor** in the Supabase Dashboard.
3. Run the migration SQL found in `db_schema_update.sql` to create all required tables.
4. Copy your **Project URL** and **Anon Key** from **Project Settings → API** into your `.env` file.
5. Enable **Email Auth** under **Authentication → Providers** if not already enabled.

> For the full database schema reference (tables, columns, RLS policies), see [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md).

### Database Tables

| Table               | Purpose                                        |
|---------------------|------------------------------------------------|
| `profiles`          | Core user data for all roles (fan/fighter/organizer) |
| `social_links`      | Social media links per profile                 |
| `contact_info`      | Contact details per profile                    |
| `sports_records`    | Fight win/loss/draw records per sport          |
| `fighters_managed`  | Organizer ↔ Fighter relationships              |
| `sports_of_interest`| Sports fans follow                             |

---

## ▶️ Running the App

| Command         | Description                                   |
|-----------------|-----------------------------------------------|
| `yarn start`    | Start Expo dev server (default)               |
| `yarn ios`      | Open in iOS Simulator                         |
| `yarn android`  | Open in Android Emulator                      |
| `yarn web`      | Open in Web browser                           |
| `yarn lint`     | Run ESLint checks                             |

---

## 📁 Project Structure

```
strydas-fighter-app/
├── App.tsx                    # App entry point
├── index.js                   # Expo entry file
├── app.json                   # Expo config (name, icons, plugins)
├── .env                       # Local env vars (not in git)
├── .env.example               # Env var template (safe to commit)
│
├── assets/                    # Images, fonts, icons
│
├── components/                # Reusable UI components
│   └── common/                # Shared components (sheets, pickers, etc.)
│
├── screens/                   # Full page screens
│   └── AuthScreens/           # Onboarding & profile completion flows
│       ├── CompleteProfile.tsx
│       ├── OnboardingFan.tsx
│       ├── OnboardingFighter.tsx
│       └── OnboardingOrganizer.tsx
│
├── navigation/                # React Navigation setup
│
├── lib/
│   ├── supabase.ts            # Supabase client initialization
│   └── types.ts               # Shared TypeScript types & interfaces
│
├── services/
│   └── profileService.ts      # All database operations (profiles, social links, etc.)
│
├── hooks/                     # Custom React hooks
│
├── constant/                  # App-wide constants (colors, enums, etc.)
│
└── scripts/                   # Utility scripts
```

---

## 📜 Available Scripts

```bash
yarn start          # Start the Expo development server
yarn ios            # Start on iOS simulator
yarn android        # Start on Android emulator
yarn web            # Start in web browser
yarn lint           # Run ESLint
```

---

## ✨ Key Features

- **Multi-role Onboarding** — Separate onboarding flows for Fans, Fighters, and Organizers
- **Fighter Profiles** — Weight division, sports records (wins/losses/draws), gym, division
- **Organizer Tools** — Create events (Fight Night / Tournament), manage fighters
- **Social Links** — Add Instagram, Facebook, Twitter, and other social media links
- **Contact Info** — WhatsApp, email, and phone contact management
- **Event Management** — Create and manage fight events with sport, level, and type
- **Match Records** — Track win/loss/draw stats per sport (Muay Thai, Boxing, MMA, K-1, etc.)

---

## 🐛 Troubleshooting

### `EXPO_PUBLIC_*` variables not loading
- Make sure your `.env` file is in the **project root** (same level as `package.json`).
- Restart the Expo bundler after making changes: `yarn start --clear`

### Metro bundler cache issues
```bash
yarn start --clear
```

### Dependency issues
```bash
rm -rf node_modules
yarn install
```

### Supabase connection errors
- Double-check the `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` values in your `.env`.
- Verify the project is active in the [Supabase Dashboard](https://app.supabase.com).
- Check that RLS policies allow the actions you're testing.

### Port already in use
If you see `EADDRINUSE` errors:
```bash
# Find and kill the process using the port
lsof -ti:8081 | xargs kill -9
yarn start
```

---

## 📚 Useful Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Navigation Docs](https://reactnavigation.org/docs/getting-started)
- [React Native Docs](https://reactnative.dev/docs/getting-started)

---

> For additional implementation details, see the other markdown docs in this repo:
> [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) · [`AUTH_IMPLEMENTATION.md`](./AUTH_IMPLEMENTATION.md) · [`FEATURES_IMPLEMENTED.md`](./FEATURES_IMPLEMENTED.md)
