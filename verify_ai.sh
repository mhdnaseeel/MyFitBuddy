#!/bin/bash

# Configuration
AUTH_URL="http://localhost:8080/api/auth"
WORKOUT_URL="http://localhost:8080/api/workout"
EMAIL="testuser@example.com"
PASSWORD="password123"

# 1. Signin to get Token
echo "--- authenticating ---"
RESPONSE=$(curl -s -X POST $AUTH_URL/signin \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Signin Failed"
  echo "Response: $RESPONSE"
  exit 1
else
  echo "Token received"
fi
echo ""

# 2. Generate Workout
echo "--- Testing Workout Generation ---"
echo "Sending Request..."
curl -v -X POST $WORKOUT_URL/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "Build Muscle",
    "preferences": "3 days a week"
  }'
echo ""
