# 강의자료 사용 검증 보고서

대상 강의: Lecture 3 (CSS 기초), Lecture 4 (CSS 고급), Lecture 5
(반응형/Bootstrap), Lecture 6 (JS 기초), Lecture 7 (JS 고급/DOM),
Practice 9 (TypeScript), Lecture 10 (React 기초), Lecture 12 (React 고급).

분류:
- ✅ 강의자료 명시 범위
- ⚠️ 강의자료 직접 명시 X, 그러나 강의된 개념의 자연스러운 확장
- ❌ 강의 범위 밖 — 사용자가 별도로 승인했거나 다른 결정 필요

---

## 1. HTML

| 사용 | 출처 | 비고 |
|---|---|---|
| `<!DOCTYPE>`, `<html>`, `<head>`, `<body>`, `<title>`, `<meta>` | ✅ Lec 3 이전 | 필수 요소 |
| `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`, `<aside>` | ✅ Lec 3 (semantic tags) | div + id/class 대체 |
| `<h1>~<h6>`, `<p>`, `<br>`, `<hr>` | ✅ Lec 3 이전 | |
| `<ul>`, `<ol>`, `<li>` | ✅ Lec 3 이전 | |
| `<a href>`, `<img src alt>`, `<button>`, `<table>` | ✅ Lec 3 이전 | |
| `<form>`, `<input>`, `<textarea>`, `<select>`, `<option>`, `<label>` | ✅ Lec 3 이전 (HTML Forms) | |
| `<link rel>`, `<script src>` | ✅ Lec 3, Lec 6 (외부 CSS/JS) | |

→ **HTML 전체 강의 범위 안.**

---

## 2. CSS

### 2-1. 강의 명시
| 사용 | 출처 |
|---|---|
| 타입/ID/클래스/속성/유사 선택자 | ✅ Lec 3 |
| 외부/내부/인라인 CSS | ✅ Lec 3 |
| color, background, font, text 속성 | ✅ Lec 3 |
| Box Model (margin, border, padding) | ✅ Lec 4 |
| display: block / inline / none / inline-block | ✅ Lec 4 |
| position: static / relative / absolute / fixed | ✅ Lec 4 |
| z-index, overflow | ✅ Lec 4 |
| float | ✅ Lec 4 |
| CSS 변수 `var(--name)` | ✅ Lec 4/5 |
| Bootstrap 컨테이너, 타이포그래피, 그리드 (.container, .row, .col-*, .text-center 등) | ✅ Lec 5 |
| 반응형 (미디어 쿼리) | ✅ Lec 5 |
| 의사클래스 `:hover`, `:focus`, `:active` | ✅ Lec 3 |

### 2-2. ⚠️ 강의 직접 X (현대 CSS, 일반 상식)
| 사용 | 코드 위치 | 대체 가능 여부 |
|---|---|---|
| `display: flex` + `gap`, `justify-content`, `align-items` | 거의 모든 CSS | float 또는 Bootstrap grid 로 치환 가능. 단 작업량 큼. |
| `display: grid`, `grid-template-columns/rows` | home.css, squad.css, members.css, schedule.css, admin.css | Bootstrap grid (`.row`/`.col-*`) 로 대체 가능. 작업량 큼. |
| `transition`, `transform: scale/rotate/translateY` | 거의 모든 CSS hover 효과 | 제거하면 애니메이션 없음. 기능 영향 X. |
| `@keyframes`, `animation` | global.css (spin), countdown.css (pulse), members.css (scaleIn), gallery.css (fadeIn), home.css (tileFadeIn), squad.css (slotPulse) | 제거 가능, UX 살짝 정적. |
| `aspect-ratio` | gallery.css, squad.css | `padding-bottom: 100%` 트릭으로 대체. |
| `clip-path: polygon(...)` | squad.css (유니폼 모양) | 제거 시 사각형 박스. 기능 OK. |
| `backdrop-filter: blur()` | navbar.css, gallery.css, login.css, members.css, countdown.css | 제거 가능, 배경 살짝 흐림 없어짐. |
| linear-gradient, radial-gradient | home.css, login.css 등 | 제거 시 단색 배경. 외관 단순해짐. |
| `appearance: none` (select 화살표 커스텀) | admin.css | 제거 시 OS 기본 select 모양. |
| `text-shadow`, `box-shadow` | 곳곳 | 제거 가능. |
| `object-fit` | navbar.css, footer.css 등 (로고 이미지) | 사용 X 시 이미지 비율 안 맞을 수 있음. |
| `inset: 0` (단축형) | 곳곳 | `top:0; right:0; bottom:0; left:0` 로 풀어 쓸 수 있음. |
| `font-display: swap`, `@font-face` | global.css (NEXON 폰트 등록) | 폰트 사용 자체는 강의 범위. 등록 문법은 Lec 3 에서 다루지 않음. |
| `:root` 가상 요소 | global.css (CSS 변수 정의 자리) | Lec 5 강의 예제에 등장. ✅ OK |
| 단축속성 `padding: 10px 20px` 식 | 곳곳 | ✅ OK (Lec 3) |
| `repeating-linear-gradient` | squad.css (피치 무늬) | 제거 시 단색 피치. |

