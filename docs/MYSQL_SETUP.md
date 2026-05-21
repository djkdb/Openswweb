# CLASS FC — MySQL 백엔드 셋업 가이드

지금까지 모든 동적 데이터(로그인, RSVP, MOTM, 댓글, 라인업, 갤러리 등)는
`localStorage` 에 임시 저장되어 있습니다. 같은 컴퓨터에서만 보이고, 새로
로그인한 부원은 빈 상태로 시작합니다. 동아리 전원이 함께 쓰려면 MySQL +
Node.js(Express) 백엔드가 필요합니다.

이 문서는 **윈도우 기준**으로 처음부터 끝까지 따라 할 수 있도록 정리한
가이드입니다.

---

## 1. MySQL 설치

### 1-1. 다운로드 & 설치
1. https://dev.mysql.com/downloads/installer/ 접속
2. **MySQL Installer for Windows** 다운로드 (mysql-installer-community-*.msi)
3. 실행 → `Developer Default` 선택 → Next → Execute
4. 설치 도중 **root 비밀번호** 설정 (잊지 말 것! 예: `Classfc1234!`)
5. `Apply Configuration` → Finish

### 1-2. 설치 확인
```bash
# 명령 프롬프트에서
mysql -u root -p
# 비밀번호 입력 후 mysql> 프롬프트 뜨면 성공
```

---

## 2. 데이터베이스 & 사용자 생성

`mysql -u root -p` 로 접속 후 한 줄씩 실행:

```sql
CREATE DATABASE classfc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'classfc_app'@'localhost' IDENTIFIED BY 'changeme_strong_password';
GRANT ALL PRIVILEGES ON classfc.* TO 'classfc_app'@'localhost';
FLUSH PRIVILEGES;

USE classfc;
```

---

## 3. 테이블 스키마

`schema.sql` 파일로 저장해서 한 번에 실행해도 됩니다.
`mysql -u classfc_app -p classfc < schema.sql`

