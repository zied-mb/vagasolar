<div align="center">

# VagaSolar

### Photovoltaic Simulation Engine & Administrative CRM — MERN Stack

**A full-stack, component-driven web platform that automates solar energy audits, generates financial projections calibrated to live STEG tariff data, and pipelines qualified leads into a JWT-secured administrative CRM — engineered for the Tunisian solar market.**

[![React](https://img.shields.io/badge/React-18.2.0-20232a?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Runtime-6DA55F?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-404d59?style=flat-square&logo=express&logoColor=61DAFB)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8.3-4ea94b?style=flat-square&logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-jsonwebtoken_9.0-000000?style=flat-square&logo=JSON%20web%20tokens)](https://jwt.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-1.41.3-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.19.2-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)

</div>

---

## Project Overview

VagaSolar is a full-scale MERN application built for the Tunisian solar energy market. The platform serves two distinct concerns from a single deployable system:

1. **Public Solar Simulator** — A multi-step form that collects household consumption data, fetches the current STEG tariff configuration from the database, and executes a full residential bill decomposition to produce financial and technical projections (payback period, ROI, kWp sizing, panel count). Results are rendered as interactive charts via Recharts and exportable as a client-generated PDF.

2. **Administrative CRM** — A JWT-protected dashboard that handles the full lead lifecycle: from simulator-generated lead capture through pipeline status management, to `.xlsx` export. It also provides live CRUD control over all dynamic content (projects, testimonials) and directly mutates the STEG tariff singleton document that drives the simulator's calculations.

The architecture enforces a clean separation of concerns: all public data is served from MongoDB at runtime, eliminating static data files and decoupling content from deploys.

---

## Directory Architecture

### Frontend (`/frontend/src/`)

```text
src/
├── App.jsx                      # Root: BrowserRouter, lazy routes, dark mode state
├── index.js                     # React DOM entry point
├── admin/
│   ├── components/
│   │   ├── AdminLayout.jsx      # Persistent sidebar + Outlet wrapper for /admin sub-routes
│   │   └── ProtectedRoute.jsx   # Token validation guard; redirects unauthenticated users
│   └── pages/
│       ├── AdminDashboard.jsx   # Aggregated KPIs and recent activity feed
│       ├── AdminLeadDetail.jsx  # Full audit result reconstruction + status/notes editor
│       ├── AdminLeads.jsx       # Paginated lead list with status filter and text search
│       ├── AdminLogin.jsx       # Credential submission → POST /api/auth/login
│       ├── AdminMessages.jsx    # Contact form submissions inbox
│       ├── AdminProjects.jsx    # Project CRUD with Cloudinary image management
│       ├── AdminStegRates.jsx   # Live mutation of the StegRate singleton document
│       ├── AdminSubscribers.jsx # Newsletter subscriber list
│       └── AdminTestimonials.jsx
├── components/
│   ├── common/                  # Shared loading states and skeleton screens
│   ├── layout/
│   │   ├── Header/              # Navigation with dark mode toggle
│   │   ├── Footer/
│   │   └── ScrollToTopButton.jsx
│   ├── pages/
│   │   └── NotFound.jsx
│   ├── sections/
│   │   ├── About/               # AboutVisual.jsx + animated stat counters
│   │   ├── Contact/             # Form component → POST /api/messages
│   │   ├── Hero/                # HeroContent.jsx + HeroVisual solar grid animation
│   │   ├── Projects/            # Gallery, ProjectDetail, ProjectFullGallery
│   │   ├── Services/
│   │   └── Testimonials/
│   ├── simulator/
│   │   ├── SimulatorForm.jsx    # Multi-step form shell (3 steps)
│   │   ├── LeadCaptureForm.jsx  # Lead gate between simulation and results
│   │   ├── ResultDashboard.jsx  # Recharts visualization of simulation output
│   │   ├── PrintTemplate.jsx    # DOM node used as source for html2canvas PDF export
│   │   └── ButtonSimulateur.jsx # CTA trigger for the simulator modal
│   └── ui/
│       └── Notification.jsx     # Real-time Socket.IO toast renderer
├── constants/
│   ├── about.js                 # Static copy for the About section
│   ├── navigation.js            # Nav link definitions
│   ├── services.js              # Service card definitions
│   └── simulator.js             # Simulator step configuration constants
├── hooks/
│   ├── useSimulator.js          # Core simulation engine: tariff calc + flow state machine
│   ├── useStats.js              # Fetches aggregated stats from /api/stats
│   ├── useContactForm.js        # Contact form state and submission logic
│   ├── useGallery.js            # Fetches and manages projects from /api/projects
│   ├── useScrollSection.js      # IntersectionObserver for viewport-triggered animations
│   └── useStatCycle.js          # Animated number cycling for stat counters
├── services/
│   ├── api.js                   # Axios instance: baseURL, withCredentials, 401 interceptor
│   └── dataService.js           # Domain-specific fetch wrappers (getStegRates, getProjects…)
└── utils/
    └── scrollUtils.js           # Shared scroll helper utilities
```

### Backend (`/backend/`)

```text
backend/
├── server.js                    # Entry point: security middleware stack, route mounting
├── config/
│   └── db.js                    # Mongoose connection with retry logic
├── controllers/
│   ├── authController.js        # Login, logout, session check
│   ├── leadController.js        # Lead CRUD, status patch, .xlsx export
│   ├── messageController.js     # Contact submissions + Socket.IO broadcast
│   ├── projectController.js     # Project CRUD + Cloudinary image handling
│   ├── statsController.js       # Aggregated public stats
│   ├── stegRateController.js    # StegRate singleton: GET + PUT
│   ├── subscriberController.js
│   └── testimonialController.js
├── middleware/
│   ├── authMiddleware.js        # JWT validation (httpOnly cookie + Bearer header), role check
│   ├── upload.js                # Multer + multer-storage-cloudinary configuration
│   └── validationMiddleware.js  # Zod schema validation wrapper
├── models/
│   ├── Lead.js                  # Full resultat JSON, pipeline status enum, compound indexes
│   ├── Message.js
│   ├── Project.js
│   ├── StegRate.js              # Singleton tariff document with all STEG rate fields
│   ├── Subscriber.js
│   ├── Testimonial.js
│   └── User.js                  # bcrypt hashed password, role: 'admin'
├── routes/
│   ├── authRoutes.js
│   ├── leadRoutes.js
│   ├── messageRoutes.js
│   ├── projectRoutes.js
│   ├── statsRoutes.js
│   ├── stegRateRoutes.js
│   ├── subscriberRoutes.js
│   ├── testimonialRoutes.js
│   └── uploadRoutes.js
├── scripts/
│   └── seed.js                  # Initial database seeding script
└── utils/
    ├── logger.js                # Winston logger (piped from Morgan)
    └── zodSchemas.js            # Zod validation schemas for all request bodies
```

---

## Key Features

### STEG-Calibrated Simulation Engine (`useSimulator.js`)

A stateful, multi-step form hook implementing the Tunisian residential electrical tariff model:

- **Tiered Rate Calculation** — Residential billing applies a tranche-based system across 6 consumption tiers (0.062 DT/kWh → 0.414 DT/kWh). Professional and agricultural clients use a configurable flat rate.
- **Full Bill Decomposition** — Computes `energy cost`, `surtaxes`, `TVA on energy`, `fixed monthly fee (redevance fixe)`, and `TVA on fixed fee` independently — both pre- and post-solar offset — to produce an accurate net savings figure.
- **Solar Sizing Engine** — Derives required system capacity (kWp), panel count, and total installation cost from the user's target coverage percentage and the `productionPerKwp` constant fetched from the database.
- **Live Rate Fetching** — Fetches the active `StegRate` singleton from `GET /api/steg-rates` on mount. Falls back to hardcoded constants if the API is unreachable, ensuring the simulator remains functional during backend downtime.
- **Flow State Machine** — Manages a 3-state flow: `form` → `lead` (lead capture gate) → `dashboard`. The result dashboard is rendered only after a lead document has been successfully created in MongoDB.

### Data Visualization (`ResultDashboard.jsx`)

- Interactive charts built with **Recharts** (composable SVG) render the simulation output: bill comparison, month-by-month savings projection, and ROI break-even timeline.
- A **Framer Motion**-animated results panel provides staggered entrance animations for each KPI card.
- The `PrintTemplate.jsx` component mirrors the dashboard layout as a printer-optimized DOM node. `html2canvas` captures it to a canvas and `jsPDF` converts it to a downloadable `.pdf` — entirely client-side, no server rendering step required.

### Administrative CRM (JWT-Protected Dashboard)

Nested routes under `/admin` rendered inside `AdminLayout`. `ProtectedRoute` validates the session token before rendering any child route, redirecting expired or absent sessions to `/admin/login`.

| Route | Page | Function |
| :--- | :--- | :--- |
| `/admin` | `AdminDashboard` | Aggregated KPIs and recent activity feed |
| `/admin/leads` | `AdminLeads` | Paginated lead list with status filter and full-text search |
| `/admin/leads/:id` | `AdminLeadDetail` | Full audit result reconstruction + status/notes editor |
| `/admin/steg-rates` | `AdminStegRates` | Live mutation of the `StegRate` singleton document |
| `/admin/projects` | `AdminProjects` | Project CRUD with Cloudinary image management |
| `/admin/testimonials` | `AdminTestimonials` | Testimonial CRUD with avatar upload |
| `/admin/messages` | `AdminMessages` | Contact form submissions inbox |
| `/admin/subscribers` | `AdminSubscribers` | Newsletter subscriber list |

### Security Architecture

The server enforces a layered security model applied at startup and on every request:

1. **Startup Guard** — Five required environment variables (`MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) are validated before the process binds to any port. A missing variable triggers `process.exit(1)`.
2. **Strict CORS Whitelist** — Only origins matching `FRONTEND_URL` or `http://localhost:3000` are permitted. All other origins are logged via Winston and blocked with a CORS error.
3. **Body Size Limit** — JSON and URL-encoded bodies are capped at `10kb` to prevent Denial-of-Service via large payload injection.
4. **Anti-Caching** — All `/api/*` routes set `Cache-Control: no-store` to prevent sensitive admin data from persisting in browser or proxy caches.
5. **Token Strategy** — The `protect` middleware reads tokens from httpOnly cookies first, then falls back to `Authorization: Bearer`. The user role is verified to be `admin` before any protected handler executes.
6. **NoSQL Injection Prevention** — `express-mongo-sanitize` strips `$` and `.` characters from request bodies and query parameters on every request.

---

## Development & Installation

### Prerequisites

- Node.js `v16+`
- A MongoDB Atlas cluster and connection URI
- A Cloudinary account with API credentials

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/zied-mb/vagasolar.git
cd vagasolar

# 2. Configure and start the backend
cd backend
npm install
# Create backend/.env using the environment reference below
npm run dev
# API server starts on http://localhost:5000

# 3. Configure and start the frontend (new terminal)
cd ../frontend
npm install
# Create frontend/.env with REACT_APP_API_URL=http://localhost:5000
npm start
# Client starts on http://localhost:3000
```

### Seeding the Initial Admin User

```bash
# Run once after configuring INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD in backend/.env
cd backend
npm run seed
```

The `server.js` startup sequence also performs an auto-seed: if `INITIAL_ADMIN_EMAIL` is present in the environment and no matching user exists in the database, an admin user is created automatically on boot.

---

## Environment Configuration

### Backend (`/backend/.env`)

| Variable | Description |
| :--- | :--- |
| `NODE_ENV` | Runtime environment. `development` or `production`. Controls stack trace exposure in error responses. |
| `PORT` | TCP port for the Express HTTP server (default: `5000`). |
| `MONGO_URI` | MongoDB Atlas connection string. Required at startup; process exits with code 1 if absent. |
| `JWT_SECRET` | HMAC signing secret for `jsonwebtoken`. Use a cryptographically random string of 64+ characters in production. |
| `JWT_EXPIRE` | Token TTL passed to `jwt.sign` options (e.g., `7d`, `24h`). |
| `FRONTEND_URL` | Allowlisted origin for the CORS whitelist and Socket.IO CORS config. Set to your deployment URL in production. |
| `INITIAL_ADMIN_EMAIL` | Bootstrap email for automatic admin user creation on server startup. |
| `INITIAL_ADMIN_PASSWORD` | Bootstrap password for the seeded admin user. Rotate immediately after first login. |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier. |
| `CLOUDINARY_API_KEY` | Public API key for authenticating Cloudinary SDK requests. |
| `CLOUDINARY_API_SECRET` | Private API secret for signed upload operations. Never expose client-side. |

### Frontend (`/frontend/.env`)

| Variable | Description |
| :--- | :--- |
| `REACT_APP_API_URL` | Base URL for the Axios instance. `http://localhost:5000` in development; your production API URL in production. |
| `GENERATE_SOURCEMAP` | Set to `false` in production to suppress source map generation and reduce bundle exposure. |

---

## API Reference

| Method | Endpoint | Access | Description |
| :---: | :--- | :---: | :--- |
| `POST` | `/api/auth/login` | Public | Authenticates admin; returns httpOnly JWT cookie. Rate-limited: 10 req / 15 min. |
| `POST` | `/api/auth/logout` | Protected | Clears the JWT cookie. |
| `GET` | `/api/auth/me` | Protected | Returns the authenticated user's profile. |
| `POST` | `/api/leads` | Public | Creates a lead record from simulator output. |
| `GET` | `/api/leads` | Protected | Paginated lead list with `status` filter and full-text search. |
| `GET` | `/api/leads/export` | Protected | Streams an `.xlsx` file of all lead records. |
| `GET` | `/api/leads/:id` | Protected | Single lead with full `resultat` object. |
| `PATCH` | `/api/leads/:id/status` | Protected | Updates pipeline status and internal notes. |
| `PATCH` | `/api/leads/:id/pdf` | Public | Marks `pdfDownloaded: true` atomically on PDF export. |
| `GET` | `/api/steg-rates` | Public | Returns the active STEG tariff configuration singleton. |
| `PUT` | `/api/steg-rates` | Protected | Mutates the STEG tariff singleton document. |
| `GET` | `/api/projects` | Public | All published projects. |
| `POST` | `/api/projects` | Protected | Creates a project record with Cloudinary image. |
| `PUT` | `/api/projects/:id` | Protected | Updates a project. |
| `DELETE` | `/api/projects/:id` | Protected | Deletes a project and its Cloudinary assets. |
| `GET` | `/api/testimonials` | Public | All testimonials. |
| `POST` \| `PUT` \| `DELETE` | `/api/testimonials/*` | Protected | Testimonial CRUD with avatar upload. |
| `POST` | `/api/messages` | Public | Submits a contact form. Emits `new-message` via Socket.IO. |
| `GET` | `/api/messages` | Protected | Fetches all stored messages. |
| `POST` | `/api/subscribers` | Public | Registers an email subscriber with duplicate prevention. |
| `GET` | `/api/subscribers` | Protected | Fetches all subscribers. |
| `GET` | `/api/stats` | Public | Returns aggregated platform statistics. |
| `POST` | `/api/upload/image` | Protected | Streams a multipart image upload directly to Cloudinary. |
| `GET` | `/api/health` | Public | Health check. Returns `{ status: "OK", timestamp }`. |

---

## Connect

**Zied Meddeb** — Full-Stack Engineer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Zied_Meddeb-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/zied-meddeb-7087a2266/)
[![Portfolio](https://img.shields.io/badge/Portfolio-zied--meddeb.netlify.app-FF5722?style=flat-square&logo=google-chrome&logoColor=white)](https://zied-meddeb-portfolio.netlify.app/)
[![GitHub](https://img.shields.io/badge/GitHub-zied--mb-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/zied-mb)
