import { useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { gsap } from 'gsap';
import './CardNav.css';

const CardNav = ({
  items,
  className = '',
  baseColor = 'rgba(29, 29, 31, 0.9)',
  menuColor = '#ffffff',
  onItemClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const tlRef = useRef(null);

  const calculateHeight = () => {
    const menuEl = menuRef.current;
    if (!menuEl) return 32; // Altura mínima de la barra

    const wasVisible = menuEl.style.visibility;
    const wasHeight = menuEl.style.height;
    menuEl.style.visibility = 'hidden';
    menuEl.style.height = 'auto';
    menuEl.style.position = 'absolute';

    void menuEl.offsetHeight;

    const height = menuEl.scrollHeight;
    menuEl.style.visibility = wasVisible;
    menuEl.style.height = wasHeight;
    menuEl.style.position = '';

    return 60 + height + 16; // Altura cuando está expandido
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    const menuEl = menuRef.current;
    if (!navEl || !menuEl) return null;

    gsap.set(navEl, { height: '32px', overflow: 'hidden' });
    gsap.set(menuEl, { opacity: 0, y: -10 });

    const tl = gsap.timeline({ paused: true });
    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.3,
      ease: 'power2.out'
    });
    tl.to(menuEl, {
      opacity: 1,
      y: 0,
      duration: 0.25,
      ease: 'power2.out'
    }, '-=0.15');

    return tl;
  };

  useLayoutEffect(() => {
    // Siempre iniciar colapsado, incluso en desktop
    const navEl = navRef.current;
    const menuEl = menuRef.current;
    if (navEl && menuEl) {
      gsap.set(navEl, { height: '32px', overflow: 'hidden' });
      gsap.set(menuEl, { opacity: 0, y: -10 });
      setIsExpanded(false);
    }

    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      const isDesktop = globalThis.matchMedia?.('(min-width: 1024px)').matches ?? false;
      if (isDesktop) {
        const navEl = navRef.current;
        const menuEl = menuRef.current;
        if (navEl && menuEl) {
          gsap.set(navEl, { height: 'auto', overflow: 'visible' });
          gsap.set(menuEl, { opacity: 1, y: 0 });
        }
        return;
      }

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl !== null) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl !== null) {
          tlRef.current = newTl;
        }
      }
    };

    globalThis.addEventListener?.('resize', handleResize);
    return () => globalThis.removeEventListener?.('resize', handleResize);
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (tl === null) return;

    if (!isExpanded) {
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsExpanded(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const handleItemClick = (item) => {
    if (onItemClick) {
      onItemClick(item.id);
    }
    if (globalThis.innerWidth < 768 && isExpanded) {
      toggleMenu();
    }
  };

  return (
    <div className={`card-nav-container ${className}`}>
      <nav 
        ref={navRef} 
        className={`card-nav ${isExpanded ? 'open' : ''}`} 
        style={{ backgroundColor: baseColor }}
        onClick={!isExpanded ? toggleMenu : undefined}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (!isExpanded && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            toggleMenu();
          }
        }}
      >
        {!isExpanded && (
          <div className="minimal-bar-trigger">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="4" y1="8" x2="20" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <line x1="4" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            </svg>
          </div>
        )}
        
        <div className="card-nav-bar">
          {isExpanded && (
            <>
              <button
                type="button"
                className={`menu-toggle ${isExpanded ? 'open' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu();
                }}
                aria-label="Close menu"
                style={{ color: menuColor }}
              >
                <div className="menu-toggle-line" />
                <div className="menu-toggle-line" />
                <div className="menu-toggle-line" />
              </button>

              <div className="nav-logo">
                <span className="logo-text">ASCII Studio</span>
              </div>

              <div className="nav-spacer" />
            </>
          )}
        </div>

        <div ref={menuRef} className="nav-menu" aria-hidden={!isExpanded}>
          {(items || []).map((item, idx) => (
            <button
              key={`${item.id}-${idx}`}
              type="button"
              className="nav-menu-item"
              onClick={(e) => {
                e.stopPropagation();
                handleItemClick(item);
              }}
              style={{ color: menuColor }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

CardNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    bgColor: PropTypes.string,
    textColor: PropTypes.string
  })),
  className: PropTypes.string,
  baseColor: PropTypes.string,
  menuColor: PropTypes.string,
  onItemClick: PropTypes.func
};

export default CardNav;
