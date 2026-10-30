# gift-tech.net — Wix CDN 에 남아 있는 이미지 자산을 assets\images\ 로 내려받습니다.
# 실행 위치: 프로젝트 루트 (Windows PowerShell)
#   powershell -ExecutionPolicy Bypass -File scripts\fetch-assets.ps1
# 이미 받은 파일은 건너뛰고, 실패한 파일은 마지막에 목록으로 보여줍니다.

$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$List = Join-Path $Root "scripts\assets.txt"
$Dest = Join-Path $Root "assets\images"
New-Item -ItemType Directory -Force -Path $Dest | Out-Null

$ok = 0; $skip = 0; $fail = 0; $failed = @()
Get-Content -Path $List -Encoding UTF8 | ForEach-Object {
  $line = $_.Trim()
  if ($line -eq "" -or $line.StartsWith("#")) { return }
  $parts = $line -split "`t", 2
  if ($parts.Count -lt 2) { return }
  $name = $parts[0].Trim(); $url = $parts[1].Trim()
  $out = Join-Path $Dest $name
  if ((Test-Path $out) -and ((Get-Item $out).Length -gt 0)) {
    Write-Host "skip   $name (이미 있음)"; $script:skip++; return
  }
  try {
    Invoke-WebRequest -Uri $url -OutFile $out -TimeoutSec 30 -UserAgent "Mozilla/5.0" -UseBasicParsing
    Write-Host "ok     $name"; $script:ok++
  } catch {
    if (Test-Path $out) { Remove-Item $out -Force }
    Write-Host "FAIL   $name  ($($_.Exception.Message))" -ForegroundColor Yellow
    $script:fail++; $script:failed += "$name  $url"
  }
}

Write-Host ""
Write-Host "완료: 받음 $ok / 건너뜀 $skip / 실패 $fail"
if ($fail -gt 0) {
  Write-Host "실패한 파일은 브라우저에서 URL 을 열어 수동 저장 후 assets\images\ 에 같은 이름으로 넣어 주세요:"
  $failed | ForEach-Object { Write-Host "  $_" }
  exit 1
}