```sql
-- =========================
-- accounts: 로그인 부원
-- =========================
CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(40) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,    -- bcrypt 권장. 평문 저장 금지
  name VARCHAR(40) NOT NULL,
  number VARCHAR(8),
  email VARCHAR(120) UNIQUE,
  role ENUM('admin', 'member') DEFAULT 'member',
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- members: 선수단 (학회 등록 부원)
-- =========================
CREATE TABLE members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT,                          -- accounts.id (선택)
  number INT NOT NULL,
  name VARCHAR(40) NOT NULL,
  name_en VARCHAR(80),
  position ENUM('GK', 'DF', 'MF', 'FW') NOT NULL,
  role VARCHAR(30) DEFAULT 'Member',       -- Captain, Vice-Captain, Manager, Member
  year INT,                                 -- 입학년도
  goals INT DEFAULT 0,
  assists INT DEFAULT 0,
  matches_played INT DEFAULT 0,
  bio TEXT,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
);

-- =========================
-- matches: 경기 일정
-- =========================
CREATE TABLE matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  match_date DATE NOT NULL,
  match_time TIME NOT NULL,
  opponent VARCHAR(60) NOT NULL,
  opponent_dept VARCHAR(60),
  venue VARCHAR(120),
  match_type ENUM('League', 'Cup', 'Friendly') DEFAULT 'League',
  status ENUM('upcoming', 'finished', 'cancelled') DEFAULT 'upcoming',
  home_away ENUM('home', 'away') DEFAULT 'home',
  score_ours INT,
  score_theirs INT,
  INDEX idx_status_date (status, match_date)
);

-- =========================
-- notices: 공지/커뮤니티 글
-- =========================
CREATE TABLE notices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  category ENUM('공지', '경기', '모집', '운영') NOT NULL,
  author_id INT,
  author_name VARCHAR(40),                  -- 비회원 작성 대비 보존
  content TEXT NOT NULL,
  pinned BOOLEAN DEFAULT FALSE,
  important BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES accounts(id) ON DELETE SET NULL,
  INDEX idx_category_date (category, created_at)
);

-- =========================
-- comments: 댓글 (공지 카테고리 제외)
-- =========================
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  notice_id INT NOT NULL,
  account_id INT,
  author_name VARCHAR(40) NOT NULL,
  author_number VARCHAR(8),
  text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (notice_id) REFERENCES notices(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL,
  INDEX idx_notice (notice_id, created_at)
);

-- =========================
-- rsvp: 경기 참석 여부
-- =========================
CREATE TABLE rsvp (
  id INT AUTO_INCREMENT PRIMARY KEY,
  match_id INT NOT NULL,
  account_id INT NOT NULL,
  status ENUM('attend', 'late') NOT NULL,
  responded_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_match_account (match_id, account_id),
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- =========================
-- motm_votes: MOTM 투표
-- =========================
CREATE TABLE motm_votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  match_id INT NOT NULL,
  voter_account_id INT NOT NULL,
  voted_member_id INT NOT NULL,
  voted_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_match_voter (match_id, voter_account_id),
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  FOREIGN KEY (voter_account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (voted_member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- =========================
-- lineups: 공식 라인업 (관리자가 게시)
-- =========================
CREATE TABLE lineups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  match_id INT NOT NULL UNIQUE,
  lineup_type ENUM('football', 'futsal') DEFAULT 'football',
  formation VARCHAR(20) NOT NULL,           -- '4-3-3', '1-2-1' 등
  published_by INT,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  FOREIGN KEY (published_by) REFERENCES accounts(id) ON DELETE SET NULL
);

CREATE TABLE lineup_slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lineup_id INT NOT NULL,
  slot_id VARCHAR(20) NOT NULL,             -- 'GK', 'LB', 'PIVOT' 등
  member_id INT NOT NULL,
  UNIQUE KEY uk_lineup_slot (lineup_id, slot_id),
  FOREIGN KEY (lineup_id) REFERENCES lineups(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- =========================
-- gallery: 사진
-- =========================
CREATE TABLE gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  tag ENUM('Match', 'Training', 'Team', 'Highlight', 'Event') DEFAULT 'Match',
  image_url VARCHAR(255),
  taken_date DATE,
  uploaded_by INT,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES accounts(id) ON DELETE SET NULL
);
```

---

## 4. 초기 데이터 (시드)

`seed.sql` — 지금 프론트에 하드코딩된 데이터를 그대로 옮긴 것:

