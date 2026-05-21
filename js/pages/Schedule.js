function Schedule({ user }) {
  const [tab, setTab] = React.useState('upcoming');

  const upcoming = matches
    .filter(m => m.status === 'upcoming')
    .sort((a, b) => a.date.localeCompare(b.date));

  const finished = matches
    .filter(m => m.status === 'finished')
    .sort((a, b) => b.date.localeCompare(a.date));

  const winCount = finished.filter(m => m.scoreOurs > m.scoreTheirs).length;
  const drawCount = finished.filter(m => m.scoreOurs === m.scoreTheirs).length;
  const lossCount = finished.filter(m => m.scoreOurs < m.scoreTheirs).length;
  const goalsFor = finished.reduce((s, m) => s + m.scoreOurs, 0);
  const goalsAgainst = finished.reduce((s, m) => s + m.scoreTheirs, 0);

  const list = tab === 'upcoming' ? upcoming : finished;

  return (
    <div className="container page-section schedule-page">
      <div className="section-subtitle">FIXTURES</div>
      <h2 className="section-title">경기 일정</h2>

      <div className="schedule-stats-row">
        <div className="schedule-stat-card">
          <div className="ss-num">{upcoming.length}</div>
          <div className="ss-label">UPCOMING</div>
        </div>
        <div className="schedule-stat-card">
          <div className="ss-num">{finished.length}</div>
          <div className="ss-label">PLAYED</div>
        </div>
        <div className="schedule-stat-card">
          <div className="ss-num green-accent">{winCount}W</div>
          <div className="ss-label">WINS</div>
        </div>
        <div className="schedule-stat-card">
          <div className="ss-num">{drawCount}D</div>
          <div className="ss-label">DRAWS</div>
        </div>
        <div className="schedule-stat-card">
          <div className="ss-num text-danger">{lossCount}L</div>
          <div className="ss-label">LOSSES</div>
        </div>
        <div className="schedule-stat-card">
          <div className="ss-num">{goalsFor} : {goalsAgainst}</div>
          <div className="ss-label">GOALS</div>
        </div>
      </div>

      <div className="schedule-tabs">
        <button
          className={tab === 'upcoming' ? 'sched-tab active' : 'sched-tab'}
          onClick={() => setTab('upcoming')}
        >
          UPCOMING ({upcoming.length})
        </button>
        <button
          className={tab === 'finished' ? 'sched-tab active' : 'sched-tab'}
          onClick={() => setTab('finished')}
        >
          RESULTS ({finished.length})
        </button>
      </div>

      <div className="row g-4">
        {list.map(m => (
          <div className="col-lg-6" key={m.id}>
            <MatchCard match={m} user={user} />
          </div>
        ))}
      </div>

      {list.length === 0 && (
        <div className="schedule-empty">
          {tab === 'upcoming' ? '예정된 경기가 없습니다.' : '진행된 경기가 없습니다.'}
        </div>
      )}
    </div>
  );
}
