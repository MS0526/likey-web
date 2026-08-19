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

## 🚀 2. 팀원 개발 환경 세팅 (처음 시작할 때 1번만 실행!)

> ⚠️ **경고:** 절대로 `npm create vite` 등으로 프로젝트를 새로 만들지 마세요!  
> 이미 만들어진 프로젝트를 컴퓨터로 가지고 와서 시작해야 합니다.

### 1단계: 저장소 복사 (git clone)
내 컴퓨터의 원하는 폴더에서 터미널(Git Bash 또는 VS Code 터미널)을 열고 아래 명령어를 입력합니다.

```bash
git clone [https://github.com/MS0526/likey-web.git](https://github.com/MS0526/likey-web.git)
cd likey-web
```

- `git clone`: internet 상의 코드(깃허브)를 내 컴퓨터로 다운로드합니다.
- `cd likey-web`: 다운로드받은 프로젝트 폴더 내부로 이동합니다.

---

### 2단계: 필요한 프로그램 설치 (npm install)
저희 프로젝트는 **프론트엔드(`client`)**와 **백엔드(`server`)** 폴더가 나눠져 있습니다! 각각 이동해서 설치해 주어야 합니다.

#### 1) 프론트엔드 프로그램 설치
```bash
cd client
npm install
cd ..
```

#### 2) 백엔드 프로그램 설치
```bash
cd server
npm install
cd ..
```

- 프로젝트 실행에 필요한 외부 라이브러리(`node_modules` 폴더)를 알아서 자동으로 설치해 줍니다.
- 완료될 때까지 잠시 기다려주세요!

---

### 3단계: 내 컴퓨터에서 개발 서버 실행하기 (npm run dev)
프론트엔드와 백엔드를 모두 구동하기 위해 **터미널을 2개** 열어서 실행합니다.

#### 1) 첫 번째 터미널: 백엔드 서버 실행
```bash
cd server
npm run dev
```
- 실행 후 터미널에 `http://localhost:5000` 백엔드 서버가 켜집니다.

#### 2) 두 번째 터미널: 프론트엔드 웹 화면 실행 (VS Code 터미널 우측 `+` 버튼 클릭)
```bash
cd client
npm run dev
```
- 실행 후 터미널에 `http://localhost:5173` 링크가 뜹니다.
- **`Ctrl + 클릭`** 하거나 웹 브라우저 주소창에 치고 들어가면 내가 만드는 화면을 직접 확인할 수 있습니다!
- *(종료하고 싶을 땐 터미널에서 `Ctrl + C`를 누르시면 됩니다.)*

---

## 🌿 3. Git 협업 규칙 (코드를 고치기 전에 꼭 읽으세요!)

여러 명이 동시에 작업할 때 코드가 꼬이지 않도록 **`main` 브랜치에 직접 코드를 올려 수정하는 것은 금지**되어 있습니다.

반드시 **나만의 작업 방(브랜치)**을 만들어서 작업해 주세요!

---

### 🔄 작업 순서 (기능을 만들 때마다 무조건 이렇게 진행하세요)

#### 1단계: 가장 최신 상태 코드로 업데이트
새로운 작업을 시작하기 전에 메인 방(`main`)으로 이동해서 남들이 올려둔 최신 코드를 다운받습니다.

```bash
git checkout main
git pull origin main
```

---

#### 2단계: 내 전용 작업실(브랜치) 만들기
나만 작업할 수 있는 독립된 방을 만듭니다. (`-b`는 방을 새로 만든다는 뜻입니다)

```bash
git checkout -b feature/기능이름
```

- **메인 페이지 개발 시:** `git checkout -b feature/main-page`
- **상세 페이지 개발 시:** `git checkout -b feature/detail-page`
- **장바구니 페이지 개발 시:** `git checkout -b feature/cart-page`
- **백엔드 API 개발 시:** `git checkout -b feature/api-auth`

---

#### 3단계: 코드 작성 후 내 방에 저장하고 올리기
작업이 끝났다면 내 방(`feature/...`)에 저장 내역을 기록하고 깃허브로 올려줍니다.

```bash
git add .
git commit -m "feat: 한글로 작성한 작업 내용 설명"
git push origin feature/내브랜치이름
```

- `git add .`: 변경된 모든 파일들을 저장 목록에 올립니다.
- `git commit -m "..."`: "어떤 작업을 했는지" 설명표를 붙여 내 컴퓨터에 저장합니다.
- `git push origin ...`: 깃허브 웹사이트의 내 방으로 코드를 전송합니다.

---

#### 4단계: 팀장에게 코드 검토 요청하기 (Pull Request - PR)
1. 깃허브 주소(https://github.com/MS0526/likey-web)에 접속합니다.
2. 화면 상단에 노란색으로 뜨는 **`Compare & pull request`** 버튼을 클릭합니다.
3. 내가 오늘 어떤 작업을 했는지 간단하게 적고 **`Create pull request`**를 누르면 끝!

---

## 📝 4. 커밋 메시지 작성 규칙 (Commit Convention)

`git commit -m "..."`을 작성할 때 설명 맨 앞에는 작업 종류에 맞는 태그를 꼭 붙여주세요!

- **`feat:`** 새로운 기능이나 화면을 만들었을 때  
  *(예: `git commit -m "feat: 메인화면 상품 카드 목록 UI 작성"`)*
- **`fix:`** 버그나 오류를 고쳤을 때  
  *(예: `git commit -m "fix: 장바구니 버튼 안 눌리는 오류 수정"`)*
- **`style:`** CSS나 디자인, 레이아웃만 수정했을 때  
  *(예: `git commit -m "style: 버튼 색상 노란색으로 변경"`)*
- **`docs:`** README 같은 가이드 문서를 수정했을 때  
  *(예: `git commit -m "docs: 팀원 가이드 내용 추가"`)*
- **`refactor:`** 기능은 똑같은데 코드 구조를 깔끔하게 다듬었을 때  
  *(예: `git commit -m "refactor: client 및 server 폴더 구조 분리"`)*

---

## 📁 5. 폴더 구조 안내 (어디에 코드를 짜야 할까?)

*(※ 아래 구조는 임시로 만든 구조이며 회의를 통해 달라질 수 있습니다.)*  
`client`와 `server` 폴더 내부 구조를 잘 확인하고 각 위치에 맞는 파일 작업을 진행해 주세요.

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
