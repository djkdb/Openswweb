function Admin({ onChange }) {
  const [section, setSection] = React.useState('dashboard');
  const [accounts, setAccounts] = React.useState([]);
  const [rsvpSummary, setRsvpSummary] = React.useState({});

  const [newTitle, setNewTitle] = React.useState('');
  const [newCategory, setNewCategory] = React.useState('공지');
  const [newContent, setNewContent] = React.useState('');
  const [newPinned, setNewPinned] = React.useState(false);
  const [newImportant, setNewImportant] = React.useState(false);
  const [postResult, setPostResult] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const loadAdminData = async () => {
    try {
      const [a, r] = await Promise.all([
        api.get('/api/admin/accounts'),
        api.get('/api/admin/rsvp-summary')
      ]);
      setAccounts(a);
      setRsvpSummary(r);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => { loadAdminData(); }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) {
      setPostResult('제목과 내용은 필수입니다.');
      return;
    }
    setBusy(true);
    try {
      await api.post('/api/notices', {
        title: newTitle,
        category: newCategory,
        content: newContent,
        pinned: newPinned,
        important: newImportant
      });
      setNewTitle('');
      setNewContent('');
      setNewPinned(false);
      setNewImportant(false);
      setPostResult('공지가 등록되었습니다.');
      setTimeout(() => setPostResult(''), 2000);
      if (onChange) onChange();
      const fresh = await api.get('/api/notices');
      notices = fresh;
    } catch (e) {
      setPostResult('등록 실패: ' + e.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!confirm('이 공지를 삭제할까요?')) return;
    try {
      await api.del('/api/notices/' + id);
      const fresh = await api.get('/api/notices');
      notices = fresh;
      if (onChange) onChange();
      setPostResult('삭제되었습니다.');
      setTimeout(() => setPostResult(''), 1500);
    } catch (e) {
      alert('삭제 실패: ' + e.message);
    }
  };

  const handleDeleteAccount = async (id) => {
    if (!confirm('이 회원을 삭제할까요?')) return;
    try {
      await api.del('/api/admin/accounts/' + id);
      await loadAdminData();
    } catch (e) {
      alert('삭제 실패: ' + e.message);
    }
  };

  const totalMembers = members.length + accounts.length;
  const upcomingCount = matches.filter(m => m.status === 'upcoming').length;
  const allNoticesCount = notices.length;

  return (
    <div className="container page-section admin-page">
      <div className="section-subtitle">CONTROL CENTER</div>
      <h2 className="section-title">관리자 대시보드</h2>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <button
            className={section === 'dashboard' ? 'admin-side-btn active' : 'admin-side-btn'}
            onClick={() => setSection('dashboard')}
          >
            DASHBOARD
          </button>
          <button
            className={section === 'notice' ? 'admin-side-btn active' : 'admin-side-btn'}
            onClick={() => setSection('notice')}
          >
            공지 관리
          </button>
          <button
            className={section === 'member' ? 'admin-side-btn active' : 'admin-side-btn'}
            onClick={() => setSection('member')}
          >
            회원 관리
          </button>
          <button
            className={section === 'match' ? 'admin-side-btn active' : 'admin-side-btn'}
            onClick={() => setSection('match')}
          >
            경기 일정
          </button>
          <button
            className={section === 'rsvp' ? 'admin-side-btn active' : 'admin-side-btn'}
            onClick={() => setSection('rsvp')}
          >
            참석 명단
          </button>
        </aside>

        <main className="admin-content">
          {section === 'dashboard' && (
            <div>
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="adm-stat-label">전체 회원</div>
                  <div className="adm-stat-num">{totalMembers}</div>
                  <div className="adm-stat-sub">선수단 {members.length} + 가입 {accounts.length}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="adm-stat-label">전체 공지</div>
                  <div className="adm-stat-num">{allNoticesCount}</div>
                  <div className="adm-stat-sub">DB 기준</div>
                </div>
                <div className="admin-stat-card">
                  <div className="adm-stat-label">예정 경기</div>
                  <div className="adm-stat-num">{upcomingCount}</div>
                  <div className="adm-stat-sub">매주 정기 경기 진행 중</div>
                </div>
                <div className="admin-stat-card">
                  <div className="adm-stat-label">사이트 가입자</div>
                  <div className="adm-stat-num">{accounts.length}</div>
                  <div className="adm-stat-sub">관리자 포함</div>
                </div>
              </div>

              <div className="admin-section-block">
                <h3 className="admin-block-title">최근 공지 5건</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>제목</th>
                      <th>카테고리</th>
                      <th>작성자</th>
                      <th>날짜</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notices.slice(0, 5).map(n => (
                      <tr key={n.id}>
                        <td>{n.title}</td>
                        <td>
                          <span className="adm-cat" style={{ color: categoryColors[n.category] }}>
                            {n.category}
                          </span>
                        </td>
                        <td>{n.author}</td>
                        <td>{n.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === 'notice' && (
            <div>
              <h3 className="admin-block-title">새 공지 작성</h3>
              <form onSubmit={handlePost} className="admin-form">
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="label-fc">제목</label>
                    <input type="text" className="form-control-fc"
                      value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="공지 제목" />
                  </div>
                  <div className="col-md-4">
                    <label className="label-fc">카테고리</label>
                    <select className="form-control-fc"
                      value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                      <option value="공지">공지</option>
                      <option value="경기">경기</option>
                      <option value="모집">모집</option>
                      <option value="운영">운영</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="label-fc">내용</label>
                  <textarea className="form-control-fc" rows="6"
                    value={newContent} onChange={(e) => setNewContent(e.target.value)}
                    placeholder="공지 본문..."></textarea>
                </div>

                <div className="admin-check-row mt-3">
                  <label>
                    <input type="checkbox" checked={newPinned}
                      onChange={(e) => setNewPinned(e.target.checked)} />
                    상단 고정
                  </label>
                  <label>
                    <input type="checkbox" checked={newImportant}
                      onChange={(e) => setNewImportant(e.target.checked)} />
                    중요 표시
                  </label>
                </div>

                {postResult && <div className="admin-result">{postResult}</div>}

                <button type="submit" className="btn-primary-green mt-3" disabled={busy}>
                  {busy ? '등록 중...' : '공지 등록'}
                </button>
              </form>

              <div className="admin-section-block mt-5">
                <h3 className="admin-block-title">전체 공지 ({notices.length})</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>제목</th>
                      <th>카테고리</th>
                      <th>작성자</th>
                      <th>날짜</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notices.map(n => (
                      <tr key={n.id}>
                        <td>
                          {n.pinned && <span className="badge-mini">PIN</span>}
                          {n.title}
                        </td>
                        <td>
                          <span className="adm-cat" style={{ color: categoryColors[n.category] }}>
                            {n.category}
                          </span>
                        </td>
                        <td>{n.author}</td>
                        <td>{n.date}</td>
                        <td>
                          <button className="adm-delete-btn"
                            onClick={() => handleDeleteNotice(n.id)}>
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === 'member' && (
            <div>
              <h3 className="admin-block-title">선수단 명단 ({members.length})</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>이름</th>
                    <th>포지션</th>
                    <th>역할</th>
                    <th>학번</th>
                    <th>출전</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(m => (
                    <tr key={m.id}>
                      <td>{m.number}</td>
                      <td>{m.name} <span className="text-secondary">({m.nameEn})</span></td>
                      <td><span style={{ color: positionColor[m.position] }}>{m.position}</span></td>
                      <td>{m.role}</td>
                      <td>{m.year}</td>
                      <td>{m.matches}경기 · {m.goals}골 · {m.assists}A</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3 className="admin-block-title mt-5">사이트 가입 회원 ({accounts.length})</h3>
              {accounts.length === 0 ? (
                <div className="admin-empty">아직 가입한 회원이 없습니다.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>아이디</th>
                      <th>이름</th>
                      <th>등번호</th>
                      <th>이메일</th>
                      <th>역할</th>
                      <th>가입일</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map(a => (
                      <tr key={a.id}>
                        <td>{a.username}</td>
                        <td>{a.name}</td>
                        <td>{a.number}</td>
                        <td>{a.email || '-'}</td>
                        <td>{a.role}</td>
                        <td>{a.joinedAt ? a.joinedAt.substring(0, 10) : '-'}</td>
                        <td>
                          {a.role !== 'admin' && (
                            <button className="adm-delete-btn"
                              onClick={() => handleDeleteAccount(a.id)}>
                              삭제
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {section === 'match' && (
            <div>
              <h3 className="admin-block-title">예정 경기 ({matches.filter(m => m.status === 'upcoming').length})</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>시간</th>
                    <th>상대</th>
                    <th>장소</th>
                    <th>유형</th>
                    <th>홈/원정</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.filter(m => m.status === 'upcoming').map(m => (
                    <tr key={m.id}>
                      <td>{m.date}</td>
                      <td>{m.time}</td>
                      <td>{m.opponent}<br /><span className="text-secondary">{m.opponentDept}</span></td>
                      <td>{m.venue}</td>
                      <td>{m.type}</td>
                      <td>{m.homeAway === 'home' ? '홈' : '원정'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3 className="admin-block-title mt-5">최근 결과 ({matches.filter(m => m.status === 'finished').length})</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>상대</th>
                    <th>결과</th>
                    <th>스코어</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.filter(m => m.status === 'finished').map(m => {
                    let r = 'D';
                    if (m.scoreOurs > m.scoreTheirs) r = 'W';
                    else if (m.scoreOurs < m.scoreTheirs) r = 'L';
                    return (
                      <tr key={m.id}>
                        <td>{m.date}</td>
                        <td>{m.opponent}</td>
                        <td><span className={`res-badge res-${r.toLowerCase()}`}>{r}</span></td>
                        <td>{m.scoreOurs} : {m.scoreTheirs}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {section === 'rsvp' && (() => {
            const upcomingList = matches
              .filter(m => m.status === 'upcoming')
              .sort((a, b) => a.date.localeCompare(b.date));
            return (
              <div>
                <h3 className="admin-block-title">예정 경기별 참석 명단</h3>
                {upcomingList.length === 0 && (
                  <div className="admin-empty">예정된 경기가 없습니다.</div>
                )}
                {upcomingList.map(m => {
                  const data = rsvpSummary[m.id] || { attend: [], late: [] };
                  return (
                    <div key={m.id} className="rsvp-admin-block">
                      <div className="rsvp-admin-head">
                        <div>
                          <div className="rsvp-admin-date">{m.date} · {m.time}</div>
                          <div className="rsvp-admin-vs">
                            CLASS FC vs {m.opponent} <span className="text-secondary">({m.venue})</span>
                          </div>
                        </div>
                        <div className="rsvp-admin-totals">
                          <span className="rsvp-count-ok">참석 {data.attend.length}</span>
                          <span className="rsvp-count-late">늦참 {data.late.length}</span>
                        </div>
                      </div>
                      <div className="rsvp-admin-grid">
                        <div>
                          <div className="rsvp-admin-col-title">참석 ({data.attend.length})</div>
                          {data.attend.length === 0 ? (
                            <div className="rsvp-admin-empty">아직 없음</div>
                          ) : (
                            <ul className="rsvp-name-list">
                              {data.attend.map(r => (
                                <li key={r.username}>#{r.number || '00'} {r.name}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div>
                          <div className="rsvp-admin-col-title late-col">늦참 ({data.late.length})</div>
                          {data.late.length === 0 ? (
                            <div className="rsvp-admin-empty">아직 없음</div>
                          ) : (
                            <ul className="rsvp-name-list">
                              {data.late.map(r => (
                                <li key={r.username}>#{r.number || '00'} {r.name}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </main>
      </div>
    </div>
  );
}
