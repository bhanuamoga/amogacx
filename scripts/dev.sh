#!/usr/bin/env bash
set -euo pipefail

# load env vars
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "🚀 Starting Next.js dev server on http://localhost:3000"
npm run dev
