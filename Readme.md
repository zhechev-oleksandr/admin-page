# Admin-page

A full-stack monorepo with a React frontend and Express backend.

## Tech Stack

### Frontend
- [React](https://react.dev/) — UI library
- [TypeScript](https://www.typescriptlang.org/) — type safety
- [Vite](https://vitejs.dev/) — build tool
- [Tailwind CSS v4](https://tailwindcss.com/) — styling
- [Zustand](https://zustand-demo.pmnd.rs/) — client state management
- [TanStack Query](https://tanstack.com/query) — server state management
- [React Router v7](https://reactrouter.com/) — routing
- [Axios](https://axios-http.com/) — HTTP client
- [Zod](https://zod.dev/) — schema validation
- [Biome](https://biomejs.dev/) — linter and formatter

### Backend
- [Express](https://expressjs.com/) — web framework
- [TypeScript](https://www.typescriptlang.org/) — type safety
- [Prisma v6](https://www.prisma.io/) — ORM
- [MongoDB](https://www.mongodb.com/) — database
- [Zod](https://zod.dev/) — request validation
- [JWT](https://github.com/auth0/node-jsonwebtoken) — authentication
- [Biome](https://biomejs.dev/) — linter and formatter

### Monorepo
- [Turborepo](https://turbo.build/) — monorepo build system
- [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) — package management

---

## Project Structure

```
my-project/
├── frontend/
│   └── src/
│       ├── core/           # axios instance, router, query client, providers
│       ├── features/       # feature-based modules (auth, users, etc.)
│       │   └── auth/
│       │       ├── components/
│       │       ├── hooks/
│       │       ├── api.ts
│       │       ├── store.ts
│       │       └── index.ts
│       ├── pages/          # route-level components
│       ├── shared/         # reusable UI, hooks, utils, types
│       └── main.tsx
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── config/         # db, env
│       ├── controllers/    # request/response handling
│       ├── middleware/      # auth, error handling
│       ├── models/         # types/interfaces
│       ├── routes/         # express router definitions
│       ├── services/       # business logic
│       ├── types/
│       ├── app.ts
│       └── server.ts
├── shared/
│   ├── schemas/            # zod schemas shared between frontend and backend
│   ├── types/
│   └── constants/
├── package.json
└── turbo.json
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v22+
- [npm](https://www.npmjs.com/) v10+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or local MongoDB instance

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/zhechev-oleksandr/admin-page.git
cd admin-page
```

### 2. Install dependencies

Install all workspace dependencies from the root:

```bash
npm install
```

Then install backend dependencies:

```bash
cd backend
npm install
cd ..
```

### 3. Configure environment variables

Create a `.env` file in `backend/`:

```bash
cp backend/.env.example backend/.env
```

Fill in the values:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority&appName=<appName>"
JWT_SECRET=your-secret-here
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Generate Prisma client

```bash
cd backend
npx prisma generate
```

### 5. Push the database schema

```bash
npx prisma db push
```

### 6. Start the development servers

From the root, start both frontend and backend simultaneously:

```bash
npm run dev
```

Or run them individually:

```bash
# Frontend only
turbo run dev --filter=frontend

# Backend only
turbo run dev --filter=backend
```

The frontend runs on [http://localhost:5173](http://localhost:5173)
The backend runs on [http://localhost:3000](http://localhost:3000)

---

## Available Scripts

Run from the **root** of the project:

| Command | Description |
|---|---|
| `npm run dev` | Start all workspaces in development mode |
| `npm run build` | Build all workspaces |
| `npm run lint` | Lint all workspaces with Biome |

Run from **`backend/`**:

| Command | Description |
|---|---|
| `npm run dev` | Start backend in watch mode |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run compiled production build |
| `npm run lint` | Lint with Biome |
| `npm run lint:fix` | Lint and auto-fix |
| `npm run db:push` | Push Prisma schema to MongoDB |
| `npm run db:studio` | Open Prisma Studio |

Run from **`frontend/`**:

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint with Biome |
| `npm run lint:fix` | Lint and auto-fix |
| `npm run format` | Format with Biome |

## Environment Variables Reference

### Backend

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | Yes | `development` or `production` |
| `PORT` | Yes | Port the server listens on |
| `DATABASE_URL` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign JWT tokens |

### Frontend

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Base URL for API requests |