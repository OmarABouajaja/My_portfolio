<div align="center">

# NEXUS ENGINE

### _Personal Operating System & Digital Portfolio_

[![Live Site](https://img.shields.io/badge/Live_Site-omarabouajaja.dev-00f5ff?style=for-the-badge&logo=vercel&logoColor=white)](https://omarabouajaja.dev)
[![Build Status](https://img.shields.io/github/actions/workflow/status/OmarABouajaja/My_portfolio/android-build.yml?style=for-the-badge&logo=github-actions&label=APK+Build)](https://github.com/OmarABouajaja/My_portfolio/actions)
[![Latest APK](https://img.shields.io/github/release/OmarABouajaja/My_portfolio?style=for-the-badge&logo=android&label=Download+APK&color=3ddc84)](https://github.com/OmarABouajaja/My_portfolio/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-a855f7?style=for-the-badge)](LICENSE)

<br/>

> **A high-performance, modular Life OS** — bridging a public creative portfolio with a private, production-grade command center for freelance operations, IoT telemetry, cloud infrastructure management, and personal knowledge systems.

</div>

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        NEXUS ENGINE                             │
├────────────────────────┬────────────────────────────────────────┤
│   PUBLIC NODE          │   PRIVATE COMMAND CENTER               │
│   (Portfolio)          │   (Admin OS — Auth-Gated)              │
│                        │                                        │
│  • Hero / About        │  • Dashboard Overview                  │
│  • Projects Showcase   │  • Projects, Skills, Services CRUD     │
│  • Skills & Stack      │  • IoT Fleet Monitor (ESP32)           │
│  • Timeline            │  • Cloud Infra (Cloudflare + Supabase) │
│  • Certifications      │  • Finance & Invoice Engine            │
│  • Contact / Chat      │  • Neural Flow / Life OS               │
│  • PWA / Installable   │  • Encrypted Secret Vault              │
│                        │  • Telemetry & Analytics               │
└────────────────────────┴────────────────────────────────────────┘
         ▲                              ▲
         │         Supabase             │
         └──── PostgreSQL + Realtime ───┘
                  Edge Functions
                  RLS Policies
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + TypeScript |
| **Styling** | Tailwind CSS v3 (Custom HSL Design System) |
| **Animations** | Framer Motion + CSS Hardware Acceleration |
| **Backend** | Supabase (PostgreSQL, Realtime, RLS, Edge Functions) |
| **Native App** | Capacitor 6 (iOS + Android PWA shell) |
| **Cloud / CDN** | Cloudflare (DNS, Cache, Dev Mode API) |
| **CI/CD** | GitHub Actions (Cloud APK builds) |
| **Data Fetching** | TanStack React Query v5 |
| **i18n** | i18next (EN / FR / ES / AR) |

---

## Features

### 🌐 Public Portfolio
- **Interactive 3D Visualization** via React Three Fiber
- **Multilingual** — English, French, Spanish, Arabic
- **PWA** — installable as a native app on iOS & Android
- **SEO Optimized** — sitemap, robots.txt, Open Graph meta
- **Real-time Contact** — Supabase-powered secure chat

### 🔒 Admin OS (Command Center)
- **28 Modules** — Projects, Timeline, Skills, Finance, Blog, IoT, and more
- **Cloud Infra Manager** — Manage Cloudflare zones and Supabase projects directly from the dashboard
- **Security Vault** — API keys encrypted at rest via Supabase RLS; _never_ exposed to the browser
- **Dynamic Resume** — Compiles live PostgreSQL records into an exportable PDF
- **Neural Flow** — Personal knowledge and task management system
- **Encrypted Vault** — AES-GCM client-side encryption for private notes
- **LocalDrop** — Peer-to-peer file transfer via WebRTC
- **Telemetry** — Visitor analytics and IoT device health monitoring

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- A [Supabase](https://supabase.com) project

### Local Development

```bash
# 1. Clone
git clone https://github.com/OmarABouajaja/My_portfolio.git
cd My_portfolio

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Fill in your Supabase credentials in .env

# 4. Apply database schema
# Open your Supabase SQL Editor and run: supabase_schema.sql

# 5. Run dev server
npm run dev
```

> **Mock Mode**: If `.env` is missing or empty, the app gracefully degrades to mock data — no errors, no crashes.

### Database Setup

Run the contents of [`supabase_schema.sql`](./supabase_schema.sql) in your Supabase SQL Editor. It uses `CREATE TABLE IF NOT EXISTS` throughout, so it is safe to re-run at any time.

---

## Admin Access

The command center is hidden from the public UI to maintain a clean professional facade.

**To access:**
1. Navigate to `/admin` directly, **or**
2. Double-click the `ABOUAJAJA_OMAR/` logo in the top navigation bar

You will be prompted for your Supabase admin credentials. Your role must be set to `admin` in the `user_roles` table.

---

## Cloud Infra Setup

The Cloud Infra module lets you manage Cloudflare domains and Supabase projects from your dashboard. It works via Supabase Edge Functions so API tokens are **never exposed to the browser**.

### 1. Deploy Edge Functions
```bash
supabase functions deploy admin-cloudflare
supabase functions deploy admin-supabase
```

### 2. Add API Tokens in the Dashboard
Navigate to **Admin → Cloud Infra → Security Vault** and paste:
- **Cloudflare API Token** — needs `Zone:Read`, `Cache Purge:Purge`, `Zone Settings:Edit`
- **Supabase Personal Access Token** — from `supabase.com/dashboard/account/tokens`

Tokens are stored encrypted in `system_secrets` with Supabase RLS — only Edge Functions can read them.

---

## Android APK

The app is automatically built as an Android APK on every push to `main` via GitHub Actions.

**Download the latest build:**  
[→ Releases Page](https://github.com/OmarABouajaja/My_portfolio/releases/latest)

> **Note**: You must add two GitHub Secrets to your repository for the build to work with live Supabase data:
> - `VITE_SUPABASE_URL`
> - `VITE_SUPABASE_PUBLISHABLE_KEY`
>
> Go to **Settings → Secrets → Actions → New repository secret**.

---

## Security

| Concern | Mitigation |
|---------|-----------|
| Admin route exposure | Hidden URL + Supabase Auth required |
| API key leakage | All secrets stored in `system_secrets` table with RLS; only Edge Functions can proxy them |
| Client-side secrets | AES-GCM encryption via Web Crypto API in the Encrypted Vault |
| Environment variables | `.env` is gitignored; `.env.example` contains only placeholder values |
| CORS | Edge Functions enforce auth headers; `Access-Control-Allow-Origin` scoped appropriately |

---

## Project Structure

```
My_portfolio/
├── src/
│   ├── components/          # All UI components
│   │   └── admin/           # 28 admin module components
│   ├── pages/               # Route-level pages (Index, Admin, ClientPortal)
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # Supabase client & type definitions
│   ├── config/              # Site-wide config (siteConfig.ts)
│   └── utils/               # Crypto, telemetry utilities
├── supabase/
│   └── functions/           # Deno Edge Functions
├── public/                  # Static assets, PWA icons, robots.txt
├── .github/workflows/       # GitHub Actions CI/CD
├── supabase_schema.sql      # Complete database schema
└── capacitor.config.ts      # Native app configuration
```

---

## License

Distributed under the **MIT License**.  
Copyright © 2026 Omar Abouajaja. All rights reserved.

<div align="center">
<sub>Built with obsessive attention to detail. No templates were harmed in the making of this OS.</sub>
</div>
