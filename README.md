<parameter name="CodeContent"># Find My Paw 🐾

> The instant, secure QR-based ID tag for the modern pet.

A privacy-first, full-stack SaaS platform built on Next.js that enables pet owners to generate a smart QR tag for their pet's collar. When a stranger scans the tag, they are instantly shown the pet's profile and — if `Lost Mode` is active — the owner's emergency contact information and a click-to-call button, with **no app download required**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/akiibot/find-my-paw)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Stateless QR Tags** | QR codes link to a permanent URL slug. No hardware ever needs to be replaced or reprinted. |
| **Privacy-First Profiles** | Emergency contact info is completely hidden by default. It is only revealed when the owner activates `Lost Mode`. |
| **One-Click Emergency Broadcast** | Toggling `Lost Mode` instantly transforms the pet's public page into a high-urgency missing poster with click-to-call, WhatsApp deep-link, and mailto actions. |
| **Finder's Reward Display** | Owners can optionally offer and publicly display a finder's reward with a localized currency symbol. |
| **Passive Scan Tracking** | Every QR tag scan is passively logged with anonymised IP hashes and User-Agent strings. |
| **Supabase Photo Storage** | Pet profile photos are stored in a dedicated Supabase Storage bucket with public CDN delivery. |
| **Google OAuth Sign-In** | Secure, one-click authentication via Google, powered by Auth.js v5. |
| **QR Code Generation** | Owners can view and download the printable QR code for their pet's tag from the dashboard. |
| **Dark Mode** | Full semantic OKLCH dark mode support via Tailwind CSS tokens. |

---

## 🛠️ Tech Stack

### Core Framework
- **[Next.js 15](https://nextjs.org/)** — App Router, React Server Components, Server Actions (Turbopack)
- **[TypeScript](https://www.typescriptlang.org/)** — End-to-end type safety

### Styling & UI
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first styling with OKLCH semantic tokens
- **[shadcn/ui](https://ui.shadcn.com/)** — Accessible, headless component library
- **[Lucide React](https://lucide.dev/)** — SVG icon library

### Database & ORM
- **[Prisma](https://www.prisma.io/)** — Type-safe PostgreSQL ORM
- **[PostgreSQL](https://www.postgresql.org/)** — Relational database (hosted on Supabase or Vercel Postgres)
- **[Supabase Storage](https://supabase.com/docs/guides/storage)** — Pet photo CDN storage

### Authentication
- **[Auth.js v5 (NextAuth)](https://authjs.dev/)** — Session management with database adapter
- **Google OAuth 2.0** — Social sign-in provider

### QR Codes
- **[qrcode.react](https://www.npmjs.com/package/qrcode.react)** — Client-side QR code generation as scalable SVG

---

## 🗄️ Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  pets          Pet[]
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Pet {
  id            String   @id @default(cuid())
  ownerId       String
  owner         User     @relation(...)

  // Unique Identifiers
  nanoId        String   @unique   // Short tag ID  (e.g. "a1b2c3d4")
  publicId      String   @unique   // URL slug       (e.g. "luna-a1b2")

  // Profile
  name          String
  photoUrl      String?
  breed         String?
  age           String?
  color         String?
  notes         String?  @db.Text
  medicalNotes  String?  @db.Text
  behaviorNotes String?  @db.Text

  // Emergency / Lost Mode
  lostMode      Boolean  @default(false)
  rewardEnabled Boolean  @default(false)
  rewardText    String?
  lastSeenArea  String?

  // Owner Contact (hidden unless lostMode = true)
  ownerPhone    String?
  whatsapp      String?
  ownerEmail    String?

  scans         ScanEvent[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model ScanEvent {
  id        String   @id @default(cuid())
  petId     String
  pet       Pet      @relation(...)
  ipHash    String?  // Anonymized for privacy
  userAgent String?
  createdAt DateTime @default(now())
}
```

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Marketing landing page
│   ├── login/                    # Google OAuth sign-in page
│   ├── dashboard/
│   │   ├── layout.tsx            # Glassmorphic nav shell
│   │   ├── page.tsx              # Pet card grid
│   │   ├── new/                  # Create pet form
│   │   └── pet/[petId]/
│   │       ├── page.tsx          # Full pet editor + Lost Mode command center
│   │       └── qr/               # QR code download page
│   ├── p/[publicId]/
│   │   └── page.tsx              # Public-facing pet profile (QR scan destination)
│   └── actions/
│       └── pet.ts                # Server Actions: createPet, updatePet, deletePet
├── components/
│   ├── ImageUploader.tsx         # Supabase Storage drag-and-drop uploader
│   ├── InteractiveTag.tsx        # 3D QR tag hero component (landing page)
│   └── ui/                       # shadcn/ui primitives
└── lib/
    ├── auth.ts                   # Auth.js config with Prisma adapter
    ├── prisma.ts                 # Prisma client singleton
    └── supabase.ts               # Supabase Storage client
```

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- A PostgreSQL database (local, Docker, Supabase, or Vercel Postgres)
- A Google Cloud project with OAuth 2.0 credentials
- A Supabase project with a public `pet-photos` storage bucket

### 1. Clone the repository
```bash
git clone https://github.com/akiibot/find-my-paw.git
cd find-my-paw
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env.local
```

Fill in your `.env.local`:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@host:5432/findmypaw?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/findmypaw"

# Auth.js — generate with: npx auth secret
AUTH_SECRET="your-auth-secret"

# Google OAuth — from console.cloud.google.com
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Supabase Storage — from supabase.com/dashboard
NEXT_PUBLIC_SUPABASE_URL="https://<project>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 4. Push the database schema
```bash
npx prisma db push
```

> For production, switch to `npx prisma migrate deploy`.

### 5. Start the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔐 Authentication Setup (Google OAuth)

1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Create a new project → **APIs & Services** → **Credentials** → **Create OAuth Client ID**
3. Application type: **Web application**
4. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (local)
   - `https://your-domain.com/api/auth/callback/google` (production)
5. Copy the Client ID and Secret into `.env.local`

---

## ☁️ Supabase Storage Setup

1. Go to [supabase.com](https://supabase.com) → your project → **Storage**
2. Click **New bucket**, name it exactly `pet-photos`
3. Enable the **Public bucket** toggle
4. Go to **Project Settings** → **API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🌐 Deployment (Vercel)

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com/new)
3. Add all environment variables from `.env.local` to the Vercel project settings
4. Deploy — Vercel auto-detects Next.js and handles everything else

---

## 🗺️ Use Cases

- **Pet collar tags** — Attach a printed QR tag to any pet collar or harness
- **Animal shelters** — Use a single QR tag per kennel to store animal info
- **Pet events** — Temporary tags for dog shows or animal fairs
- **Foster networks** — Foster families can quickly share pet info with vets and adopters via a scannable link

---

## 🧭 Roadmap

- [ ] Multi-image galleries per pet
- [ ] Map-based last-seen location picker
- [ ] SMS/email alert to owner on QR scan
- [ ] NFC tag support (write `publicId` slug to any NFC chip)
- [ ] Printable PDF tag sheet generator
- [ ] Aggregated scan analytics dashboard

---

## 📄 License

MIT — free to use, modify, and distribute.

---

<p align="center">Built with ❤️ for every pet that deserves to come home.</p>
