import { useEffect, useRef, useState } from 'react'
import { HiOutlineDocumentText, HiOutlineClipboardCopy, HiOutlinePhotograph, HiOutlineCube } from 'react-icons/hi'
import p5 from 'p5'
import { exportAsTxt, copyToClipboard, downloadCanvasAsPNG, downloadAsSVG } from '../utils/exportUtils'

const MatrixRain = () => {
  const containerRef = useRef(null)
  const p5Instance = useRef(null)
  const [charSet, setCharSet] = useState('default')
  const [speed, setSpeed] = useState(10)
  const [fontSize, setFontSize] = useState(14)
  const [showNotification, setShowNotification] = useState('')
  const [dropCount, setDropCount] = useState(0)

  const charSets = {
    default: '01',
    binary: '01',
    numbers: '0123456789',
    letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    japanese: 'アイウエオカキクケコサシスセソタチツテト',
    code: '{}[]()<>/\\|=+-*%#@!&^~`',
    full: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,.<>?'
  }

  useEffect(() => {
    if (!containerRef.current) return

    const sketch = (p) => {
      let drops = []
      const currentCharSet = charSet

      class Drop {
        constructor(x) {
          this.x = x
          this.y = p.random(-500, -50)
          this.speed = p.random(5, 15)
          this.length = p.random(10, 40)
          this.chars = []
          this.charSetArray = Array.from(charSets[currentCharSet] || charSets.default)
          
          // Generar caracteres iniciales
          for (let i = 0; i < this.length; i++) {
            this.chars.push({
              char: this.charSetArray[Math.floor(Math.random() * this.charSetArray.length)],
              brightness: 255 - (i * (255 / this.length))
            })
          }
        }

        update(currentSpeed, currentFontSize) {
          this.y += this.speed * (currentSpeed / 10)
          
          // Actualizar brillo de caracteres
          for (let i = 0; i < this.chars.length; i++) {
            this.chars[i].brightness = 255 - (i * (255 / this.length))
          }

          // Cambiar caracteres ocasionalmente
          if (p.random() < 0.1) {
            const idx = Math.floor(p.random() * this.chars.length)
            this.chars[idx].char = this.charSetArray[Math.floor(Math.random() * this.charSetArray.length)]
          }

          // Resetear si sale de pantalla
          if (this.y > p.height + this.length * currentFontSize) {
            this.y = p.random(-200, -50)
            this.chars = []
            this.charSetArray = Array.from(charSets[currentCharSet] || charSets.default)
            for (let i = 0; i < this.length; i++) {
              this.chars.push({
                char: this.charSetArray[Math.floor(Math.random() * this.charSetArray.length)],
                brightness: 255 - (i * (255 / this.length))
              })
            }
          }
        }

        display(currentFontSize) {
          p.push()
          p.textAlign(p.CENTER)
          p.textSize(currentFontSize)
          
          this.chars.forEach((item, index) => {
            const alpha = item.brightness / 255 // Normalizar a 0-1
            // Rosa base (#F5669F corresponde a hue ~330), variaciones entre 320-340
            const hue = 330 + (Math.sin(index * 0.3 + this.y * 0.01) * 15) // Variación de tono más amplia
            // Saturación variando entre 50-90 para efectos pastel y vibrantes
            let saturation = 50 + (alpha * 40)
            // Brillo variando según posición (más brillante arriba, más oscuro abajo)
            let brightness = 40 + (alpha * 60)
            
            // Primer carácter más brillante (rosa neón/vibrante)
            if (index === 0) {
              brightness = Math.min(95, 70 + (alpha * 25))
              saturation = Math.min(90, 60 + (alpha * 30))
            } else {
              brightness = Math.max(20, brightness * (1 - index * 0.15)) // Más oscuro hacia abajo
              saturation = Math.max(40, saturation * 0.8) // Menos saturado hacia abajo (más pastel)
            }
            
            p.fill(hue, saturation, brightness)
            p.text(item.char, this.x, this.y + index * currentFontSize)
          })
          
          p.pop()
        }
      }

      p.setup = () => {
        const maxWidth = Math.min(containerRef.current?.clientWidth - 64 || 1200, 1400)
        const maxHeight = Math.min(window.innerHeight - 300, 800)
        const canvas = p.createCanvas(maxWidth, maxHeight)
        canvas.parent(containerRef.current)
        p.colorMode(p.HSB, 360, 100, 100, 255)
        p.background(0, 0, 0)
        
        // Crear drops con el fontSize actual
        const currentFontSize = fontSize
        const numDrops = Math.floor(p.width / currentFontSize)
        for (let i = 0; i < numDrops; i++) {
          drops.push(new Drop(i * currentFontSize))
        }
        setDropCount(numDrops)
      }

      p.draw = () => {
        // Fondo con efecto de desvanecimiento
        p.push()
        p.fill(0, 0, 0, 20)
        p.rect(0, 0, p.width, p.height)
        p.pop()

        // Actualizar y mostrar drops con valores actuales
        const currentSpeed = speed
        const currentFontSize = fontSize
        drops.forEach(drop => {
          drop.update(currentSpeed, currentFontSize)
          drop.display(currentFontSize)
        })
      }

      p.windowResized = () => {
        const maxWidth = Math.min(containerRef.current?.clientWidth - 64 || 1200, 1400)
        const maxHeight = Math.min(window.innerHeight - 300, 800)
        p.resizeCanvas(maxWidth, maxHeight)
        drops = []
        const currentFontSize = fontSize
        const numDrops = Math.floor(p.width / currentFontSize)
        for (let i = 0; i < numDrops; i++) {
          drops.push(new Drop(i * currentFontSize))
        }
        setDropCount(numDrops)
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
  }, [charSet, speed, fontSize])

  const getAsciiText = () => {
    if (!p5Instance.current) return ''
    // Simular captura de estado actual (simplificado)
    return 'Matrix Rain ASCII Art\n' + '='.repeat(50) + '\n\n'
  }

  const handleExportTxt = () => {
    const asciiText = getAsciiText()
    exportAsTxt(asciiText, 'matrix-rain.txt')
    showNotificationMessage('✓ Exportado como TXT')
  }

  const handleCopy = async () => {
    const asciiText = getAsciiText()
    const success = await copyToClipboard(asciiText)
    if (success) {
      showNotificationMessage('✓ Copiado al portapapeles')
    } else {
      showNotificationMessage('✗ Error al copiar')
    }
  }

  const handleDownloadPNG = () => {
    if (p5Instance.current && p5Instance.current.canvas) {
      downloadCanvasAsPNG(p5Instance.current.canvas, 'matrix-rain.png')
      showNotificationMessage('✓ Imagen PNG descargada')
    }
  }

  const handleDownloadSVG = () => {
    const asciiText = getAsciiText()
    downloadAsSVG(asciiText, 900, 650, fontSize)
    showNotificationMessage('✓ Imagen SVG descargada')
  }

  const showNotificationMessage = (message) => {
    setShowNotification(message)
    setTimeout(() => setShowNotification(''), 2000)
  }

  return (
    <div className="matrix-container">
      <div className="controls-panel">
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
        
        <div className="control-group">
          <label>Velocidad: {speed}</label>
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>
        
        <div className="control-group">
          <label>Tamaño de fuente: {fontSize}px</label>
          <input 
            type="range" 
            min="8" 
            max="24" 
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
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

export default MatrixRain

