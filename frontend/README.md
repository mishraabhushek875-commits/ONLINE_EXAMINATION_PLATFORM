# Matnite Infotech — Admin Frontend (Next.js)

Admin panel for the Online Examination Management System, built to match the
"Matnite Infotech" theme from your screenshots (green/violet accents, white
cards, rounded-2xl, Lora serif logo + Inter body font).

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Zustand (`authStore`, `uiStore`) for global state, with `persist` for auth
- Axios with an interceptor that attaches the JWT and auto-refreshes on 401
- lucide-react icons, recharts (ready to use for charts if you add them)

## Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL to your backend
npm run dev
```
Visit `http://localhost:3000` → redirects to `/admin/dashboard`. You'll be
bounced to `/login` once you wire up route protection (see "Next steps").

## What's built
- `/login` and `/verify-otp` — match your auth screens, call
  `POST /auth/login` then `POST /auth/verify-otp`, store the access/refresh
  token + admin info in `authStore`.
- `/admin/dashboard` — stat cards (Students, Question Banks, Tests,
  Questions), recently enrolled students, top question banks, recent tests.
  Pulls data live from `/exams`, `/banks`, `/questions`, and `/users`
  (see gap below) and computes the counts client-side, since your backend
  doesn't expose one combined dashboard endpoint.
- `/admin/students` — list + search + activate/deactivate.
- `/admin/question-banks` — list + create + delete.
- `/admin/exams` — list + create (with question bank picker) + delete.
- `/admin/questions` — list + filter by category + create MCQ (4+ options,
  tap to mark correct answers) + delete.
- Shared `DataTable` (search + pagination), `Sidebar`, `Navbar`, `StatCard`,
  `Badge`, `Button` components — reused across every page so new admin
  screens (Attempts, Reports, Settings, Exam Assignments) are quick to add
  with the same look.

## ⚠️ One backend gap to fix first
Your provided controllers have **no route to list students**. I wired the
frontend to call:
```
GET /api/users?role=student&page=&limit=&search=
PATCH /api/users/:id/status
```
These don't exist yet in your Express app. Add a small `userController.ts` +
`userRoutes.ts` (admin-only, same pattern as your other controllers) that
queries `prisma.user.findMany({ where: { role: "student" } })`, and mount it
in `app.ts` as `app.use("/api/users", userRoutes)`. Until then, the Students
page and the "Total Students" stat will show empty/zero.

Everything else (`/exams`, `/banks`, `/questions`, `/admin/exams/...` for
assignments) maps directly to the controllers you shared.

## Next steps you'll likely want
- Route protection: redirect to `/login` when `authStore.isAuthenticated` is
  false (a small `useEffect` in `admin/layout.tsx`, or Next middleware).
- "Exam Assignments" and "Attempts" pages — `assignmentService.ts` already
  has every call wired (`assignOne`, `assignBulk`, `getAssignedStudents`,
  `getStudentExams`, `remove`); just needs a page using `DataTable`.
- Charts on the dashboard (Students Overview / Test Attempts) — `recharts`
  is already in `package.json`, just add a `<LineChart>`/`<BarChart>` once
  you have a backend endpoint with attempt history over time.
