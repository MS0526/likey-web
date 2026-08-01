# 🎁 라이키 (LIKEY)
> **투명하고 직관적인 마켓형 물품 후원 플랫폼**  
> "현금 후원 대신, 수혜자에게 정말 필요한 물품을 직접 장바구니에 담아 마음을 전하세요."

---

## 🛠️ 1. 적용 기술 스택 (Tech Stack)

- **Framework / Build:** React 19, Vite
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Routing:** `react-router-dom`
- **Icons:** `lucide-react`

---

## 💻 2. 팀장 초기 프로젝트 세팅 & 깃허브 업로드 가이드 (초기 1회)

> ⚠️ **주의:** 이 단계는 팀장이 초기 프로젝트를 세팅하고 깃허브에 처음 올릴 때만 수행합니다. 팀원들은 '3. 팀원 개발 시작 가이드'로 바로 넘어가세요.

### 1단계: 프로젝트 생성 및 패키지 설치
```bash
# 바탕화면 이동 후 Vite 프로젝트 생성
cd Desktop
npm create vite@latest likey-web -- --template react
cd likey-web
npm install

# Tailwind CSS v4 & 추가 라이브러리 설치
npm install @tailwindcss/vite
npm install react-router-dom lucide-react

# 3단계: Run Development Server (개발 서버 실행)
개발 서버를 키고 브라우저(http://localhost:5173)에서 화면을 확인합니다.