# 🎁 나눔카트
> **투명하고 직관적인 마켓형 물품 후원 플랫폼**  
> "현금 후원 대신, 수혜자에게 정말 필요한 물품을 직접 장바구니에 담아 마음을 전하세요."

### 🔗 배포 링크
- **웹사이트**: https://likey-web.vercel.app
- **백엔드 API**: http://1.201.117.56:5000  
  *(가비아 클라우드 서버에서 직접 운영 중입니다. 도메인·HTTPS는 아직 미적용 상태입니다.)*
- **이전 백엔드 (Render)**: https://likey-web.onrender.com  
  *(가비아 클라우드로 이전 완료. 더 이상 사용하지 않지만 기록용으로 남겨둡니다.)*

### 🔑 데모 로그인 계정
회원가입 없이 아래 계정으로 바로 체험해보실 수 있습니다.

| 유형 | 이메일 | 비밀번호 |
|---|---|---|
| 개인 후원자 | `user@likey.com` | `user1234` |
| 기관 회원 | `org@likey.com` | `org1234` |

### ✨ 주요 기능
- **마켓형 물품 후원** — 현금이 아닌, 기관에 실제로 필요한 물품을 골라 장바구니에 담아 후원
- **후원도우미 AI 챗봇** — 예산이나 자연어 질문("초등학생 학용품 추천해줘" 등)으로 지금 가장 필요한 물품을 AI가 추천
- **기관 대시보드** — 물품 요청 등록(긴급 후원 포함), 후원 수락 관리, 사용 현황, AI 기반 "다음 요청 물품" 추천 등 데이터 분석
- **후원 인증 피드** — 기관이 공개한 인증 사진으로 후원이 실제로 어떻게 쓰였는지 확인
- **개인 후원 활동 요약** — 내가 후원한 내역과 카테고리별 성향 확인
- **기관 수락 게이트** — 결제만으로는 배송되지 않고, 등록된 기관이 수락해야 발송되는 구조로 악용을 방지

---

## 🛠️ 1. 기술 스택 (Tech Stack)
*저희 프로젝트에서 사용되는 프로그램 언어와 도구들입니다.*

### 🎨 프론트엔드 (`client` 폴더)
- **Framework / Build Tool:** React 19, Vite *(웹 화면을 만들고 빠르게 띄워주는 핵심 도구)*
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) *(디자인 및 꾸미기를 담당하는 도구)*
- **Routing:** `react-router-dom` *(페이지 이동을 담당하는 도구)*
- **Icons:** `lucide-react` *(아이콘 모음집)*
- **HTTP 통신:** `axios` *(백엔드 API 호출을 담당하는 도구)*
- **상태 관리:** React Context API (`DonationContext`, `AuthContext`, `CartContext`) *(별도 라이브러리 없이 화면 간 공유 상태를 관리)*
- **Lint:** `oxlint`
- **배포:** Vercel

### ⚙️ 백엔드 (`server` 폴더)
- **Runtime / Framework:** Node.js, Express *(데이터 처리 및 API 서버를 담당하는 도구)*
- **Language / Dev Tools:** TypeScript, `tsx`, `nodemon` *(안정적인 코드 작성 및 개발 서버 자동 재시작 도구)*
- **AI:** OpenAI SDK (`gpt-4o-mini`) *(예산·질문에 맞는 후원 물품을 추천하는 `/api/ai/recommend` API에 사용)*
- **기타:** `cors`, `dotenv`
- **배포:** 가비아 클라우드 (Rocky Linux, PM2로 상시 실행)

---

## 🚀 2. 로컬에서 실행하기

`client`(프론트엔드)와 `server`(백엔드)로 나뉜 모노레포 구조입니다. 각각 따로 설치·실행합니다.

```bash
git clone https://github.com/MS0526/likey-web.git
cd likey-web
```

#### 프론트엔드
```bash
cd client
npm install
npm run dev   # http://localhost:5173
```

#### 백엔드
```bash
cd server
npm install
cp .env.example .env   # OPENAI_API_KEY 채워넣기
npm run dev   # http://localhost:5000
```

두 서버를 각각 다른 터미널에서 띄우면 프론트가 백엔드를 바라보며 동작합니다. AI 추천 기능(챗봇, 기관 데이터 분석)을 테스트하려면 `server/.env`에 유효한 `OPENAI_API_KEY`가 필요하고, 없어도 나머지 기능은 정상 동작합니다(AI 부분만 로컬 규칙 기반 추천으로 자동 대체됨).

---

## 🌿 3. 개발 프로세스

`main` 브랜치를 보호하고, 기능 단위로 브랜치를 나눠 Pull Request로 병합하는 방식으로 작업했습니다.

