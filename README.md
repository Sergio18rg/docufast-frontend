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

Create .env.local file:

NEXT_PUBLIC_API_URL or "http://localhost:4000/api" default

---

### Run project

npm run dev

Application will run at:
http://localhost:3000

---

## Test Users

Must be created in the backend. Read README.md

| Role          | Email                 | Password      |
| ------------- | --------------------- | ------------- |
| Administrator | admin@docufast.com    | Admin1234!    |
| Worker        | worker@docufast.com   | Worker1234!   |
| External      | external@docufast.com | External1234! |

---

## Available Scripts

- npm run dev
- npm run start

---

## Notes

This project is the frontend part of the DocuFast Final Degree Project.