```sql
USE classfc;

INSERT INTO accounts (username, password_hash, name, number, role) VALUES
  ('admin', '$2b$10$EXAMPLE_HASH_REPLACE_ME', '운영자', '00', 'admin');

INSERT INTO members (number, name, name_en, position, role, year, goals, assists, matches_played, bio) VALUES
  (77, '차형창', 'Hyeong-chang Cha', 'FW', 'Captain',      22, 14, 6,  18, '팀의 주장이자 에이스 스트라이커.'),
  (17, '이성준', 'Seong-jun Lee',    'MF', 'Vice-Captain', 21,  5, 11, 17, '경기 흐름을 조율하는 미드필더.'),
  (29, '김태효', 'Tae-hyo Kim',      'DF', 'Manager',      22,  1, 2,  16, '수비의 핵심.'),
  (1,  '박지훈', 'Ji-hoon Park',     'GK', 'Member',       23,  0, 0,  18, '뛰어난 반사신경의 골키퍼.'),
  (8,  '정민혁', 'Min-hyuk Jung',    'MF', 'Member',       23,  3, 7,  15, '활동량이 많은 미드필더.'),
  (11, '한승우', 'Seung-woo Han',    'FW', 'Member',       24,  9, 4,  16, '드리블에 능한 윙어.'),
  (5,  '오재현', 'Jae-hyeon Oh',     'DF', 'Member',       22,  0, 1,  17, '제공권에 강한 센터백.'),
  (23, '서동훈', 'Dong-hoon Seo',    'MF', 'Member',       24,  2, 5,  14, '세트피스 키커.'),
  (4,  '윤성호', 'Seong-ho Yoon',    'DF', 'Member',       21,  0, 0,  18, '공격 가담이 빠른 풀백.'),
  (9,  '강재민', 'Jae-min Kang',     'FW', 'Member',       23,  8, 3,  15, '포스트 플레이가 좋은 스트라이커.'),
  (14, '신현우', 'Hyun-woo Shin',    'MF', 'Member',       24,  4, 2,  13, '먼 거리 슛이 강점.'),
  (21, '문지원', 'Ji-won Moon',      'GK', 'Member',       24,  0, 0,  4,  '백업 골키퍼.');

INSERT INTO matches (match_date, match_time, opponent, opponent_dept, venue, match_type, status, home_away, score_ours, score_theirs) VALUES
  ('2026-05-24', '15:00', 'EE United',  '전자공학과',    '학생회관 운동장', 'League',   'upcoming', 'home', NULL, NULL),
  ('2026-05-31', '14:00', 'ME FC',      '기계공학과',    '제2운동장',       'League',   'upcoming', 'away', NULL, NULL),
  ('2026-06-07', '16:00', 'CE Eagles',  '컴퓨터공학과',  '학생회관 운동장', 'Cup',      'upcoming', 'home', NULL, NULL),
  ('2026-05-17', '15:00', 'CHEM Lions', '화학공학과',    '학생회관 운동장', 'League',   'finished', 'home', 3, 1),
  ('2026-05-10', '14:00', 'BIO Wolves', '생명공학과',    '제2운동장',       'League',   'finished', 'away', 2, 2),
  ('2026-05-03', '15:00', 'PHY United', '물리학과',      '학생회관 운동장', 'Friendly', 'finished', 'home', 4, 0),
  ('2026-04-26', '15:00', 'MATH FC',    '수학과',        '제2운동장',       'League',   'finished', 'away', 1, 2);
```

비밀번호 해시는 한 번 Node 로 만든 다음 INSERT 하세요:

```js
// 임시 스크립트: makehash.js
const bcrypt = require('bcrypt');
bcrypt.hash('admin1234', 10).then(console.log);
// → 출력된 문자열을 위 INSERT 의 password_hash 자리에 붙여넣기
```

---

## 5. Node.js + Express 서버

### 5-1. 폴더 구조
```
classfc/
├── (현재 프론트엔드 파일들)
│   ├── index.html, js/, css/, assets/
└── server/
    ├── package.json
    ├── .env
    ├── index.js
    └── db.js
```

### 5-2. 초기화
```bash
cd Openswweb
mkdir server
cd server
npm init -y
npm install express mysql2 bcrypt jsonwebtoken cors dotenv
```

### 5-3. `.env`
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=classfc_app
DB_PASSWORD=changeme_strong_password
DB_NAME=classfc
JWT_SECRET=replace-with-a-long-random-string
PORT=3001
```

### 5-4. `db.js`
```js
import mysql from 'mysql2/promise';
import 'dotenv/config';

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4'
});
```

### 5-5. `index.js` — 최소 API 예시
```js
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { pool } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// 인증 미들웨어
function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'no token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'bad token' });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'admin only' });
  next();
}

// ----- AUTH -----
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await pool.query(
    'SELECT * FROM accounts WHERE username = ?', [username]
  );
  if (rows.length === 0) return res.status(401).json({ error: 'invalid' });
  const ok = await bcrypt.compare(password, rows[0].password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid' });
  const u = rows[0];
  const token = jwt.sign(
    { id: u.id, username: u.username, name: u.name, number: u.number, role: u.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ token, user: { id: u.id, name: u.name, number: u.number, role: u.role, username: u.username } });
});

