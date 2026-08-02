# 🎁 라이키 (LIKEY)
> **투명하고 직관적인 마켓형 물품 후원 플랫폼**  
> "현금 후원 대신, 수혜자에게 정말 필요한 물품을 직접 장바구니에 담아 마음을 전하세요."

---

## 🛠️ 1. 기술 스택 (Tech Stack)
*저희 프로젝트에서 사용되는 프로그램 언어와 도구들입니다.*

- **Framework / Build Tool:** React 19, Vite *(웹 화면을 만들고 빠르게 띄워주는 핵심 도구)*
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) *(디자인 및 꾸미기를 담당하는 도구)*
- **Routing:** `react-router-dom` *(페이지 이동을 담당하는 도구)*
- **Icons:** `lucide-react` *(아이콘 모음집)*

### ⚙️ 백엔드 (`server` 폴더)
- **Runtime / Framework:** Node.js, Express *(데이터 처리 및 API 서버를 담당하는 도구)*
- **Language / Dev Tools:** TypeScript, `tsx`, `nodemon` *(안정적인 코드 작성 및 개발 서버 자동 재시작 도구)*

---

## 🚀 2. 팀원 개발 환경 세팅 (처음 시작할 때 1번만 실행!)

> ⚠️ **경고:** 절대로 `npm create vite` 등으로 프로젝트를 새로 만들지 마세요!  
> 이미 만들어진 프로젝트를 컴퓨터로 가지고 와서 시작해야 합니다.

### 1단계: 저장소 복사 (git clone)
내 컴퓨터의 원하는 폴더에서 터미널(Git Bash 또는 VS Code 터미널)을 열고 아래 명령어를 입력합니다.

git clone https://github.com/MS0526/likey-web.git
cd likey-web

- `git clone`: internet 상의 코드(깃허브)를 내 컴퓨터로 다운로드합니다.
- `cd likey-web`: 다운로드받은 프로젝트 폴더 내부로 이동합니다.

---

2단계: 필요한 프로그램 설치 (npm install)
저희 프로젝트는 프론트엔드(client)와 백엔드(server) 폴더가 나눠져 있습니다! 각각 이동해서 설치해 주어야 합니다.

1) 프론트엔드 프로그램 설치
Bash
cd client
npm install
cd ..
2) 백엔드 프로그램 설치
Bash
cd server
npm install
cd ..
프로젝트 실행에 필요한 외부 라이브러리(node_modules 폴더)를 알아서 자동으로 설치해 줍니다.

완료될 때까지 잠시 기다려주세요!

3단계: 내 컴퓨터에서 개발 서버 실행하기 (npm run dev)
프론트엔드와 백엔드를 모두 구동하기 위해 터미널을 2개 열어서 실행합니다.

1) 첫 번째 터미널: 백엔드 서버 실행
Bash
cd server
npm run dev
실행 후 터미널에 http://localhost:5000 백엔드 서버가 켜집니다.

2) 두 번째 터미널: 프론트엔드 웹 화면 실행 (VS Code 터미널 우측 + 버튼 클릭)
Bash
cd client
npm run dev
실행 후 터미널에 http://localhost:5173 링크가 뜹니다.

Ctrl + 클릭 하거나 웹 브라우저 주소창에 치고 들어가면 내가 만드는 화면을 직접 확인할 수 있습니다!

(종료하고 싶을 땐 터미널에서 Ctrl + C를 누르시면 됩니다.)

🌿 3. Git 협업 규칙 (코드를 고치기 전에 꼭 읽으세요!)
여러 명이 동시에 작업할 때 코드가 꼬이지 않도록 main 브랜치에 직접 코드를 올려 수정하는 것은 금지되어 있습니다.

반드시 나만의 작업 방(브랜치)을 만들어서 작업해 주세요!

🔄 작업 순서 (기능을 만들 때마다 무조건 이렇게 진행하세요)
1단계: 가장 최신 상태 코드로 업데이트
새로운 작업을 시작하기 전에 메인 방(main)으로 이동해서 남들이 올려둔 최신 코드를 다운받습니다.

