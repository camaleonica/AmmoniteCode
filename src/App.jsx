import { useState, useEffect } from 'react'
import { MdBarChart, MdFullscreen, MdFullscreenExit } from 'react-icons/md'
import MatrixRain from './components/MatrixRain'
import ImageToAscii from './components/ImageToAscii'
import AsciiPatternGenerator from './components/AsciiPatternGenerator'
import AsciiDrawer from './components/AsciiDrawer'
import RunningHorse from './components/RunningHorse'
import StatsDisplay from './components/StatsDisplay'
import StaggeredMenu from './components/StaggeredMenu'
import ClickSpark from './components/ClickSpark'
import ScrollVelocity from './components/ScrollVelocity'
import './App.css'

function App() {
  const [mode, setMode] = useState('presentation')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showStats, setShowStats] = useState(true)

  // Solo mostrar las opciones en el menú, no la presentación (esa es la landing)
  const navItems = [
    {
      label: 'Matrix rain',
      ariaLabel: 'Matrix Rain - Lluvia de caracteres estilo Matrix',
      onClick: () => setMode('matrix')
    },
    {
      label: 'Imágen a ASCII',
      ariaLabel: 'Imagen a ASCII - Convierte imágenes a arte ASCII',
      onClick: () => setMode('image')
    },
    {
      label: 'Patrones',
      ariaLabel: 'Patrones - Genera patrones ASCII animados',
      onClick: () => setMode('pattern')
    },
    {
      label: 'Lets draw',
      ariaLabel: 'Dibujador - Dibuja y crea arte ASCII interactivo',
      onClick: () => setMode('drawer')
    }
  ]

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch(err => {
        console.log('Error al entrar en pantalla completa:', err)
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      })
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <ClickSpark
      sparkColor='#ffffff'
      sparkSize={14}
      sparkRadius={30}
      sparkCount={12}
      duration={600}
      asciiChars='*+•◦○●◉♦◊▲△▴▵'
    >
      <div className="app-container">
        <StaggeredMenu
          items={navItems}
          position="right"
          colors={['#1d1d1f', '#2a2a2f']}
          accentColor="#F5669F"
          menuButtonColor="#ffffff"
          openMenuButtonColor="#F5669F"
          isFixed={true}
          displaySocials={false}
          displayItemNumbering={true}
          logoUrl="/ammonite-fossil.png"
          onLogoClick={() => setMode('presentation')}
        />
        
        <main className="main-content">
          {mode === 'presentation' ? (
            <div className="presentation-fullscreen">
              <RunningHorse />
            </div>
          ) : (
            <>
              <header className="app-header">
                <div className="header-content">
                  <div className="scroll-velocity-title">
                    <ScrollVelocity
                      texts={['Laboratorio ASCII']}
                      velocity={50}
                      className="scroll-velocity-text"
                      numCopies={4}
                      parallaxClassName="scroll-velocity-parallax"
                      scrollerClassName="scroll-velocity-scroller"
                    />
                  </div>
                  <p>Generador creativo de arte ASCII</p>
                  
                  <div className="header-actions">
                    <button 
                      onClick={toggleFullscreen} 
                      className="action-btn"
                      title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                    >
                      {isFullscreen ? <MdFullscreenExit style={{ color: '#F5669F' }} /> : <MdFullscreen style={{ color: '#F5669F' }} />}
                    </button>
                    
                    <button 
                      onClick={() => setShowStats(!showStats)} 
                      className="action-btn"
                      title="Mostrar/ocultar estadísticas"
                    >
                      <MdBarChart style={{ color: '#F5669F' }} />
                    </button>
                  </div>
                </div>
              </header>
              
              {showStats && <StatsDisplay mode={mode} />}
              
              <div className="canvas-container">
                {mode === 'matrix' && <MatrixRain />}
                {mode === 'image' && <ImageToAscii />}
                {mode === 'pattern' && <AsciiPatternGenerator />}
                {mode === 'drawer' && <AsciiDrawer />}
              </div>

              <footer className="app-footer">
                <p>Proyecto de código experimental y creativo. Con el objetivo de hechar un lindo vistazo al trasfondo de la sagrada geometría en las cosas y retratar perspectivas de todas las posibilidades. Somos esto.</p>
              </footer>
            </>
          )}
        </main>
      </div>
    </ClickSpark>
  )
}

export default App
