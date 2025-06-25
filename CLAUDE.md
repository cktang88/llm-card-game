# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is "The Will to Fight" - a full-stack trading card game built on Cloudflare's developer platform. It's a two-player tactical card game with morale-based combat mechanics, built with React, TypeScript, and Cloudflare Workers.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server (frontend + backend)
- `npm run build` - Build for production (TypeScript + Vite)
- `npm run lint` - Run ESLint checks
- `npm run check` - Full validation (TypeScript, build, deploy dry-run)
- `npm run deploy` - Deploy to Cloudflare Workers

### Database Commands
- `npm run db:generate` - Generate Drizzle migrations from schema changes
- `npm run db:migrate:local` - Apply migrations to local D1 database
- `npm run db:migrate:remote` - Apply migrations to remote D1 database

### Testing
**No testing framework is currently configured.** The project would need test setup from scratch.

## Architecture Overview

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Cloudflare Workers + Hono.js
- **Database**: Cloudflare D1 (SQLite) + Drizzle ORM
- **State**: Zustand (client), In-memory (game state)
- **UI**: Tailwind CSS + shadcn/ui components
- **Routing**: Wouter (React router)
- **Data Fetching**: TanStack Query

### Project Structure
```
/src
├── components/ui/      # shadcn/ui components
├── game/              # Core game logic (models, managers, utils)
│   ├── constants/     # Game constants
│   ├── data/         # Card and commander definitions
│   ├── managers/     # Game state management
│   └── models/       # Unit, Player, GameState classes
├── react-app/         # Frontend React application
│   ├── features/     # Feature modules (deck-builder, game, etc.)
│   └── store/        # Zustand stores
└── worker/           # Backend Cloudflare Worker
    ├── db/          # Database schema (Drizzle)
    └── gameApi.ts   # Game API endpoints
```

### Key Game Concepts
- **Morale System**: Unit power equals current morale
- **Two-Row Board**: Front Line (5 slots) + Reinforcement Row (3 slots)
- **Combat**: Column-based targeting with health/morale damage types
- **Turn Phases**: Play → Deploy → Commander → Combat
- **Win Condition**: Reduce opponent's Overall Army Morale to 0

### Development Notes
- Game state is stored in D1 database with room-based multiplayer support
- Database schema is in `src/worker/db/schema.ts`
- Game logic runs on backend in Cloudflare Workers
- Simple AI opponent implemented in `src/worker/ai/simpleAI.ts`
- Room codes are 6-digit alphabetic strings (e.g., ABCDEF)
- Multiplayer games use polling for state synchronization
- API endpoints use Hono.js routing in `src/worker/`
- Frontend features are organized by domain in `src/react-app/features/`

### Configuration Files
- `wrangler.json` - Cloudflare Workers config with D1 database binding
- `drizzle.config.ts` - Database migration configuration
- `tsconfig.json` - TypeScript with app/node/worker project references
- `vite.config.ts` - Vite with React and Cloudflare plugins