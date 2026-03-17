#!/bin/bash

# Requires an admin token as the first argument, the user ID to upgrade as the second argument, and the new role as the third
ADMIN_TOKEN=$1
TARGET_USER_ID=$2
NEW_ROLE=$3

if [ -z "$ADMIN_TOKEN" ] || [ -z "$TARGET_USER_ID" ] || [ -z "$NEW_ROLE" ]; then
  echo "Usage: ./upgrade-role.sh <admin_jwt_token> <target_user_id> <new_role>"
  echo "Roles available: admin, doctor, invited"
  exit 1
fi

curl -X POST http://localhost:3000/v1/auth/admin/upgrade-user \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "'"$TARGET_USER_ID"'",
    "role": "'"$NEW_ROLE"'"
  }' | jq .
