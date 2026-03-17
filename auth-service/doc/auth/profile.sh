#!/bin/bash

# Requires a token as an argument: ./profile.sh <token>
TOKEN=$1

if [ -z "$TOKEN" ]; then
  echo "Usage: ./profile.sh <jwt_token>"
  exit 1
fi

curl -X GET http://localhost:3000/v1/auth/profile \
  -H "Authorization: Bearer $TOKEN" | jq .
