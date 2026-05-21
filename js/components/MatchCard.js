function MatchCard({ match, user }) {
  const [rsvpStore, setRsvpStore] = React.useState(
    JSON.parse(localStorage.getItem('classfc_rsvp') || '{}')
  );
  const [motmStore, setMotmStore] = React.useState(
    JSON.parse(localStorage.getItem('classfc_motm') || '{}')
  );
  const [motmOpen, setMotmOpen] = React.useState(false);

  const d = new Date(match.date);
  const dateLabel = `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, '0')}`;
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];

  const isFinished = match.status === 'finished';
  let resultTag = '';
  if (isFinished) {
    if (match.scoreOurs > match.scoreTheirs) resultTag = 'WIN';
    else if (match.scoreOurs < match.scoreTheirs) resultTag = 'LOSS';
    else resultTag = 'DRAW';
  }

  const myRsvp = user && rsvpStore[match.id] && rsvpStore[match.id][user.username]
    ? rsvpStore[match.id][user.username].status
    : null;

  const attendList = rsvpStore[match.id] ? Object.values(rsvpStore[match.id]) : [];
  const attendCount = attendList.filter(r => r.status === 'attend').length;
  const lateCount = attendList.filter(r => r.status === 'late').length;

  const handleRsvp = (status) => {
    if (!user) {
      alert('로그인 후 이용해주세요.');
      return;
    }
    const updated = { ...rsvpStore };
    if (!updated[match.id]) updated[match.id] = {};
    updated[match.id][user.username] = {
      status,
      name: user.name,
      number: user.number,
      at: new Date().toISOString()
    };
    setRsvpStore(updated);
    localStorage.setItem('classfc_rsvp', JSON.stringify(updated));
  };

  const handleCancelRsvp = () => {
    const updated = { ...rsvpStore };
    if (updated[match.id]) {
      delete updated[match.id][user.username];
      if (Object.keys(updated[match.id]).length === 0) delete updated[match.id];
    }
    setRsvpStore(updated);
    localStorage.setItem('classfc_rsvp', JSON.stringify(updated));
  };

  const motmVotes = motmStore[match.id] || {};
  const myMotmVote = user ? motmVotes[user.username] : null;
  const tally = {};
  for (const voter in motmVotes) {
    const mid = motmVotes[voter];
    tally[mid] = (tally[mid] || 0) + 1;
  }
  let motmWinner = null, motmMax = 0;
  for (const mid in tally) {
    if (tally[mid] > motmMax) { motmWinner = mid; motmMax = tally[mid]; }
  }
  const motmPlayer = motmWinner ? members.find(m => String(m.id) === String(motmWinner)) : null;
  const totalVotes = Object.keys(motmVotes).length;

  const handleVoteMotm = (memberId) => {
    if (!user) {
      alert('로그인 후 투표할 수 있습니다.');
      return;
    }
    const updated = { ...motmStore };
    if (!updated[match.id]) updated[match.id] = {};
    updated[match.id][user.username] = memberId;
    setMotmStore(updated);
    localStorage.setItem('classfc_motm', JSON.stringify(updated));
    setMotmOpen(false);
  };

  return (
    <div className={`match-card card-fc ${isFinished ? 'is-finished' : ''}`}>
      <div className="match-card-top">
        <div className="match-date-block">
          <div className="match-date-big">{dateLabel}</div>
          <div className="match-date-day">{dayOfWeek}요일 · {match.time}</div>
        </div>
        <div className="match-tags">
          <span className={`match-type-tag type-${match.type.toLowerCase()}`}>{match.type}</span>
          {isFinished && (
            <span className={`match-result-tag result-${resultTag.toLowerCase()}`}>{resultTag}</span>
          )}
          {!isFinished && (
            <span className="match-upcoming-tag">UPCOMING</span>
          )}
        </div>
      </div>

      <div className="match-teams">
        <div className="match-team-home">
          <div className="match-team-name">CLASS FC</div>
          <div className="match-team-sub">SW</div>
        </div>

        <div className="match-vs">
          {isFinished ? (
            <div className="match-score">
              <span className="score-ours">{match.scoreOurs}</span>
              <span className="score-dash">:</span>
              <span className="score-theirs">{match.scoreTheirs}</span>
            </div>
          ) : (
            <div className="match-vs-text">VS</div>
          )}
        </div>

        <div className="match-team-away">
          <div className="match-team-name">{match.opponent}</div>
          <div className="match-team-sub">{match.opponentDept}</div>
        </div>
      </div>

      <div className="match-venue">
        <span className="venue-pin">●</span> {match.venue}
        <span className="venue-side">{match.homeAway === 'home' ? 'HOME' : 'AWAY'}</span>
      </div>

      {!isFinished && (
        <div className="match-rsvp">
          <div className="rsvp-counts">
            <span className="rsvp-count-ok">참석 {attendCount}</span>
            <span className="rsvp-count-late">늦참 {lateCount}</span>
          </div>
          <div className="rsvp-actions">
            <button
              className={myRsvp === 'attend' ? 'rsvp-btn active' : 'rsvp-btn'}
              onClick={() => handleRsvp('attend')}
            >
              참석
            </button>
            <button
              className={myRsvp === 'late' ? 'rsvp-btn late active' : 'rsvp-btn late'}
              onClick={() => handleRsvp('late')}
            >
              늦참
            </button>
            {myRsvp && (
              <button className="rsvp-cancel-btn" onClick={handleCancelRsvp}>취소</button>
            )}
          </div>
        </div>
      )}

      {isFinished && (
        <div className="match-motm">
          {motmPlayer ? (
            <div className="motm-winner-row">
              <span className="motm-icon">★</span>
              <span className="motm-label">MOTM</span>
              <span className="motm-name">#{motmPlayer.number} {motmPlayer.name}</span>
              <span className="motm-votes">({motmMax}/{totalVotes}표)</span>
            </div>
          ) : (
            <div className="motm-empty">아직 MOTM 투표가 없습니다</div>
          )}

          {!motmOpen ? (
            <button className="motm-vote-btn" onClick={() => setMotmOpen(true)}>
              {myMotmVote ? '내 투표 변경' : 'MOTM 투표하기'}
            </button>
          ) : (
            <div className="motm-vote-panel">
              <div className="motm-panel-title">베스트 선수를 선택하세요</div>
              <div className="motm-player-list">
                {members.map(m => (
                  <button
                    key={m.id}
                    className={String(myMotmVote) === String(m.id) ? 'motm-pick active' : 'motm-pick'}
                    onClick={() => handleVoteMotm(m.id)}
                  >
                    <span className="motm-pick-num">#{m.number}</span>
                    <span className="motm-pick-name">{m.name}</span>
                    <span className="motm-pick-pos">{m.position}</span>
                  </button>
                ))}
              </div>
              <button className="motm-close-btn" onClick={() => setMotmOpen(false)}>닫기</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
