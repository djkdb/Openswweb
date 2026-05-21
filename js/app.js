function App() {
  const [page, setPage] = React.useState('home');
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const saved = localStorage.getItem('classfc_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem('classfc_user', JSON.stringify(u));
    setPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('classfc_user');
    setPage('home');
  };

  let content;
  if (page === 'home') content = <Home setPage={setPage} user={user} />;
  else if (page === 'login') content = <Login onLogin={handleLogin} setPage={setPage} />;
  else if (page === 'members') content = <Members />;
  else if (page === 'schedule') content = <Schedule user={user} />;
  else if (page === 'notice') content = <Notice user={user} />;
  else if (page === 'gallery') content = <Gallery />;
  else if (page === 'stats') content = <Stats />;
  else if (page === 'admin') {
    if (user && user.role === 'admin') {
      content = <Admin />;
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
