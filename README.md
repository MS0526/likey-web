# 🎁 라이키 (LIKEY)
> **투명하고 직관적인 마켓형 물품 후원 플랫폼**  
> "현금 후원 대신, 수혜자에게 정말 필요한 물품을 직접 장바구니에 담아 마음을 전하세요."

---

## 🛠️ 1. 기술 스택 (Tech Stack)

- **Framework / Build Tool:** React 19, Vite
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Routing:** `react-router-dom`
- **Icons:** `lucide-react`

---

## 🚀 2. 팀원 개발 환경 세팅 (클론 및 실행 방법)

> ⚠️ **주의:** 프로젝트를 새로 만들어 시작하지 마시고, 반드시 아래 순서대로 저장소를 클론(Clone)받아 진행해 주세요.

### 1단계: Repository Clone (코드 다운로드)
터미널(Terminal)을 열고 프로젝트를 저장할 작업 폴더로 이동한 후 저장소를 다운로드합니다.

git clone [https://github.com/MS0526/likey-web.git](https://github.com/MS0526/likey-web.git)
cd likey-web

### 2단계: Package Download (라이브러리 다운로드)
`node_modules` 폴더 및 프로젝트에 필요한 모든 외부 라이브러리를 컴퓨터에 자동으로 설치합니다.

npm install

### 3단계: Run Development Server (개발 서버 실행)
개발 서버를 실행하고 출력되는 Local 주소(`http://localhost:5173`)를 브라우저로 열어 화면을 확인합니다.

npm run dev

---

## 🌿 3. Git 브랜치 협업 및 PR 규칙

`main` 브랜치에 코드를 직접 커밋/푸시하는 것은 금지되어 있습니다. **반드시 기능별 브랜치를 생성하여 작업 후 Pull Request(PR)**를 올려주세요.

### 🔄 작업 흐름 (기능 개발 시작 및 마무리가 될 때마다 실행)

#### 1. main 브랜치 최신화
새로운 작업을 시작하기 전에 항상 `main` 브랜치를 최신 상태로 업데이트합니다.

git checkout main
git pull origin main

#### 2. 기능 브랜치 생성 및 이동
새로운 기능 개발을 위한 독립적인 브랜치를 생성합니다.

# 예시: 메인 페이지 개발 시
git checkout -b feature/main-page

# 예시: 상세 페이지 개발 시
git checkout -b feature/detail-page

#### 3. 작업 내역 커밋 & 깃허브 업로드
작업을 마친 후 본인의 브랜치로 코드를 올립니다.

git add .
git commit -m "feat: 메인 마켓 물품 카드 UI 구현"
git push origin feature/본인브랜치명

#### 4. GitHub에서 Pull Request (PR) 등록
1. 깃허브 저장소 페이지([https://github.com/MS0526/likey-web)에](https://github.com/MS0526/likey-web)에) 접속합니다.
2. 상단에 뜨는 **`Compare & pull request`** 버튼을 클릭합니다.
3. 작업 내용 요약을 적고 **`Create pull request`**를 클릭해 검토 요청을 보냅니다.

---

## 📝 4. Commit Convention (커밋 메시지 규칙)

커밋 메시지 맨 앞에는 작업 유형에 맞는 태그를 반드시 작성해 주세요.

- `feat:` 새로운 기능 추가 (예: `feat: 장바구니 수량 변경 기능 구현`)
- `fix:` 버그 수정 (예: `fix: 헤더 반응형 레이아웃 깨짐 수정`)
- `style:` UI 디자인 및 CSS 스타일 변경 (기능 변경 없음)
- `docs:` README 등 문서 수정
- `refactor:` 코드 구조 개선 및 리팩토링

---

## 📁 5. 프로젝트 폴더 구조 (Directory Structure)
(이 구조는 임시로 만든 구조이며 회의를 통해 달라질 수 있음)
`src` 폴더 내부 구조를 잘 확인하고 각 위치에 맞는 파일 작업을 진행해 주세요.

src/
├── components/          # 공통 및 재사용 UI 컴포넌트
│   ├── Header.jsx       # 상단 로고 및 검색바
│   ├── ItemCard.jsx     # 물품 정보 카드
│   ├── DonationModal.jsx # 후원 결제 모달
│   └── Footer.jsx       # 하단 푸터
├── pages/               # 주요 화면 페이지 컴포넌트
│   ├── HomePage.jsx     # 메인 마켓 리스트 (/)
│   ├── DetailPage.jsx   # 물품 상세 사연 페이지 (/items/:id)
│   ├── CartPage.jsx     # 장바구니 페이지 (/cart)
│   └── FeedPage.jsx     # 수혜자 감사 인증샷 피드 (/feed)
├── App.jsx              # 라우팅(페이지 이동) 및 Layout 설정
├── index.css            # Tailwind CSS 설정
└── main.jsx             # React 진입점