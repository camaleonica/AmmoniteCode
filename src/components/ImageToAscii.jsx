import { useEffect, useRef, useState } from 'react'
import { HiOutlineDocumentText, HiOutlineClipboardCopy, HiOutlinePhotograph, HiOutlineCube, HiOutlineCloudUpload } from 'react-icons/hi'
import p5 from 'p5'
import { exportAsTxt, copyToClipboard, downloadCanvasAsPNG, downloadAsSVG } from '../utils/exportUtils'

const ImageToAscii = () => {
  const containerRef = useRef(null)
  const p5Instance = useRef(null)
  const [image, setImage] = useState(null)
  const [density, setDensity] = useState(10)
  const [contrast, setContrast] = useState(1.5)
  const [charSet, setCharSet] = useState('detailed')
  const [asciiText, setAsciiText] = useState('')
  const [showNotification, setShowNotification] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef(null)
  const imgRef = useRef(null)
  const paramsRef = useRef({ density, contrast, charSet })

  const charSets = {
    simple: ' .:-=+*#%@',
    detailed: ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
    blocks: ' ░▒▓█',
    numbers: ' .123456789',
    gradient: ' .:;+=xX$&'
  }

  // Actualizar referencia de parámetros cuando cambian
  useEffect(() => {
    paramsRef.current = { density, contrast, charSet }
  }, [density, contrast, charSet])

  useEffect(() => {
    if (!containerRef.current) return

    // Limpiar instancia anterior
    if (p5Instance.current) {
      p5Instance.current.remove()
      p5Instance.current = null
    }

    if (!image) {
      imgRef.current = null
      return
    }

    const sketch = (p) => {
      let img = null
      let imageReady = false
      let canvasWidth = 800
      let canvasHeight = 600

      p.setup = () => {
        const canvas = p.createCanvas(canvasWidth, canvasHeight)
        canvas.parent(containerRef.current)
        p.colorMode(p.RGB, 255)
        p.background(0)
        
        // Cargar imagen
        img = p.loadImage(
          image,
          () => {
            imageReady = true
            setIsProcessing(true)
            imgRef.current = img
            
            // Calcular el tamaño necesario del canvas basado en el ASCII que se generará
            const params = paramsRef.current
            const textWidth = Math.floor(img.width / params.density)
            const textHeight = Math.floor(img.height / params.density * 0.6)
            
            // El canvas debe ser exactamente del tamaño necesario para mostrar todo el ASCII
            canvasWidth = Math.ceil(textWidth * params.density)
            canvasHeight = Math.ceil(textHeight * params.density)
            
            p.resizeCanvas(canvasWidth, canvasHeight)
            
            // Procesar después de un pequeño delay
            setTimeout(() => {
              processImage()
            }, 100)
          },
          () => {
            console.error('Error loading image')
            setIsProcessing(false)
            imageReady = false
          }
        )
      }

      const processImage = () => {
        if (!img || !imageReady) {
          setIsProcessing(false)
          return
        }

        try {
          const params = paramsRef.current
          const currentChars = charSets[params.charSet] || charSets.simple
          const charArray = Array.from(currentChars)
          const currentDensity = params.density
          const currentContrast = params.contrast
          
          img.loadPixels()
          
          if (!img.pixels || img.pixels.length === 0) {
            console.error('No pixel data available')
            setIsProcessing(false)
            return
          }
          
          // Calcular dimensiones del ASCII
          const w = Math.floor(img.width / currentDensity)
          const h = Math.floor(img.height / currentDensity * 0.6)
          
          // Calcular el tamaño necesario del canvas para mostrar todo el ASCII
          const neededWidth = Math.ceil(w * currentDensity)
          const neededHeight = Math.ceil(h * currentDensity)
          
          // Ajustar canvas al tamaño necesario siempre (incluso si es menor o mayor)
          if (neededWidth !== canvasWidth || neededHeight !== canvasHeight) {
            canvasWidth = neededWidth
            canvasHeight = neededHeight
            p.resizeCanvas(canvasWidth, canvasHeight)
          }
          
          p.colorMode(p.RGB, 255)
          p.background(0)
          p.fill(255)
          p.textAlign(p.LEFT, p.TOP)
          p.textSize(currentDensity)
          
          let asciiOutput = ''
          
          // Procesar todos los píxeles
          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const px = Math.floor(x * currentDensity)
              const py = Math.floor(y * currentDensity)
              
              if (px < img.width && py < img.height) {
                const index = (py * img.width + px) * 4
                
                if (index + 2 < img.pixels.length) {
                  const r = img.pixels[index]
                  const g = img.pixels[index + 1]
                  const b = img.pixels[index + 2]
                  
                  const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255
                  const adjustedBrightness = Math.pow(Math.max(0, Math.min(1, brightness)), currentContrast)
                  
                  const charIndex = Math.floor(adjustedBrightness * (charArray.length - 1))
                  const char = charArray[charIndex] || ' '
                  
                  asciiOutput += char
                  
                  const gray = adjustedBrightness * 255
                  p.fill(gray, gray, gray)
                  p.text(char, x * currentDensity, y * currentDensity)
                } else {
                  asciiOutput += ' '
                }
              } else {
                asciiOutput += ' '
              }
            }
            asciiOutput += '\n'
          }
          
          setAsciiText(asciiOutput)
          setIsProcessing(false)
        } catch (error) {
          console.error('Error processing image:', error)
          setIsProcessing(false)
        }
      }

      // Función para actualizar cuando cambian los parámetros
      p.reprocess = () => {
        if (img && imageReady) {
          setIsProcessing(true)
          setTimeout(() => {
            processImage()
          }, 10)
        }
      }

      p.draw = () => {
        // Canvas estático
      }
    }

    p5Instance.current = new p5(sketch)

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove()
        p5Instance.current = null
      }
    }
  }, [image])

  // Reprocesar cuando cambian los parámetros
  useEffect(() => {
    if (image && p5Instance.current?.reprocess) {
      p5Instance.current.reprocess()
    }
  }, [density, contrast, charSet, image])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setIsProcessing(true)
      setAsciiText('')
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target.result)
      }
      reader.onerror = () => {
        setIsProcessing(false)
        showNotificationMessage('✗ Error al cargar la imagen')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleExportTxt = () => {
    if (asciiText) {
      exportAsTxt(asciiText, 'ascii-image.txt')
      showNotificationMessage('✓ Exportado como TXT')
    }
  }

  const handleCopy = async () => {
    if (asciiText) {
      const success = await copyToClipboard(asciiText)
      if (success) {
        showNotificationMessage('✓ Copiado al portapapeles')
      } else {
        showNotificationMessage('✗ Error al copiar')
      }
    }
  }

  const handleDownloadPNG = () => {
    if (p5Instance.current?.canvas) {
      downloadCanvasAsPNG(p5Instance.current.canvas, 'ascii-image.png')
      showNotificationMessage('✓ Imagen PNG descargada')
    }
  }

  const handleDownloadSVG = () => {
    if (asciiText && p5Instance.current) {
      const params = paramsRef.current
      downloadAsSVG(asciiText, p5Instance.current.width, p5Instance.current.height, params.density)
      showNotificationMessage('✓ Imagen SVG descargada')
    }
  }

  const showNotificationMessage = (message) => {
    setShowNotification(message)
    setTimeout(() => setShowNotification(''), 2000)
  }

  return (
    <div className="image-ascii-container">
      <div className="controls-panel">
        <div className="control-group">
          <button 
            className="upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <HiOutlineCloudUpload style={{ color: '#F5669F', fontSize: '20px' }} />
            <span>Subir Imagen</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>
        
        {image && (
          <>
            <div className="control-group">
              <label>Densidad: {density}px</label>
              <input 
                type="range" 
                min="4" 
                max="20" 
                value={density}
                onChange={(e) => setDensity(Number(e.target.value))}
              />
            </div>
            
            <div className="control-group">
              <label>Contraste: {contrast.toFixed(1)}</label>
              <input 
                type="range" 
                min="0.5" 
                max="3" 
                step="0.1"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
              />
            </div>
            
            <div className="control-group">
              <label htmlFor="char-set-select">Caracteres:</label>
              <select id="char-set-select" value={charSet} onChange={(e) => setCharSet(e.target.value)}>
                {Object.keys(charSets).map(key => (
                  <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
      
      {image && asciiText && (
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
      )}
      
      <div ref={containerRef} className="p5-canvas-wrapper" />
      
      {isProcessing && (
        <div className="processing-indicator">
          <p>⏳ Procesando imagen...</p>
        </div>
      )}
      
      {!image && (
        <div className="upload-placeholder">
          <p>📸 Sube una imagen para convertirla a ASCII Art</p>
          <p className="hint">Arrastra una imagen aquí o haz clic en el botón</p>
        </div>
      )}

      {showNotification && (
        <div className="notification">
          {showNotification}
        </div>
      )}
    </div>
  )
}

export default ImageToAscii
