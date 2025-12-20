import './MacWindow.css'

const MacWindow = ({ title, children, className = '' }) => {
  return (
    <div className={`mac-window ${className}`}>
      <div className="mac-window-titlebar">
        <div className="mac-window-controls">
          <button className="mac-btn-close">●</button>
          <button className="mac-btn-minimize">●</button>
          <button className="mac-btn-maximize">●</button>
        </div>
        <div className="mac-window-title">{title}</div>
      </div>
      <div className="mac-window-content">
        {children}
      </div>
    </div>
  )
}

export default MacWindow

