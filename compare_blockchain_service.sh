#!/bin/bash
PROJECT_DIR="$HOME/landloyalty-website/landloyalty-presale-website"

echo "════════════════════════════════════════════════════════════════"
echo "🔍 BLOCKCHAIN SERVICE COMPARISON ANALYSIS"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📁 Checking for blockchainService.js..."
if [ ! -f "$PROJECT_DIR/src/services/blockchainService.js" ]; then
    echo "   ❌ File not found"
    exit 1
fi
echo "   ✅ File found"
echo ""

cd "$PROJECT_DIR"
echo "📊 File Statistics:"
echo "   Size: $(wc -c < src/services/blockchainService.js) bytes"
echo "   Lines: $(wc -l < src/services/blockchainService.js) lines"
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "📄 CURRENT blockchainService.js CONTENT:"
echo "════════════════════════════════════════════════════════════════"
echo ""
cat src/services/blockchainService.js
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "END OF FILE"
echo "════════════════════════════════════════════════════════════════"
