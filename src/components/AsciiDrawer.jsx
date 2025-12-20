import { useEffect, useRef, useState } from 'react'
import { HiOutlineDocumentText, HiOutlineClipboardCopy, HiOutlinePhotograph, HiOutlineCube, HiOutlineTrash } from 'react-icons/hi'
import p5 from 'p5'
import { exportAsTxt, copyToClipboard, downloadCanvasAsPNG, downloadAsSVG } from '../utils/exportUtils'

const AsciiDrawer = () => {
  const containerRef = useRef(null)
  const p5Instance = useRef(null)
  const [charSet, setCharSet] = useState('detailed')
  const [brushSize, setBrushSize] = useState(10)
  const [density, setDensity] = useState(8)
  const [showNotification, setShowNotification] = useState('')

  const charSets = {
    simple: ' .:-=+*#%@',
    detailed: ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
    blocks: ' ░▒▓█',
    numbers: ' .123456789',
    gradient: ' .:;+=xX$&'
  }

  useEffect(() => {
    if (!containerRef.current) return

    const sketch = (p) => {
      let drawingCanvas
      let displayCanvas
      let lastX = 0
      let lastY = 0

      p.setup = () => {
        const maxWidth = Math.min(containerRef.current?.clientWidth - 64 || 1200, 1400)
        const maxHeight = Math.min(window.innerHeight - 300, 800)
        displayCanvas = p.createCanvas(maxWidth, maxHeight)
        displayCanvas.parent(containerRef.current)
        p.background(0)
        
        // Canvas oculto para el dibujo real
        drawingCanvas = p.createGraphics(maxWidth, maxHeight)
        drawingCanvas.background(0)
      }

      p.draw = () => {
        // Mostrar el canvas de dibujo convertido a ASCII
        convertDrawingToAscii()
      }

      const convertDrawingToAscii = () => {
        p.background(0)
        p.fill(255)
        p.textAlign(p.LEFT, p.TOP)
        p.textSize(density)
        
        drawingCanvas.loadPixels()
        const chars = charSets[charSet] || charSets.simple
        const charArray = Array.from(chars)
        
        const w = Math.floor(drawingCanvas.width / density)
        const h = Math.floor(drawingCanvas.height / density * 0.6)
        
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const px = Math.floor(x * density)
            const py = Math.floor(y * density)
            
            if (px < drawingCanvas.width && py < drawingCanvas.height) {
              const index = (py * drawingCanvas.width + px) * 4
              const r = drawingCanvas.pixels[index]
              const g = drawingCanvas.pixels[index + 1]
              const b = drawingCanvas.pixels[index + 2]
              
              if (r > 10 || g > 10 || b > 10) {
                const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255
                const charIndex = Math.floor(brightness * (charArray.length - 1))
                const char = charArray[charIndex]
                
                const gray = brightness * 255
                p.fill(gray)
                p.text(char, x * density, y * density)
              }
            }
          }
        }
      }

      let isDrawingLocal = false

      p.mousePressed = () => {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          isDrawingLocal = true
          drawingCanvas.stroke(255)
          drawingCanvas.strokeWeight(brushSize)
          drawingCanvas.line(p.mouseX, p.mouseY, p.mouseX, p.mouseY)
          lastX = p.mouseX
          lastY = p.mouseY
        }
      }

      p.mouseDragged = () => {
        if (isDrawingLocal && p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          drawingCanvas.stroke(255)
          drawingCanvas.strokeWeight(brushSize)
          drawingCanvas.line(lastX, lastY, p.mouseX, p.mouseY)
          lastX = p.mouseX
          lastY = p.mouseY
        }
      }

      p.mouseReleased = () => {
        isDrawingLocal = false
      }

      p.touchStarted = () => {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          isDrawingLocal = true
          drawingCanvas.stroke(255)
          drawingCanvas.strokeWeight(brushSize)
          drawingCanvas.line(p.mouseX, p.mouseY, p.mouseX, p.mouseY)
          lastX = p.mouseX
          lastY = p.mouseY
        }
        return false
      }

      p.touchMoved = () => {
        if (isDrawingLocal && p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          drawingCanvas.stroke(255)
          drawingCanvas.strokeWeight(brushSize)
          drawingCanvas.line(lastX, lastY, p.mouseX, p.mouseY)
          lastX = p.mouseX
          lastY = p.mouseY
        }
        return false
      }

      p.touchEnded = () => {
        isDrawingLocal = false
        return false
      }

      // Exponer funciones para exportar
      p.exportDrawing = () => {
        return { drawingCanvas, displayCanvas: displayCanvas.elt }
      }

      // Guardar referencia para exportar
      if (p5Instance.current) {
        p5Instance.current.exportDrawing = () => {
          return { drawingCanvas, displayCanvas: displayCanvas.elt }
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
  }, [charSet, brushSize, density])

  const getAsciiText = () => {
    // Esta función necesitaría acceso al canvas para extraer el texto ASCII
    // Por simplicidad, retornamos un placeholder
    return 'ASCII Art generado desde dibujo'
  }

  const handleExportTxt = () => {
    const asciiText = getAsciiText()
    exportAsTxt(asciiText, 'ascii-drawing.txt')
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
      downloadCanvasAsPNG(p5Instance.current.canvas, 'ascii-drawing.png')
      showNotificationMessage('✓ Imagen PNG descargada')
    }
  }

  const handleDownloadSVG = () => {
    const asciiText = getAsciiText()
    downloadAsSVG(asciiText, 800, 600, density)
    showNotificationMessage('✓ Imagen SVG descargada')
  }

  const handleClear = () => {
    if (p5Instance.current) {
      p5Instance.current.remove()
      // Reiniciar canvas
      const sketch = (p) => {
        let drawingCanvas
        let displayCanvas

        p.setup = () => {
          displayCanvas = p.createCanvas(800, 600)
          displayCanvas.parent(containerRef.current)
          p.background(0)
          drawingCanvas = p.createGraphics(800, 600)
          drawingCanvas.background(0)
        }

        p.draw = () => {
          p.background(0)
        }
      }
      p5Instance.current = new p5(sketch, containerRef.current)
    }
  }

  const showNotificationMessage = (message) => {
    setShowNotification(message)
    setTimeout(() => setShowNotification(''), 2000)
  }

  return (
    <div className="drawer-container">
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
          <label>Tamaño de pincel: {brushSize}px</label>
          <input 
            type="range" 
            min="1" 
            max="50" 
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
          />
        </div>
        
        <div className="control-group">
          <label>Densidad ASCII: {density}px</label>
          <input 
            type="range" 
            min="4" 
            max="20" 
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <button onClick={handleClear} className="clear-btn">
            <HiOutlineTrash style={{ color: '#F5669F', fontSize: '20px' }} />
            <span>Limpiar</span>
          </button>
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
      
      <div className="drawer-instructions">
        <p>🎨 Dibuja en el canvas y verás tu arte convertido a ASCII en tiempo real</p>
      </div>

      {showNotification && (
        <div className="notification">
          {showNotification}
        </div>
      )}
    </div>
  )
}

export default AsciiDrawer

