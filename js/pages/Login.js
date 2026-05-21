function Login({ onLogin, setPage }) {
  const [mode, setMode] = React.useState('login');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [signupName, setSignupName] = React.useState('');
  const [signupNumber, setSignupNumber] = React.useState('');
  const [signupEmail, setSignupEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('아이디와 비밀번호를 모두 입력해 주세요.');
      return;
    }

    if (username === 'admin' && password === 'admin1234') {
      onLogin({ name: '운영자', number: '00', role: 'admin', username: 'admin' });
      return;
    }

    const stored = JSON.parse(localStorage.getItem('classfc_accounts') || '[]');
    const acc = stored.find(a => a.username === username && a.password === password);
    if (acc) {
      onLogin({ name: acc.name, number: acc.number, role: 'member', username: acc.username });
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password || !signupName || !signupNumber || !signupEmail) {
      setError('모든 항목을 입력해 주세요.');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    const stored = JSON.parse(localStorage.getItem('classfc_accounts') || '[]');
    if (stored.find(a => a.username === username)) {
      setError('이미 사용 중인 아이디입니다.');
      return;
    }

    const newAcc = {
      username,
      password,
      name: signupName,
      number: signupNumber,
      email: signupEmail,
      role: 'member',
      joinedAt: new Date().toISOString()
    };
    stored.push(newAcc);
    localStorage.setItem('classfc_accounts', JSON.stringify(stored));
    setSuccess('가입 완료! 이제 로그인 할 수 있습니다.');

    setUsername('');
    setPassword('');
    setSignupName('');
    setSignupNumber('');
    setSignupEmail('');

    setTimeout(() => {
      setMode('login');
      setSuccess('');
    }, 1400);
  };

  return (
    <div className="login-page">
      <div className="login-bg"></div>

      <div className="container login-container">
        <div className="login-left">
          <div className="login-brand">
            <img src="assets/img/classfc-logo.png" alt="CLASS FC" className="login-brand-logo" />
            <div className="login-brand-text">
              <div className="login-brand-title">CLASS FC</div>
              <div className="login-brand-sub">OFFICIAL CLUB ACCESS</div>
            </div>
          </div>

          <h1 className="login-quote-title">
            "WE PLAY <span className="green-accent">AS ONE</span>."
          </h1>
          <p className="login-quote-sub">
            동아리 부원 전용 공간으로 들어오세요.
            경기 일정, 라인업, 공지를 한 곳에서 확인할 수 있습니다.
          </p>

          <div className="login-features">
            <div className="login-feature">
              <span className="lf-icon">●</span>
              실시간 공지 및 알림
            </div>
            <div className="login-feature">
              <span className="lf-icon">●</span>
              경기 일정 및 라인업 확인
            </div>
            <div className="login-feature">
              <span className="lf-icon">●</span>
              팀 갤러리 열람
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card card-fc">
            <div className="login-tabs">
              <button
                className={mode === 'login' ? 'login-tab active' : 'login-tab'}
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              >
                LOGIN
              </button>
              <button
                className={mode === 'signup' ? 'login-tab active' : 'login-tab'}
                onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
              >
                SIGN UP
              </button>
            </div>

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="login-form">
                <h2 className="login-form-title">로그인</h2>

                <div className="mb-3">
                  <label className="label-fc">아이디</label>
                  <input
                    type="text"
                    className="form-control-fc"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                  />
                </div>

                <div className="mb-3">
                  <label className="label-fc">비밀번호</label>
                  <input
                    type="password"
                    className="form-control-fc"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                  />
                </div>

                {error && <div className="login-error">{error}</div>}

                <button type="submit" className="btn-primary-green login-submit">
                  LOGIN →
                </button>

                <div className="login-hint">
                  <span className="hint-key">관리자:</span> admin / admin1234
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="login-form">
                <h2 className="login-form-title">신규 부원 가입</h2>

                <div className="mb-3">
                  <label className="label-fc">아이디</label>
                  <input
                    type="text"
                    className="form-control-fc"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="영문/숫자"
                  />
                </div>

                <div className="mb-3">
                  <label className="label-fc">비밀번호 (6자 이상)</label>
                  <input
                    type="password"
                    className="form-control-fc"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                  />
                </div>

                <div className="row">
                  <div className="col-7 mb-3">
                    <label className="label-fc">이름</label>
                    <input
                      type="text"
                      className="form-control-fc"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="홍길동"
                    />
                  </div>
                  <div className="col-5 mb-3">
                    <label className="label-fc">등번호</label>
                    <input
                      type="text"
                      className="form-control-fc"
                      value={signupNumber}
                      onChange={(e) => setSignupNumber(e.target.value)}
                      placeholder="00"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="label-fc">이메일</label>
                  <input
                    type="email"
                    className="form-control-fc"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="you@university.ac.kr"
                  />
                </div>

                {error && <div className="login-error">{error}</div>}
                {success && <div className="login-success">{success}</div>}

                <button type="submit" className="btn-primary-green login-submit">
                  CREATE ACCOUNT →
                </button>
              </form>
            )}

            <div className="login-back">
              <button onClick={() => setPage('home')} className="link-arrow">← 메인으로</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
