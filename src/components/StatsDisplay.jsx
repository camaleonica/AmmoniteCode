import { useEffect, useState } from 'react'
import './StatsDisplay.css'

const StatsDisplay = ({ fps, charCount, dropCount, mode }) => {
  const [stats, setStats] = useState({
    fps: 0,
    charCount: 0,
    dropCount: 0,
    frameTime: 0
  })

  useEffect(() => {
    let lastTime = performance.now()
    let frameCount = 0
    let lastFpsUpdate = performance.now()

    const updateStats = () => {
      const now = performance.now()
      const deltaTime = now - lastTime
      lastTime = now
      
      frameCount++
      
      // Actualizar FPS cada segundo
      if (now - lastFpsUpdate >= 1000) {
        setStats(prev => ({
          ...prev,
          fps: frameCount,
          frameTime: deltaTime.toFixed(2),
          charCount: charCount || prev.charCount,
          dropCount: dropCount || prev.dropCount
        }))
        frameCount = 0
        lastFpsUpdate = now
      }
      
      requestAnimationFrame(updateStats)
    }
    
    const rafId = requestAnimationFrame(updateStats)
    
    return () => cancelAnimationFrame(rafId)
  }, [charCount, dropCount])

  // Usar FPS pasado como prop si está disponible
  useEffect(() => {
    if (fps !== undefined) {
      setStats(prev => ({ ...prev, fps }))
    }
  }, [fps])

  const displayFps = fps !== undefined ? fps : stats.fps

  return (
    <div className="stats-display">
      <div className="stat-item">
        <span className="stat-label">FPS:</span>
        <span className="stat-value">{displayFps}</span>
      </div>
      {charCount > 0 && (
        <div className="stat-item">
          <span className="stat-label">Caracteres:</span>
          <span className="stat-value">{charCount.toLocaleString()}</span>
        </div>
      )}
      {dropCount > 0 && (
        <div className="stat-item">
          <span className="stat-label">Drops:</span>
          <span className="stat-value">{dropCount}</span>
        </div>
      )}
      {stats.frameTime > 0 && (
        <div className="stat-item">
          <span className="stat-label">Frame Time:</span>
          <span className="stat-value">{stats.frameTime}ms</span>
        </div>
      )}
    </div>
  )
}

export default StatsDisplay

