# Med AI — Multimodal Campus Emergency & First-Aid Companion

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![PostgreSQL RLS](https://img.shields.io/badge/PostgreSQL-Row_Level_Security-336791.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Med AI** is a multimodal AI-powered campus safety and first-aid companion designed for university students, resident advisors (RAs), laboratory assistants, and campus safety teams. It provides rapid, safety-bounded triage guidance for minor medical incidents, chemical spills, sports injuries, and physical safety situations with hands-free voice assistance and verified two-step escalation protocols.

---

## 📌 Problem Statement

During minor medical emergencies and physical safety incidents on university campuses—such as chemistry lab acid splashes, dormitory lacerations, sports injuries, or heat exhaustion—students and first responders face critical challenges:
1. **Panic & Inaction:** Responders often freeze or apply harmful, anecdotal home remedies (e.g., applying butter or ice to burns, rubbing chemical-exposed eyes).
2. **Language Barriers:** In diverse international university environments, instructions in English only can slow response times for non-native speakers.
3. **Unverified Alerts:** Accidental emergency dispatches cause panic and strain campus emergency services, while delayed escalation in critical moments puts students at risk.
4. **Hands-Occupied Responders:** During first-aid delivery, a responder's hands are busy applying pressure or flushing eyewash stations, making touch-based mobile UIs impractical.
5. **Lack of Compliance Logging:** Incidents often go undocumented, preventing Environmental Health & Safety (EH&S) and university health clinics from conducting safety reviews.

**Med AI solves this** by offering an evidence-based, multimodal decision-support companion that analyzes text descriptions and photos, reads clear containment protocols aloud, offers instant speed dials, enforces two-step alert verification, and maintains compliance-ready audit logs.

---

## 🌟 Key Features

### 1. 🔍 Multimodal Incident Triage
- **Text, Photo & Live Camera Input:** Describe symptoms in natural language, upload reference photos (drag-and-drop), or snap live photos with your webcam/mobile camera (`CameraCaptureModal`).
- **Safety-Bounded Protocols:** Generates clear, numbered immediate containment steps, explicit contraindications (*What NOT to do*), and red-flag escalation triggers.
- **One-Click Demo Presets:** Quick-test scenarios for laboratory chemical splashes, athletic ankle sprains, and minor lacerations.

### 2. 🌐 Bilingual Support (English & Hindi)
- Real-time toggling between **English** and **Hindi (हिन्दी)** across all triage evaluations, interface controls, and safety protocols.

### 3. 🎙️ Hands-Free Voice Guidance (Text-to-Speech)
- Integrated Web Speech API (`window.speechSynthesis`) reads critical step-by-step instructions aloud in English or Hindi, allowing responders to listen without touching their device.

### 4. 🚨 Two-Step Alert Escalation & Emergency Speed Dial
- **Explicit Verification:** Requires student review and confirmation before sending notifications, preventing accidental dispatches.
- **Direct Speed Dialers:** One-tap calling for **24/7 Campus Safety Escorts**, **National Emergency (911 / 112)**, and **Poison Control (1-800-222-1222)**.
- **GPS Location Copier:** One-click GPS coordinates and dorm room copier for emergency dispatchers.

### 5. 📖 Campus First-Aid Protocol Handbook
- Evidence-based quick-reference protocols for:
  - **Hands-Only Adult CPR** (Cardiac emergency)
  - **Lab Chemical Eye Splash** (Chemical / Eyewash station guide)
  - **Thermal Burns & Scalds** (Trauma response)
  - **Severe Allergic Reaction / Anaphylaxis** (EpiPen guide)
  - **Heat Exhaustion & Stroke** (Environmental safety)
- Categorized tabs with voice read-aloud support.

### 6. 🗄️ Audit Trail & Compliance Export
- Filterable historical log of past triage evaluations scoped exclusively to the authenticated user.
- Export audit records to **CSV Spreadsheet** (for campus health center & EH&S compliance) and **Full JSON Backup**.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend Framework** | [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/) | High-performance SPA with fast development and build times |
| **Language** | [TypeScript 5.x](https://www.typescriptlang.org/) | Strict type safety across components, models, and services |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/) | Clean, responsive design with high-contrast accessibility |
| **Speech & Media** | Web Speech API + Web MediaDevices | In-browser TTS audio readout and live webcam snapshot capture |
| **AI Triage Engine** | [Google Gemini API](https://ai.google.dev/) (`@google/genai`) | Multimodal vision & text safety-bounded triage analysis |
| **Database & Auth** | [Supabase](https://supabase.com/) / [PostgreSQL](https://www.postgresql.org/) | Relational database with per-user Row-Level Security (RLS) |

---

## 📁 Project Structure

```
├── public/                     # Static icons and assets
├── src/
│   ├── components/
│   │   ├── alerts/             # Alert confirmation modal & verified dispatch logic
│   │   ├── auth/               # User authentication & profile switching
│   │   ├── contacts/           # Emergency contacts CRUD management
│   │   ├── dashboard/          # Multimodal triage workspace, camera modal, speed dial & handbook
│   │   ├── database/           # PostgreSQL schema explorer & documentation modal
│   │   ├── history/            # Searchable triage audit trail & CSV/JSON export modal
│   │   ├── landing/            # Overview landing page & feature showcase
│   │   ├── layout/             # Navigation header, footers, and view router
│   │   └── ui/                 # Reusable Button, Card, Badge, and Notice components
│   ├── context/                # AuthContext & user session state providers
│   ├── services/               # Gemini AI triage service & Supabase/Local database service
│   ├── types.ts                # Shared TypeScript interfaces & types
│   ├── main.tsx                # Application root entry
│   └── App.tsx                 # Core application state & navigation router
├── schema.sql                  # PostgreSQL & Supabase database schema with RLS policies
├── supabase-schema.sql         # Supabase initialization script
├── metadata.json               # Application metadata, title, and frame permissions
├── vite.config.ts              # Vite bundler configuration
└── package.json                # Project dependencies and build scripts
```

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** (or yarn / pnpm)

### Step-by-Step Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/med-ai.git
   cd med-ai
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to create your local `.env` file:
   ```bash
   cp .env.example .env
   ```
   Populate the variables:
   ```env
   # Google Gemini API Key
   GEMINI_API_KEY=your_gemini_api_key_here

   # (Optional) Supabase Database Credentials
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Lint and Typecheck:**
   ```bash
   npm run lint
   ```

---

## 🗄️ Database Setup (PostgreSQL / Supabase)

To provision the database with complete Row-Level Security (RLS) isolation:

1. Open your **Supabase Dashboard** (or any PostgreSQL management tool).
2. Navigate to the **SQL Editor**.
3. Run the SQL statements found in [`schema.sql`](./schema.sql).
4. The schema initializes the following tables with strict per-user RLS policies:
   - `profiles`: User information and role definitions (Student, RA, Lab Tech, First Responder).
   - `emergency_contacts`: Designated emergency contacts with primary toggling.
   - `incidents`: Multimodal incident reports, descriptions, and image data.
   - `guidance`: Immediate steps, contraindications, and escalation criteria.
   - `alert_logs`: Audit log of verified emergency alert dispatches.

---

## 🚢 Deployment Guide

### Option 1: Static Hosting (Vercel, Netlify, Cloudflare Pages)
1. Build the production static bundle:
   ```bash
   npm run build
   ```
2. The compiled assets will be output to the `dist/` directory.
3. Deploy `dist/` to any static host with standard SPA rewrite rules (`/* -> index.html`).

### Option 2: Google Cloud Run / Docker
1. Ensure the container serves on port `3000`.
2. Build and run using the production start command:
   ```bash
   npm run build
   npm start
   ```

---

## ⚠️ Medical & Safety Disclaimer

> **CRITICAL:** **Med AI is an informational decision-support and first-aid containment tool intended solely for minor campus situations.** It does **NOT** provide certified medical diagnoses and does **NOT** substitute for professional emergency medical technicians (EMTs), campus paramedics, or licensed physicians. If an individual is unconscious, experiencing severe uncontrolled bleeding, chest pain, or difficulty breathing, immediately dial **911 / 112** or contact campus emergency services.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