- 브랜치: `feature/기능이름`, `fix/버그이름` 등으로 분리
- 커밋 메시지: [Conventional Commits](https://www.conventionalcommits.org/ko/) 스타일 태그 사용
  - `feat:` 새 기능 · `fix:` 버그 수정 · `style:` 디자인/레이아웃 · `docs:` 문서 · `refactor:` 리팩터링
- 리뷰: PR을 통해 변경사항을 확인한 뒤 `main`에 병합

---

## 📁 4. 프로젝트 구조

```text
likey-web/
├── client/                          # 🎨 프론트엔드 (React + Vite)
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/              # 공통·재사용 UI 컴포넌트
│   │   │   ├── Header.jsx           # 상단 헤더
│   │   │   ├── CategoryNav.jsx      # 카테고리 내비게이션
│   │   │   ├── UrgentBanner.jsx     # 긴급 후원 배너
│   │   │   ├── AvailableNow.jsx     # 랜딩페이지 서비스 특징 소개
│   │   │   ├── HowItWorks.jsx       # 랜딩페이지 이용 절차 안내(3단계)
│   │   │   ├── StarBar.jsx          # 랜딩페이지 상단 통계(등록 기관·필요 물품 수)
│   │   │   ├── KoreaMap.jsx         # 지역별 기관 분포 대한민국 지도
│   │   │   ├── ItemCard.jsx         # 물품 카드
│   │   │   ├── OrgCard.jsx          # 기관 카드
│   │   │   ├── ProgressBar.jsx      # 후원 진행률 바
│   │   │   ├── ProtectedRoute.jsx   # 로그인 필요 라우트 가드
│   │   │   ├── DevNav.jsx           # 개발용 임시 내비게이션
│   │   │   ├── AiChatbot.jsx        # 후원도우미 AI 챗봇(플로팅)
│   │   │   ├── AiDemo.jsx           # 랜딩페이지 AI 추천 데모 섹션
│   │   │   ├── RecommendCard.jsx    # AI 추천 물품 카드(챗봇·데모 공용)
│   │   │   ├── OrgHeader.jsx        # 기관 대시보드 헤더
│   │   │   ├── MetricCard.jsx       # 대시보드 지표 카드
│   │   │   ├── TabNav.jsx           # 대시보드 탭 내비게이션
│   │   │   ├── RequestRow.jsx       # 물품 요청 목록 행
│   │   │   ├── ApprovalRow.jsx      # 후원 승인 목록 행
│   │   │   ├── UsageTable.jsx       # 수령·사용 현황 테이블
│   │   │   ├── ProofCard.jsx        # 후원 인증 사진 카드
│   │   │   └── CategoryBarChart.jsx # 카테고리별 후원 현황 막대 차트
│   │   ├── pages/                   # 주요 화면 (라우팅 단위)
│   │   │   ├── HomePage.jsx         # 지도 기반 기관 메인 화면
│   │   │   ├── AuthSelectPage.jsx   # 기관/개인·기업 로그인 선택
│   │   │   ├── LoginPage.jsx        # 로그인
│   │   │   ├── MarketPage.jsx       # 카테고리별 마켓 리스트
│   │   │   ├── DetailPage.jsx       # 물품 상세
│   │   │   ├── CartPage.jsx         # 장바구니
│   │   │   ├── FeedPage.jsx         # 후원 인증 피드
│   │   │   └── OrgPage.jsx          # 기관 대시보드(요청등록·승인·현황·데이터분석)
│   │   ├── data/                    # 목데이터 (API 미연동, 프론트에서 직접 사용)
│   │   │   ├── items.js
│   │   │   ├── organizations.jsx
│   │   │   ├── requests.js
│   │   │   ├── donations.js
│   │   │   └── proofs.js            # 후원 인증 사진 목데이터
│   │   ├── contexts/                # React Context 기반 상태 관리
│   │   │   ├── DonationContext.jsx  # 후원·요청·인증 상태(승인 루프 포함)
│   │   │   ├── AuthContext.jsx      # 로그인 상태(개인/기관)
│   │   │   └── CartContext.jsx      # 장바구니 상태
│   │   ├── lib/
│   │   │   └── api.js               # axios 인스턴스(백엔드 API 호출)
│   │   ├── utils/
│   │   │   ├── urgency.js           # 긴급도·달성률 판단 로직
│   │   │   ├── recommend.js         # AI 추천 호출(백엔드→Gemini→로컬 폴백)
│   │   │   ├── geminiRecommend.js   # (개발용) Gemini 직접 호출 — 정리 예정
│   │   │   ├── aiTimeout.js         # AI 응답 지연 시 UX 처리(타임아웃)
│   │   │   ├── chatIntent.js        # 챗봇 인사·감사 등 의도 판별
│   │   │   ├── parseAmount.js       # 채팅 입력에서 금액 파싱
│   │   │   └── orgAnalytics.js      # 기관 카테고리 통계·다음 요청 추천 알고리즘
│   │   ├── App.jsx                  # 라우팅·레이아웃
│   │   ├── App.css
│   │   ├── index.css                # Tailwind 설정(브랜드 색상 토큰)
│   │   └── main.jsx                 # React 진입점
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vercel.json                  # Vercel 배포용 SPA 라우팅 설정
│   └── vite.config.js
│
├── server/                          # ⚙️ 백엔드 (TypeScript)
│   ├── src/
│   │   ├── index.ts                 # 서버 진입점(CORS·라우터 연결)
│   │   └── routes/
│   │       ├── authRoutes.ts        # 로그인 API(개인/기관)
│   │       ├── itemRoutes.ts        # 물품·기관·요청·후원 조회 API(현재 프론트 미사용)
│   │       └── aiRoutes.ts          # AI 후원 추천 API(POST /api/ai/recommend)
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
│
├── .gitignore
├── .oxlintrc.json                   # oxlint 린터 설정
└── README.md
```

---

## 📄 License

[MIT](./LICENSE)
