#!/bin/bash

# Requires a token as an argument: ./logout.sh <token>
TOKEN=$1

if [ -z "$TOKEN" ]; then
  echo "Usage: ./logout.sh <jwt_token>"
  exit 1
fi

curl -X POST http://localhost:3000/v1/auth/logout \
  -H "Authorization: Bearer $TOKEN" | jq .
