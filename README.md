# matrimony-app

Simple fullstack starter using React (Vite) + Express + Prisma + Postgres. The frontend calls the backend API, which reads sample data from the database.

## Getting started

### Requirements
- Node.js 18+
- Postgres database

### Environment variables
Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL` and (optionally) `PORT`. Railway exposes a `DATABASE_URL` you can drop in directly.

### Install dependencies
```
cd backend && npm install
cd ../frontend && npm install
```

### Database setup
Run migrations and seed sample messages (schema lives in the top-level `prisma/` directory):
```
cd backend
npx prisma migrate deploy --schema ../prisma/schema.prisma
npm run seed
```

### Development
Run the backend (port 4000) and frontend dev server (port 5173 with API proxy):
```
cd backend && npm run dev
cd ../frontend && npm run dev
```
Visit http://localhost:5173 to see the UI.

### Production build
Build the frontend and start the backend:
```
cd frontend && npm run build
cd ../backend && npm start
```
The backend serves the static frontend from `backend/public`.

### Docker
A single Dockerfile builds the frontend and backend together:
```
docker build -t fullstack-test .
docker run -p 8080:8080 -e DATABASE_URL=... fullstack-test
```
