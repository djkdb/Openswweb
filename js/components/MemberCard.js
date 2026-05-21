function MemberCard({ member, onClick }) {
  const motmStore = JSON.parse(localStorage.getItem('classfc_motm') || '{}');
  let motmCount = 0;
  for (const mid in motmStore) {
    const tally = {};
    for (const voter in motmStore[mid]) {
      const id = motmStore[mid][voter];
      tally[id] = (tally[id] || 0) + 1;
    }
    let winnerId = null, max = 0;
    for (const id in tally) {
      if (tally[id] > max) { winnerId = id; max = tally[id]; }
    }
    if (String(winnerId) === String(member.id)) motmCount++;
  }

  return (
    <div className="member-card card-fc" onClick={() => onClick(member)}>
      <div className="member-card-top">
        <div className="member-number">#{member.number}</div>
        <div
          className="member-pos-badge"
          style={{ background: positionColor[member.position] + '22', color: positionColor[member.position] }}
        >
          {member.position}
        </div>
      </div>

      {motmCount > 0 && (
        <div className="member-motm-badge">★ MOTM × {motmCount}</div>
      )}

      <div className="member-avatar">
        <div className="member-avatar-circle">
          {member.name.charAt(0)}
        </div>
      </div>

      <div className="member-card-body">
        <div className="member-name">{member.name}</div>
        <div className="member-name-en">{member.nameEn}</div>
        {member.role !== 'Member' && (
          <div className="member-role-tag">{member.role}</div>
        )}
      </div>

      <div className="member-card-stats">
        <div className="stat-block">
          <div className="stat-num">{member.matches}</div>
          <div className="stat-label">MATCHES</div>
        </div>
        <div className="stat-block">
          <div className="stat-num">{member.goals}</div>
          <div className="stat-label">GOALS</div>
        </div>
        <div className="stat-block">
          <div className="stat-num">{member.assists}</div>
          <div className="stat-label">ASSISTS</div>
        </div>
      </div>
    </div>
  );
}
