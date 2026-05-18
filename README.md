# 🤖 EmpAI — AI-Based Employee Performance Analytics & Recommendation System

<div align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-6366f1?style=for-the-badge" />
  <img src="https://img.shields.io/badge/OpenRouter-AI-8b5cf6?style=for-the-badge" />
  <img src="https://img.shields.io/badge/JWT-Auth-10b981?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge" />
</div>

## 📋 Project Description

EmpAI is a production-grade, AI-powered Full Stack MERN application that enables HR teams and managers to analyze employee performance, get AI-generated recommendations, and make data-driven decisions. Built for the **B.Tech 4th Semester ESE Examination — AI308B**.

---

## ✨ Features

### 🔐 Authentication
- JWT-based login/register
- bcrypt password hashing (salt rounds: 12)
- Protected frontend and backend routes
- Role-based access control (Admin / HR / Manager)
- Persistent login via Zustand store + localStorage

### 👥 Employee Management
- Add / Edit / Delete employees
- Search with 400ms debounce
- Filter by department, status, performance score
- Pagination (8 per page)
- Skills array with tag input

### 📊 Analytics Dashboard
- KPI cards (Total, Avg Score, Promotion Eligible, Training Needed)
- Performance trend area chart (Recharts)
- Department distribution pie chart
- Performance score distribution bar chart
- Department comparison horizontal bar chart
- Top 10 employee rankings table

### 🤖 AI Integration (OpenRouter)
- Individual employee recommendations
- Promotion eligibility assessment
- Training suggestions with skill gap analysis
- AI-powered employee ranking
- Intelligent prompt engineering per performance tier

