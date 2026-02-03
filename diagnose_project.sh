#!/bin/bash
# ============================================================================
# PROJECT DIAGNOSTIC SCRIPT
# ============================================================================

echo "═══════════════════════════════════════════════════════════════"
echo "🔍 LANDLOYALTY PRESALE - PROJECT DIAGNOSTIC"
echo "═══════════════════════════════════════════════════════════════"
echo ""

PROJECT_DIR="$HOME/landloyalty-website/landloyalty-presale-website"

# ============================================================================
# STEP 1: Verify project exists
# ============================================================================
echo "📁 STEP 1: Checking project location..."
if [ -d "$PROJECT_DIR" ]; then
    echo "   ✅ Project found at: $PROJECT_DIR"
    cd "$PROJECT_DIR"
else
    echo "   ❌ Project not found at: $PROJECT_DIR"
    exit 1
fi
echo ""

# ============================================================================
# STEP 2: Show project structure
# ============================================================================
echo "📂 STEP 2: Project structure..."
echo "   Main directories:"
ls -la src/ | grep "^d" | awk '{print "   ", $9}'
echo ""

# ============================================================================
# STEP 3: List all TypeScript/JavaScript files in src
# ============================================================================
echo "📄 STEP 3: All source files..."
find src/ -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) | head -30
echo "   (showing first 30 files)"
echo ""

# ============================================================================
# STEP 4: Check existing services
# ============================================================================
echo "🔧 STEP 4: Existing services..."
echo "   Services in src/services/:"
ls -lh src/services/ 2>/dev/null || echo "   ⚠️  services directory not found"
echo ""

# ============================================================================
# STEP 5: Find App.tsx location
# ============================================================================
echo "📍 STEP 5: Locating App.tsx..."
find src/ -name "App.tsx" -type f
echo ""

# ============================================================================
# STEP 6: Check App.tsx imports (first 50 lines)
# ============================================================================
echo "📦 STEP 6: Current imports in App.tsx (first 50 lines)..."
head -50 src/App.tsx | grep "^import" | head -20
echo ""

# ============================================================================
# STEP 7: Find balance-related state declarations
# ============================================================================
echo "💰 STEP 7: Current balance state declarations..."
echo "   Searching for balance state in App.tsx:"
grep -n "useState.*[Bb]alance\|const.*balance.*=" src/App.tsx | head -10
echo ""

# ============================================================================
# STEP 8: Find balance fetching functions
# ============================================================================
echo "🔄 STEP 8: Balance fetching functions..."
echo "   Searching for balance fetch logic:"
grep -n "getBalance\|fetchBalance\|connection.getBalance" src/App.tsx | head -10
echo ""

# ============================================================================
# STEP 9: Check for existing useEffect with balance fetching
# ============================================================================
echo "⚡ STEP 9: useEffect hooks related to balance..."
echo "   Lines with useEffect that might fetch balance:"
grep -n "useEffect" src/App.tsx | head -10
echo ""

# ============================================================================
# STEP 10: Find where balance is displayed in JSX
# ============================================================================
echo "🎨 STEP 10: Balance display in JSX..."
echo "   Searching for balance display:"
grep -n "[Bb]alance.*{" src/App.tsx | head -10
echo ""

# ============================================================================
# STEP 11: Check blockchain config
# ============================================================================
echo "⚙️ STEP 11: Blockchain configuration..."
if [ -f "src/config/blockchain-config.ts" ]; then
    echo "   ✅ blockchain-config.ts found"
    echo "   Token mint addresses (if any):"
    grep -n "USDC\|USDT\|mint" src/config/blockchain-config.ts | head -10
else
    echo "   ⚠️  blockchain-config.ts not found"
fi
echo ""

# ============================================================================
# STEP 12: Check purchase service
# ============================================================================
echo "💳 STEP 12: Purchase service..."
if [ -f "src/services/purchaseService.ts" ]; then
    echo "   ✅ purchaseService.ts found"
    echo "   Size: $(wc -l < src/services/purchaseService.ts) lines"
    echo "   Payment methods mentioned:"
    grep -n "SOL\|USDC\|USDT" src/services/purchaseService.ts | head -10
else
    echo "   ⚠️  purchaseService.ts not found"
fi
echo ""

# ============================================================================
# STEP 13: Check BuySection component
# ============================================================================
echo "🛒 STEP 13: BuySection component..."
if [ -f "src/components/presale/BuySection.tsx" ]; then
    echo "   ✅ BuySection.tsx found"
    echo "   Props interface:"
    grep -n "interface.*Props\|balance" src/components/presale/BuySection.tsx | head -10
else
    echo "   ⚠️  BuySection.tsx not found"
fi
echo ""

# ============================================================================
# STEP 14: Check for existing token balance service
# ============================================================================
echo "🔍 STEP 14: Checking for existing balance service..."
find src/ -name "*balance*" -o -name "*token*" | grep -i service
echo ""

# ============================================================================
# STEP 15: Show App.tsx connection setup
# ============================================================================
echo "🔌 STEP 15: Connection and wallet setup in App.tsx..."
echo "   Looking for connection initialization:"
grep -n "new Connection\|useConnection\|connection.*=" src/App.tsx | head -5
echo ""

# ============================================================================
# STEP 16: Find where wallet address is used
# ============================================================================
echo "👛 STEP 16: Wallet address usage..."
echo "   Wallet address/pubkey references:"
grep -n "address\|publicKey\|walletAddress" src/App.tsx | head -10
echo ""

# ============================================================================
# STEP 17: Show actual balance fetching code (50 lines context)
# ============================================================================
echo "📝 STEP 17: Actual balance fetching implementation..."
echo "   Showing balance fetch code with context:"
grep -n -A 30 "const fetchBalance\|function fetchBalance" src/App.tsx | head -50
echo ""

# ============================================================================
# STEP 18: Check console errors in browser
# ============================================================================
echo "🐛 STEP 18: Browser console errors (if any)..."
echo "   Please check your browser F12 console and copy any errors"
echo "   Common error patterns to look for:"
echo "   - Token account not found"
echo "   - getBalance errors"
echo "   - RPC errors"
echo ""

# ============================================================================
# SUMMARY
# ============================================================================
echo "═══════════════════════════════════════════════════════════════"
echo "✅ DIAGNOSTIC COMPLETE"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "📋 NEXT STEPS:"
echo "   1. Copy this ENTIRE output"
echo "   2. Also share F12 console errors from browser"
echo "   3. I'll create exact fixes for YOUR code"
echo ""
echo "═══════════════════════════════════════════════════════════════"
