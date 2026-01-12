#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/hoangsonww/Customizable-AI-Chatbot.git"
PROJECT_DIR="Customizable-AI-Chatbot"

echo "🔄 Cloning repository..."
if [ ! -d "$PROJECT_DIR" ]; then
  git clone "$REPO_URL"
else
  echo "→ $PROJECT_DIR already exists, pulling latest..."
  cd "$PROJECT_DIR"
  git pull
  cd ..
fi

cd "$PROJECT_DIR"

echo "📦 Installing dependencies..."
if [ -f yarn.lock ]; then
  yarn install
else
  npm install
fi

echo "📝 Copying .env template"
if [ ! -f .env ]; then
  cp .env.template .env
  echo "⚠️  Please edit .env and fill in your API keys."
else
  echo ".env already exists, skipping."
fi

echo "✅ Setup complete. To start developing, run ./scripts/dev.sh"
