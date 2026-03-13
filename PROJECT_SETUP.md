# 📚 Project Setup & Organization Guide

## Overview

Gas Whisperer Oracle is a modern, production-ready Vite + React + TypeScript web application for real-time blockchain gas price tracking. This guide explains the project structure, setup process, and how to maintain code quality.

## Project Structure

### Root Level Configuration Files

```
├── .env.example              # Environment variables template (commit this)
├── .env.production           # Production environment config (don't commit)
├── .env.local                # Local development config (in .gitignore)
├── .env.*.local              # Environment-specific configs
├── .gitignore                # Git ignore rules
├── vite.config.ts            # Vite build configuration
├── tsconfig.json             # TypeScript configuration
├── tsconfig.app.json         # App-specific TypeScript config
├── tsconfig.node.json        # Node scripts TypeScript config
├── tailwind.config.ts        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── eslint.config.js          # ESLint rules
├── components.json           # Shadcn/UI components registry
├── package.json              # Project dependencies and scripts
└── index.html                # HTML entry point
```

### Source Directory (`src/`)

```
src/
├── components/               # React components
│   ├── GasTracker.tsx        # Main application component
│   ├── GasPriceCard.tsx      # Chain gas price display
│   ├── GasChart.tsx          # Chart component
│   ├── SimulationControls.tsx # Simulation inputs
│   ├── SimulationResults.tsx # Results display
│   ├── ErrorNotifications.tsx # Error UI
│   └── ui/                   # Shadcn/UI components (auto-generated)
│       ├── button.tsx
│       ├── card.tsx
│       ├── chart.tsx
│       └── ... (additional UI components)
├── config/                   # Configuration modules
│   ├── config.ts             # Environment config manager
│   └── providers.ts          # RPC provider endpoints
├── hooks/                    # Custom React hooks
│   ├── useGasStore.ts        # State management hook
│   ├── use-toast.ts          # Toast notifications
│   └── use-mobile.tsx        # Mobile detection
├── lib/                      # Utility libraries
│   ├── gas-utils.ts          # Gas calculations and formatting
│   ├── price-oracle.ts       # ETH/USD price oracle
│   ├── websocket-provider.ts # WebSocket connection handler
│   └── utils.ts              # General utilities
├── types/                    # TypeScript type definitions
│   └── gas.ts                # Gas tracker types and interfaces
├── pages/                    # Page components
│   ├── Index.tsx             # Home page
│   └── NotFound.tsx          # 404 page
├── App.tsx                   # Root component
├── main.tsx                  # Application entry point
├── index.css                 # Global Styles
└── vite-env.d.ts             # Vite environment type definitions
```

### Docker & Deployment Files

```
├── Dockerfile                # Container configuration
├── docker-compose.yml        # Multi-container setup
├── vercel.json               # Vercel deployment config
├── netlify.toml              # Netlify deployment config
└── .github/
    └── workflows/
        └── deploy.yml        # GitHub Actions CI/CD
```

### Documentation Files

```
├── README.md                 # Main project documentation
├── DEPLOYMENT.md             # Deployment guide for all platforms
├── PROJECT_SETUP.md          # This file - project organization guide
```

## Environment Configuration

### Development Setup (`.env.local`)

```env
# These are loaded automatically for development
VITE_ETHEREUM_RPC_WS=wss://mainnet.infura.io/ws/v3/YOUR_PROJECT_ID
VITE_POLYGON_RPC_WS=wss://polygon-mainnet.infura.io/ws/v3/YOUR_PROJECT_ID
VITE_ARBITRUM_RPC_WS=wss://arbitrum-mainnet.infura.io/ws/v3/YOUR_PROJECT_ID

VITE_APP_ENV=development
VITE_DEBUG_LOGGING=true
```

### Production Setup (`.env.production`)

```env
# Used when deploying to production
VITE_ETHEREUM_RPC_WS=wss://mainnet.infura.io/ws/v3/YOUR_PRODUCTION_PROJECT_ID
VITE_POLYGON_RPC_WS=wss://polygon-mainnet.infura.io/ws/v3/YOUR_PRODUCTION_PROJECT_ID
VITE_ARBITRUM_RPC_WS=wss://arbitrum-mainnet.infura.io/ws/v3/YOUR_PRODUCTION_PROJECT_ID

VITE_APP_ENV=production
VITE_DEBUG_LOGGING=false
```

## Development Workflow

### Initial Setup

```bash
# 1. Clone repository
git clone https://github.com/charanxcode/gas-whisperer-oracle.git
cd gas-whisperer-oracle

# 2. Install dependencies
bun install
# or: npm install

# 3. Create local environment file
cp .env.example .env.local

# 4. Edit environment file with your Infura keys
nano .env.local  # or use your preferred editor

# 5. Start development server
bun run dev
# or: npm run dev
```

### Daily Development

```bash
# Start dev server (with hot reload)
bun run dev

# In another terminal, run type checking
bun run type-check

# Run linter
bun run lint

# Fix linting issues
bun run lint:fix
```

### Before Committing

```bash
# Run all checks
bun run lint
bun run type-check
bun run build

# If all pass, commit changes
git add .
git commit -m "Description of changes"
git push origin branch-name
```

## Code Organization Best Practices

### Components

**Naming Convention**: PascalCase (e.g., `GasTracker.tsx`)