### 2-3. ❌ 강의 범위 밖
없음. 모든 CSS 가 직접 또는 자연스러운 확장으로 분류 가능.

---

## 3. JavaScript (브라우저)

### 3-1. 강의 명시 (Lec 6, 7, 10)
| 사용 | 출처 |
|---|---|
| `let`, `const`, `var` | ✅ Lec 6, Lec 10 |
| 산술/논리/비교 연산자 | ✅ Lec 6 |
| if/else, switch, for, while | ✅ Lec 6 |
| Array, String, Number, Object 기본 | ✅ Lec 6 |
| `console.log`, `alert`, `document.write`, `innerHTML` | ✅ Lec 6 |
| `document.getElementById`, `querySelectorAll`, `getElementsByClassName` | ✅ Lec 7 |
| 이벤트 핸들러 (onclick 등) | ✅ Lec 7 |
| 객체, 클래스 (`class`) | ✅ Lec 6 |
| 화살표 함수 | ✅ Lec 10 (ES6) |
| `.map()`, 배열 메서드 | ✅ Lec 10 (`.map` 명시) |
| Destructuring, Spread `...` | ✅ Lec 10 |
| import / export (모듈) | ✅ Lec 10 |
| 삼항 연산자 `? :` | ✅ Lec 10 |
| 템플릿 리터럴 `` `${x}` `` | ✅ Lec 10 (ES6, 슬라이드 화살표 함수 예제에 등장) |

