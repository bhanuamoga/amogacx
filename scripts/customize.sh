#!/usr/bin/env bash
set -euo pipefail

# ----------------------------------------
# scripts/customize.sh
# Interactive configurator for your AI chatbot
# ----------------------------------------

CONFIG_UI="configuration/ui.ts"
CONFIG_ID="configuration/identity.ts"
CONFIG_INTENTION="configuration/intention.ts"

# Helper: prompt with default
prompt() {
  local var_name=$1
  local prompt_text=$2
  local default=$3
  read -p "$prompt_text [$default]: " input
  printf -v "$var_name" '%s' "${input:-$default}"
}

echo "🛠️  Starting interactive customization…"
echo

# 1) UI texts
echo "→ UI text customizations (in $CONFIG_UI)"
current_header=$(grep '^export const CHAT_HEADER' $CONFIG_UI | cut -d'`' -f2)
prompt CHAT_HEADER "Chat header text" "$current_header"

current_placeholder=$(grep '^export const MESSAGE_PLACEHOLDER' $CONFIG_UI | cut -d'`' -f2)
prompt MESSAGE_PLACEHOLDER "Message placeholder text" "$current_placeholder"

current_footer=$(grep '^export const FOOTER_MESSAGE' $CONFIG_UI | cut -d'`' -f2)
prompt FOOTER_MESSAGE "Footer message text" "$current_footer"

# apply UI replacements
sed -i.bak -E "s|^export const CHAT_HEADER.*|export const CHAT_HEADER: string = \`$CHAT_HEADER\`;|" $CONFIG_UI
sed -i.bak -E "s|^export const MESSAGE_PLACEHOLDER.*|export const MESSAGE_PLACEHOLDER: string = \`$MESSAGE_PLACEHOLDER\`;|" $CONFIG_UI
sed -i.bak -E "s|^export const FOOTER_MESSAGE.*|export const FOOTER_MESSAGE: string = \`$FOOTER_MESSAGE\`;|" $CONFIG_UI

echo "✅ Updated $CONFIG_UI"
echo

# 2) Identity
echo "→ Identity customizations (in $CONFIG_ID)"
current_owner=$(grep '^export const OWNER_NAME' $CONFIG_ID | cut -d'\`' -f2)
prompt OWNER_NAME "Owner name" "$current_owner"

current_ai_name=$(grep '^export const AI_NAME' $CONFIG_ID | cut -d'\`' -f2)
prompt AI_NAME "AI name" "$current_ai_name"

current_tone=$(grep '^export const AI_TONE' $CONFIG_ID | cut -d'\`' -f2)
prompt AI_TONE "AI tone" "$current_tone"

current_role=$(grep '^export const AI_ROLE' $CONFIG_ID | cut -d'\`' -f2)
prompt AI_ROLE "AI role description" "$current_role"

# apply identity replacements
sed -i.bak -E "s|^export const OWNER_NAME.*|export const OWNER_NAME: string = \`$OWNER_NAME\`;|" $CONFIG_ID
sed -i.bak -E "s|^export const AI_NAME.*|export const AI_NAME: string = \`$AI_NAME\`;|" $CONFIG_ID
sed -i.bak -E "s|^export const AI_TONE.*|export const AI_TONE: string = \`$AI_TONE\`;|" $CONFIG_ID
sed -i.bak -E "s|^export const AI_ROLE.*|export const AI_ROLE: string = \`$AI_ROLE\`;|" $CONFIG_ID

echo "✅ Updated $CONFIG_ID"
echo

# 3) Intention file
echo "→ Opening $CONFIG_INTENTION for any advanced tweaks…"
echo "(Make any system-prompt or behavior changes you like, then save & exit.)"
${EDITOR:-vi} $CONFIG_INTENTION
echo "✅ Finished customizing intention."

echo
echo "🎉 All done! You can now rebuild your project to see changes:"
echo "   npm run dev"
