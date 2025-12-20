import './Sidebar.css'

const Sidebar = ({ mode, onModeChange, isOpen, onToggle }) => {
  const modes = [
    { id: 'presentation', label: 'Presentación', icon: '🎬' },
    { id: 'matrix', label: 'Matrix Rain', icon: '🌧️' },
    { id: 'image', label: 'Imagen → ASCII', icon: '🖼️' },
    { id: 'pattern', label: 'Patrones', icon: '🎨' },
    { id: 'drawer', label: 'Dibujador', icon: '✏️' }
  ]

  return (
    <>
      <button 
        className={`sidebar-toggle ${isOpen ? 'open' : ''}`}
        onClick={onToggle}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>ASCII Studio</h2>
        </div>
        <nav className="sidebar-nav">
          {modes.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${mode === item.id ? 'active' : ''}`}
              onClick={() => onModeChange(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}
    </>
  )
}

export default Sidebar

