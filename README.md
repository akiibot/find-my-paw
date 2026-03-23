# Find My Paw 🐾

A privacy-first SaaS MVP that helps lost pets return home instantly using stateless QR tags.

## 🚀 Features
- **Stateless QR Codes:** Unique tags that redirect via the backend, meaning one physical tag lasts forever.
- **Privacy-First Profiles:** General pet data is visible when safe, but contact info is strictly hidden until the owner toggles "Lost Mode".
- **Real-time Missing Alerts:** When an owner activates Lost Mode, the scan page instantly becomes a high-urgency missing poster with click-to-call, WhatsApp, and email actions.
- **Scan Tracking:** Passive metric tracking for every time a collar is scanned.
- **Vercel-Ready:** Built on Next.js 14 App Router, Auth.js, Tailwind, and Prisma.

## 🛠️ Local Development Setup

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database (e.g., local Postgres app, Docker, Supabase, or Vercel Postgres)

### 2. Environment Variables
Create a local `.env.local` file by copying the example:
```bash
cp .env.example .env.local
```
Then, fill in your database connection string and Auth.js secrets.
- `AUTH_SECRET`: Generate one using `npx auth secret`
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Get these from Google Cloud Console's OAuth section.

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Database Schema
Push the Prisma schema to your PostgreSQL database:
```bash
npx prisma db push
```
*(Note: We use `db push` for rapid MVP prototyping instead of explicit migrations. Once in production, switch to `migrate dev`.)*

### 5. Start the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

## 🎨 Tech Stack
- **Next.js 14** (React Server Components, Server Actions)
- **TypeScript**
- **Tailwind CSS + shadcn/ui** (Premium UI elements)
- **Prisma** (PostgreSQL ORM)
- **NextAuth.js (v5 Beta)** (Authentication)
- **Lucide React** (Icons)
- **qrcode.react** (Generating QR codes as SVGs)
