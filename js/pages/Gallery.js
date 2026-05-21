function Gallery() {
  const [selected, setSelected] = React.useState(null);
  const [tag, setTag] = React.useState('All');

  const tags = ['All', 'Match', 'Training', 'Team', 'Highlight', 'Event'];
  const filtered = tag === 'All' ? galleryItems : galleryItems.filter(g => g.tag === tag);

  const iconMap = {
    trophy: '◆',
    team: '●●●',
    star: '★',
    training: '▶',
    event: '◉',
    field: '▣'
  };

  return (
    <div className="container page-section gallery-page">
      <div className="section-subtitle">MOMENTS</div>
      <h2 className="section-title">CLASS FC 갤러리</h2>

      <div className="gallery-filter-row">
        {tags.map(t => (
          <button
            key={t}
            className={tag === t ? 'gal-tag-btn active' : 'gal-tag-btn'}
            onClick={() => setTag(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {filtered.map(g => (
          <div
            key={g.id}
            className="gallery-tile"
            style={{ background: g.gradient }}
            onClick={() => setSelected(g)}
          >
            <div className="gallery-tile-icon">{iconMap[g.icon] || '●'}</div>
            <div className="gallery-tile-info">
              <div className="gtile-tag">{g.tag}</div>
              <div className="gtile-title">{g.title}</div>
              <div className="gtile-date">{g.date}</div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="gallery-empty">해당 태그의 사진이 없습니다.</div>
      )}

      {selected && <GalleryModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
