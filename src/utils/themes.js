// Sistema de temas de color para ASCII Art Studio

export const themes = {
  matrix: {
    name: 'Matrix',
    primary: '#00ff64',
    secondary: '#00cc50',
    background: '#000000',
    text: '#00ff64',
    accent: '#ffffff',
    description: 'Clásico verde Matrix'
  },
  cyberpunk: {
    name: 'Cyberpunk',
    primary: '#00ffff',
    secondary: '#ff00ff',
    background: '#0a0a0a',
    text: '#00ffff',
    accent: '#ff00ff',
    description: 'Azul y magenta neón'
  },
  terminal: {
    name: 'Terminal',
    primary: '#00ff41',
    secondary: '#008f11',
    background: '#0d1117',
    text: '#c9d1d9',
    accent: '#58a6ff',
    description: 'Terminal moderna'
  },
  retro: {
    name: 'Retro',
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    background: '#2d3436',
    text: '#ffeaa7',
    accent: '#fd79a8',
    description: 'Colores retro vibrantes'
  },
  monochrome: {
    name: 'Monocromo',
    primary: '#ffffff',
    secondary: '#808080',
    background: '#000000',
    text: '#ffffff',
    accent: '#ffffff',
    description: 'Blanco y negro clásico'
  },
  sunset: {
    name: 'Sunset',
    primary: '#ff6b35',
    secondary: '#f7931e',
    background: '#1a1a2e',
    text: '#ff6b35',
    accent: '#ffd23f',
    description: 'Naranjas y amarillos cálidos'
  },
  ocean: {
    name: 'Ocean',
    primary: '#00d4ff',
    secondary: '#0099cc',
    background: '#001122',
    text: '#00d4ff',
    accent: '#66e0ff',
    description: 'Azules oceánicos'
  },
  neon: {
    name: 'Neon',
    primary: '#ff0080',
    secondary: '#00ff80',
    background: '#000000',
    text: '#ff0080',
    accent: '#8000ff',
    description: 'Neón multicolor'
  }
}

export const applyTheme = (themeName) => {
  const theme = themes[themeName] || themes.matrix
  const root = document.documentElement
  
  root.style.setProperty('--theme-primary', theme.primary)
  root.style.setProperty('--theme-secondary', theme.secondary)
  root.style.setProperty('--theme-background', theme.background)
  root.style.setProperty('--theme-text', theme.text)
  root.style.setProperty('--theme-accent', theme.accent)
}

