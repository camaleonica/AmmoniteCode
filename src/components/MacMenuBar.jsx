import { useState } from 'react'
import './MacMenuBar.css'

const MacMenuBar = ({ menus }) => {
  const [activeMenu, setActiveMenu] = useState(null)

  return (
    <div className="mac-menubar">
      {menus.map((menu, index) => (
        <div 
          key={index}
          className="mac-menubar-item"
          onMouseEnter={() => setActiveMenu(index)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <span className="mac-menubar-label">{menu.label}</span>
          {activeMenu === index && menu.items && (
            <div className="mac-menu-dropdown">
              {menu.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`mac-menu-item ${item.disabled ? 'disabled' : ''}`}
                  onClick={() => !item.disabled && item.action && item.action()}
                >
                  {item.label}
                  {item.shortcut && (
                    <span className="mac-menu-shortcut">{item.shortcut}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default MacMenuBar

