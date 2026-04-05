# Finance Dashboard API (Enterprise Architecture)

This repository contains the backend implementation for a Finance Dashboard system, utilizing an enterprise-grade service-oriented architecture with Next.js App Router (Route Handlers). Let's go over the architecture, decisions, and instructions on how to use it!

## Features Delivered

- **Role-Based Access Control (RBAC)**: Supports roles 'Viewer', 'Analyst', and 'Admin' via middleware (`lib/auth.ts`).
- **Service Layer Abstraction**: Strictly separates business logic from REST handlers (`services/*`).
- **Pagination & Search**: Extends basic CRUD capabilities with query parameter functionality.
- **Soft Delete Pattern**: Protects records by simply applying a timestamp `deletedAt` rather than executing an irreversible DB `DELETE` command.
- **Runtime Type Safety**: Defends the database using the Zod schema validation library before logic executes.
- **Data Visuals**: Although this was primarily a backend assessment, a beautiful interactive map showing how to execute fetching APIs was mocked in `app/page.tsx`!

## Architectural Decisions & Tradeoffs

1. **Framework Choice (Next.js Route Handlers vs Express.js)**: Why Next.js? Because the environment was natively provided as a Next.js directory. Implementing Route Handlers natively is highly scalable in Vercel Edge networks while bringing built-in Typescript and request/response simplifications over Express.
2. **Database Choice (SQLite / Prisma)**: Utilizing an embedded SQLite database simplifies assessment testing—we don't need docker grids or cloud credentials to evaluate the structural integrity of relational logic. Prisma simplifies querying safely.
3. **Mock Authentication**: Without external Identity Providers like Clerk or Auth0, we process mock authentications via the headers tag `X-User-Id`. 

## How To Run Locally

1. **Install Modules**
```bash
npm install
```

2. **Initialize Database**
```bash
npx prisma db push
```

3. **Populate Seed Data**
```bash
npx ts-node prisma/seed.ts
```

4. **Launch Server**
```bash
npm run dev
```

## API Documentation

All API requests must include the `X-User-Id` header correlating to an ID in your `User` table (grab these from Prisma Studio via `npx prisma studio`).

### Users API (`Admin` Only)
* `GET /api/users`: Returns array of users.
* `POST /api/users`: Formulate `{ "name": "...", "role": "..." }`.
* `PUT /api/users/:id`: Modify user details.

### Record API (`Analyst`, `Admin`)
* `GET /api/records?search=xx&page=1&limit=10`: Paginated listings of datasets matching searches.
* `POST /api/records`: Store new financial transactions *[Admin]*
* `PUT /api/records/:id`: Perform partial updates to records *[Admin]*
* `DELETE /api/records/:id`: Safe soft-deletes a record *[Admin]*

### Dashboard Analytics (`Viewer`, `Analyst`, `Admin`)
* `GET /api/dashboard/summary`: Aggragate calculations fetching net profit.
* `GET /api/dashboard/recent`: Fetches trailing activity bounds.

---
**Thank you for reviewing!**
