function Notice({ user }) {
  const [selected, setSelected] = React.useState(null);
  const [category, setCategory] = React.useState('전체');
  const [search, setSearch] = React.useState('');

  const localNotices = JSON.parse(localStorage.getItem('classfc_notices_extra') || '[]');
  const allNotices = [...localNotices, ...notices];

  const categories = ['전체', '공지', '경기', '모집', '운영'];

  let displayed = allNotices;
  if (category !== '전체') {
    displayed = displayed.filter(n => n.category === category);
  }
  if (search) {
    displayed = displayed.filter(n =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
    );
  }

  const sorted = [...displayed].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.date.localeCompare(a.date);
  });

  if (selected) {
    return (
      <div className="container page-section notice-detail-page">
        <button onClick={() => setSelected(null)} className="link-arrow notice-back-btn">
          ← 목록으로
        </button>

        <div className="notice-detail-card card-fc">
          <div className="notice-detail-head">
            <div className="notice-tags">
              {selected.pinned && <span className="notice-pin-tag">PINNED</span>}
              <span
                className="notice-cat-tag"
                style={{
                  background: (categoryColors[selected.category] || '#00d166') + '22',
                  color: categoryColors[selected.category] || '#00d166'
                }}
              >
                {selected.category}
              </span>
              {selected.important && <span className="notice-imp-tag">중요</span>}
            </div>

            <h1 className="notice-detail-title">{selected.title}</h1>

            <div className="notice-detail-meta">
              <span>by <strong>{selected.author}</strong></span>
              <span className="meta-dot">·</span>
              <span>{selected.date}</span>
            </div>
          </div>

          <div className="divider-line"></div>

          <div className="notice-detail-body">{selected.content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-section notice-page">
      <div className="section-subtitle">UPDATES</div>
      <h2 className="section-title">공지 게시판</h2>

      <div className="notice-toolbar">
        <div className="notice-cat-row">
          {categories.map(c => (
            <button
              key={c}
              className={category === c ? 'cat-filter-btn active' : 'cat-filter-btn'}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <input
          type="text"
          className="form-control-fc notice-search"
          placeholder="검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {sorted.length === 0 ? (
        <div className="notice-empty">검색 결과가 없습니다.</div>
      ) : (
        <div className="row g-4">
          {sorted.map(n => (
            <div className="col-md-6" key={n.id}>
              <NoticeCard notice={n} onClick={setSelected} compact={false} />
            </div>
          ))}
        </div>
      )}

      {user && user.role === 'admin' && (
        <div className="notice-admin-hint">
          관리자 페이지에서 공지를 추가할 수 있습니다.
        </div>
      )}
    </div>
  );
}
