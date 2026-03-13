#!/bin/bash
# Project Health Check Script
# Run this to verify everything is properly configured

echo "🏥 Gas Whisperer Oracle - Project Health Check"
echo "=============================================="
echo ""

# Check Node Version
echo "✓ Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "  Node.js: $NODE_VERSION"

# Check Bun (if installed)
if command -v bun &> /dev/null; then
    BUN_VERSION=$(bun -v)
    echo "  Bun: $BUN_VERSION (installed)"
else
    echo "  Bun: Not installed (optional)"
fi

# Check Git
echo ""
echo "✓ Checking Git..."
git status > /dev/null 2>&1
if [ $? -eq 0 ]; then
    BRANCH=$(git branch --show-current)
    echo "  Git branch: $BRANCH ✓"
else
    echo "  Git: Not initialized ✗"
fi

# Check dependencies
echo ""
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]; then
    PACKAGE_COUNT=$(find node_modules -maxdepth 1 -type d | wc -l)
    echo "  Packages installed: ~$PACKAGE_COUNT ✓"
else
    echo "  node_modules: Not found ✗"
    echo "  Run: bun install or npm install"
fi

# Check key files
echo ""
echo "✓ Checking project structure..."
FILES=(
    "package.json"
    "vite.config.ts"
    "tsconfig.json"
    "tailwind.config.ts"
    ".env.example"
    "src/App.tsx"
    "src/main.tsx"
    "index.html"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file (missing)"
    fi
done

# Check environment setup
echo ""
echo "✓ Checking environment configuration..."
if [ -f ".env.local" ]; then
    echo "  .env.local: Found ✓"
else
    echo "  .env.local: Not found ✗"
    echo "  Run: cp .env.example .env.local"
fi

# Check configuration
echo ""
echo "✓ Checking source configuration..."
CONFIG_FILES=(
    "src/config/config.ts"
    "src/config/providers.ts"
    "src/types/gas.ts"
    "src/lib/gas-utils.ts"
    "src/hooks/useGasStore.ts"
)

for file in "${CONFIG_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file (missing)"
    fi
done

# Check build capability
echo ""
echo "✓ Checking build capability..."
if command -v bun &> /dev/null; then
    BUILD_CMD="bun"
elif command -v npm &> /dev/null; then
    BUILD_CMD="npm"
else
    BUILD_CMD="none"
fi

if [ "$BUILD_CMD" != "none" ]; then
    echo "  Build tool: $BUILD_CMD ✓"
else
    echo "  Build tool: Not found ✗"
fi

# Summary
echo ""
echo "=============================================="
echo "✅ Health check complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Ensure all ✓ items above"
echo "   2. Run: npm install (if not done)"
echo "   3. Create: cp .env.example .env.local"
echo "   4. Configure: Add Infura Project ID to .env.local"
echo "   5. Start: npm run dev"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Project overview"
echo "   - PROJECT_SETUP.md - Project structure guide"
echo "   - DEPLOYMENT.md - Hosting & deployment guide"
echo ""
