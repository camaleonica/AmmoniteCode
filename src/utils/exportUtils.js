// Utilidades para exportar ASCII art

export const exportAsTxt = (asciiText, filename = 'ascii-art.txt') => {
  const blob = new Blob([asciiText], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback para navegadores antiguos
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (e) {
      document.body.removeChild(textArea)
      return false
    }
  }
}

export const downloadCanvasAsPNG = (canvas, filename = 'ascii-art.png') => {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 'image/png')
}

export const downloadAsSVG = (asciiText, width = 800, height = 600, fontSize = 12, color = '#00ff64', bgColor = '#000000') => {
  const lines = asciiText.split('\n')
  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  <text x="10" y="${fontSize + 10}" font-family="Aujournuit, Aujournuit-Wide" font-size="${fontSize}" fill="${color}" xml:space="preserve">
${lines.map((line, i) => `    <tspan x="10" dy="${i === 0 ? 0 : fontSize}">${escapeXml(line)}</tspan>`).join('\n')}
  </text>
</svg>`
  
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'ascii-art.svg'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const escapeXml = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export const getAsciiTextFromCanvas = (p5Instance, callback) => {
  // Esta función debe ser implementada por cada componente según su lógica
  // Se pasará como callback desde el componente
  return callback()
}

