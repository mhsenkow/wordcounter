#!/usr/bin/env bash
# Curl matrix for live ibm.io deploy. Exit 1 on any miss.
set -euo pipefail
BASE="${VERIFY_BASE:-https://www.ibm.io}"
GG_IP="${GG_IP:-184.154.70.198}"
CACHE_V=44
fail=0

check() {
  local url="$1"
  local label="${2:-$url}"
  local out code size
  out=$(curl -sS -o /dev/null -w "%{http_code} %{size_download}" "$url" 2>/dev/null || echo "000 0")
  code="${out%% *}"
  size="${out##* }"
  if [[ "$code" != "200" ]] || [[ "${size:-0}" -lt 100 ]]; then
    echo "FAIL $label → $code ($size bytes)"
    fail=$((fail + 1))
  else
    echo "OK   $label → $code ($size bytes)"
  fi
}

echo "== Cloudflare Worker ($BASE) =="
for path in \
  /wordcount/ /timecount/ /tools/ \
  /bill/ /hourly/ /budget/ /fuel/ /tax/ \
  /unit/ /dose/ /bitrate/ /scalemap/ /pace/ \
  /ratio/ /typescale/ /exposure/ /contrast/ \
  /odds/ /combo/ /deal/ /sample/ /streak/ /bayes/; do
  check "${BASE}${path}" "$path"
done

for asset in \
  "/lib/number-tool.js?v=${CACHE_V}" \
  "/lib/number-tool.css?v=${CACHE_V}" \
  "/lib/deep-viz.js" \
  "/lib/vega.min.js" \
  "/lib/vega-lite.min.js" \
  "/lib/vega-embed.min.js" \
  "/lib/regl.min.js" \
  "/lib/suite.js?v=${CACHE_V}"; do
  check "${BASE}${asset}" "$asset"
done

echo ""
echo "== GreenGeeks origin spot-check (Host: ibm.io) =="
for path in /bill/ /wordcount/ /lib/deep-viz.js; do
  out=$(curl -sS -o /dev/null -w "%{http_code} %{size_download}" -H "Host: ibm.io" "http://${GG_IP}${path}" 2>/dev/null || echo "000 0")
  code="${out%% *}"
  size="${out##* }"
  if [[ "$code" != "200" ]] || [[ "$size" -lt 100 ]]; then
    echo "FAIL GG $path → $code ($size bytes)"
    fail=$((fail + 1))
  else
    echo "OK   GG $path → $code ($size bytes)"
  fi
done

echo ""
if [[ "$fail" -gt 0 ]]; then
  echo "$fail live check(s) failed"
  exit 1
fi
echo "all live checks passed"
