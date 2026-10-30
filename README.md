# gift-tech.net — 상테크 · 상품권재테크 × 한국상품권협회

Wix 에서 운영하던 사이트를 정적 HTML 로 옮긴 프로젝트입니다.
GitHub(`increw01-alt`) → Cloudflare Pages 자동 배포 구조이며, 빌드 과정 없이 저장소 그대로 배포됩니다.

```
gift-tech-net-site/
├─ index.html                 메인
├─ 상품권-재테크.html          /상품권-재테크      (Wix 와 동일한 URL 유지)
├─ 상품권-현금화.html          /상품권-현금화
├─ 상품권-할부구매.html        /상품권-할부구매
├─ 상품권-구입처.html          /상품권-구입처
├─ customer.html              /customer
├─ 404.html                   페이지 없음
├─ _redirects                 /blog → / 등 리다이렉트
├─ _headers                   보안·캐시 헤더
├─ robots.txt / sitemap.xml
├─ assets/
│  ├─ css/style.css           디자인 토큰 + 컴포넌트
│  ├─ js/main.js              메뉴·아이콘·이미지 폴백·상담 클릭 dataLayer
│  └─ images/                 이미지 (scripts/fetch-assets 로 채움)
├─ scripts/
│  ├─ assets.txt              Wix CDN 이미지 목록
│  ├─ fetch-assets.sh         WSL/Linux 용 다운로드
│  └─ fetch-assets.ps1        Windows PowerShell 용 다운로드
└─ README.md
```

스택: 정적 HTML + Tailwind CSS(CDN) + Pretendard + Lucide icons. 외부 폼·백엔드 없음(상담은 채널톡 링크).

---

## 1. 로컬에 풀기 (Windows)

1. 압축을 `C:\Users\OK\Desktop\gift-tech-net-site` 에 풉니다.
2. **이미지 내려받기** — Wix CDN 에 남아 있는 로고·브랜드 로고·단계 스크린샷을 가져옵니다. (Wix 해지 전에 꼭 한 번 실행)

   ```powershell
   # Windows PowerShell — 프로젝트 루트에서
   powershell -ExecutionPolicy Bypass -File scripts\fetch-assets.ps1
   ```
   ```bash
   # 또는 WSL
   cd /mnt/c/Users/OK/Desktop/gift-tech-net-site
   bash scripts/fetch-assets.sh
   ```
   실패한 파일이 있으면 출력된 URL 을 브라우저에서 열어 저장 후 `assets/images/` 에 같은 이름으로 넣으면 됩니다.
   이미지가 없어도 사이트는 깨지지 않습니다(로고는 텍스트, 브랜드 로고는 이니셜, 스크린샷은 숨김).

3. 로컬 확인:
   ```bash
   # WSL / 아무 폴더에서
   python3 -m http.server 8080
   # → http://localhost:8080  (Tailwind·폰트·아이콘은 CDN 이라 인터넷 필요)
   ```
   `file://` 로 직접 열면 절대경로(`/assets/...`)가 깨지니 꼭 서버로 확인하세요.

## 2. GitHub 저장소 만들기

```bash
# WSL, 프로젝트 루트
cd /mnt/c/Users/OK/Desktop/gift-tech-net-site
git init -b main
git add .
git commit -m "feat: gift-tech.net Wix → 정적 사이트 이전"
gh repo create increw01-alt/gift-tech-net-site --public --source=. --remote=origin --push
# gh 가 없으면 GitHub 에서 빈 저장소를 만든 뒤:
# git remote add origin https://github.com/increw01-alt/gift-tech-net-site.git && git push -u origin main
```

## 3. Cloudflare Pages 연결

Cloudflare 대시보드 → **Workers & Pages → Create → Pages → Connect to Git** → `gift-tech-net-site` 선택

| 항목 | 값 |
|---|---|
| Production branch | `main` |
| Framework preset | None |
| Build command | (비움) |
| Build output directory | `/` |
| 환경변수 | 없음 |

배포가 끝나면 `gift-tech-net-site.pages.dev` 에서 먼저 확인합니다. 특히 아래 두 가지:

- `https://gift-tech-net-site.pages.dev/상품권-현금화` 가 열리는지 (한글 파일명 서빙 확인)
- `/blog` 가 메인으로 301 되는지

## 4. 도메인 연결 — 순서가 중요합니다

도메인이 아직 Wix 에 등록되어 있는 동안은 네임서버를 바꿀 수 없으므로, **도메인 이전이 끝난 뒤** 연결합니다.

1. Wix → 중간 등록기관(Namecheap/Porkbun/가비아 등) 이전 완료 (EPP 코드, 최대 7일)
2. Cloudflare 에 `gift-tech.net` 존 추가 → 새 등록기관에서 네임서버를 Cloudflare 것으로 변경
3. Pages 프로젝트 → **Custom domains** → `gift-tech.net` 과 `www.gift-tech.net` 추가 (DNS 레코드 자동 생성)
4. Cloudflare DNS 에서 Wix 가 남긴 A/CNAME 레코드가 있으면 삭제 (Pages 가 만든 CNAME 만 남김)
5. Bulk Redirects 또는 Pages 설정에서 `gift-tech.net` → `www.gift-tech.net` 중 하나로 정규화 (현재 canonical 은 **www** 기준)

이전이 끝나기 전에 미리 사이트를 보여 주고 싶으면 `pages.dev` 주소를 쓰면 됩니다.

## 5. 배포 후 확인

- [ ] 6개 페이지 모두 200, `/blog` 301, 없는 주소는 404.html
- [ ] 모바일(390px)·데스크톱(1366px) 레이아웃, 햄버거 메뉴 동작
- [ ] 채널톡 링크(`koreagiftcard.channel.io`)·전화·메일 링크 동작
- [ ] `assets/images/logo.png` 등 이미지 표시 (fetch-assets 실행 여부)
- [ ] Google Search Console·네이버 서치어드바이저: 소유 확인 메타는 Wix 값 그대로 유지했으므로 재인증 불필요. `sitemap.xml` 다시 제출
- [ ] Wix 쪽: 도메인 이전 완료 후 프리미엄 플랜 자동갱신 해지

## 6. 교체·보완할 값 (TODO)

| 위치 | 내용 |
|---|---|
| 모든 페이지 `<head>` 주석 | GTM 컨테이너 ID `GTM-XXXXXXX` — 준비되면 주석 해제 |
| 푸터 사업자 정보 | 대표자명, 사업자등록번호, 통신판매업 신고번호 (대괄호 자리) |
| `assets/images/og-image.png` | Wix 원본을 그대로 사용 중 — 새로 만들면 2500×1330 또는 1200×630 |
| 블로그 | 열려면 `blog.html` 을 만들고 `_redirects` 의 `/blog` 줄 삭제, 메뉴에 다시 추가 |

## 7. 수정 방법

- 공통 헤더·푸터·상담 배너는 각 HTML 에 동일하게 들어 있습니다. 문구를 바꿀 때는 6개 파일을 함께 바꿔 주세요(VS Code 전체 바꾸기 권장).
- 색상·간격은 `assets/css/style.css` 상단 `:root` 토큰에서 한 번에 바꿉니다. 브랜드 포인트 색 `#44b4ff` 는 기존 Wix 사이트 색을 유지했습니다.
- 상담 클릭은 `dataLayer` 에 `consult_click` 이벤트로 올라갑니다. GTM 연결 후 GA4·Google Ads 전환 트리거로 바로 쓸 수 있습니다.
