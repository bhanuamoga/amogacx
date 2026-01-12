#!/usr/bin/env bash
set -euo pipefail

# load env vars
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

INDEX_NAME="${PINECONE_INDEX:-my-ai}"
DOC_DIR="${1:-./docs}"

echo "📤 Upserting documents in ${DOC_DIR} to Pinecone index '${INDEX_NAME}'"
node scripts/upsert-pinecone.js "$INDEX_NAME" "$DOC_DIR"

echo "✅ Documents upserted."
