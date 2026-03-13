# 🚀 Deployment & Hosting Guide

This guide explains how to build, configure, and deploy the Gas Whisperer Oracle application to various hosting platforms.

## Prerequisites

- **Node.js**: v18 or higher
- **Bun**: Latest version (recommended) or npm
- **Git**: For version control
- **Infura Account**: For WebSocket RPC endpoints ([Get Free API Key](https://www.infura.io/))

## Setup Instructions

### 1. Local Environment Setup

```bash
# Clone the repository
git clone https://github.com/charanxcode/gas-whisperer-oracle.git
cd gas-whisperer-oracle

# Install dependencies (using Bun)
bun install

# Or using npm
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit the .env.local file with your Infura Project ID
nano .env.local
```

**Required Environment Variables:**

```env
# Ethereum Mainnet
VITE_ETHEREUM_RPC_WS=wss://mainnet.infura.io/ws/v3/YOUR_INFURA_PROJECT_ID

# Polygon Mainnet
VITE_POLYGON_RPC_WS=wss://polygon-mainnet.infura.io/ws/v3/YOUR_INFURA_PROJECT_ID

# Arbitrum Mainnet
VITE_ARBITRUM_RPC_WS=wss://arbitrum-mainnet.infura.io/ws/v3/YOUR_INFURA_PROJECT_ID

# Optional Configuration
VITE_APP_ENV=development
VITE_DEBUG_LOGGING=false
VITE_GAS_UPDATE_INTERVAL=6000
VITE_PRICE_UPDATE_INTERVAL=10000
```

### 3. Local Development

```bash
# Start development server
bun run dev

# Or with npm
npm run dev

# Server will be available at http://localhost:8080
```

### 4. Build for Production

```bash
# Build the application
bun run build

# Built files will be in the dist/ directory
```

## Deployment Platforms

### 🔹 Vercel (Recommended for Ease)

**Advantages:**
- Automatic deployments on git push
- Zero-config deployment for static sites
- Great for Next.js/Vite projects
- Free tier available
- Environment variable management through UI

**Steps:**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/import
   - Select your GitHub repository
   - Click "Import Project"

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all `VITE_*` variables from your `.env.production`

4. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be available at `https://your-project.vercel.app`

**Vercel Configuration** (already provided in `vercel.json`):
```json
{
  "buildCommand": "bun run build",
  "devCommand": "bun run dev",
  "installCommand": "bun install",
  "output": "./dist"
}
```

### 🔹 Netlify

**Advantages:**
- Simple deployment from Git
- Built-in form handling
- Analytics and monitoring
- Global CDN

**Steps:**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com/
   - Click "New site from Git"
   - Select GitHub and your repository

3. **Configure Build**
   - Build command: `bun run build`
   - Publish directory: `dist`
   - Environment variables: Add your `VITE_*` variables

4. **Deploy**
   - Netlify will automatically build and deploy on push
   - Your app will be available at `https://your-app-name.netlify.app`

**Netlify Configuration** (already provided in `netlify.toml`):
```toml
[build]
  command = "bun run build"
  publish = "dist"
```

### 🔹 Docker & Docker Compose

**Advantages:**
- Consistent environment across platforms
- Easy to deploy anywhere
- Self-contained application
- Great for internal deployment

**Local Docker Build & Run:**

```bash
# Build the Docker image
docker build -t gas-whisperer-oracle .

# Run the container
docker run -p 3000:3000 \
  -e VITE_ETHEREUM_RPC_WS="wss://..." \
  -e VITE_POLYGON_RPC_WS="wss://..." \
  -e VITE_ARBITRUM_RPC_WS="wss://..." \
  gas-whisperer-oracle

# Application will be available at http://localhost:3000
```

**Docker Compose:**

```bash
# Create .env file with your configuration
cp .env.example .env

# Edit .env with your values
nano .env

# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

**Dockerfile Details:**
- **Builder Stage**: Installs dependencies and builds the app
- **Production Stage**: Uses lightweight Alpine image with `serve`
- **Health Check**: Ensures container is running properly
- **Multi-Stage Build**: Reduces final image size

### 🔹 GitHub Pages

**Advantages:**
- Free hosting directly from your repository
- No server costs
- Perfect for static sites

**Steps:**

1. **Build locally first**
   ```bash
   bun run build
   ```

2. **Push dist folder to gh-pages branch**
   ```bash
   git add dist
   git commit -m "Build for deployment"
   git push origin main

   # Deploy dist to gh-pages
   git subtree push --prefix dist origin gh-pages
   ```

3. **Configure GitHub Pages**
   - Go to Settings → Pages
   - Select "gh-pages" branch as source

4. **Access your site**
   - https://your-username.github.io/gas-whisperer-oracle

### 🔹 AWS (S3 + CloudFront)

**Advantages:**
- Highly scalable
- Global content delivery
- Pay-as-you-go pricing
- Enterprise-grade infrastructure

**Steps:**

1. **Build the application**
   ```bash
   bun run build
   ```

2. **Create S3 bucket**
   - Enable static website hosting
   - Upload dist folder contents

3. **Create CloudFront distribution**
   - Point to your S3 bucket
   - Configure SSL/TLS certificate

4. **Configure DNS** (Route 53 or your DNS provider)

### 🔹 Railway / Render / Heroku

**Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway init

# Deploy
railway up
```

**Render:**
- Connect your GitHub repository
- Set build command: `bun run build`
- Set publish directory: `dist`
- Add environment variables

## CI/CD Pipeline

Automatic deployment on git push to main branch is configured via GitHub Actions (`.github/workflows/deploy.yml`):

**Setup:**

1. Add Vercel secrets to GitHub repository:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

2. Workflow triggers automatically on:
   - Push to `main` branch
   - Pull requests for testing

## Production Best Practices

### 1. Environment Configuration

```bash
# For production, use .env.production
cp .env.production .env.production.local

# Edit with production values
nano .env.production.local
```

### 2. Build Optimization

```bash
# Production build with optimizations
bun run build

# Preview production build locally
bun run preview
```

### 3. Security

- ✅ Never commit sensitive API keys to Git
- ✅ Use environment variables for all secrets
- ✅ Enable CORS only for trusted domains
- ✅ Keep dependencies updated: `bun update`
- ✅ Use HTTPS for all connections

### 4. Monitoring

- Enable error tracking (Sentry, LogRocket)
- Monitor WebSocket connections
- Set up uptime monitoring
- Use analytics to track user behavior

### 5. Performance

- Use CDN for static assets
- Enable gzip compression
- Minify CSS/JS (automatic with Vite)
- Cache static files with proper headers
- Monitor Core Web Vitals

## Troubleshooting

### WebSocket Connection Issues

```javascript
// Check WebSocket configuration
console.log(import.meta.env.VITE_ETHEREUM_RPC_WS);

// Ensure PROJECT_ID is set to actual Infura ID, not placeholder
// Check browser console for connection errors
```

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
bun install
bun run build

# Or with npm
npm ci
npm run build
```

### Environment Variables Not Loading

```bash
# Check environment file is properly named
ls -la .env*

# Verify variables are exported correctly
echo $VITE_ETHEREUM_RPC_WS

# Rebuild after changing .env
bun run build
```

## Performance Metrics

Typical performance on production deployments:

- **First Contentful Paint (FCP)**: ~1.2s
- **Largest Contentful Paint (LCP)**: ~1.8s
- **Cumulative Layout Shift (CLS)**: <0.1
- **Time to Interactive (TTI)**: ~2.3s
- **Bundle Size**: ~280KB (gzipped)

## Support & Resources

- **Infura Documentation**: https://docs.infura.io/
- **Vite Documentation**: https://vitejs.dev/
- **React Documentation**: https://react.dev/
- **GitHub Issues**: Report bugs and feature requests

---

**Last Updated**: March 2026
