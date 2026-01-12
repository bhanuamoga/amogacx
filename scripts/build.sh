#!/usr/bin/env bash
set -euo pipefail

echo "🔨 Building production bundle"
npm run build
echo "✅ Build complete. You can preview locally with npm run start"
