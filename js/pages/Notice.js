function Notice({ user }) {
  const [selected, setSelected] = React.useState(null);
  const [category, setCategory] = React.useState('전체');
  const [search, setSearch] = React.useState('');
  const [commentsStore, setCommentsStore] = React.useState(
    JSON.parse(localStorage.getItem('classfc_comments') || '{}')
  );
  const [newComment, setNewComment] = React.useState('');

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
    const isOfficial = selected.category === '공지';
    const noticeKey = String(selected.id);
    const comments = commentsStore[noticeKey] || [];

    const handleAddComment = (e) => {
      e.preventDefault();
      if (!user) {
        alert('로그인 후 댓글을 작성할 수 있습니다.');
        return;
      }
      const text = newComment.trim();
      if (!text) return;
      const item = {
        id: Date.now(),
        username: user.username,
        name: user.name,
        number: user.number,
        text,
        date: new Date().toISOString()
      };
      const updated = { ...commentsStore, [noticeKey]: [...comments, item] };
      setCommentsStore(updated);
      localStorage.setItem('classfc_comments', JSON.stringify(updated));
      setNewComment('');
    };

    const handleDeleteComment = (cid) => {
      const updated = {
        ...commentsStore,
        [noticeKey]: comments.filter(c => c.id !== cid)
      };
      setCommentsStore(updated);
      localStorage.setItem('classfc_comments', JSON.stringify(updated));
    };

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
              {!isOfficial && comments.length > 0 && (
                <>
                  <span className="meta-dot">·</span>
                  <span>댓글 {comments.length}</span>
                </>
              )}
            </div>
          </div>

          <div className="divider-line"></div>

          <div className="notice-detail-body">{selected.content}</div>
        </div>

        {isOfficial ? (
          <div className="comments-locked">
            공지사항에는 댓글을 작성할 수 없습니다.
          </div>
        ) : (
          <div className="comments-section">
            <h3 className="comments-title">댓글 {comments.length}</h3>

            <div className="comments-list">
              {comments.length === 0 && (
                <div className="comments-empty">첫 댓글을 남겨보세요.</div>
              )}
              {comments.map(c => (
                <div className="comment-item" key={c.id}>
                  <div className="comment-head">
                    <span className="comment-author">
                      #{c.number || '00'} {c.name}
                    </span>
                    <span className="comment-date">{c.date.substring(0, 16).replace('T', ' ')}</span>
                    {user && (user.username === c.username || user.role === 'admin') && (
                      <button
                        className="comment-delete"
                        onClick={() => handleDeleteComment(c.id)}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  <div className="comment-text">{c.text}</div>
                </div>
              ))}
            </div>

            {user ? (
              <form className="comment-form" onSubmit={handleAddComment}>
                <div className="comment-form-user">
                  <span className="comment-form-num">#{user.number || '00'}</span>
                  <span className="comment-form-name">{user.name}</span>
                </div>
                <textarea
                  className="form-control-fc comment-textarea"
                  rows="3"
                  placeholder="댓글을 남겨보세요..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <div className="comment-form-actions">
                  <button type="submit" className="btn-primary-green comment-submit">
                    등록
                  </button>
                </div>
              </form>
            ) : (
              <div className="comments-login-hint">
                댓글 작성은 로그인 후 가능합니다.
              </div>
            )}
          </div>
        )}
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
