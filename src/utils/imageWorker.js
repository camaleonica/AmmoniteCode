// Web Worker para procesar imágenes a ASCII en background thread

// Esta función se ejecutará en el worker
self.onmessage = function(e) {
  const { imageData, width, height, density, contrast, charSet } = e.data
  
  const chars = charSet || ' .:-=+*#%@'
  const charArray = Array.from(chars)
  
  const w = Math.floor(width / density)
  const h = Math.floor(height / density * 0.6)
  
  let asciiOutput = ''
  const pixels = imageData.data
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = Math.floor(x * density)
      const py = Math.floor(y * density)
      
      if (px < width && py < height) {
        const index = (py * width + px) * 4
        const r = pixels[index]
        const g = pixels[index + 1]
        const b = pixels[index + 2]
        
        // Calcular brillo
        const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255
        const adjustedBrightness = Math.pow(brightness, contrast)
        
        // Mapear a caracteres
        const charIndex = Math.floor(adjustedBrightness * (charArray.length - 1))
        const char = charArray[charIndex]
        
        asciiOutput += char
      }
    }
    asciiOutput += '\n'
  }
  
  // Enviar resultado de vuelta
  self.postMessage({ asciiText: asciiOutput })
}

