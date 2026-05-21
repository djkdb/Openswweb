function GalleryModal({ item, onClose }) {
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  if (!item) return null;

  const iconMap = {
    trophy: '◆',
    team: '●●●',
    star: '★',
    training: '▶',
    event: '◉',
    field: '▣'
  };

  return (
    <div className="gallery-modal-backdrop" onClick={onClose}>
      <div className="gallery-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="gallery-modal-close" onClick={onClose}>×</button>

        <div className="gallery-modal-image" style={{ background: item.gradient }}>
          <div className="gallery-modal-icon">{iconMap[item.icon] || '●'}</div>
        </div>

        <div className="gallery-modal-info">
          <div className="gallery-modal-tag">{item.tag}</div>
          <h3 className="gallery-modal-title">{item.title}</h3>
          <div className="gallery-modal-date">{item.date}</div>
        </div>
      </div>
    </div>
  );
}
