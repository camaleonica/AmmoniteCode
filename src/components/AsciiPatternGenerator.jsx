import { useEffect, useRef, useState } from 'react'
import { HiOutlineDocumentText, HiOutlineClipboardCopy, HiOutlinePhotograph, HiOutlineCube } from 'react-icons/hi'
import p5 from 'p5'
import { exportAsTxt, copyToClipboard, downloadCanvasAsPNG, downloadAsSVG } from '../utils/exportUtils'

const AsciiPatternGenerator = () => {
  const containerRef = useRef(null)
  const p5Instance = useRef(null)
  const [pattern, setPattern] = useState('wave')
  const [speed, setSpeed] = useState(2)
  const [complexity, setComplexity] = useState(5)
  const [charSet, setCharSet] = useState('waves')
  const [showNotification, setShowNotification] = useState('')
  const [asciiText, setAsciiText] = useState('')

  const patterns = ['wave', 'spiral', 'matrix', 'noise', 'circular', 'grid']
  const charSets = {
    waves: '▁▂▃▄▅▆▇█',
    dots: '·°○●',
    blocks: '░▒▓█',
    symbols: '▖▗▘▙▚▛▜▝▞▟',
    simple: ' .:-=+*#%@'
  }

  useEffect(() => {
    if (!containerRef.current) return

    const sketch = (p) => {
      let time = 0
      let chars
      let cols, rows
      const cellSize = 12

      p.setup = () => {
        const maxWidth = Math.min(containerRef.current?.clientWidth - 64 || 1200, 1400)
        const maxHeight = Math.min(window.innerHeight - 300, 800)
        const canvas = p.createCanvas(maxWidth, maxHeight)
        canvas.parent(containerRef.current)
        p.colorMode(p.HSB, 360, 100, 100, 255)
        p.background(0, 0, 0)
        p.textSize(cellSize)
        p.textAlign(p.CENTER, p.CENTER)
        
        cols = Math.floor(p.width / cellSize)
        rows = Math.floor(p.height / cellSize)
        chars = Array.from(charSets[charSet] || charSets.waves)
      }

      p.draw = () => {
        p.background(0, 0, 0)
        time += speed * 0.01
        
        chars = Array.from(charSets[charSet] || charSets.waves)
        
        if (pattern === 'wave') {
          drawWavePattern()
        } else if (pattern === 'spiral') {
          drawSpiralPattern()
        } else if (pattern === 'matrix') {
          drawMatrixPattern()
        } else if (pattern === 'noise') {
          drawNoisePattern()
        } else if (pattern === 'circular') {
          drawCircularPattern()
        } else if (pattern === 'grid') {
          drawGridPattern()
        }
      }

      const drawWavePattern = () => {
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const wave = p.sin((x * complexity * 0.1) + time) * p.cos((y * complexity * 0.1) + time)
            const normalized = (wave + 1) / 2
            const charIndex = Math.floor(normalized * (chars.length - 1))
            const char = chars[charIndex]
            
            const hue = 330 + (normalized * 20) - 10 // Rosa con variaciones
            const saturation = 70 + (normalized * 30) // 70-100
            const brightness_hsb = 60 + (normalized * 40) // 60-100
            p.fill(hue, saturation, brightness_hsb)
            p.text(char, x * cellSize + cellSize / 2, y * cellSize + cellSize / 2)
          }
        }
      }

      const drawSpiralPattern = () => {
        const centerX = cols / 2
        const centerY = rows / 2
        
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const dx = x - centerX
            const dy = y - centerY
            const angle = p.atan2(dy, dx) + time
            const dist = p.dist(x, y, centerX, centerY)
            const spiral = (angle + dist * complexity * 0.1) % (p.TWO_PI)
            const normalized = spiral / p.TWO_PI
            
            const charIndex = Math.floor(normalized * (chars.length - 1))
            const char = chars[charIndex]
            
            const brightness = normalized
            const hue = 330 + (normalized * 20) - 10 // Rosa con variaciones (320-340)
            const saturation = 60 + (normalized * 40) // 60-100 para pastel a vibrante
            const brightness_hsb = 50 + (normalized * 50) // 50-100 para oscuro a claro
            p.fill(hue, saturation, brightness_hsb)
            p.text(char, x * cellSize + cellSize / 2, y * cellSize + cellSize / 2)
          }
        }
      }

      const drawMatrixPattern = () => {
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const value = p.noise(x * complexity * 0.05, y * complexity * 0.05, time)
            const charIndex = Math.floor(value * (chars.length - 1))
            const char = chars[charIndex]
            
            const hue = 330 + (value * 15) - 7.5 // Rosa con variaciones
            const saturation = 65 + (value * 35) // 65-100
            const brightness_hsb = 55 + (value * 45) // 55-100
            p.fill(hue, saturation, brightness_hsb)
            p.text(char, x * cellSize + cellSize / 2, y * cellSize + cellSize / 2)
          }
        }
      }

      const drawNoisePattern = () => {
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const value = p.noise(x * complexity * 0.1, y * complexity * 0.1, time)
            const charIndex = Math.floor(value * (chars.length - 1))
            const char = chars[charIndex]
            
            const hue = 325 + (value * 25) - 12.5 // Rosa con más variaciones
            const saturation = 60 + (value * 40) // 60-100 (más pastel)
            const brightness_hsb = 50 + (value * 50) // 50-100
            p.fill(hue, saturation, brightness_hsb)
            p.text(char, x * cellSize + cellSize / 2, y * cellSize + cellSize / 2)
          }
        }
      }

      const drawCircularPattern = () => {
        const centerX = cols / 2
        const centerY = rows / 2
        
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const dist = p.dist(x, y, centerX, centerY)
            const wave = p.sin(dist * complexity * 0.1 - time * 2)
            const normalized = (wave + 1) / 2
            
            const charIndex = Math.floor(normalized * (chars.length - 1))
            const char = chars[charIndex]
            
            const hue = 330 + (normalized * 20) - 10 // Rosa con variaciones (320-340)
            const saturation = 55 + (normalized * 45) // 55-100 (pastel a vibrante)
            const brightness_hsb = 45 + (normalized * 55) // 45-100 (oscuro a claro)
            p.fill(hue, saturation, brightness_hsb)
            p.text(char, x * cellSize + cellSize / 2, y * cellSize + cellSize / 2)
          }
        }
      }

      const drawGridPattern = () => {
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const gridX = (x % (cols / complexity)) / (cols / complexity)
            const gridY = (y % (rows / complexity)) / (rows / complexity)
            const wave = p.sin(gridX * p.PI * 2 + time) * p.sin(gridY * p.PI * 2 + time)
            const normalized = (wave + 1) / 2
            
            const charIndex = Math.floor(normalized * (chars.length - 1))
            const char = chars[charIndex]
            
            const hue = 325 + (normalized * 30) - 15 // Rosa con variaciones más amplias (310-340)
            const saturation = 50 + (normalized * 50) // 50-100 (pastel a vibrante)
            const brightness_hsb = 40 + (normalized * 60) // 40-100 (oscuro a claro)
            p.fill(hue, saturation, brightness_hsb)
            p.text(char, x * cellSize + cellSize / 2, y * cellSize + cellSize / 2)
          }
        }
      }
    }

    if (p5Instance.current) {
      p5Instance.current.remove()
    }

    p5Instance.current = new p5(sketch)

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove()
      }
    }
  }, [pattern, speed, complexity, charSet])

  const getAsciiText = () => {
    return `ASCII Pattern Generator\nPattern: ${pattern}\nComplexity: ${complexity}\n` + '='.repeat(50) + '\n\n'
  }

  const showNotificationMessage = (message) => {
    setShowNotification(message)
    setTimeout(() => setShowNotification(''), 2000)
  }

  const handleExportTxt = () => {
    const text = getAsciiText()
    exportAsTxt(text, 'ascii-pattern.txt')
    showNotificationMessage('✓ Exportado como TXT')
  }

  const handleCopy = async () => {
    const text = getAsciiText()
    const success = await copyToClipboard(text)
    if (success) {
      showNotificationMessage('✓ Copiado al portapapeles')
    } else {
      showNotificationMessage('✗ Error al copiar')
    }
  }

  const handleDownloadPNG = () => {
    if (p5Instance.current && p5Instance.current.canvas) {
      downloadCanvasAsPNG(p5Instance.current.canvas, 'ascii-pattern.png')
      showNotificationMessage('✓ Imagen PNG descargada')
    }
  }

  const handleDownloadSVG = () => {
    const text = getAsciiText()
    downloadAsSVG(text, 900, 650, 12)
    showNotificationMessage('✓ Imagen SVG descargada')
  }

  return (
    <div className="pattern-container">
      <div className="controls-panel">
        <div className="control-group">
          <label>Patrón:</label>
          <select value={pattern} onChange={(e) => setPattern(e.target.value)}>
            {patterns.map(p => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <label>Velocidad: {speed}</label>
          <input 
            type="range" 
            min="0" 
            max="10" 
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>
        
        <div className="control-group">
          <label>Complejidad: {complexity}</label>
          <input 
            type="range" 
            min="1" 
            max="15" 
            value={complexity}
            onChange={(e) => setComplexity(Number(e.target.value))}
          />
        </div>
        
        <div className="control-group">
          <label>Caracteres:</label>
          <select value={charSet} onChange={(e) => setCharSet(e.target.value)}>
            {Object.keys(charSets).map(key => (
              <option key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="export-buttons">
        <button onClick={handleExportTxt} className="export-btn">
          <HiOutlineDocumentText style={{ color: '#F5669F', fontSize: '20px' }} />
          <span>TXT</span>
        </button>
        <button onClick={handleCopy} className="export-btn">
          <HiOutlineClipboardCopy style={{ color: '#F5669F', fontSize: '20px' }} />
          <span>Copiar</span>
        </button>
        <button onClick={handleDownloadPNG} className="export-btn">
          <HiOutlinePhotograph style={{ color: '#F5669F', fontSize: '20px' }} />
          <span>PNG</span>
        </button>
        <button onClick={handleDownloadSVG} className="export-btn">
          <HiOutlineCube style={{ color: '#F5669F', fontSize: '20px' }} />
          <span>SVG</span>
        </button>
      </div>
      
      <div ref={containerRef} className="p5-canvas-wrapper" />
      
      {showNotification && (
        <div className="notification">
          {showNotification}
        </div>
      )}
    </div>
  )
}

export default AsciiPatternGenerator

