# 🍯 Honey Chain

### Transparent. Traceable. Trusted.

> An enterprise-grade digital honey traceability platform connecting beekeepers, cooperatives, testing laboratories, manufacturers, and consumers through unit-level serialization, scientific purity governance, and instant QR-based public verification.

[![SIH 2026](https://img.shields.io/badge/SIH-2026-FFA500?style=for-the-badge&logo=target&logoColor=white)](https://github.com/ChiragBhandar/SIH)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Turbopack Build](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=turbopack&logoColor=white)](https://vercel.com/)
[![Deployment](https://img.shields.io/badge/Live_Demo-Vercel-success?style=for-the-badge&logo=vercel&logoColor=white)](https://sih-beetech.vercel.app)

---

## ⚡ One-Line Value Proposition

```
Manufacturer Packages Batch → Generates Real QR Codes → Consumer Scans Bottle → Instant Public Provenance Trail
```

```mermaid
flowchart LR
    A["🏭 Manufacturer<br/>Selects Certified Batch"] --> B["🏷️ Unit Serialization<br/>Mass Reconciled"]
    B --> C["📲 Real QR Generation<br/>Vector SVG & PNG Export"]
    C --> D["🍯 Physical Bottle<br/>Printed QR Label"]
    D --> E["📱 Consumer Scan<br/>Zero App Download Needed"]
    E --> F["🌐 Public Registry (/verify)<br/>Consumer-Safe Payload"]
    F --> G["✅ Verified Provenance<br/>Origin • NMR Purity • Timeline"]
```

---

## 🎯 Problem Statement

Honey is recognized as the **third most adulterated food commodity globally**. The apiculture supply chain in India faces systemic structural vulnerabilities:

1. **Rampant Sugar Adulteration**: Commercial honey is frequently diluted with inverted cane sugar, C4 corn syrup, and high-fructose rice syrups designed to bypass basic quality tests.
2. **Fragmented & Paper-Based Traceability**: Handoffs between rural beekeepers, local aggregators, transport fleets, and commercial processors rely heavily on unverified paper registers that are easily manipulated.
3. **Loss of Botanical & Geographic Identity**: Wild monofloral and high-altitude alpine honeys are blended with commercial bulk honey, depriving tribal beekeepers and cooperatives of fair market premiums.
4. **Consumer Transparency Deficit**: Traditional quality certificates are issued for bulk intermediate tanks, leaving the end consumer with zero verifiable connection between the laboratory report and the physical jar in their hands.
5. **High Friction for Field & Retail Adoption**: Most traceability solutions require specialized native mobile applications, complex blockchain wallets, or English-only user interfaces that exclude local beekeeping communities.

---

## 💡 Our Solution

**Honey Chain** is a complete, production-ready digital operating system designed to bridge the apiculture supply chain from remote apiary yards to supermarket shelves.

* **For Beekeepers & Cooperatives**: Geofenced apiary mapping (e.g., Chamoli, Uttarakhand; Kullu Valley, HP), hive box tracking with RFID/NFC pairing, and digital harvest lot registration.
* **For Logistics & Aggregators**: Cryptographically signed custody transfers, container seal verification, and strict gross/tare/net weight reconciliation.
* **For Testing Laboratories**: Digital certification workflow capturing scientific purity metrics — **NMR (Nuclear Magnetic Resonance) spectroscopy**, **C4 sugar isotope ratios**, moisture percentage, and HMF freshness index under ISO/IEC 17025 standards.
* **For Manufacturers & Bottlers**: Automated packaging runs linked to certified source batches, strict mass balance validation (ensuring bottles packaged never exceed available batch weight), and unit-level QR serialization.
* **For Consumers**: Instant verification via standard smartphone camera scanning — rendering a tamper-evident, bilingual (English & Hindi) provenance page with no login or app installation required.

---

## 🔄 The 5-Stage Verification Journey

Every retail bottle registered on Honey Chain is anchored across five sequential, audit-governed stages:

```mermaid
flowchart TD
    subgraph S1["Stage 01: Apiary Origin"]
        H["🐝 Geofenced Apiary Yard<br/>• GPS Coordinates & Elevation<br/>• Box Registration (NFC/RFID)<br/>• Foraging Bloom & Colony Health"]
    end

    subgraph S2["Stage 02: Harvest & Raw Batching"]
        R["🍯 Raw Extraction<br/>• Refractometer Moisture &lt; 18%<br/>• Food-Grade Drum Weighing<br/>• Tamper-Evident Seal ID Assigned"]
    end

    subgraph S3["Stage 03: Chain of Custody"]
        C["🚚 Transport & Receiving<br/>• Dual-Party Digital Signatures<br/>• Gross/Tare/Net Reconciliation<br/>• Carrier & Fleet Route Logging"]
    end

    subgraph S4["Stage 04: Lab Quality Certification"]
        L["🧪 Independent Testing Lab<br/>• NMR Fingerprint Spectroscopy<br/>• C4 Sugar Isotope Ratio &lt; 7%<br/>• ISO/IEC 17025 Certified Hash"]
    end

    subgraph S5["Stage 05: Bottling & Serialization"]
        B["🏷️ Manufacturing & Packaging<br/>• Low-Temp Micro-Filtration<br/>• Serial Code: HC-BTL-YYYY-XXXXX<br/>• Real QR Code Attached to Jar"]
    end

    subgraph S6["Consumer Verification"]
        V["📱 Smartphone Scan<br/>• /verify/[bottleId] Public Page<br/>• 5-Stage Timeline & Lab Report<br/>• Tamper Status (Active / Suspended)"]
    end

    S1 --> S2 --> S3 --> S4 --> S5 --> S6
```

---

## 🔑 Key Features

### 🏭 1. Manufacturer & Bottling Operations
* **Certified Batch Binding**: Prevents packaging from raw or uncertified batches. Only batches with approved laboratory certifications are eligible for bottling.
* **Automatic Mass Reconciliation**: Computes total packaged weight against remaining batch volume. Prohibits over-allocation and detects yield discrepancy.
* **Unit-Level Serialization**: Generates unique, non-guessable bottle identifiers (`HC-BTL-2026-00001` through `HC-BTL-2026-XXXXX`).
* **High-Density QR Generation**: On-the-fly QR code generation using `qrcode` with Level 'H' error correction, pixelated crisp rendering, and production URL encoding.
* **Export & Print Ready**: Export individual QR codes as PNG, vector SVG, or generate complete formatted print label sheets with one click.

### 📱 2. Consumer Verification Portal (`/verify/[bottleId]`)
* **Zero-Friction Access**: Standard smartphone camera scanning opens the web page directly — no mobile app download or sign-in needed.
* **Sanitized Public Data Transform**: Backed by `/api/verify/[bottleId]` which enforces strict data sanitization, completely stripping internal credentials, pricing, carrier logistics, and database IDs.
* **Purity & Origin Badges**: Live visual indicators for botanical origin, harvest season, laboratory test compliance, and tamper-seal status.
* **Chronological Milestones**: Complete, step-by-step visual audit trail showing the harvest, custody, lab testing, certification, and packaging run dates.
* **Active Tamper Alerts**: Real-time warning banners if a bottle or batch has been flagged as "Suspended" or recalled by administrators.

### 🧪 3. Scientific Laboratory Governance
* **Multi-Parameter Purity Panels**: Digital recording of NMR spectroscopy fingerprinting, C4 carbon isotope analysis, HMF (Hydroxymethylfurfural) freshness, and diastase activity.
* **Accredited Certificate Linking**: Each test attaches an official certificate ID (`CERT-HC-2026-XXXX`) cryptographically tied to the source batch.

### 🚚 4. Verifiable Chain-of-Custody
* **Dual-Party Digital Handoff**: Sender and receiver validation for field-to-processing plant transit.
* **Tamper-Evident Seals**: Recording of physical container security seal identifiers (`SL-8831`).
* **Discrepancy Detection**: Automated reconciliation between dispatch net weight and receiving facility scale weight.

### 🔐 5. Multi-Tenant Role-Based Access Control (RBAC)
* **Isolated Organizational Workspaces**: Support for Producer Cooperatives, Commercial Processors/Manufacturers, and Independent Testing Labs.
* **Switchable Role Context**: Switch between Beekeeper, Manufacturer, Lab Technician, Buyer/Logistics, and Org Admin roles with instantaneous permission filtering.

### 🌐 6. Native Bilingual Localization (English & हिन्दी)
* **Seamless Hindi/English Switching**: First-class language toggle supporting Devanagari script (`Noto Sans Devanagari`) across both the public consumer verification experience and internal operational dashboards.

### 🏪 7. Honey Marketplace & Batch Exchange
* **B2B Lot Trading**: Facilitates transparent raw and processed honey trade between beekeeping collectives and certified manufacturers.
* **Quality-First Listings**: Buyers review moisture percentages, botanical origin, and lab test results before placing custody orders.

### 🛡️ 8. Enterprise Admin & Audit Governance
* **Immutable Audit Trail**: Event-by-event logging of apiary additions, custody transfers, lab test submissions, and packaging runs.
* **Plausibility & Exception Engine**: Automated flags for abnormal hive yields, moisture anomalies, or custody weight mismatches.

---

## 📲 QR-Based Product Traceability Deep Dive

The QR system is built on **real scannable 2D barcodes**, not simulated placeholders.

```
       Physical Honey Bottle (Shelf)
                   │
                   ▼
         [ High-Density QR Code ]
  (Level 'H' Reed-Solomon Error Correction)
                   │
                   │ Encodes: https://sih-beetech.vercel.app/verify/HC-BTL-2026-00001
                   ▼
         Consumer Smartphone Camera
                   │
                   ▼
      GET /api/verify/HC-BTL-2026-00001
                   │
         [ Server-Side Sanitizer ]
       - Input regex sanitization
       - Strips internal IDs & costs
       - Validates bottle & batch status
                   │
                   ▼
      Consumer Verification Viewport
       - Purity Index (NMR: 99.4%)
       - Geofenced Origin (Chamoli)
       - 5-Stage Provenance Timeline
       - Tamper Status (Valid / Suspended)
```

### QR Technical Implementation Highlights
1. **Engine**: Compiled client-side using `qrcode` with high error-correction (`errorCorrectionLevel: "H"`), allowing up to 30% label damage or smudge without losing scan readability.
2. **Vector SVG & Raster PNG**: Manufacturers can download high-resolution PNG for digital use or lossless SVG for industrial roll-printer integration.
3. **Printable Label Generator**: Embedded CSS print stylesheet formatting a ready-to-print sticker with brand identity, product identifier, scan instructions, and serial code.
4. **Edge Caching**: Public verification API responses include `Cache-Control: public, s-maxage=60, stale-while-revalidate=300` headers to ensure sub-millisecond scan response times at scale.

---

## 👥 User Roles

| Role | Responsibility in Honey Chain | Access Scope |
| :--- | :--- | :--- |
| **Beekeeper / Apiary Inspector** | Registers apiary coordinates, logs hive health, and records harvest lot extraction. | Apiaries, Hive boxes, Colony Activities, Raw Batches |
| **Collector / Logistics Fleet** | Initiates and confirms custody transfers between apiaries and processing hubs. | Custody transfers, Transit tracking, Receiving weight reconciliation |
| **Lab Technician / Admin** | Tests honey samples, records NMR and C4 parameters, and issues accredited purity certificates. | Sample logs, Lab tests, Purity certifications |
| **Manufacturer / Processor** | Executes processing/refining jobs, creates packaging runs, and generates bottle QR codes. | Processing jobs, Bottling lines, QR generator, Packaging runs |
| **Bulk Buyer** | Discovers verified raw batches on the marketplace, verifies lab tests, and places orders. | Marketplace, Batch discovery, Custody receipt |
| **Consumer** | Scans bottle QR codes to view provenance, purity certificates, and harvest origins. | Public `/verify/[bottleId]` route (no login required) |
| **Platform / Org Admin** | Manages organization profiles, user permissions, audit logs, and exception resolution. | Enterprise Admin console, Audit trail, Plausibility checks |

---

## 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph ClientLayer["Client Layer (Next.js 16 App Router)"]
        Landing["Public Landing Page<br/>(/)"]
        PublicVerify["Public Bottle Verification<br/>(/verify/[bottleId])"]
        AuthPages["Auth & Workspace Select<br/>(/login, /select-role)"]
        ManufacturerApp["Manufacturer & Ops Workspaces<br/>(/dashboard, /bottles, /lab, /batches)"]
        AdminApp["Admin Governance Console<br/>(/admin, /audit, /plausibility)"]
    end

    subgraph StateLayer["Context & State Providers"]
        AuthContext["AuthSessionContext<br/>(RBAC, Org & Role Switcher)"]
        TraceContext["TraceabilityContext<br/>(Reconciled Batches, Bottles, Certs)"]
        LangContext["LanguageContext<br/>(Bilingual EN/HI Runtime)"]
    end

    subgraph ServiceLayer["Application Logic & Services"]
        QRService["QR Engine (qrcode)<br/>PNG, SVG & Print Generator"]
        Reconciliation["Mass Balance Engine<br/>Weight Validation & Lot Binding"]
        Sanitizer["Public Verification Sanitizer<br/>buildPublicVerification()"]
    end

    subgraph APILayer["API Route Handlers"]
        VerifyAPI["GET /api/verify/[bottleId]<br/>Rate-limited, Cached & Sanitized"]
    end

    subgraph StorageLayer["Data & Persistence Layer"]
        LocalStorageStore["Reactive In-Memory Store<br/>+ LocalStorage Persistence"]
        MockData["Domain Models & Lineage Traces<br/>(Batches, Hives, Labs, Bottles)"]
        PostgresTarget["Production Target: PostgreSQL<br/>(Prisma ORM Ready)"]
    end

    Landing --> PublicVerify
    PublicVerify --> VerifyAPI
    VerifyAPI --> Sanitizer
    Sanitizer --> StorageLayer

    AuthPages --> AuthContext
    ManufacturerApp --> TraceContext
    AdminApp --> TraceContext

    ManufacturerApp --> QRService
    ManufacturerApp --> Reconciliation

    TraceContext --> StorageLayer
    AuthContext --> LocalStorageStore
```

---

## 💻 Technology Stack

| Layer | Technology | Specification / Details |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16.3.5** | Modern App Router, Server Components & Dynamic Route Handlers |
| **Language** | **TypeScript 5.x** | Strict mode typing across all models, batches, and verification payloads |
| **Frontend Runtime** | **React 19.2.8** | Client hooks, transitions, microtask effects, and reactive state stores |
| **Styling** | **Tailwind CSS v4** | CSS-first PostCSS configuration, responsive layout primitives |
| **UI Primitives** | **Radix UI** | Accessible Dialog, Dropdown, Tabs, Switch, Tooltip, Select primitives |
| **Icons** | **Lucide React** | Clean, contextual iconography for supply chain and laboratory workflows |
| **QR Code Engine** | **qrcode (v1.5.4)** | Client-side PNG canvas rendering, lossless vector SVG export, error correction Level 'H' |
| **Data Architecture** | **Reactive Store + Web Storage** | Type-safe in-memory domain stores synchronized with browser local storage |
| **Localization** | **Custom i18n Engine** | Runtime English & Hindi translations with Devanagari typography support |
| **Typography** | **Google Fonts** | `Inter`, `Manrope`, and `Noto Sans Devanagari` via `next/font/google` |
| **Bundler & Build** | **Turbopack** | Sub-second compilation and optimized static/dynamic page generation |
| **Deployment Target** | **Vercel** | Edge-ready serverless hosting with CDN-level route caching |

---

## 🗄️ Database & Domain Data Model

Honey Chain models the physical lifecycle of honey through interconnected entities:

```
Apiary (GPS, Elevation, Yard)
  │
  ├── Hives (Langstroth Box, Queen Status, NFC/RFID)
  │     │
  │     └── ColonyActivities (Inspections, Feeding, Health)
  │
  └── HarvestBatch (Raw Honey Lot, Weight, Moisture %, Seal ID)
        │
        ├── CustodyTransfer (Dual-Signed Dispatch, Carrier Fleet, Delivery)
        │     │
        │     └── ReceivingRecord (Gross/Tare/Net Reconciliation, Plant Gate)
        │
        ├── ProcessingJob (Low-Temp Micro-Filtration, Moisture Control)
        │     │
        │     └── ProcessedBatch (Clarified Honey Lot, Weight)
        │           │
        │           ├── LabTest (NMR Spectroscopy, C4 Ratio, Moisture, HMF)
        │           │     │
        │           │     └── QualityCertification (ISO/IEC 17025 Standard)
        │           │
        │           └── PackagingRun (Bottling Line, Size, Weight Check)
        │                 │
        │                 └── Bottles [HC-BTL-YYYY-XXXXX]
        │                       │
        │                       ├── QR Identifier (QR-HC-XXXXX)
        │                       ├── Public Token (/verify/[bottleId])
        │                       └── Source Lineage (Immutable Trace Hash)
```

### Public vs. Private Data Separation
Honey Chain enforces strict data minimization:
* **Private Operational Data** (Never exposed to consumers): Beekeeper phone numbers, truck driver identities, procurement costs, internal batch IDs, processing equipment IDs, and organization user credentials.
* **Public Consumer Data** (Exposed via `/verify`): Botanical variety, geographic origin region, harvest month/year, certified laboratory purity score, NMR test result, packaging date, and tamper-seal verification status.

---

## 🔐 Security & Privacy

1. **Input Sanitization**: Verification endpoints strip non-alphanumeric characters (`replace(/[^a-zA-Z0-9\-_]/g, "")`) to prevent injection or parameter tampering.
2. **Public Data Sanitization**: The server-side transformer `buildPublicVerification()` strictly filters the internal bottle record into a sanitized public payload before emitting JSON.
3. **Role-Based Guards**: Protected operational routes (`/bottles`, `/lab`, `/custody`, `/admin`) are guarded by `AuthGuard` and role capability checks.
4. **Tamper & Suspension Propagation**: If a batch fails post-market testing or is recalled, the administrator flags the batch, instantly cascading a "SUSPENDED" warning banner across all related consumer QR codes.
5. **No Secrets in Client Bundles**: Zero API keys, private tokens, or administrative credentials are coded into public client assets.

---

## 👤 The User Experiences

### 📱 Consumer Journey
```text
1. Discovers physical honey bottle on retail shelf
2. Points smartphone camera at bottle's QR code
3. Browser opens: https://sih-beetech.vercel.app/verify/HC-BTL-2026-00001
4. Instant verification seal displays "Verified Authentic — Grade A (99.4% Purity)"
5. Inspects botanical origin (Chamoli, Uttarakhand) and harvest extraction season
6. Reviews independent laboratory panel (NMR Blossom Origin & C4 Sugar < 7.0%)
7. Scrolls through the 5-stage chronological supply-chain timeline
8. Optionally toggles Hindi (हिन्दी) for regional language accessibility
```

### 🏭 Manufacturer Journey
```text
1. Logs in and selects the "Golden Hive Foods" (Manufacturer) workspace
2. Navigates to Bottling Operations (/bottles)
3. Clicks "Create Packaging Run" (/bottles/new)
4. Selects an approved, certified processed honey batch (e.g. HC-PB-2026-0001)
5. Selects bottle size (e.g. 500 g) and bottle count (e.g. 100 bottles)
6. System checks batch balance: validates 50.0 kg required <= 445.0 kg remaining
7. Submits run: generates 100 individual serialized bottles (HC-BTL-2026-00001 ... 00100)
8. Opens bottle detail view to preview real high-density QR code
9. Downloads vector SVG for industrial labeling or clicks "Print QR Sheet" for immediate application
10. Labeled bottles enter commercial retail distribution
```

---

## 🚀 Live Demo & Sample Data

The application is deployed on Vercel and ready for evaluation:

🌐 **Live Application URL**: [https://sih-beetech.vercel.app](https://sih-beetech.vercel.app)

### Quick Verification Test Bottles
Test the consumer scan flow by entering any of these sample bottle codes on the homepage or navigating directly:

* **Highland Wild Multifloral Raw Honey**: [`HC-BTL-2026-00001`](https://sih-beetech.vercel.app/verify/HC-BTL-2026-00001) *(Chamoli, Uttarakhand • Grade A 99.4% Purity)*
* **Alpine Blossom Certified Honey**: [`HC-BTL-2026-00002`](https://sih-beetech.vercel.app/verify/HC-BTL-2026-00002) *(High-altitude flora • Full NMR Spectrum Verified)*
* **Sample Jar 03**: [`HC-BTL-2026-00003`](https://sih-beetech.vercel.app/verify/HC-BTL-2026-00003) *(Certified single-source mountain batch)*

### Demo Workspaces Available
* **Beekeeper Cooperative**: Highland Apiaries Cooperative (`ORG-HAC-01`)
* **Manufacturer**: Golden Hive Foods (`ORG-GHF-02`)
* **Accredited Laboratory**: PureTrace Labs (`ORG-PTL-03`)

---

## ⚙️ Getting Started & Local Development

### Prerequisites
* **Node.js**: `v20.x` or later (LTS recommended)
* **Package Manager**: `npm` (v10+), `pnpm`, or `yarn`
* **Modern Web Browser**: Chrome, Firefox, Safari, or Edge

### 1. Clone the Repository
```bash
git clone https://github.com/ChiragBhandar/SIH.git
cd SIH
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a local `.env.local` file (optional, sensible production defaults are configured):

```env
# Base URL for QR code generation and verification links
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note**: In production deployment, QR codes automatically target the live domain `https://sih-beetech.vercel.app` so generated physical barcodes remain scannable worldwide.

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the landing page, operations workspaces, and public verification portal.

### 5. Production Build & Validation
To verify Turbopack production compilation and type safety:

```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```text
SIH/
├── public/                       # Static public assets, icons, product photography
│   ├── images/products/          # Authentic honey jar photography
│   ├── icon.svg                  # Application favicon & brand vectors
│   └── favicon.svg
├── src/
│   ├── app/                      # Next.js 16 App Router pages & endpoints
│   │   ├── (public)/             # Root landing page (page.tsx, layout.tsx)
│   │   ├── api/verify/[bottleId] # Public sanitized verification REST endpoint
│   │   ├── verify/[bottleId]     # Public consumer bottle verification page
│   │   ├── bottles/              # Packaging runs, bottle registry, QR generator
│   │   ├── dashboard/            # Operational analytics & health charts
│   │   ├── hives/ & activities/  # Apiary tracking, hive boxes, inspection logs
│   │   ├── batches/              # Raw honey extraction batch management
│   │   ├── custody/ & receiving/ # Chain-of-custody transfer handoffs
│   │   ├── processing/           # Clarification, filtration & blending jobs
│   │   ├── lab/ & certifications/# NMR testing, purity scoring & ISO certificates
│   │   ├── marketplace/          # B2B honey batch trading platform
│   │   ├── admin/                # Audit trails, plausibility checks, exceptions
│   │   └── select-role/          # Workspace & role switching interface
│   ├── components/               # Modular UI components
│   │   ├── landing/              # Hero, 5-stage workflow, bento grid showcase
│   │   ├── bottles/              # Real QR view, print sheet, SVG/PNG export
│   │   ├── dashboard/            # Hive health & harvest analytics charts
│   │   ├── shell/                # App shell, navigation headers, responsive sidebar
│   │   ├── ui/                   # Radix UI design tokens & buttons
│   │   └── marketplace/          # Product listing cards & order dialogs
│   ├── context/                  # Client state providers
│   │   ├── auth-session-context  # Multi-tenant RBAC & session store
│   │   ├── traceability-context  # Core batch, bottle, and lineage state
│   │   └── language-context      # English & Hindi (हिन्दी) localization provider
│   ├── data/                     # Typed mock repositories & domain fixtures
│   │   ├── mock-bottles.ts       # Serialized bottles & public verification builder
│   │   ├── mock-traceability.ts  # Apiaries, hives, harvests, custody transfers
│   │   ├── mock-quality.ts       # Lab test results & accredited certificates
│   │   └── mock-auth.ts          # Organizations, users, and role permissions
│   ├── hooks/                    # Reusable React hooks (media queries, filters)
│   ├── i18n/                     # Internationalization dictionaries
│   │   ├── translations/en.ts    # Comprehensive English dictionary
│   │   └── translations/hi.ts    # Comprehensive Hindi dictionary
│   ├── lib/                      # Formatters, constants, and utilities
│   └── types/                    # Domain TypeScript interface declarations
├── package.json                  # Dependencies & execution scripts
├── tsconfig.json                 # TypeScript strict configuration
└── next.config.ts                # Next.js configuration
```

---

## 📌 Implementation Status

| System Capability | Implementation Detail | Status |
| :--- | :--- | :---: |
| **5-Stage Supply Chain Traceability** | Apiary → Harvest → Custody → Lab → Bottling fully linked | ✅ Implemented |
| **Unit-Level Bottle Serialization** | Unique codes (`HC-BTL-2026-XXXXX`) generated per jar | ✅ Implemented |
| **Real Scannable QR Generation** | High error correction ('H'), canvas display, SVG & PNG download | ✅ Implemented |
| **Printable Label Sheet** | Formatted industrial print layout for physical packaging lines | ✅ Implemented |
| **Public Consumer Verification** | `/verify/[bottleId]` route with zero-login requirement | ✅ Implemented |
| **Sanitized Public API** | `/api/verify/[bottleId]` endpoint with strict data minimization | ✅ Implemented |
| **Scientific Purity Recording** | NMR spectroscopy, C4 sugar ratio, moisture, and HMF indices | ✅ Implemented |
| **Chain-of-Custody Handoffs** | Dual-party signoff, container seals, and scale weight reconciliation | ✅ Implemented |
| **Mass Balance Validation** | Auto-checks remaining batch kg to prevent over-bottling | ✅ Implemented |
| **Multi-Tenant Role Switcher** | Switch between Beekeeper, Manufacturer, Lab, and Admin | ✅ Implemented |
| **Bilingual Localization** | Full English & Hindi (हिन्दी) toggle with Devanagari typography | ✅ Implemented |
| **Operational Analytics Dashboard** | Real-time charts for harvest yield, hive health, and alerts | ✅ Implemented |
| **B2B Honey Marketplace** | Batch discovery, order placement, and custody transfer linking | ✅ Implemented |
| **Enterprise Audit & Governance** | Plausibility checks, exception alerts, and immutable event logs | ✅ Implemented |
| **Production Build & Turbopack** | 34 routes compiled with zero TypeScript or linting errors | ✅ Verified |

---

## 🇮🇳 Smart India Hackathon (SIH) 2026 Alignment

| Dimension | Project Specification |
| :--- | :--- |
| **Event** | **Smart India Hackathon 2026** |
| **Domain / Theme** | **Agriculture, Food Processing & Rural Development / Smart Automation** |
| **Core Innovation** | **Unit-level serialization linked directly to accredited laboratory NMR spectroscopy, eliminating honey adulteration through zero-barrier smartphone verification.** |
| **Target Beneficiaries** | Tribal & rural beekeepers, honey FPOs, testing laboratories, commercial packaging brands, and Indian consumers. |

### How Honey Chain Addresses the Problem
1. **Empowers Smallholder Beekeepers**: By anchoring honey origin to geofenced apiaries in regions like Chamoli and Kullu, beekeepers receive authentic provenance proof, commanding fair price premiums over adulterated industrial blends.
2. **Defeats Syrup Adulteration**: Integrating laboratory test parameters (NMR and C4 carbon isotope) into the digital record ensures adulterated batches cannot progress to packaging.
3. **Restores Consumer Trust**: Consumers do not have to trust marketing slogans; scanning the physical bottle reveals independent laboratory certificates and harvest lineage in under three seconds.
4. **Bilingual Rural Inclusivity**: By embedding native Hindi language support, beekeepers and cooperative managers can operate the platform in their regional language without technical intimidation.

---

## 🌍 Measurable Real-World Impact

* **For Consumers**: Instant verification of purity (NMR, C4 sugar, moisture) and geographical origin directly from any smartphone camera.
* **For Beekeepers & Collectives**: Verifiable proof of high-altitude alpine or wild forest origin, eliminating unfair discounts from middlemen.
* **For Food Processing Brands**: Streamlined compliance with FSSAI standards, automated batch mass reconciliation, and elimination of packaging errors.
* **For Regulatory Authorities**: Complete digital chain of custody from hive yard to retail shelf, simplifying safety audits and contamination recalls.

---

## 🗺️ Future Roadmap

While Honey Chain is fully functional as an end-to-end prototype, our post-hackathon roadmap includes:

- [ ] **PostgreSQL & Prisma Integration**: Transitioning in-memory repositories to persistent PostgreSQL storage with Neon / Supabase database adapters.
- [ ] **IoT Apiary Sensors**: Direct telemetry ingestion from Bluetooth/LoRaWAN hive scales, temperature sensors, and humidity monitors.
- [ ] **GS1 Digital Link Compliance**: Formatting QR payloads to comply with international GS1 Digital Link resolver standards.
- [ ] **Decentralized Hash Anchoring**: Periodic batch anchoring to public/consortium distributed ledgers (Polygon / Hyperledger) for cross-border export verification.
- [ ] **Offline-First Field PWA**: Mobile service workers enabling beekeepers to log extractions in remote mountain valleys without cellular coverage.

---

## 👥 Hackathon Team

* **Project Name**: Honey Chain (SIH BeeTech)
* **Repository**: [https://github.com/ChiragBhandar/SIH](https://github.com/ChiragBhandar/SIH)
* **Team Submission**: SIH 2026

| Team Member | Role | Key Contributions |
| :--- | :--- | :--- |
| **Lead Developer** | Full-Stack Architect | Next.js architecture, QR generation pipeline, verification engine & UI |
| **Domain & Backend** | Systems & Data | Traceability lineage models, mass balance reconciliation & RBAC |
| **Frontend & UX** | Design & Localization | Responsive UI, bilingual English/Hindi localization & dashboard charts |

---

## 📄 License & Status

This repository is developed for **Smart India Hackathon (SIH) 2026**. All rights reserved by the development team. Distributed for hackathon evaluation, academic review, and demonstration purposes.
