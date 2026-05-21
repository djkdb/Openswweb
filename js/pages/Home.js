function Home({ setPage, user }) {
  const [tick, setTick] = React.useState(0);
  const [galleryOffset, setGalleryOffset] = React.useState(0);
  const [galleryPaused, setGalleryPaused] = React.useState(false);

  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    if (galleryPaused) return;
    const id = setInterval(() => {
      setGalleryOffset(o => (o + 1) % galleryItems.length);
    }, 3500);
    return () => clearInterval(id);
  }, [galleryPaused]);

  const upcoming = matches.filter(m => m.status === 'upcoming').sort((a, b) => a.date.localeCompare(b.date));
  const nextMatch = upcoming[0];

  const recentNotices = [...notices].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const previewGallery = Array.from({ length: 5 }, (_, i) =>
    galleryItems[(galleryOffset + i) % galleryItems.length]
  );

  const totalGoals = members.reduce((s, m) => s + m.goals, 0);
  const totalMatches = matches.filter(m => m.status === 'finished').length;
  const wins = matches.filter(m => m.status === 'finished' && m.scoreOurs > m.scoreTheirs).length;

  let countdown = '경기 정보 없음';
  if (nextMatch) {
    const target = new Date(`${nextMatch.date}T${nextMatch.time}:00`).getTime();
    const now = Date.now();
    const diff = target - now;
    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      countdown = `${days}일 ${hours}시간 ${mins}분 ${secs}초`;
    } else {
      countdown = '경기 진행 중';
    }
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-bg-grid"></div>
        <img src="assets/img/classfc-logo.png" alt="" className="hero-watermark" />
        <div className="container hero-inner">
          <div className="hero-crest-row">
            <img src="assets/img/classfc-logo.png" alt="CLASS FC" className="hero-crest" />
          </div>
          <div className="hero-meta">
            <span className="hero-est">EST. 2013</span>
            <span className="hero-dot">·</span>
            <span className="hero-dept">DEPT. OF SOFTWARE</span>
          </div>
          <h1 className="hero-title">
            CLASS <span className="green-accent">FC</span>
          </h1>
          <div className="hero-slogan">
            "Building the digital home of our football family."
          </div>
          <div className="hero-sub">
            소프트웨어학과 축구 동아리 공식 웹사이트
          </div>

          <div className="hero-buttons">
            <button className="btn-primary-green" onClick={() => setPage('schedule')}>
              NEXT MATCH →
            </button>
            <button className="btn-outline-green" onClick={() => setPage('members')}>
              MEET THE TEAM
            </button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">{members.length}</div>
              <div className="hero-stat-label">PLAYERS</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">{totalMatches}</div>
              <div className="hero-stat-label">MATCHES</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">{wins}</div>
              <div className="hero-stat-label">WINS</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">{totalGoals}</div>
              <div className="hero-stat-label">GOALS</div>
            </div>
          </div>
        </div>

        <div className="hero-side-text">
          THE OFFICIAL HOME OF CLASS FC
        </div>
      </section>

      {nextMatch && (
        <section className="next-match-section">
          <div className="container">
            <div className="next-match-row">
              <div className="next-match-label">
                <div className="badge-green">NEXT MATCH</div>
                <h3 className="next-match-title">다가오는 경기까지</h3>
                <div className="countdown-text">{countdown}</div>
                <button className="btn-outline-green mt-3" onClick={() => setPage('schedule')}>
                  전체 일정 보기
                </button>
              </div>
              <div className="next-match-card-wrap">
                <MatchCard match={nextMatch} user={user} />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="home-section">
        <div className="container">
          <div className="home-section-head">
            <div>
              <div className="section-subtitle">LATEST</div>
              <h2 className="section-title">최근 공지</h2>
            </div>
            <button className="link-arrow" onClick={() => setPage('notice')}>
              ALL NOTICES →
            </button>
          </div>

          <div className="row g-4">
            {recentNotices.map(n => (
              <div className="col-md-4" key={n.id}>
                <NoticeCard notice={n} compact={false} onClick={() => setPage('notice')} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section gallery-preview-section">
        <div className="container">
          <div className="home-section-head">
            <div>
              <div className="section-subtitle">MEMORIES</div>
              <h2 className="section-title">갤러리 미리보기</h2>
            </div>
            <button className="link-arrow" onClick={() => setPage('gallery')}>
              VIEW ALL →
            </button>
          </div>

          <div
            className="gallery-preview-grid"
            onMouseEnter={() => setGalleryPaused(true)}
            onMouseLeave={() => setGalleryPaused(false)}
          >
            {previewGallery.map((g, i) => (
              <div
                key={`${g.id}-${i}`}
                className={`gallery-preview-tile tile-${i}`}
                style={{ background: g.gradient }}
                onClick={() => setPage('gallery')}
              >
                <div className="gallery-tile-overlay">
                  <div className="gallery-tile-tag">{g.tag}</div>
                  <div className="gallery-tile-title">{g.title}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="gallery-slide-dots">
            {Array.from({ length: galleryItems.length }, (_, i) => (
              <span
                key={i}
                className={i === galleryOffset ? 'slide-dot active' : 'slide-dot'}
                onClick={() => setGalleryOffset(i)}
              ></span>
            ))}
            <span className="slide-pause-hint">
              {galleryPaused ? '⏸ 일시정지' : '▶ 자동 슬라이드'}
            </span>
          </div>
        </div>
      </section>

      <section className="home-cta-section">
        <div className="container">
          <div className="home-cta-box">
            <div>
              <div className="badge-green">JOIN US</div>
              <h2 className="cta-title">함께 뛸 사람을 찾습니다.</h2>
              <p className="cta-desc">
                실력보다 중요한 건 동료와 함께한다는 것. 신입 부원은 언제든 환영입니다.
              </p>
            </div>
            <div className="home-cta-action">
              {user ? (
                <button className="btn-primary-green" onClick={() => setPage('notice')}>
                  공지 확인하기
                </button>
              ) : (
                <button className="btn-primary-green" onClick={() => setPage('login')}>
                  SIGN UP NOW
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
