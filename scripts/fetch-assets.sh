#!/usr/bin/env bash
# gift-tech.net — Wix CDN 에 남아 있는 이미지 자산을 assets/images/ 로 내려받습니다.
# 실행 위치: 프로젝트 루트 (WSL / macOS / Linux)
#   bash scripts/fetch-assets.sh
# 이미 받은 파일은 건너뛰고, 실패한 파일은 마지막에 목록으로 보여줍니다.

set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LIST="$ROOT/scripts/assets.txt"
DEST="$ROOT/assets/images"
mkdir -p "$DEST"

ok=0; skip=0; fail=0; failed=()
while IFS=$'\t' read -r name url; do
  [[ -z "${name:-}" || "${name:0:1}" == "#" ]] && continue
  out="$DEST/$name"
  if [[ -s "$out" ]]; then
    echo "skip   $name (이미 있음)"; skip=$((skip+1)); continue
  fi
  if curl -fsSL --retry 2 --max-time 30 -A "Mozilla/5.0" -o "$out.part" "$url"; then
    mv "$out.part" "$out"
    echo "ok     $name"; ok=$((ok+1))
  else
    rm -f "$out.part"
    echo "FAIL   $name"; fail=$((fail+1)); failed+=("$name  $url")
  fi
done < "$LIST"

echo
echo "완료: 받음 $ok / 건너뜀 $skip / 실패 $fail"
if (( fail > 0 )); then
  echo "실패한 파일은 브라우저에서 URL 을 열어 수동 저장 후 assets/images/ 에 같은 이름으로 넣어 주세요:"
  printf '  %s\n' "${failed[@]}"
  exit 1
fi
