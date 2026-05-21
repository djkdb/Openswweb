const notices = [
  {
    id: 1,
    title: '2026년 5월 정기 회의 안내',
    category: '공지',
    author: 'CLASS FC 운영진',
    date: '2026-05-19',
    pinned: true,
    important: true,
    content: `안녕하세요, CLASS FC 운영진입니다.

5월 정기 회의를 아래와 같이 진행합니다.

일시: 2026년 5월 26일 (화) 오후 7시
장소: 소프트웨어학과 세미나실 (공학관 5층)

논의 안건:
1. 5월 경기 리뷰
2. 6월 컵 대회 일정 확정
3. 신입 부원 환영회 일정
4. 유니폼 추가 제작 건

필참 부탁드립니다. 불참 시 운영진에 미리 연락 주세요.`
  },
  {
    id: 2,
    title: '5/24 EE United 전 라인업 안내',
    category: '경기',
    author: '차형창',
    date: '2026-05-20',
    pinned: true,
    important: false,
    content: `5월 24일 EE United 와의 리그 경기 라인업입니다.

선발 11인:
GK 박지훈 / DF 윤성호 김태효 오재현 / MF 이성준 정민혁 서동훈 / FW 한승우 차형창 강재민 / 신현우

집결: 14:00 학생회관 운동장 앞
워밍업: 14:20 부터
킥오프: 15:00

당일 우천 시 본 공지에 댓글로 안내드립니다.`
  },
  {
    id: 3,
    title: '신입 부원 모집 (~5/31까지)',
    category: '모집',
    author: '김태효',
    date: '2026-05-15',
    pinned: false,
    important: false,
    content: `CLASS FC 신입 부원을 모집합니다.

자격: 소프트웨어학과 재학생 (학년 무관)
인원: 4명 내외
지원: 운영진에게 DM 또는 이메일

함께 뛸 분을 기다립니다!`
  },
  {
    id: 4,
    title: '5/17 CHEM Lions 전 승리 후기 3-1',
    category: '경기',
    author: '이성준',
    date: '2026-05-17',
    pinned: false,
    important: false,
    content: `오늘 경기 다들 수고 많으셨습니다.

전반 차형창 선수 선제골 이후 후반에 한승우, 강재민 선수의 추가골로 3-1 승리했습니다.

이번 주 훈련은 수요일 저녁 8시, 공식 그라운드에서 진행됩니다.`
  },
  {
    id: 5,
    title: '유니폼 사이즈 재조사',
    category: '운영',
    author: 'CLASS FC 운영진',
    date: '2026-05-12',
    pinned: false,
    important: false,
    content: `상반기 유니폼 추가 제작을 위해 사이즈를 다시 조사합니다.

신청 폼에 본인 이름, 등번호, 사이즈, 마킹 영문을 기입해 주세요.
마감: 5/22 (목) 자정`
  },
  {
    id: 6,
    title: '동아리 회비 납부 안내 (2026 상반기)',
    category: '운영',
    author: '김태효',
    date: '2026-05-05',
    pinned: false,
    important: true,
    content: `2026년 상반기 동아리 회비 납부 안내입니다.

금액: 30,000원
계좌: 농협 1234-5678-9012 (CLASS FC)
마감: 5/20

회비는 유니폼, 경기장 대관, 음료 및 간식 등에 사용됩니다.`
  },
  {
    id: 7,
    title: '훈련 일정 변경 (수요일 → 목요일)',
    category: '운영',
    author: 'CLASS FC 운영진',
    date: '2026-04-30',
    pinned: false,
    important: false,
    content: `다음 주부터 정기 훈련 요일을 목요일 저녁 8시로 변경합니다.

수업 시간표 변경에 따른 결정입니다.
양해 부탁드립니다.`
  }
];

const categoryColors = {
  '공지': '#00d166',
  '경기': '#ff4d5e',
  '모집': '#f5a623',
  '운영': '#4a90e2'
};
