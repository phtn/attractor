# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is **re-up.ph** - a Next.js 15.3.4 web application with TypeScript, using Convex for real-time backend, tRPC for API layer, and shadcn/ui components. The project includes web3D graphics with Three.js, payment processing, and a comprehensive admin system.

## Development Commands

### Core Development
```bash
bun dev              # Start Next.js dev server with Turbopack
bun build            # Build for production with Turbopack
bun start            # Start production server
bun lint:fix         # Fix linting issues
```

### Memory Analysis & Optimization
```bash
bun memory:check     # Basic memory leak detection
bun memory:quick     # Quick 15-iteration memory check (1s intervals)
bun memory:detailed  # Detailed 40-iteration analysis with GC
bun memory:check:gc  # Memory check with garbage collection
```

### Code Quality Analysis
```bash
bun anal:code        # Analyze code patterns for potential issues
bun anal:code:save   # Analyze and save results
bun anal:quick       # Quick code analysis
bun anal:src         # Analyze src directory specifically
```

### Database Operations (Convex)
```bash
npx convex dev       # Start Convex development server
npx convex deploy    # Deploy functions to production
npx convex dashboard # Open Convex dashboard
```

## Architecture

### Directory Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Reusable React components including 3D graphics
- `src/ctx/` - Context providers (Auth, Convex, Theme, SFX, Resize)
- `src/hooks/` - Custom React hooks with memory management utilities
- `src/lib/` - Utility libraries (auth, payments, webhooks)
- `src/server/` - tRPC server setup and routers
- `convex/` - Convex backend functions and schema

### Key Technologies
- **Frontend**: Next.js 15.3.4, React 19, TypeScript, Tailwind CSS
- **Backend**: Convex (real-time database), tRPC (type-safe APIs)
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **UI**: shadcn/ui components, Radix UI primitives
- **Auth**: Convex Auth with GitHub provider
- **Payments**: Paymongo integration
- **State**: Tanstack Query, React Context

### Database Schema (Convex)
Tables: `admins`, `users`, `categories`, `cats` with proper indexing and search capabilities.

Path aliases configured:
- `@/*` → `./src/*`
- `vx/*` → `./convex/*`  
- `@@/*` → `./convex/_generated/*`

### Memory Management
The project includes sophisticated memory leak detection and prevention:
- Custom timeout management hooks in `src/hooks/use-timeout-cleanup.ts`
- Automated memory analysis with `memory-check.cjs`
- Code pattern analysis with `analyze-code-patterns.cjs`
- All components follow proper cleanup patterns for timeouts, event listeners, and subscriptions

### Admin System
Located at `/admin` with comprehensive data management for categories, assets, and user administration. Features include:
- Server-side tables with pagination, sorting, and filtering
- Real-time data synchronization via Convex
- Responsive design with sidebar navigation

### 3D Graphics & Interactive Elements
- WebGL-based globe visualization using Cobe library
- Three.js scenes with orbital mechanics and space shuttle models
- GPU shader programming for visual effects
- Sound effects system with theme-aware audio feedback

### Development Guidelines
- Memory management is critical - use provided hooks for timeouts
- Follow React best practices with proper cleanup in useEffect
- Use tRPC for type-safe API calls
- Convex functions should be optimized with proper indexing
- All components should handle loading and error states
- 3D components require proper disposal of geometries and materials

### Routing Structure
- `/` - Landing page with 3D globe and hero section  
- `/init` - Main application interface with GPU monitoring
- `/admin` - Administrative dashboard (requires auth)
- `/reviewer` - Code review and chat interface
- `/api` - tRPC and webhook endpoints

The application emphasizes performance, memory efficiency, and developer experience with comprehensive tooling for monitoring and optimization.