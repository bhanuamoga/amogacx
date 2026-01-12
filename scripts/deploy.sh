#!/usr/bin/env bash
set -euo pipefail

# load env vars
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "🌐 Deploying to Vercel (production)…"
vercel --prod
