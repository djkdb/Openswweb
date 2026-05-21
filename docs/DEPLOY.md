# CLASS FC — 배포 가이드

전체 구성:
```
   사용자 브라우저
        │
        ▼
[ GitHub Pages ]    coomind.github.io/Openswweb
   (정적 프론트)
        │  fetch
        ▼
[ Render.com    ]   classfc-api.onrender.com
   (Node.js API)
        │  mysql2 connection
        ▼
[ ngrok TCP tunnel ]  0.tcp.ap.ngrok.io:XXXXX
        │
        ▼
[ 본인 PC : MySQL ]   localhost:3306
```

처음부터 끝까지 순서대로 따라 하세요.

---

## 0. 사전 준비물

- [ ] MySQL 설치 완료 (확인: `mysql -u root -p` 접속 가능)
- [ ] Node.js 18+ 설치 (확인: `node --version`)
- [ ] Git 설치 + GitHub 계정
- [ ] Render.com 계정 (https://render.com 무료 가입)
- [ ] ngrok 계정 (https://ngrok.com 무료 가입)

---

## 1. 로컬 MySQL 셋업

MySQL 콘솔에서 한 줄씩 실행:

```sql
CREATE DATABASE classfc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'classfc_app'@'localhost' IDENTIFIED BY '비번_길게_바꾸세요!';
CREATE USER 'classfc_app'@'%'         IDENTIFIED BY '비번_길게_바꾸세요!';
GRANT ALL PRIVILEGES ON classfc.* TO 'classfc_app'@'localhost';
GRANT ALL PRIVILEGES ON classfc.* TO 'classfc_app'@'%';
FLUSH PRIVILEGES;
EXIT;
```

> ⚠️ `'%'` 사용자는 외부(=ngrok 경유 Render)에서도 접속 가능하게 하기 위함입니다.
> 비밀번호를 반드시 강하게 설정하세요.

스키마 적용:
```bash
cd Openswweb/server
mysql -u classfc_app -p classfc < schema.sql
```

테이블 10개가 생성되었는지 확인:
```bash
mysql -u classfc_app -p classfc -e "SHOW TABLES;"
```

---

## 2. MySQL 외부 접속 허용 (윈도우 기준)

기본 MySQL 은 `localhost` 만 받아줍니다. ngrok 으로 들어오는 연결을 받으려면
`bind-address` 를 풀어줘야 합니다.

1. **MySQL 설정 파일 찾기**: `C:\ProgramData\MySQL\MySQL Server 8.0\my.ini`
2. `[mysqld]` 섹션 아래 다음을 수정/추가:
   ```
   bind-address = 0.0.0.0
   ```
3. 윈도우 서비스에서 **MySQL80** 서비스 재시작
   (`Win+R` → `services.msc` → MySQL80 우클릭 → 재시작)
4. 확인:
   ```bash
   netstat -an | findstr 3306
   ```
   `0.0.0.0:3306 LISTENING` 나오면 OK.

---

## 3. 서버 환경 설정 + 시드 데이터

```bash
cd Openswweb/server
npm install
```

`.env.example` 복사해서 `.env` 만들기:
```bash
copy .env.example .env       # 윈도우
# cp .env.example .env         # mac/linux
```

`.env` 를 메모장으로 열어 본인 값으로 수정:
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=classfc_app
DB_PASSWORD=위에서_정한_비번
DB_NAME=classfc

JWT_SECRET=아무거나_32자_이상_랜덤한_문자열_예를_들면_password_generator_로_생성
CORS_ORIGIN=*
PORT=3001
```

초기 데이터(부원 12명, 경기 7개, 공지 6개, 갤러리 12개, admin 계정) 입력:
```bash
npm run seed
```
출력:
```
✓ admin account (login: admin / admin1234)
✓ 12 members
✓ 7 matches
✓ 6 notices
✓ 12 gallery items
```

서버 실행:
```bash
npm run dev
```
출력:
```
CLASS FC API listening on :3001
  health: http://localhost:3001/api/health
```

브라우저에서 http://localhost:3001/api/health 열어 `{"ok":true,"db":"up",...}` 확인.

---

## 4. 프론트엔드 로컬 테스트

서버 켠 상태에서, 새 VS Code 창으로 Openswweb 폴더 열기 → `index.html`
Live Server 로 열기. 브라우저에서:

1. 페이지가 정상 로드되고 "서버 연결 중" 로딩 후 메인 화면 표시
2. 로그인 → `admin` / `admin1234`
3. SCHEDULE → 참석 클릭 → ADMIN → 참석 명단에서 확인
4. NOTICE → 경기 카테고리 글 클릭 → 댓글 작성 가능

여기까지 동작하면 로컬 풀스택은 완성입니다.

---

## 5. GitHub 에 푸시

이미 `coomind/Openswweb` 에 푸시되어 있다면 건너뛰기.

```bash
cd Openswweb
git add .
git commit -m "ready for deploy"
git push
```

---

## 6. ngrok 으로 MySQL 외부 노출

### 6-1. ngrok 설치
1. https://ngrok.com 가입 → Your Authtoken 페이지에서 토큰 복사
2. 윈도우용 다운로드 → 압축 해제 → `ngrok.exe` 실행 가능한 폴더로
3. 토큰 등록:
   ```bash
   ngrok config add-authtoken 토큰값붙여넣기
   ```

### 6-2. TCP 터널 시작
```bash
ngrok tcp 3306
```

출력 예시:
```
Forwarding   tcp://0.tcp.ap.ngrok.io:18234 -> localhost:3306
```

`0.tcp.ap.ngrok.io` = 호스트, `18234` = 포트. 이 두 값을 메모.

> ⚠️ **무료 티어 한계**: ngrok 을 재시작할 때마다 URL/포트가 바뀝니다.
> 바뀔 때마다 Render 환경변수 `DB_HOST`, `DB_PORT` 도 수정해야 합니다.
> 매번 켜는 게 번거로우면 `ngrok` 유료 플랜($8/월) 으로 reserved TCP 도메인을 잡으면 됩니다.

### 6-3. 외부 접속 테스트 (선택)
다른 컴퓨터 또는 휴대폰 핫스팟에서:
```bash
mysql -h 0.tcp.ap.ngrok.io -P 18234 -u classfc_app -p
```
접속 되면 OK.

---

## 7. Render.com 배포 (백엔드)

### 7-1. 새 Web Service 생성
1. Render 대시보드 → **New +** → **Web Service**
2. **Connect a repository** → GitHub 연결 → `coomind/Openswweb` 선택
3. 설정:
   - **Name**: `classfc-api`
   - **Region**: Singapore (한국에서 가장 가까움)
   - **Branch**: `claude/build-website-from-ppt-w9pmi` (또는 본인이 머지한 메인 브랜치)
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
4. **Environment Variables** 추가:
   ```
   DB_HOST         = 0.tcp.ap.ngrok.io     ← ngrok 호스트
   DB_PORT         = 18234                  ← ngrok 포트
   DB_USER         = classfc_app
   DB_PASSWORD     = 위에서_정한_비번
   DB_NAME         = classfc
   JWT_SECRET      = 같은_random_string
   CORS_ORIGIN     = https://coomind.github.io
   ```
5. **Create Web Service**

### 7-2. 배포 확인
- Render 대시보드에 로그가 흐르고, 끝에 `CLASS FC API listening on :10000` (Render 가 PORT 를 주입함) 나오면 성공
- URL 은 `https://classfc-api.onrender.com` (또는 비슷한 이름)
- 브라우저로 `https://classfc-api.onrender.com/api/health` → `{"ok":true,"db":"up",...}` 확인

> 🟡 **콜드 스타트**: 무료 티어는 15분 동안 요청 없으면 잠듭니다. 다음 첫
> 요청은 20~40초 대기. 부원이 자주 들어오면 거의 안 잠들지만, 새벽 첫 접속
> 같은 경우 느릴 수 있습니다.

---

## 8. GitHub Pages 배포 (프론트엔드)

### 8-1. 프론트 API URL 확인
`js/config.js` 를 보면:
```js
return 'https://classfc-api.onrender.com';
```
이 값이 본인 Render URL 과 같은지 확인. 다르면 수정 후 푸시.

### 8-2. GitHub Pages 활성화
1. `coomind/Openswweb` 저장소 → **Settings** → **Pages**
2. **Source** → `Deploy from a branch`
3. **Branch** → `claude/build-website-from-ppt-w9pmi` (또는 메인) / **folder** → `/ (root)`
4. **Save**

1~2분 후 페이지 새로고침하면 상단에:
```
Your site is live at https://coomind.github.io/Openswweb/
```

### 8-3. CORS 설정 검증
백엔드 `CORS_ORIGIN` 에 정확히 `https://coomind.github.io` (트레일링 슬래시 X)
가 들어있어야 합니다. 도메인이 바뀌면 Render 환경변수도 수정 후 저장
(자동 재배포됨).

---

## 9. 정상 동작 체크리스트

브라우저로 `https://coomind.github.io/Openswweb/` 열기:

- [ ] 로딩 스피너 후 메인 페이지 표시
- [ ] MEMBERS → 12명 표시
- [ ] SCHEDULE → 경기 7개 표시
- [ ] LOGIN → admin / admin1234 로그인 성공
- [ ] SCHEDULE → 참석 버튼 → "참석 1" 으로 바뀜
- [ ] 다른 브라우저(시크릿창) 로 들어가서 같은 경기 보면 "참석 1" 이 보임 ← DB 공유 확인
- [ ] ADMIN → 참석 명단 → 운영자 이름이 보임
- [ ] NOTICE → 경기 카테고리 게시글 → 댓글 작성 가능
- [ ] SQUAD → 라인업 짜기 → "라인업으로 게시" → SCHEDULE 카드에 "공식 라인업" 펼침 가능

---

## 10. 운영 팁

### 10-1. 부원에게 배포할 때
링크 한 줄로 끝:
```
CLASS FC 공식 사이트: https://coomind.github.io/Openswweb/
회원가입 후 사용해 주세요.
```

### 10-2. PC/ngrok 끄지 않기
- 부원이 접속하는 시간대는 PC + MySQL + ngrok 이 모두 켜져 있어야 합니다.
- 노트북이라면 절전 모드 해제, 화면 끄기만 설정.
- 권장: **PC 시작 시 자동 실행**
  - `ngrok.exe` 단축키 → 시작프로그램 폴더 (`shell:startup`)
  - `npm start` 는 `pm2` 같은 프로세스 매니저로 자동 시작 가능

### 10-3. ngrok URL 이 바뀌었을 때
1. ngrok 재시작 후 새 호스트:포트 메모
2. Render 대시보드 → 서비스 → Environment → `DB_HOST`, `DB_PORT` 수정 → Save
3. Render 가 자동 재배포(약 1분)

### 10-4. 데이터 백업
주기적으로 PC 에서:
```bash
mysqldump -u classfc_app -p classfc > backup_2026-05-22.sql
```

### 10-5. 비밀번호 변경/리셋
새 비밀번호 해시 생성:
```bash
cd server
node -e "import('bcrypt').then(b => b.hash('새비번', 10).then(console.log))"
```
출력된 해시를 DB 에 직접 업데이트:
```sql
UPDATE accounts SET password_hash = '$2b$10$위에서_출력된해시' WHERE username = 'admin';
```

---

## 11. 자주 나오는 문제

| 증상                                                | 원인                              | 해결                                                         |
|-----------------------------------------------------|-----------------------------------|--------------------------------------------------------------|
| `connect ECONNREFUSED`                              | ngrok 안 켜짐 / MySQL 안 켜짐     | ngrok / MySQL 서비스 둘 다 실행 중인지 확인                   |
| CORS error                                          | `CORS_ORIGIN` 미스매치            | Render env 의 `CORS_ORIGIN` 을 GitHub Pages URL 과 정확히 일치 |
| 첫 로딩이 30초 걸림                                 | Render 콜드 스타트                | 정상. 5분 이내 재접속은 빠름                                  |
| 로그인하면 다른 사람도 자기 계정으로 보임           | JWT_SECRET 가 'changeme' 같은 약함 | `JWT_SECRET` 을 32자 이상 랜덤으로 교체 + Render 환경변수 갱신 |
| ngrok 무료에 `1 simultaneous tcp session` 에러      | 이미 다른 ngrok 세션이 살아있음   | `ngrok kill` 후 다시 시작                                     |
| MySQL `Access denied for user 'classfc_app'@'IP'`   | `'%'` 사용자 없음                 | `CREATE USER 'classfc_app'@'%'` + `GRANT` 다시                |

---

## 12. 향후 개선 (선택)

- **HTTPS DB**: ngrok 대신 Cloudflare Tunnel + 본인 도메인 → 더 안정
- **콜드 스타트 방지**: UptimeRobot 등 무료 핑 서비스가 5분마다 `/api/health` 호출
- **유료 DB 호스팅**: PlanetScale / Aiven / Railway 로 옮기면 PC 안 켜둬도 됨
- **도메인 구입**: `classfc.kr` 등 구입 → GitHub Pages 와 Render 양쪽에 연결
- **자동 백업**: GitHub Actions 로 매일 mysqldump → Google Drive
