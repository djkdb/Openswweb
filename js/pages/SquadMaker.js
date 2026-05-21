function SquadMaker({ user }) {
  const draft = JSON.parse(localStorage.getItem('classfc_squad_draft') || 'null');

  const [type, setType] = React.useState(draft ? draft.type : 'football');
  const [formation, setFormation] = React.useState(draft ? draft.formation : '4-3-3');
  const [assignments, setAssignments] = React.useState(draft ? draft.assignments : {});
  const [selectedSlot, setSelectedSlot] = React.useState(null);
  const [targetMatch, setTargetMatch] = React.useState('');
  const [publishMsg, setPublishMsg] = React.useState('');
  const [memberFilter, setMemberFilter] = React.useState('');

  const slots = formations[type][formation] || [];

  React.useEffect(() => {
    localStorage.setItem('classfc_squad_draft', JSON.stringify({
      type, formation, assignments
    }));
  }, [type, formation, assignments]);

  React.useEffect(() => {
    if (selectedSlot && assignments[selectedSlot]) return;
    if (selectedSlot) return;
    const firstEmpty = slots.find(s => !assignments[s.id]);
    if (firstEmpty) setSelectedSlot(firstEmpty.id);
  }, [formation, type]);

  const handleTypeChange = (t) => {
    setType(t);
    const first = Object.keys(formations[t])[0];
    setFormation(first);
    setAssignments({});
    setSelectedSlot(null);
    setPublishMsg('');
  };

  const handleFormationChange = (f) => {
    setFormation(f);
    setAssignments({});
    setSelectedSlot(null);
  };

  const handleSlotClick = (slotId) => {
    if (assignments[slotId]) {
      const updated = { ...assignments };
      delete updated[slotId];
      setAssignments(updated);
      setSelectedSlot(slotId);
    } else {
      setSelectedSlot(slotId);
    }
  };

  const handleMemberClick = (memberId) => {
    if (!selectedSlot) {
      const firstEmpty = slots.find(s => !assignments[s.id]);
      if (!firstEmpty) return;
      assignSlot(firstEmpty.id, memberId);
    } else {
      assignSlot(selectedSlot, memberId);
    }
  };

  const assignSlot = (slotId, memberId) => {
    const updated = { ...assignments };
    for (const sid in updated) {
      if (String(updated[sid]) === String(memberId)) delete updated[sid];
    }
    updated[slotId] = memberId;
    setAssignments(updated);
    const nextEmpty = slots.find(s => !updated[s.id]);
    setSelectedSlot(nextEmpty ? nextEmpty.id : null);
  };

  const handleReset = () => {
    if (Object.keys(assignments).length === 0) return;
    if (!confirm('정말 스쿼드를 초기화하시겠어요?')) return;
    setAssignments({});
    setSelectedSlot(slots[0] ? slots[0].id : null);
  };

  const handlePublish = () => {
    if (!targetMatch) {
      setPublishMsg('게시할 경기를 선택해 주세요.');
      return;
    }
    const filledCount = Object.keys(assignments).length;
    const required = formationSizes[type];
    if (filledCount < required) {
      if (!confirm(`아직 ${required - filledCount}자리가 비어있습니다. 그래도 게시할까요?`)) return;
    }
    const lineups = JSON.parse(localStorage.getItem('classfc_lineups') || '{}');
    lineups[targetMatch] = {
      type,
      formation,
      assignments,
      publishedAt: new Date().toISOString(),
      publishedBy: user.name
    };
    localStorage.setItem('classfc_lineups', JSON.stringify(lineups));
    setPublishMsg('라인업이 게시되었습니다. Schedule 페이지에서 부원이 확인할 수 있습니다.');
    setTimeout(() => setPublishMsg(''), 4000);
  };

  const usedIds = new Set(Object.values(assignments).map(String));
  const filteredMembers = members.filter(m => {
    if (!memberFilter) return true;
    const q = memberFilter.toLowerCase();
    return m.name.toLowerCase().includes(q)
      || m.nameEn.toLowerCase().includes(q)
      || String(m.number).includes(q)
      || m.position.toLowerCase().includes(q);
  });

  const upcomingMatches = matches
    .filter(m => m.status === 'upcoming')
    .sort((a, b) => a.date.localeCompare(b.date));

  const filledCount = Object.keys(assignments).length;
  const totalSlots = slots.length;

  const findMember = (id) => members.find(m => String(m.id) === String(id));

  return (
    <div className="squad-page">
      <div className="container squad-container">
        <div className="squad-head">
          <div>
            <div className="section-subtitle">SQUAD MAKER</div>
            <h2 className="section-title">{type === 'futsal' ? '풋살' : '축구'} 스쿼드 메이커</h2>
            <div className="squad-sub">
              부원을 선택해 포메이션에 배치하고, 다음 경기 라인업으로 게시할 수 있습니다.
            </div>
          </div>

          <div className="squad-type-tabs">
            <button
              className={type === 'football' ? 'sq-type active' : 'sq-type'}
              onClick={() => handleTypeChange('football')}
            >
              ⚽ 축구 (11인)
            </button>
            <button
              className={type === 'futsal' ? 'sq-type active' : 'sq-type'}
              onClick={() => handleTypeChange('futsal')}
            >
              🤾 풋살 (5인)
            </button>
          </div>
        </div>

        <div className="squad-layout">
          <aside className="squad-sidebar">
            <div className="squad-control-block">
              <label className="label-fc">포메이션</label>
              <select
                className="form-control-fc"
                value={formation}
                onChange={(e) => handleFormationChange(e.target.value)}
              >
                {Object.keys(formations[type]).map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="squad-progress">
              배치 {filledCount} / {totalSlots}
              <div className="squad-progress-bar">
                <div
                  className="squad-progress-fill"
                  style={{ width: `${(filledCount / totalSlots) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="squad-members-block">
              <div className="squad-members-head">
                <span className="label-fc">학회 등록 부원</span>
                <span className="squad-hint">
                  {selectedSlot ? `→ ${selectedSlot} 자리에 배치` : '슬롯 먼저 클릭'}
                </span>
              </div>

              <input
                type="text"
                className="form-control-fc squad-search"
                placeholder="이름·번호·포지션 검색"
                value={memberFilter}
                onChange={(e) => setMemberFilter(e.target.value)}
              />

              <div className="squad-members-list">
                {filteredMembers.map(m => {
                  const used = usedIds.has(String(m.id));
                  return (
                    <button
                      key={m.id}
                      className={used ? 'squad-mem-row used' : 'squad-mem-row'}
                      onClick={() => handleMemberClick(m.id)}
                      disabled={used}
                    >
                      <span className="squad-mem-num">{m.number}</span>
                      <span className="squad-mem-name">{m.name}</span>
                      <span
                        className="squad-mem-pos"
                        style={{
                          background: positionColor[m.position] + '22',
                          color: positionColor[m.position]
                        }}
                      >
                        {m.position}
                      </span>
                      {used && <span className="squad-used-tag">배치됨</span>}
                    </button>
                  );
                })}
                {filteredMembers.length === 0 && (
                  <div className="squad-empty-list">검색 결과 없음</div>
                )}
              </div>
            </div>

            <button className="squad-reset-btn" onClick={handleReset}>
              ↺ 스쿼드 초기화
            </button>

            {user && user.role === 'admin' && (
              <div className="squad-publish">
                <div className="label-fc">관리자 — 다음 경기 라인업으로 게시</div>
                <select
                  className="form-control-fc mt-2"
                  value={targetMatch}
                  onChange={(e) => setTargetMatch(e.target.value)}
                >
                  <option value="">경기 선택...</option>
                  {upcomingMatches.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.date} vs {m.opponent}
                    </option>
                  ))}
                </select>
                <button
                  className="btn-primary-green squad-publish-btn"
                  onClick={handlePublish}
                >
                  라인업으로 게시
                </button>
                {publishMsg && <div className="squad-publish-msg">{publishMsg}</div>}
              </div>
            )}
          </aside>

          <div className="squad-pitch-wrap">
            <div className={`squad-pitch type-${type}`}>
              <div className="pitch-line center-line"></div>
              <div className="pitch-circle"></div>
              <div className="pitch-box top-box"></div>
              <div className="pitch-box bottom-box"></div>
              <div className="pitch-small-box top-small"></div>
              <div className="pitch-small-box bottom-small"></div>
              <div className="pitch-arc bottom-arc"></div>

              {slots.map(slot => {
                const memberId = assignments[slot.id];
                const m = memberId ? findMember(memberId) : null;
                const isSelected = selectedSlot === slot.id;
                return (
                  <div
                    key={slot.id}
                    className={`pitch-slot ${m ? 'filled' : 'empty'} ${isSelected ? 'selected' : ''}`}
                    style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                    onClick={() => handleSlotClick(slot.id)}
                  >
                    <div className="pitch-slot-label">{slot.label}</div>
                    <div className="pitch-shirt">
                      {m ? (
                        <>
                          <span className="pitch-shirt-num">{m.number}</span>
                        </>
                      ) : (
                        <span className="pitch-shirt-empty">+</span>
                      )}
                    </div>
                    <div className="pitch-slot-name">
                      {m ? m.name : '선수 선택'}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="squad-pitch-foot">
              <span className="squad-formation-label">{formation}</span>
              <span className="squad-type-label">
                {type === 'futsal' ? 'FUTSAL · 5 a side' : 'FOOTBALL · 11 a side'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