Bash
git checkout main
git pull origin main
2단계: 내 전용 작업실(브랜치) 만들기
나만 작업할 수 있는 독립된 방을 만듭니다. (-b는 방을 새로 만든다는 뜻입니다)

Bash
git checkout -b feature/기능이름
메인 페이지 개발 시: git checkout -b feature/main-page

상세 페이지 개발 시: git checkout -b feature/detail-page

장바구니 페이지 개발 시: git checkout -b feature/cart-page

백엔드 API 개발 시: git checkout -b feature/api-auth

3단계: 코드 작성 후 내 방에 저장하고 올리기
작업이 끝났다면 내 방(feature/...)에 저장 내역을 기록하고 깃허브로 올려줍니다.

Bash
git add .
git commit -m "feat: 한글로 작성한 작업 내용 설명"
git push origin feature/내브랜치이름
git add .: 변경된 모든 파일들을 저장 목록에 올립니다.

git commit -m "...": "어떤 작업을 했는지" 설명표를 붙여 내 컴퓨터에 저장합니다.

git push origin ...: 깃허브 웹사이트의 내 방으로 코드를 전송합니다.

4단계: 팀장에게 코드 검토 요청하기 (Pull Request - PR)
깃허브 주소(https://github.com/MS0526/likey-web)에 접속합니다.

화면 상단에 노란색으로 뜨는 Compare & pull request 버튼을 클릭합니다.

내가 오늘 어떤 작업을 했는지 간단하게 적고 Create pull request를 누르면 끝!

📝 4. 커밋 메시지 작성 규칙 (Commit Convention)
git commit -m "..."을 작성할 때 설명 맨 앞에는 작업 종류에 맞는 태그를 꼭 붙여주세요!

feat: 새로운 기능이나 화면을 만들었을 때

(예: git commit -m "feat: 메인화면 상품 카드 목록 UI 작성")

fix: 버그나 오류를 고쳤을 때

(예: git commit -m "fix: 장바구니 버튼 안 눌리는 오류 수정")

style: CSS나 디자인, 레이아웃만 수정했을 때

(예: git commit -m "style: 버튼 색상 노란색으로 변경")

docs: README 같은 가이드 문서를 수정했을 때

(예: git commit -m "docs: 팀원 가이드 내용 추가")

refactor: 기능은 똑같은데 코드 구조를 깔끔하게 다듬었을 때

(예: git commit -m "refactor: client 및 server 폴더 구조 분리")

📁 5. 폴더 구조 안내 (어디에 코드를 짜야 할까?)
(※ 아래 구조는 임시로 만든 구조이며 회의를 통해 달라질 수 있습니다.)

client와 server 폴더 내부 구조를 잘 확인하고 각 위치에 맞는 파일 작업을 진행해 주세요.

Plaintext
likey-web/
├── client/                     # 🎨 프론트엔드 웹 화면 (React + Vite)
│   ├── src/
│   │   ├── components/         # 공통 및 재사용 UI 컴포넌트
│   │   │   ├── Header.jsx      # 상단 로고 및 검색바
│   │   │   ├── ItemCard.jsx    # 물품 정보 카드
│   │   │   ├── DonationModal.jsx # 후원 결제 모달
│   │   │   └── Footer.jsx      # 하단 푸터
│   │   ├── pages/              # 주요 화면 페이지 컴포넌트
│   │   │   ├── HomePage.jsx    # 메인 마켓 리스트 (/)
│   │   │   ├── DetailPage.jsx  # 물품 상세 사연 페이지 (/items/:id)
│   │   │   ├── CartPage.jsx    # 장바구니 페이지 (/cart)
│   │   │   └── FeedPage.jsx    # 수혜자 감사 인증샷 피드 (/feed)
│   │   ├── App.jsx             # 라우팅 및 Layout 설정
│   │   ├── index.css           # Tailwind CSS 설정
│   │   └── main.jsx            # React 진입점
│   ├── package.json
│   └── vite.config.js
│
└── server/                     # ⚙️ 백엔드 서버 (Node.js + Express + TypeScript)
    ├── src/
    │   └── index.ts            # 백엔드 서버 진입점
    ├── package.json
    └── tsconfig.json