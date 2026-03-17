#!/bin/bash

# Requires a token as an argument: ./refresh.sh <token>
TOKEN=$1

if [ -z "$TOKEN" ]; then
  echo "Usage: ./refresh.sh <jwt_token>"
  exit 1
fi

curl -X POST http://localhost:3000/v1/auth/refresh \
  -H "Authorization: Bearer $TOKEN" | jq .
