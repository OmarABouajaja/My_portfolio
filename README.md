# Abouajaja_Omar/ Digital Portfolio & OS

A highly-advanced, modular, 3D-integrated personal portfolio and "Life Operating System" built for a Senior Full-Stack & 3D Web Engineer. Designed with an industrial cyber aesthetic, it serves as both a client-facing showcase and a private administrative command center.

## Features

- **Public Portfolio**: Immersive 3D data visualization, localized content (EN/FR/ES/AR), service offerings, and project showcases.
- **Command Center (Admin Dashboard)**: A fully-featured, black-box administrative suite accessible via a hidden trigger.
- **Client Portal**: Secure, token-based area for clients to track project milestones and communicate securely.
- **Dynamic CMS**: All content (projects, timeline, services, bio, equipment) is driven by Supabase.
- **IoT & Hardware Integration**: Built-in support for telemetry streaming and ESP32 device matrix management.
- **Dynamic Resume Builder**: Compiles active database content into a stylable PDF resume on the fly.
- **PWA Ready**: Installable as a native-feeling app on mobile and desktop devices.

## Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS & Framer Motion
- **3D Engine**: Three.js & React Three Fiber
- **Backend & Auth**: Supabase (PostgreSQL)
- **State Management**: TanStack React Query & LocalStorage
- **Icons**: Lucide React

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and add your Supabase credentials.
   ```env
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Admin Access

The Command Center is hidden from standard users to maintain a clean aesthetic.
To access the admin panel:
1. Double-click the `ABOUAJAJA_OMAR/` logo in the top-left navigation bar.
2. OR press `Cmd+K` / `Ctrl+K` to open the System Search palette and navigate to "Access Admin Subsystem".

*Note: If Supabase is not connected, the dashboard will run in local Mock Mode.*

## Localization

The platform uses `i18next` for localization. All text content is centralized in `src/i18n.ts`. To modify the supported languages or add new ones, update the `resources` object. Database records (projects, services) natively support `_en`, `_fr`, `_es`, and `_ar` columns.

## License

MIT License. Copyright (c) 2026 Omar Abouajaja.
