# DocuFast Frontend

## Overview

DocuFast Frontend is the web application for the DocuFast platform, a logistics and document management system.

---

## Technologies Used

- Next.js
- React
- TypeScript
- TailwindCSS
- shadcn/ui
- Lucide React Icons
- React Hook Form
- Zod
- JWT Authentication
- Fetch API / Axios

---

## Project Structure
```
src/
├── app/
│ ├── (public)/
│ │ ├── layout.tsx
│ │ ├── page.tsx
│ │ ├── login/
│ │ ├── about/
│ │ └── contact/
│ │
│ ├── (private)/
│ │ ├── layout.tsx
│ │ ├── dashboard/
│ │ ├── profile/
│ │ ├── workers/
│ │ ├── vehicles/
│ │ ├── clients/
│
├── components/
├── hooks/
├── lib/
├── services/
├── constants/
├── types/
```
---

## Authentication

The application uses JWT authentication.

Flow:

1. User logs in with email and password.
2. Backend returns JWT token.
3. Token is stored in localStorage.
4. Frontend loads user profile.
5. Private routes are protected.
6. Role-based access control is applied.
7. Logout removes token and redirects to login.

---

## Role-Based Access Control

Roles:

- Administrator
- Worker
- External

| Section   | Administrator | Worker | External |
| --------- | ------------- | ------ | -------- |
| Dashboard | Yes           | No     | No       |
| Profile   | Yes           | Yes    | No       |
| Workers   | Yes           | No     | Yes      |
| Vehicles  | Yes           | No     | No       |
| Clients   | Yes           | No     | No       |

---

## Installation Guide

### Prerequisites

- Node.js >= 24
- npm
- Git
- Backend API running & DB

Check versions:
- node -v
- npm -v

---

### Clone repository

git clone https://github.com/Sergio18rg/docufast-frontend

cd docufast-frontend

---

### Install dependencies

npm install

---

### Environment variables

Create a `.env.local` file in the root directory (optional):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**Note:** If not specified, the application defaults to `http://localhost:4000/api`. Only set the variable if the backend runs in a different URL

---

### Run project

npm run dev

Application will run at:
http://localhost:3000

---

## Test Users

These users are created automatically when seeding the backend database.

| Role          | Email                    | Password      |
| ------------- | ------------------------ | ------------- |
| Administrator | admin@docufast.com       | Admin1234!    |
| Worker        | laura.gomez@docufast.com | Laura1234     |
| External      | external@docufast.com    | External1234! |

**Note:** Additional worker accounts are created during seeding (Carlos, Ana, Miguel). Worker passwords follow the pattern: `{FirstName}1234`.

---

## Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

---

## Notes

This project is the frontend part of the DocuFast Final Degree Project.
