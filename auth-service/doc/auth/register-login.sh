#!/bin/bash

# Happy path: Register a new user and then login with the same credentials
# Reports success or failure for each step

BASE_URL="http://localhost:3000/v1/auth"
EMAIL="test_$(date +%s)@example.com"
NAME="Test User"
PASSWORD="securePassword123"

echo "========================================"
echo "  Happy Path: Register → Login"
echo "========================================"
echo ""
echo "Using email: $EMAIL"
echo ""

# Step 1: Register
echo "----------------------------------------"
echo "Step 1: Registering new user..."
echo "----------------------------------------"

REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$EMAIL"'",
    "name": "'"$NAME"'",
    "password": "'"$PASSWORD"'"
  }')

REGISTER_HTTP_CODE=$(echo "$REGISTER_RESPONSE" | tail -n 1)
REGISTER_BODY=$(echo "$REGISTER_RESPONSE" | sed '$d')

echo "$REGISTER_BODY" | jq .

if [ "$REGISTER_HTTP_CODE" -eq 201 ]; then
  echo "✅ Register: SUCCESS (HTTP $REGISTER_HTTP_CODE)"
else
  echo "❌ Register: FAILED (HTTP $REGISTER_HTTP_CODE)"
  exit 1
fi

echo ""

# Step 2: Login
echo "----------------------------------------"
echo "Step 2: Logging in with same credentials..."
echo "----------------------------------------"

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$EMAIL"'",
    "password": "'"$PASSWORD"'"
  }')

LOGIN_HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n 1)
LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')

echo "$LOGIN_BODY" | jq .

if [ "$LOGIN_HTTP_CODE" -eq 200 ]; then
  echo "✅ Login: SUCCESS (HTTP $LOGIN_HTTP_CODE)"
else
  echo "❌ Login: FAILED (HTTP $LOGIN_HTTP_CODE)"
  exit 1
fi

TOKEN=$(echo "$LOGIN_BODY" | jq -r '.token')

echo ""
echo "========================================"
echo "  All steps passed! ✅"
echo "========================================"
echo ""
echo "Token: $TOKEN"
echo ""

# Copy token to clipboard
if command -v xclip &> /dev/null; then
  echo -n "$TOKEN" | xclip -selection clipboard
  echo "📋 Token copied to clipboard! (xclip)"
elif command -v xsel &> /dev/null; then
  echo -n "$TOKEN" | xsel --clipboard
  echo "📋 Token copied to clipboard! (xsel)"
elif command -v pbcopy &> /dev/null; then
  echo -n "$TOKEN" | pbcopy
  echo "📋 Token copied to clipboard! (pbcopy)"
else
  echo "⚠️  No clipboard tool found (xclip, xsel, pbcopy). Install one to auto-copy."
  echo "    You can manually copy the token above."
fi
