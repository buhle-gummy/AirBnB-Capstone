#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORK="$(mktemp -d /tmp/airbnb-submission-check.XXXXXX)"
API_PORT="${CHECK_PORT:-5120}"
API_LOG="$WORK/backend.log"
API_PID=""

cleanup() {
  if [[ -n "$API_PID" ]]; then kill "$API_PID" 2>/dev/null || true; fi
  chmod -R u+rwX "$WORK" 2>/dev/null || true
  rm -rf "$WORK" 2>/dev/null || true
}
trap cleanup EXIT

pass() { printf 'PASS  %s\n' "$1"; }
fail() { printf 'FAIL  %s\n' "$1"; exit 1; }
warn() { printf 'WARN  %s\n' "$1"; }

for required in README.md SUBMISSION-CHECKLIST.md frontend admin backend; do
  [[ -e "$ROOT/$required" ]] || fail "required submission item is missing: $required"
done
pass "submission files and folders"

build_frontend() {
  local app="$1"
  local target="$WORK/$app"
  mkdir -p "$target"
  cp "$ROOT/$app/package.json" "$ROOT/$app/package-lock.json" "$ROOT/$app/index.html" "$ROOT/$app/vite.config.js" "$target/"
  cp -R "$ROOT/$app/src" "$target/"
  (cd "$target" && npm ci --ignore-scripts --no-audit --no-fund >/dev/null && npm run lint >/dev/null && npm run build >/dev/null)
  pass "$app lint and production build"
}

build_frontend frontend
build_frontend admin

(cd "$ROOT/backend" && node --check server.js && node --check controllers/userController.js && node --check controllers/accommodationController.js && node --check controllers/reservationController.js)
pass "backend syntax"

mkdir -p "$WORK/backend"
cp "$ROOT/backend/package.json" "$ROOT/backend/package-lock.json" "$ROOT/backend/server.js" "$WORK/backend/"
cp -R "$ROOT/backend/controllers" "$ROOT/backend/middleware" "$ROOT/backend/models" "$ROOT/backend/routes" "$WORK/backend/"
if [[ -f "$ROOT/backend/.env" ]]; then cp "$ROOT/backend/.env" "$WORK/backend/.env"; else cp "$ROOT/backend/.env.example" "$WORK/backend/.env"; fi
(cd "$WORK/backend" && npm ci --ignore-scripts --no-audit --no-fund >/dev/null)

PORT="$API_PORT" node "$WORK/backend/server.js" >"$API_LOG" 2>&1 &
API_PID=$!
READY=0
for _ in $(seq 1 15); do
  if curl -fsS "http://127.0.0.1:$API_PORT/api/health" >"$WORK/health.json"; then READY=1; break; fi
  sleep 1
done
[[ "$READY" == 1 ]] || { cat "$API_LOG"; fail "backend health endpoint"; }
pass "backend health endpoint"

health_body="$(cat "$WORK/health.json")"
[[ "$health_body" == *'"success":true'* ]] || fail "backend health response body"
pass "backend health response"

invalid_status="$(curl -sS -o "$WORK/invalid.json" -w '%{http_code}' -X POST "http://127.0.0.1:$API_PORT/api/users/register" -H 'Content-Type: application/json' -d '{"username":"A","email":"not-an-email","password":"123"}')"
[[ "$invalid_status" == "400" ]] || fail "registration validation (expected 400, got $invalid_status)"
pass "registration validation"

unauth_status="$(curl -sS -o "$WORK/unauth.json" -w '%{http_code}' "http://127.0.0.1:$API_PORT/api/reservations")"
[[ "$unauth_status" == "401" ]] || fail "protected reservation route (expected 401, got $unauth_status)"
pass "protected reservation route"

for _ in $(seq 1 15); do
  if grep -q 'MongoDB connected successfully' "$API_LOG"; then
    pass "MongoDB connection"
    printf '\nAll submission checks passed.\n'
    exit 0
  fi
  if grep -q 'MongoDB connection error' "$API_LOG"; then
    warn "MongoDB connection failed; fix Atlas network access/cluster status before submission"
    exit 2
  fi
  sleep 1
done
warn "MongoDB connection was not confirmed before the check ended"
exit 2

printf '\nAll submission checks passed.\n'
