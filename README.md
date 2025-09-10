# Campus Club Finder

A React Native app built with Expo for finding and managing campus clubs.

## Development Setup

### Prerequisites
- Bun (for package management)
- Node.js 18+

### Running the App

1. **Start the backend server** (in a separate terminal):
   ```bash
   bun run dev-server.ts
   ```
   This will start the backend API server on `http://localhost:3000`

2. **Start the frontend**:
   ```bash
   bun run start-web
   ```
   This will start the Expo web development server

### Environment Variables

The app automatically detects the environment:
- **Development**: Uses `http://localhost:3000` for the API
- **Production**: Uses the current domain's origin

To override the API URL, set:
```bash
EXPO_PUBLIC_RORK_API_BASE_URL=https://your-api-domain.com
```

### Database

The app uses SQLite with Drizzle ORM:
- Database file: `backend/db/database.sqlite`
- Schema: `backend/db/schema.ts`
- Seed data: `backend/db/seed.ts`

### API Routes

The backend uses tRPC with Hono:
- Health check: `GET /api/`
- tRPC endpoint: `POST /api/trpc/*`

## Troubleshooting

### "No base url found" Error

If you see this error, make sure:
1. The backend server is running on port 3000
2. You're accessing the app from `localhost` or have set `EXPO_PUBLIC_RORK_API_BASE_URL`

### Navigation Errors

If you see navigation-related errors, ensure you're using the app within the proper navigation context provided by Expo Router.