app.post('/api/auth/signup', async (req, res) => {
  const { username, password, name, number, email } = req.body;
  if (password.length < 6) return res.status(400).json({ error: 'pw too short' });
  const hash = await bcrypt.hash(password, 10);
  try {
    await pool.query(
      'INSERT INTO accounts (username, password_hash, name, number, email) VALUES (?, ?, ?, ?, ?)',
      [username, hash, name, number, email]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: 'username already exists' });
  }
});

// ----- MEMBERS / MATCHES / NOTICES (읽기) -----
app.get('/api/members',  async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM members ORDER BY number');
  res.json(rows);
});
app.get('/api/matches',  async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM matches ORDER BY match_date');
  res.json(rows);
});
app.get('/api/notices',  async (req, res) => {
  const [rows] = await pool.query(
    `SELECT n.*, COUNT(c.id) AS comment_count
     FROM notices n LEFT JOIN comments c ON c.notice_id = n.id
     GROUP BY n.id ORDER BY n.pinned DESC, n.created_at DESC`
  );
  res.json(rows);
});

// ----- COMMENTS -----
app.get('/api/notices/:id/comments', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM comments WHERE notice_id = ? ORDER BY created_at',
    [req.params.id]
  );
  res.json(rows);
});

app.post('/api/notices/:id/comments', auth, async (req, res) => {
  const { text } = req.body;
  const [notice] = await pool.query('SELECT category FROM notices WHERE id = ?', [req.params.id]);
  if (notice[0]?.category === '공지') {
    return res.status(403).json({ error: '공지사항에는 댓글을 작성할 수 없습니다' });
  }
  await pool.query(
    'INSERT INTO comments (notice_id, account_id, author_name, author_number, text) VALUES (?, ?, ?, ?, ?)',
    [req.params.id, req.user.id, req.user.name, req.user.number, text]
  );
  res.json({ ok: true });
});

// ----- RSVP -----
app.post('/api/matches/:id/rsvp', auth, async (req, res) => {
  const { status } = req.body;   // 'attend' | 'late'
  await pool.query(
    `INSERT INTO rsvp (match_id, account_id, status)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE status = VALUES(status)`,
    [req.params.id, req.user.id, status]
  );
  res.json({ ok: true });
});

app.get('/api/matches/:id/rsvp', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT r.status, a.name, a.number
     FROM rsvp r JOIN accounts a ON a.id = r.account_id
     WHERE r.match_id = ?`,
    [req.params.id]
  );
  res.json(rows);
});

// ----- MOTM -----
app.post('/api/matches/:id/motm', auth, async (req, res) => {
  const { memberId } = req.body;
  await pool.query(
    `INSERT INTO motm_votes (match_id, voter_account_id, voted_member_id)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE voted_member_id = VALUES(voted_member_id)`,
    [req.params.id, req.user.id, memberId]
  );
  res.json({ ok: true });
});

app.get('/api/matches/:id/motm', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT voted_member_id AS member_id, COUNT(*) AS votes
     FROM motm_votes WHERE match_id = ?
     GROUP BY voted_member_id ORDER BY votes DESC`,
    [req.params.id]
  );
  res.json(rows);
});

// ----- LINEUPS -----
app.post('/api/matches/:id/lineup', auth, adminOnly, async (req, res) => {
  const { type, formation, assignments } = req.body;  // assignments: { slotId: memberId }
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM lineup_slots WHERE lineup_id IN (SELECT id FROM lineups WHERE match_id = ?)', [req.params.id]);
    await conn.query('DELETE FROM lineups WHERE match_id = ?', [req.params.id]);
    const [r] = await conn.query(
      'INSERT INTO lineups (match_id, lineup_type, formation, published_by) VALUES (?, ?, ?, ?)',
      [req.params.id, type, formation, req.user.id]
    );
    const lineupId = r.insertId;
    const rows = Object.entries(assignments).map(([sid, mid]) => [lineupId, sid, mid]);
    if (rows.length) {
      await conn.query('INSERT INTO lineup_slots (lineup_id, slot_id, member_id) VALUES ?', [rows]);
    }
    await conn.commit();
    res.json({ ok: true });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ error: e.message });
  } finally {
    conn.release();
  }
});