### 3-2. ⚠️ 강의 직접 X
| 사용 | 코드 위치 | 비고 |
|---|---|---|
| `.filter()`, `.reduce()`, `.sort()`, `.find()` | 거의 모든 페이지 | Lec 10 에서 `.map` 만 명시. 같은 Array 메서드 카테고리. |
| `async / await` | api.js, 모든 페이지의 핸들러, server/* | Lec 6 함수와 호환되지만 명시 X. |
| `Promise`, `Promise.all` | app.js | 위와 동일. |
| `fetch()` | api.js | DOM API 이지만 Lec 7 에서 명시 X. 백엔드 통신에 필요. |
| `JSON.parse`, `JSON.stringify` | 곳곳 (localStorage 데이터 직렬화 자리) | 표준 JS 이지만 강의 명시 X. |
| `localStorage`, `sessionStorage` | 토큰 저장, 배너 닫기 상태 | 명시 X. |
| `setInterval`, `setTimeout` | Home (갤러리 슬라이드, 카운트다운), CountdownBanner | 명시 X. |
| `Date` 객체 (`new Date()`, `.getTime()`, `.getDay()` 등) | 카운트다운, 날짜 포맷 | 명시 X. |
| `Object.keys`, `Object.values`, `Object.entries` | 곳곳 | Lec 6 객체 다루지만 이 메서드들 명시 X. |
| `Array.from()` | Home.js, CountdownBanner.js | 명시 X. |
| `Set` | LineupPitch 등 | 명시 X. |
| `confirm()`, `alert()` | 곳곳 | `alert` 은 Lec 6 ✅, `confirm` 은 명시 X. |

### 3-3. ❌ 강의 범위 밖 (사용자 별도 승인)
| 항목 | 비고 |
|---|---|
| Node.js, Express, mysql2, bcrypt, jsonwebtoken, cors, dotenv | 사용자가 "MySQL 백엔드" 를 명시 요청. 강의 범위 밖이라고 설명하면서 도입함. |

---

## 4. React

### 4-1. 강의 명시 (Lec 10, 12)
| 사용 | 출처 |
|---|---|
| JSX | ✅ Lec 10 |
| 함수형 컴포넌트, props | ✅ Lec 10 |
| 이벤트 핸들러 `onClick` 등 | ✅ Lec 10 |
| `style={{...}}` 인라인 / className | ✅ Lec 10 |
| 조건부 렌더링 (삼항/논리연산자) | ✅ Lec 10 |
| 리스트 렌더링 `.map()` + key | ✅ Lec 10 |
| `useState` | ✅ Lec 12 |
| `useEffect` (의존성 배열 포함) | ✅ Lec 12 |
| `useRef` | ✅ Lec 12 (사용은 안 하지만 다룬 범위) |
| controlled inputs (`value` + `onChange`) | ✅ Lec 12 |

### 4-2. ⚠️ 직접 X
| 사용 | 위치 | 비고 |
|---|---|---|
| `ReactDOM.createRoot(...).render(...)` | app.js | Lec 12 강의가 다루는 시점에는 `ReactDOM.render` 였을 가능성 높음. createRoot 는 React 18 신문법. |
| `React.Fragment` (`<>...</>` 단축형) | app.js, Home.js | Lec 10 JSX 에서 다룬 것은 단일 루트 요소. Fragment 는 자연스러운 확장. |
| Cleanup return 함수가 있는 `useEffect` | GalleryModal, Home, CountdownBanner | Lec 12 에서 useEffect 패턴으로 다뤘다고 추정. ✅ 거의 명시. |

### 4-3. ❌ 사용 안 함
| 항목 | 비고 |
|---|---|
| React Router | 없음. 강의 범위 밖이라 의도적으로 사용 X (App.js 의 useState 로 페이지 전환). |
| Redux/Zustand 등 상태관리 라이브러리 | 없음. |
| Context API | 없음. (lecture 12 에 안 다뤄짐) |
| 클래스 컴포넌트 | 없음. (함수형만 사용) |

---

## 5. TypeScript

❌ **현재 코드는 TypeScript 를 사용하지 않습니다.** 모두 일반 JavaScript (.js).
Practice 9 에서 다룬 TS 는 도입되지 않았습니다. 사용자가 이전 답변에서
"가능하면 간단한 수준의 TypeScript 도 사용해도 됨" 이라고 했고, 결정상
JS 로 통일했습니다.

선택지:
- 그대로 JS 유지 (현재)
- 일부 파일만 .ts 로 변환 (예: server/db.js → server/db.ts, 그리고
  Lec 9 처럼 변수 타입 명시)
- 전체 TS 전환

---

## 6. Bootstrap

| 사용 | 출처 |
|---|---|
| `.container`, `.container-fluid` | ✅ Lec 5 |
| `.row`, `.col-md-*`, `.col-lg-*`, `.col-sm-*` | ✅ Lec 5 (12 column grid) |
| `.text-center`, `.text-secondary` | ✅ Lec 5 (typography) |
| `.g-*` (grid gap) | ⚠️ Lec 5 강의가 다룬 Bootstrap 4 시점에는 없음. Bootstrap 5 신규. |
| `.mt-*`, `.mb-*`, `.mt-2` 같은 spacing utility | ⚠️ Bootstrap 4 부터 있음. Lec 5 가 다룬 버전에 따라 다름. |

---

## 7. Babel Standalone (in-browser JSX 변환)

❌ **강의 범위 밖.** Lec 10 의 React 강의는 CRA / Vite 같은 번들러를
가정한 것으로 보임. 사용자가 "VS Code 로 구동, Vite 없이" 라고 요청하여
부득이 Babel Standalone CDN 으로 in-browser JSX 변환을 사용 중.

대안:
- 그대로 유지 (현재). 가장 단순.
- Vite 도입 → `npm run build` 로 사전 컴파일 후 정적 파일 배포.

---

## 8. 백엔드 (Node.js + Express + MySQL)

❌ **강의 범위 밖.** 단, 사용자가 명시적으로 요청한 사항.
보안/구조 (JWT 인증, bcrypt 해싱, REST API) 도 강의 범위 밖이지만
MySQL 연동의 필수 요소로 도입.

---

## 9. 종합 평가

| 분류 | 개수 (대략) | 처리 권장 |
|---|---|---|
| ✅ 강의 직접 | 대부분 | 그대로 |
| ⚠️ 자연스러운 확장 | CSS 애니메이션/transform/그라데이션, async/await, fetch, localStorage 등 | 강의 외라고 표기는 하되 실제 사용은 유지 권장 (제거 시 기능 크게 손상) |
| ❌ 명시적으로 강의 밖 | Babel Standalone, 백엔드 전체 | 사용자 승인 / 요청 사항이라 유지 |

**`fetch`, `async/await`, `localStorage`, 애니메이션 등을 모두 제거하면**
사이트가 단순 정적 페이지로 회귀합니다 (RSVP/MOTM/댓글/로그인 등 동적
기능 전부 불가). 강의에 명시되지 않았다는 표시는 하되 실제 사용은
유지하는 것을 권장합니다.

---

## 10. 사용자 결정 필요

다음 중 어떤 방향으로 갈지 알려주시면 일괄 처리하겠습니다:

| 옵션 | 결과 |
|---|---|
| **A. 그대로 유지** | 강의 외 부분은 이 문서로 명시. 코드 변경 없음. |
| **B. ⚠️ 항목 일부 제거** | 애니메이션 / 그라데이션 / clip-path 등 시각 효과만 단순화. 동작은 그대로. |
| **C. ⚠️ 항목 전부 제거** | 동적 기능까지 정적으로 회귀. 백엔드 사용 불가. |
| **D. TypeScript 부분 도입** | server/ 또는 일부 페이지를 .ts 로 전환 (Lec 9 수준). |
| **E. Babel Standalone 제거** | Vite 도입 + `npm run build`. 배포 흐름 변경. |