**Structure**:
```typescript
// Imports
import React from 'react';
import { useGasStore } from '@/hooks/useGasStore';
import { Button } from '@/components/ui/button';

// Component definition
export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // Hooks
  const state = useGasStore();
  
  // Handlers
  const handleClick = () => { /* ... */ };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

### Hooks

**Naming Convention**: `useNameOfHook` (e.g., `useGasStore.ts`)

**Usage**:
```typescript
// Custom hook
export const useGasStore = () => {
  const [state, setState] = useState(initialState);
  
  const actions = {
    updateChainData: (chain, data) => { /* ... */ }
  };
  
  return { state, actions };
};

// Component usage
const { state, actions } = useGasStore();
```

### Utilities

**Location**: `src/lib/`

**Naming Convention**: `descriptive-name.ts`

**Example Structure**:
```typescript
// src/lib/gas-utils.ts
export const calculateGasCost = (/*...*/) => { /* ... */ };
export const formatGasPrice = (/*...*/) => { /* ... */ };
export const generateMockGasPrice = (/*...*/) => { /* ... */ };
```

### Types

**Location**: `src/types/`

**Naming Convention**: Descriptive names matching their domain

**Example Structure**:
```typescript
// src/types/gas.ts
export interface ChainData {
  baseFee: number;
  priorityFee: number;
  // ...
}

export type ChainName = 'ethereum' | 'polygon' | 'arbitrum';
```

## Build and Deployment

### Local Build

```bash
# Development build
bun run build:dev

# Production build (optimized)
bun run build:prod

# Or standard build
bun run build

# Preview production build
bun run preview
```

### Deployment Targets

| Platform | Build Command | Deploy Command |
|----------|---------------|----------------|
| Vercel | Auto | Auto |
| Netlify | Auto | Auto |
| GitHub Pages | `bun run build` | `git subtree push` |
| Docker | `docker build -t gas-whisperer .` | `docker run` |
| AWS S3 | `bun run build` | AWS CLI upload |

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions for each platform.

## Performance Optimization

### Bundle Size

Current production bundle size: **~280KB (gzipped)**

To check bundle size:
```bash
# Build and analyze
bun run build

# View dist/ size
du -sh dist/
```

### Code Splitting

Vite automatically handles code splitting for:
- Dynamic imports
- Route-based splitting
- Vendor separation

### Caching Strategy

- Static assets: 1 year cache
- HTML: No cache (must revalidate)
- JS/CSS: Max age with version hashing

## Testing & Quality

### TypeScript Type Checking

```bash
# Check for type errors
bun run type-check

# Fix TypeScript errors
# Edit files according to error messages
```

### ESLint Rules

```bash
# Check for linting issues
bun run lint

# Auto-fix issues
bun run lint:fix
```

### Manual Testing Checklist

- [ ] All chains display current gas prices
- [ ] Real-time updates occur every 6 seconds
- [ ] Chart data updates smoothly
- [ ] Simulation cost calculation is accurate
- [ ] Error notifications appear and dismiss properly
- [ ] Mobile responsiveness works correctly
- [ ] Dark theme renders correctly
- [ ] Network errors are handled gracefully

## Common Issues & Solutions

### Issue: WebSocket Connection Fails

**Solution**: 
```bash
# 1. Check environment variables
echo $VITE_ETHEREUM_RPC_WS

# 2. Ensure no "YOUR_" placeholder remains
# 3. Restart dev server
# 4. Clear browser cache
```

### Issue: Build Fails Locally

**Solution**:
```bash
# 1. Clear cache
rm -rf node_modules dist

# 2. Reinstall dependencies
bun install

# 3. Rebuild
bun run build
```

### Issue: Type Errors in IDE

**Solution**:
```bash
# 1. TypeScript version mismatch
npm install -D typescript@latest

# 2. Restart TSServer in IDE
# 3. Run type-check
bun run type-check
```

### Issue: Environment Variables Not Loading

**Solution**:
```bash
# 1. Ensure file is named .env.local (not .env)
# 2. Variables must start with VITE_ prefix
# 3. Restart dev server after .env change
# 4. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
```

## Version Control

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, perf, test, chore

**Examples**:
```
feat: Add real-time gas tracking for Arbitrum
fix: Handle WebSocket reconnection properly
docs: Updated deployment guide for Vercel
refactor: Extract gas calculation logic to utils
```

### Important Files to Never Commit

```
❌ .env.local          (local environment variables)
❌ .env.production     (production secrets)
❌ node_modules/       (install locally)
❌ dist/               (build output)
❌ .DS_Store          (macOS system files)
```

## Dependencies Management

### Adding New Package

```bash
# Add to project
bun add package-name

# Add as dev dependency
bun add -D package-name

# Update all dependencies
bun update
```

### Updating Dependencies

```bash
# Check for updates
bun update --latest

# Then test thoroughly!
bun run build
bun run lint
bun run type-check
```

## Performance Profiles

### Development Mode

- Fast hot reload: <300ms
- Type checking: Async
- Linting: On save (optional)

### Production Build

- Tree-shaking enabled
- Code minification
- CSS purging
- Asset compression
- Source maps (optional)

## Resources & Documentation

- **[Vite Docs](https://vitejs.dev/)** - Build tool
- **[React Docs](https://react.dev/)** - Framework
- **[TypeScript Docs](https://www.typescriptlang.org/)** - Type system
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Infura Docs](https://docs.infura.io/)** - Blockchain RPC

## Support

For issues or questions:
1. Check existing GitHub issues
2. Review error messages in console
3. Check documentation files
4. Open a new GitHub issue with details

---

**Version**: 1.0.0 | **Last Updated**: March 2026
