#!/bin/bash

# Configuration
BASE_URL="http://localhost:8080/api/auth"
USER_URL="http://localhost:8080/api/user"
EMAIL="testuser@example.com"
PASSWORD="password123"

# 1. Signup
echo "--- Testing Signup ---"
curl -s -X POST $BASE_URL/signup \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}" | grep "User registered successfully" && echo "Signup Successful" || echo "Signup Failed or User Exists"
echo ""

# 2. Signin
echo "--- Testing Signin ---"
RESPONSE=$(curl -s -X POST $BASE_URL/signin \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Signin Failed"
  echo "Response: $RESPONSE"
  exit 1
else
  echo "Signin Successful"
  echo "Token received"
fi
echo ""

# 3. Get User Profile
echo "--- Testing Get Profile ---"
curl -s -X GET $USER_URL/profile \
  -H "Authorization: Bearer $TOKEN" | grep "$EMAIL" && echo "Get Profile Successful" || echo "Get Profile Failed"
echo ""
