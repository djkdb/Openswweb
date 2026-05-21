function MatchCard({ match }) {
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
    </div>
  );
}
