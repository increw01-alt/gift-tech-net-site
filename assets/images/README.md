# assets/images

이 폴더의 이미지는 Wix 사이트(gift-tech.net)에 올라가 있던 원본을 그대로 가져옵니다.
프로젝트 루트에서 아래 중 하나를 실행하면 `scripts/assets.txt` 목록대로 내려받습니다.

```bash
# WSL / macOS / Linux
bash scripts/fetch-assets.sh
```

```powershell
# Windows PowerShell
powershell -ExecutionPolicy Bypass -File scripts\fetch-assets.ps1
```

이미지가 아직 없어도 사이트는 정상 표시됩니다(로고는 텍스트, 브랜드 로고는 이니셜, 단계 스크린샷은 숨김).

| 파일 | 사용 위치 |
|---|---|
| logo.png | 헤더·푸터 로고 (원본 그대로, 크기만 조절) |
| favicon.png | 브라우저 탭 아이콘 (없으면 favicon.svg 사용) |
| og-image.png | 카카오톡·페이스북 공유 썸네일 (2500×1330) |
| icon-chat-bubble.png | 파란 상담 카드/띠 배너의 말풍선 아이콘 |
| channeltalk-consult.png | 신뢰 섹션·CTA 의 채널톡 화면 이미지 |
| brand-plusu / moapin / plusmoon / pinq.png | 협회 운영·인증 사이트 로고 |
| step-01 ~ step-07.png | 상품권 현금화 7단계 플러스핀 화면 |
| step-chat.png | (예비) 추가 문의 카드 이미지 — 현재 미사용 |
| hero-home.jpg | 메인·재테크·구입처·고객센터 히어로 배경 (입자 네트워크, 패럴랙스) |
| bg-wave.jpg | 메인 2단 왼쪽 패널 배경 (스크롤 시 가로 패닝) |
| kga-frame.png | 메인 협회 섹션 네이비 블록 / 재테크 02 패널 |
| hero-cashout.jpg | 상품권 현금화 히어로 배경 |
| hero-installment.jpg | 상품권 할부구매 히어로 배경 |
| bg-benefits.jpg | 할부구매 장점 섹션 흐린 배경 |
| illus-shopping.png | 현금화 "상품권 더 필요하신가요?" 3D 일러스트 |
| banner-cultureland.png | 할부구매 절차 왼쪽 세로 배너 |
| card-channeltalk.png | 할부구매 "채널톡으로 간편하게" 카드 |
| gift-cert-stack.png | 재테크 히어로 오른쪽 상품권 이미지 |
| photo-plusu / moapin / plusmoon / pinq.jpg | 현금화 브랜드 카드 배경 사진 |
