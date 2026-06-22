'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function Animation() {
  const faceLottieRef = useRef<HTMLDivElement>(null)
  const modalVideoRef = useRef<HTMLVideoElement>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSrc, setModalSrc] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const [modalLoop, setModalLoop] = useState(false)
  const [clock, setClock] = useState('')
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  // Viewport — decides which video set to mount, avoids loading both
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Clock
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClock(now.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' }))
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])


  // Windows drag — reruns once isMobile resolves and the windows actually mount
  useEffect(() => {
    if (isMobile !== false) return
    let zTop = 200
    const wins = document.querySelectorAll<HTMLElement>('.win98')
    wins.forEach(win => {
      const titlebar = win.querySelector<HTMLElement>('.win-titlebar')
      if (!titlebar) return
      let dragging = false, startX = 0, startY = 0, startL = 0, startT = 0

      const bringToFront = () => {
        zTop++
        win.style.zIndex = String(zTop)
        wins.forEach(w => w.classList.remove('active-window'))
        win.classList.add('active-window')
      }

      titlebar.addEventListener('mousedown', (e: MouseEvent) => {
        const target = e.target as HTMLElement
        if (target.classList.contains('win-btn')) return
        dragging = true
        startX = e.clientX; startY = e.clientY
        // Utilise getBoundingClientRect pour avoir les vrais pixels
        const rect = win.getBoundingClientRect()
        startL = rect.left
        startT = rect.top
        bringToFront(); e.preventDefault()
      })
      win.addEventListener('mousedown', bringToFront)

      const onMouseMove = (e: MouseEvent) => {
        if (!dragging) return
        win.style.bottom = ''
        win.style.right = ''
        win.style.left = (startL + e.clientX - startX) + 'px'
        win.style.top = (startT + e.clientY - startY) + 'px'
        win.style.transform = 'rotate(0deg)'
      }
      const onMouseUp = () => { dragging = false }
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    })
  }, [isMobile])

  // Lottie + mouse-driven animation
  useEffect(() => {
    if (!faceLottieRef.current) return
    const faceLottie = faceLottieRef.current
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let anim: any = null
    let rafId: number

    import('lottie-web').then(({ default: lottie }) => {
      fetch('/faceanimation.json')
        .then(r => r.json())
        .then(data => {
          data.layers.forEach((l: { ef?: unknown[] }) => { if (l.ef) l.ef = [] })
          anim = lottie.loadAnimation({
            container: faceLottie,
            renderer: 'canvas',
            loop: false,
            autoplay: false,
            animationData: data,
          })

          anim.addEventListener('DOMLoaded', () => {
            const cv = faceLottie.querySelector('canvas')
            if (cv) {
              cv.style.transformOrigin = '50% 46%'
              cv.style.transform = 'scale(1.35)'
              cv.style.position = 'absolute'
              cv.style.top = '0'
              cv.style.left = '0'
            }
          })

          const TOTAL = 75
          const PI2 = Math.PI / 2
          let targetFrame = 0, curFrame = 0

          const onMouseMove = (e: MouseEvent) => {
            const nx = (e.clientX / window.innerWidth - 0.5) * 2
            const ny = (e.clientY / window.innerHeight - 0.5) * 2
            const dist = Math.min(Math.hypot(nx, ny), 1)
            const angle = Math.atan2(ny, nx)
            let dirFrame: number
            if (angle >= -PI2 && angle < 0) dirFrame = 15 + ((angle + PI2) / PI2) * 15
            else if (angle >= 0 && angle < PI2) dirFrame = 30 + (angle / PI2) * 15
            else if (angle >= PI2) dirFrame = 45 + ((angle - PI2) / PI2) * 15
            else dirFrame = (60 + ((angle + Math.PI) / PI2) * 30) % TOTAL
            const delta = ((dirFrame + TOTAL / 2) % TOTAL) - TOTAL / 2
            targetFrame = ((delta * dist) % TOTAL + TOTAL) % TOTAL
          }
          document.addEventListener('mousemove', onMouseMove)

          const animFace = () => {
            let diff = targetFrame - curFrame
            if (diff > TOTAL / 2) diff -= TOTAL
            if (diff < -TOTAL / 2) diff += TOTAL
            curFrame = (curFrame + diff * 0.1 + TOTAL) % TOTAL
            if (anim) anim.goToAndStop(curFrame, true)
            rafId = requestAnimationFrame(animFace)
          }
          animFace()

          return () => {
            document.removeEventListener('mousemove', onMouseMove)
            cancelAnimationFrame(rafId)
          }
        })
    })

    return () => {
      if (anim) anim.destroy()
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Modal
  const LOOP_VIDEOS = ['velo.mp4', 'caf%C3%A9.mp4']
  const openModal = (src: string, title: string) => {
    const shouldLoop = LOOP_VIDEOS.some(v => src.includes(v))
    setModalSrc(src); setModalTitle(title); setModalLoop(shouldLoop); setModalOpen(true)
    setTimeout(() => { modalVideoRef.current?.play().catch(() => {}) }, 100)
  }
  const closeModal = () => {
    setModalOpen(false)
    if (modalVideoRef.current) { modalVideoRef.current.pause(); modalVideoRef.current.src = '' }
  }

  const minimizeWin = (id: string) => {
    const win = document.getElementById(id)
    if (!win) return
    const content = win.querySelector<HTMLElement>('.win-content')
    const btn = win.querySelector<HTMLElement>('.win-open-btn')
    const isMin = win.dataset.minimized === 'true'
    if (content) content.style.display = isMin ? 'block' : 'none'
    if (btn) btn.style.display = isMin ? 'block' : 'none'
    win.dataset.minimized = isMin ? 'false' : 'true'
  }
  const closeWin = (id: string) => {
    const win = document.getElementById(id)
    if (win) win.style.display = 'none'
  }

  const wins = [
    { id: 'win1', src: '/motion%20design/burger.mp4',    title: 'Burger Boy · Motion Design', label: 'Burger Boy.mp4', vertical: true,  style: { top: '9vh',    left: '8vw',  transform: 'rotate(-2deg)' } },
    { id: 'win2', src: '/motion%20design/caf%C3%A9.mp4', title: 'Café · Motion Design',        label: 'Café.mp4',       vertical: false, style: { top: '9vh',    right: '5vw', transform: 'rotate(3deg)'  } },
    { id: 'win3', src: '/motion%20design/velo.mp4',      title: 'Vélo · Animation 2D',         label: 'Velo.mp4',       vertical: false, style: { bottom: '9vh', left: '8vw',  transform: 'rotate(-1deg)' } },
    { id: 'win4', src: '/motion%20design/Pepsihori.mp4', title: 'Pepsi · Motion Design',       label: 'Pepsi.mp4',      vertical: false, style: { bottom: '9vh', right: '5vw', transform: 'rotate(2deg)'  } },
  ]

  return (
    <>
      <style>{`
        body { background: #008080 !important; color: #F0EDE6; cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='26' shape-rendering='crispEdges'%3E%3Cpath d='M2,1 L2,20 L6,15 L9,22 L12,21 L9,14 L14,14 L14,13 L13,13 L13,12 L12,12 L12,11 L11,11 L11,10 L10,10 L10,9 L9,9 L9,8 L8,8 L8,7 L7,7 L7,6 L6,6 L6,5 L5,5 L5,4 L4,4 L4,3 L3,3 L3,2 L2,2 Z' fill='white' stroke='black' stroke-width='1' stroke-linejoin='miter' paint-order='stroke'/%3E%3C/svg%3E") 2 1, auto !important; }
        body::before { opacity: 0.08; }
        .cursor { display: none !important; }
        * { cursor: inherit !important; }
        a, button, .win98 { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='26' shape-rendering='crispEdges'%3E%3Cpath d='M2,1 L2,20 L6,15 L9,22 L12,21 L9,14 L14,14 L14,13 L13,13 L13,12 L12,12 L12,11 L11,11 L11,10 L10,10 L10,9 L9,9 L9,8 L8,8 L8,7 L7,7 L7,6 L6,6 L6,5 L5,5 L5,4 L4,4 L4,3 L3,3 L3,2 L2,2 Z' fill='white' stroke='black' stroke-width='1' stroke-linejoin='miter' paint-order='stroke'/%3E%3C/svg%3E") 2 1, pointer !important; }
        nav { background: rgba(0,80,80,0.75) !important; border-bottom-color: rgba(255,255,255,0.15) !important; height: 56px; }
        .nav-back { color: rgba(240,237,230,0.7) !important; }
        .nav-back:hover { color: #fff !important; }
        .nav-links a { color: rgba(240,237,230,0.7) !important; }
        .nav-links a:hover { color: #fff !important; }
        .nav-links a.active { color: var(--orange) !important; }
        .nav-links a.active::after { background: var(--orange) !important; }
        .nav-cta { background: #000 !important; color: #F0EDE6 !important; }
        .nav-cta:hover { background: var(--orange) !important; color: #000 !important; }
      `}</style>

      <nav>
        <Link href="/" className="nav-back">← DT.</Link>
        <ul className="nav-links">
          <li><Link href="/web">Sites Web</Link></li>
          <li><Link href="/animation" className="active">Animation &amp; Motion</Link></li>
          <li><a href="/#contact" className="nav-cta">Contact</a></li>
        </ul>
      </nav>

      {/* STAGE */}
      <div id="stage">
        {/* Retro overlays */}
        <div className="scanlines"></div>
        <div className="crt-sweep"></div>
        <div className="viewfinder" aria-hidden="true">
          <span className="tl"></span><span className="tr"></span>
          <span className="bl"></span><span className="br"></span>
        </div>
        <div className="rec-indicator" aria-hidden="true">
          <div className="rec-dot"></div>
          <div className="rec-meta"><span>REC</span><span className="rec-meta-bottom">LIVE · 1080p</span></div>
        </div>
        <div className="chromakey-marker" aria-hidden="true">
          <div className="ck-row"><span className="ck-swatch"></span>BG: #008080</div>
          <div>KEYED OUT IN POST</div>
        </div>
        <div className="desktop-icons" aria-hidden="true">
          <div className="desktop-icon">
            <div className="desktop-icon-img" style={{fontSize:'24px',textAlign:'center',lineHeight:'38px'}}>💻</div>
            <div className="desktop-icon-label">My Computer</div>
          </div>
          <div className="desktop-icon">
            <div className="desktop-icon-img" style={{fontSize:'24px',textAlign:'center',lineHeight:'38px'}}>🗑️</div>
            <div className="desktop-icon-label">Recycle Bin</div>
          </div>
        </div>
        {/* FACE */}
        <div id="face-container">
          <div id="face-lottie" ref={faceLottieRef}></div>
        </div>

        {/* Windows 98 — desktop only, kept unmounted on mobile to avoid loading these videos twice */}
        {isMobile === false && wins.map(w => (
          <div key={w.id} className={`win98${w.vertical ? ' vertical' : ''}`} id={w.id} style={{ position: 'fixed', width: w.vertical ? 'min(260px, 22vw)' : 'min(430px, 40vw)', ...w.style }}>
            <div className="win-titlebar">
              <span className="win-title-text"><span className="win-title-icon">🎬</span>{w.label}</span>
              <div className="win-btns">
                <button className="win-btn" onClick={() => minimizeWin(w.id)}>_</button>
                <button className="win-btn">□</button>
                <button className="win-btn win-btn-close" onClick={() => closeWin(w.id)}>✕</button>
              </div>
            </div>
            <div className="win-content">
              <video src={w.src} autoPlay muted loop playsInline preload="none"></video>
            </div>
            <button className="win-open-btn" onClick={() => openModal(w.src, w.title)}>▶ Ouvrir en plein écran</button>
          </div>
        ))}

        {/* YouTube window */}
        <div className="win98" id="win-yt" style={{ position: 'fixed', width: 'min(320px, 26vw)', top: '22vh', left: '50%', transform: 'translateX(-50%) rotate(1deg)' }}>
          <div className="win-titlebar">
            <span className="win-title-text"><span className="win-title-icon">▶</span>Animation 2D · YouTube</span>
            <div className="win-btns">
              <button className="win-btn" onClick={() => minimizeWin('win-yt')}>_</button>
              <button className="win-btn">□</button>
              <button className="win-btn win-btn-close" onClick={() => closeWin('win-yt')}>✕</button>
            </div>
          </div>
          <div className="win-content" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', background: '#c0c0c0' }}>
            <div style={{ fontSize: '13px', color: '#000', textAlign: 'center', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', lineHeight: 1.4 }}>
              J&apos;ai travaillé là-dessus
            </div>
            <a
              href="https://www.youtube.com/watch?v=PX7mrM-ZQ_8"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: '#ff0000', color: '#fff',
                padding: '8px 16px', border: '2px solid #000',
                boxShadow: '2px 2px 0 #000',
                fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '13px',
                textDecoration: 'none', cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '16px' }}>▶</span> Voir sur YouTube
            </a>
          </div>
        </div>
      </div>

      {/* TASKBAR */}
      <div className="taskbar">
        <button className={`tb-start${startMenuOpen ? ' active' : ''}`} onClick={() => setStartMenuOpen(o => !o)}>
          <span className="tb-start-flag"></span>
          <strong>Démarrer</strong>
        </button>
        <div className="tb-divider"></div>
        <div className="tb-tasks">
          {wins.map(w => (
            <div key={w.id} className="tb-task" onClick={() => { const el = document.getElementById(w.id); if (el) el.style.display = 'block' }}>
              <span className="tb-task-icon">🎬</span>{w.label}
            </div>
          ))}
          <div className="tb-task" onClick={() => { const el = document.getElementById('win-yt'); if (el) el.style.display = 'block' }}>
            <span className="tb-task-icon">▶</span>Animation 2D.mp4
          </div>
        </div>
        <div className="tb-tray">
          <span className="tb-tray-icon">🔊</span>
          <span className="tb-tray-icon">🌐</span>
          <div className="tb-clock">{clock}</div>
        </div>
      </div>

      {/* Start Menu */}
      <div className={`start-menu${startMenuOpen ? ' open' : ''}`}>
        <div className="start-menu-strip"><span>DORIAN TANI</span></div>
        <div className="start-menu-list">
          <Link href="/" className="start-menu-item" onClick={() => setStartMenuOpen(false)}><span className="ico">🏠</span>Portfolio</Link>
          <Link href="/web" className="start-menu-item" onClick={() => setStartMenuOpen(false)}><span className="ico">💻</span>Sites Web &amp; IA</Link>
          <div className="start-menu-sep"></div>
          <a href="mailto:tani.dorian02@gmail.com" className="start-menu-item"><span className="ico">📧</span>Contact</a>
          <div className="start-menu-sep"></div>
          <div className="start-menu-item" onClick={() => setStartMenuOpen(false)}><span className="ico">❌</span>Fermer</div>
        </div>
      </div>

      {/* MOBILE — Video cards (hidden on desktop) */}
      <section className="mobile-videos-section">
        <div className="section-label" style={{color:'rgba(240,237,230,0.35)'}}>Motion &amp; Animation — 04 projets</div>
        <h2 className="mobile-videos-title">Motion<br /><span className="violet">Design.</span></h2>
        <div className="mobile-videos-grid">
          {isMobile === true && wins.map(w => (
            <div key={`m-${w.id}`} className={`mobile-video-card${w.vertical ? ' vertical' : ''}`} onClick={() => openModal(w.src, w.title)} style={{cursor:'pointer'}}>
              <video src={w.src} autoPlay muted loop playsInline preload="none"></video>
              <span className="mobile-video-label">{w.label} ▶</span>
            </div>
          ))}
          <a
            href="https://www.youtube.com/watch?v=PX7mrM-ZQ_8"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-video-card"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#111', textDecoration: 'none', minHeight: '120px' }}
          >
            <span style={{ fontSize: '36px' }}>▶</span>
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '13px', textAlign: 'center' }}>J&apos;ai travaillé là-dessus</span>
            <span style={{ color: '#ff0000', fontSize: '12px', fontWeight: 'bold' }}>Voir sur YouTube</span>
          </a>
        </div>
      </section>

      {/* MODAL */}
      {modalOpen && (
        <div id="modal" className="open" onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div className="modal-inner">
            <div className="modal-titlebar">
              <span className="modal-titlebar-text">{modalTitle} — Windows Media Player</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <video ref={modalVideoRef} id="modal-video" controls src={modalSrc} loop={modalLoop}></video>
            </div>
            <div className="modal-footer"><button onClick={closeModal}>Fermer</button></div>
          </div>
        </div>
      )}
    </>
  )
}