app.get('/api/matches/:id/lineup', async (req, res) => {
  const [[lineup]] = await pool.query('SELECT * FROM lineups WHERE match_id = ?', [req.params.id]);
  if (!lineup) return res.json(null);
  const [slots] = await pool.query(
    'SELECT slot_id, member_id FROM lineup_slots WHERE lineup_id = ?',
    [lineup.id]
  );
  const assignments = {};
  slots.forEach(s => { assignments[s.slot_id] = s.member_id; });
  res.json({
    type: lineup.lineup_type,
    formation: lineup.formation,
    assignments,
    publishedAt: lineup.published_at,
    publishedBy: lineup.published_by
  });
});

app.listen(process.env.PORT, () => {
  console.log(`API on http://localhost:${process.env.PORT}`);
});
```

### 5-6. 서버 실행
`server/package.json` 에 추가:
```json
{
  "type": "module",
  "scripts": {
    "dev": "node --watch index.js"
  }
}
```

```bash
cd server
npm run dev
```

---

## 6. 프론트엔드 → API 연결

프론트의 `localStorage` 호출을 `fetch` 로 한 개씩 갈아끼우면 됩니다.
예시 (Login.js 의 로그인 부분):

```js
// 기존: localStorage 검사
// 변경:
const res = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
const data = await res.json();
if (data.token) {
  localStorage.setItem('classfc_token', data.token);
  onLogin(data.user);
} else {
  setError('아이디 또는 비밀번호가 올바르지 않습니다.');
}
```

이후 모든 fetch 에 토큰 헤더를 같이 보내세요:
```js
fetch('http://localhost:3001/api/notices/3/comments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('classfc_token')
  },
  body: JSON.stringify({ text: '댓글 내용' })
});
```

치환할 키 매핑:
| 기존 localStorage 키          | 새 API 엔드포인트                       |
| ----------------------------- | --------------------------------------- |
| `classfc_user`                | `POST /api/auth/login` 응답             |
| `classfc_accounts`            | `POST /api/auth/signup`                 |
| `classfc_rsvp`                | `GET/POST /api/matches/:id/rsvp`        |
| `classfc_motm`                | `GET/POST /api/matches/:id/motm`        |
| `classfc_comments`            | `GET/POST /api/notices/:id/comments`    |
| `classfc_lineups`             | `GET/POST /api/matches/:id/lineup`      |
| `classfc_notices_extra`       | `GET /api/notices`, `POST /api/notices` |

---

## 7. 개발 중 자주 쓰는 명령

```bash
# DB 접속
mysql -u classfc_app -p classfc

# 백업
mysqldump -u classfc_app -p classfc > backup_$(date +%Y%m%d).sql

# 복구
mysql -u classfc_app -p classfc < backup_20260521.sql

# 서버 로그 실시간
cd server && npm run dev
```

---

## 8. 보안 체크리스트 (배포 전)

- [ ] `.env` 는 절대 git 에 올리지 않기 (`.gitignore` 에 추가)
- [ ] `JWT_SECRET` 은 32자 이상 랜덤
- [ ] DB 사용자(`classfc_app`) 비밀번호 강하게
- [ ] 비밀번호는 항상 bcrypt 해시로 저장 (평문 금지)
- [ ] SQL 은 항상 `?` 파라미터 바인딩 사용 (문자열 concat 금지)
- [ ] CORS 는 운영 도메인만 허용으로 변경
- [ ] 관리자 액션은 모두 `adminOnly` 미들웨어 통과 확인
