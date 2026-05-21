function App() {
  const [page, setPage] = React.useState('home');
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState(null);
  const [dataVer, setDataVer] = React.useState(0);

  const loadAll = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [ms, mt, ns, gs] = await Promise.all([
        api.get('/api/members'),
        api.get('/api/matches'),
        api.get('/api/notices'),
        api.get('/api/gallery')
      ]);
      members = ms;
      matches = mt;
      notices = ns;
      galleryItems = gs;

      const token = localStorage.getItem('classfc_token');
      if (token) {
        try {
          const me = await api.get('/api/auth/me');
          if (me) setUser(me);
        } catch {
          localStorage.removeItem('classfc_token');
        }
      }

      setDataVer(v => v + 1);
      setLoading(false);
    } catch (e) {
      setLoadError(e.message || '서버에 연결할 수 없습니다.');
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadAll();
  }, []);

  const refresh = () => setDataVer(v => v + 1);

  const handleLogin = (u, token) => {
    setUser(u);
    localStorage.setItem('classfc_user', JSON.stringify(u));
    if (token) localStorage.setItem('classfc_token', token);
    setPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('classfc_user');
    localStorage.removeItem('classfc_token');
    setPage('home');
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-inner">
          <img src="assets/img/classfc-logo.png" alt="CLASS FC" className="app-loading-logo" />
          <div className="app-loading-title">CLASS FC</div>
          <div className="app-loading-spinner"></div>
          <div className="app-loading-text">서버에 연결 중...</div>
          <div className="app-loading-hint">
            첫 접속은 백엔드가 깨어나는 데 20~40초 걸릴 수 있어요.
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="app-loading">
        <div className="app-loading-inner">
          <img src="assets/img/classfc-logo.png" alt="CLASS FC" className="app-loading-logo" />
          <div className="app-loading-title">연결 실패</div>
          <div className="app-loading-err">{loadError}</div>
          <button className="btn-primary-green mt-3" onClick={loadAll}>다시 시도</button>
          <div className="app-loading-hint">
            서버: {window.API_BASE}
          </div>
        </div>
      </div>
    );
  }

  let content;
  if (page === 'home') content = <Home setPage={setPage} user={user} />;
  else if (page === 'login') content = <Login onLogin={handleLogin} setPage={setPage} />;
  else if (page === 'members') content = <Members />;
  else if (page === 'schedule') content = <Schedule user={user} onChange={refresh} />;
  else if (page === 'notice') content = <Notice user={user} />;
  else if (page === 'gallery') content = <Gallery />;
  else if (page === 'stats') content = <Stats />;
  else if (page === 'squad') content = <SquadMaker user={user} />;
  else if (page === 'admin') {
    if (user && user.role === 'admin') {
      content = <Admin onChange={refresh} />;
    } else {
      content = (
        <div className="container page-section text-center">
          <h2 className="section-title">ACCESS DENIED</h2>
          <p className="text-secondary mt-3">관리자 계정으로 로그인하세요.</p>
          <button className="btn-primary-green mt-4" onClick={() => setPage('login')}>
            LOGIN
          </button>
        </div>
      );
    }
  }
  else content = <Home setPage={setPage} user={user} />;

  const bannerClosed = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('classfc_banner_closed') === '1';
  const hasUpcoming = matches.some(m => m.status === 'upcoming');
  const showBanner = !bannerClosed && hasUpcoming;

  return (
    <>
      <Navbar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
      <CountdownBanner setPage={setPage} />
      <main className={showBanner ? 'app-main with-banner' : 'app-main'}>
        {content}
      </main>
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
