# BenefitBuddy

**One profile. Every benefit you deserve.**

BenefitBuddy is an AI-assisted platform that matches a citizen's profile against government welfare schemes and insurance plans, tells them exactly which ones they qualify for, and explains *why* in plain language — instead of making them dig through scheme eligibility PDFs one by one.

Originally built as a proposal for the UTKARSH 1.0 / IITB-Honeywell Sustainability Hackathon, unifying scheme discovery and insurance comparison into a single profile — something existing tools (myScheme.gov.in, PolicyBazaar, etc.) handle separately.

---

## How it works

1. A user fills out a short profile — age, gender, annual income, state, category, land holding, occupation.
2. A **deterministic rules engine** checks that profile against every scheme's hard eligibility criteria (age range, income ceiling, category, land ceiling, state, occupation, gender).
3. For every scheme, an **LLM (Gemini, with an OpenAI fallback)** turns the raw pass/fail reason into a short, polite, human-readable explanation — without changing the verdict.
4. Every check is logged, so a user can revisit their eligibility history at any time.
5. A separate **insurance comparator** lists government + private insurance plans (PMJJBY, PMSBY, Kanyadan Policy, eShield Next, etc.), personalized by age/gender and sortable by cover amount, premium, and claim settlement ratio.

The rules engine is deliberately kept deterministic and separate from the AI layer — the LLM only explains a verdict that's already been decided, it never decides eligibility itself.

---

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | React 19 + Vite, Tailwind CSS, Framer Motion, Lucide icons, Axios |
| Backend (active) | Node.js + Express, Supabase (Postgres), Google Gemini API, OpenAI (fallback) |
| Backend (prototype) | Python + FastAPI, SQLAlchemy, SQLite, Google Gemini API |
| AI | Gemini 1.5 Pro for eligibility explanations and a free-form Q&A endpoint |

> The repo currently has two parallel backends: `backend-node/` (Express + Supabase) is the actively developed one with the insurance module and the Gemini→OpenAI fallback chain. `app/` is the original FastAPI + SQLite prototype the rules engine and data model were first built in. Pick one depending on what you're running — see setup below.

---

## Project structure

```
BenefitBuddy/
├── app/                     # FastAPI prototype backend
│   ├── main.py              # API routes
│   ├── models.py            # SQLAlchemy + Pydantic models (User, Scheme, InteractionLog)
│   ├── rules_engine.py       # Deterministic eligibility checks
│   ├── gemini_service.py     # Gemini explanation generation (with template fallback)
│   ├── seed_data.py          # Seeds sample schemes (PM-KISAN, Ayushman Bharat, PMAY, etc.)
│   └── database.py
│
├── backend-node/            # Express + Supabase backend (active)
│   ├── src/
│   │   ├── index.js          # API routes
│   │   ├── rulesEngine.js    # Deterministic eligibility checks
│   │   ├── geminiService.js  # Gemini explanations + chat
│   │   ├── openaiService.js  # OpenAI fallback
│   │   └── supabaseClient.js
│   ├── schema.sql            # Postgres schema (users, schemes, insurance_plans)
│   └── seed_data.sql
│
├── frontend/                 # React + Vite client
│   └── src/
│       ├── components/       # UserForm, Dashboard, SchemeCard, Insurance
│       └── api.js
│
├── test_api.py               # Sample end-to-end test against the FastAPI backend
├── requirements.txt          # Python deps
└── .env.example
```

---

## API endpoints

Both backends expose the same shape of API:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/users` | Create a user profile |
| `GET` | `/users/:id` | Fetch a user profile |
| `GET` | `/schemes` | List all schemes |
| `POST` | `/schemes` | Add a new scheme |
| `POST` | `/eligibility/check/:user_id` | Run the rules engine + AI explanation for every scheme against a user |
| `GET` | `/users/:user_id/history` | Get a user's past eligibility checks |
| `GET` | `/insurance` | List insurance plans *(Node backend only)* |
| `POST` | `/ask-gemini` | Free-form Q&A about a user's schemes *(Node backend only)* |

---

## Getting started

### Frontend

```bash
cd frontend
npm install
npm run dev
```
Runs the app in the development mode on [http://localhost:5173/](http://localhost:5173/).

### Backend — Node/Express (active backend)

```bash
cd backend-node
npm install
cp .env.example .env
```

Ensure your `.env` is configured with your Supabase, Gemini, and OpenAI keys:

```ini
PORT=8000
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_or_service_key_here
```

Then, set up the database and run the server:

```bash
# Run schema.sql and seed_data.sql against your Supabase project in the Supabase SQL Editor
npm run dev
```
The server will run on [http://localhost:8000/](http://localhost:8000/).

### Backend — FastAPI (prototype)

```bash
pip install -r requirements.txt --break-system-packages
cp .env.example .env   # add your GEMINI_API_KEY
python -m app.seed_data     # seed sample schemes
uvicorn app.main:app --reload
```

Then run the sample flow:

```bash
python test_api.py
```

---

## Sample schemes seeded

- **PM-KISAN** — for farmers, land ≤ 5 acres
- **Ayushman Bharat** — income ≤ ₹5,00,000
- **PMAY** — Pradhan Mantri Awas Yojana (general housing)
- **Sukanya Samriddhi Yojana** — girls aged ≤ 10
- **SC/ST Scholarship** — pre-matric, ages 10–16, SC/ST category

## Sample insurance plans compared

PMJJBY, PMSBY, Kanyadan Policy, eShield Next — filtered by the user's age/gender, sortable by claim settlement ratio, premium, and cover amount.

---

## Roadmap

- [ ] XGBoost-based scheme ranking (beyond hard eligibility filtering)
- [ ] Multilingual chatbot support via Gemini
- [ ] Full state-by-state scheme database
- [ ] OCR-based document verification (Tesseract) for scheme applications
- [ ] Firebase/Supabase authentication for persistent user accounts

---

## License

This project is licensed under the MIT License.