### 🎨 UI/UX
- Dark mode (deep navy #0B1326 background)
- Glassmorphism cards with backdrop blur
- Framer Motion animations
- Responsive sidebar dashboard layout
- Loading skeletons & empty states
- Toast notifications (react-hot-toast)
- Delete confirmation modal

---

## 🗂 Project Structure

```
ese fsd/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # JWT login/register
│   │   ├── employeeController.js  # CRUD + analytics
│   │   └── aiController.js        # OpenRouter AI calls
│   ├── middleware/
│   │   ├── auth.js                # JWT protect + authorize
│   │   └── errorHandler.js        # Global error handler
│   ├── models/
│   │   ├── Employee.js            # Employee schema
│   │   └── User.js                # User schema + bcrypt hook
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   └── aiRoutes.js
│   ├── utils/
│   │   └── seed.js               # Database seeder
│   ├── app.js                    # Express app setup
│   ├── server.js                 # Server entry point
│   ├── render.yaml               # Render deployment config
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── index.js          # Axios service layer
    │   ├── components/           # Reusable components
    │   ├── layouts/
    │   │   └── DashboardLayout.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── EmployeeListPage.jsx
    │   │   ├── EmployeeDetailPage.jsx
    │   │   ├── EmployeeFormPage.jsx
    │   │   ├── AIRecommendationsPage.jsx
    │   │   ├── AnalyticsPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   └── NotFoundPage.jsx
    │   ├── routes/
    │   │   └── ProtectedRoute.jsx
    │   ├── store/
    │   │   └── authStore.js      # Zustand auth store
    │   ├── App.jsx               # Router setup
    │   ├── main.jsx
    │   └── index.css             # Global styles + Tailwind
    └── package.json
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (free tier works)
- OpenRouter API key (free at [openrouter.ai](https://openrouter.ai))

### 1. Clone and Navigate
```bash
git clone <your-github-repo-url>
cd ese\ fsd
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in .env values (see below)
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
# Update .env: VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

### 4. Seed the Database
```bash
cd backend
npm run seed
```

---

## ⚙️ Environment Variables

### Backend `.env`
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/empai_db
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔑 How to Add OpenRouter API Key

1. Visit [https://openrouter.ai](https://openrouter.ai)
2. Sign up for a free account
3. Go to **Keys** → Create a new key
4. Copy the key (starts with `sk-or-v1-...`)
5. Paste into `backend/.env`:
   ```
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   ```
6. Restart the backend: `npm run dev`

**Free Model Used:** `meta-llama/llama-3.1-8b-instruct:free`

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login, get JWT |
| GET | `/api/auth/me` | Get profile (protected) |

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/employees` | Add employee |
| GET | `/api/employees` | Get all (pagination, filter) |
| GET | `/api/employees/:id` | Get single |
| PUT | `/api/employees/:id` | Update |
| DELETE | `/api/employees/:id` | Delete (Admin/HR) |
| GET | `/api/employees/search` | Search/filter |
| GET | `/api/employees/analytics` | Analytics data |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/recommend` | AI recommendation |
| POST | `/api/ai/rank` | AI rank employees |

---

## 🧪 Test Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@empai.com | Admin@123 |
| HR | hr@empai.com | Hr@12345 |

---

## 🚢 Deployment

### Backend → Render
1. Push code to GitHub
2. Create Web Service on [render.com](https://render.com)
3. Set Root Directory: `backend`
4. Build: `npm install` | Start: `node server.js`
5. Add environment variables in Render dashboard

### Frontend → Vercel
1. Import GitHub repo on [vercel.com](https://vercel.com)
2. Set Root Directory: `frontend`
3. Add `VITE_API_URL=https://your-render-backend.onrender.com/api`
4. Deploy!

---

## 📝 Sample Employee Data

```json
{
  "name": "Aman Verma",
  "email": "aman@gmail.com",
  "department": "Engineering",
  "skills": ["React", "Node.js", "MongoDB"],
  "performanceScore": 85,
  "experience": 3
}
```

---

## 🎓 Viva Q&A Preparation

**Q: Why JWT over sessions?**
A: JWT is stateless — no server-side session store needed. Scales horizontally. Token carries user identity.

**Q: How does bcrypt work?**
A: bcrypt generates a random salt and hashes the password + salt. The salt is stored in the hash itself (60-char string). Comparison uses same salt extracted from stored hash.

**Q: What is the OpenRouter API?**
A: OpenRouter is a proxy/aggregator for multiple AI models. It provides an OpenAI-compatible API endpoint (`/v1/chat/completions`) that routes requests to models like LLaMA, Claude, GPT-4, etc. Free tier includes LLaMA 3.1 8B.

**Q: How does the AI prompt work?**
A: The prompt is dynamically built based on employee performance tier. High performers get promotion-focused prompts; low performers get improvement-focused prompts. Response is expected in JSON format for structured extraction.

**Q: Why Zustand over Redux?**
A: Zustand is significantly simpler — no boilerplate, no reducers/actions, built-in persistence middleware. Ideal for medium-scale React apps.

**Q: What is Mongoose schema validation?**
A: Mongoose validates data before saving to MongoDB using schema definitions (required, min, max, enum, match). The `ValidationError` is caught in global error middleware and returned as a 422 response.

**Q: Explain the rate limiting implementation.**
A: `express-rate-limit` middleware limits API calls to 200/15min globally and 10/min for AI endpoints (to protect the free tier quota).

---

## 📊 Deployment Checklist

- [ ] MongoDB Atlas cluster created, IP whitelisted (0.0.0.0/0 for Render)
- [ ] OpenRouter API key added to Render environment
- [ ] JWT_SECRET set to strong random string (32+ chars)
- [ ] Frontend VITE_API_URL pointing to Render backend URL
- [ ] CORS FRONTEND_URL updated with Vercel deployment URL
- [ ] Database seeded with sample data
- [ ] All API endpoints tested with Postman
- [ ] GitHub repository has clean commit history

---

## 🔗 Links

- **GitHub Repo:** [Your GitHub URL]
- **Frontend (Vercel):** [Your Vercel URL]
- **Backend API (Render):** [Your Render URL]
- **Health Check:** `GET /api/health`

---

**Built with ❤️ for ESE Examination — AI308B | MERN + AI Full Stack Development**
