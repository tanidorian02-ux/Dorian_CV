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


  // Windows drag
  useEffect(() => {
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
  }, [])

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
    { id: 'win1', src: '/motion%20design/burger.mp4', title: 'Burger Boy · Motion Design', label: 'Burger Boy.mp4', vertical: true,  style: { top: '70px',    left: '150px', transform: 'rotate(-2deg)' } },
    { id: 'win2', src: '/motion%20design/caf%C3%A9.mp4', title: 'Café · Motion Design',  label: 'Café.mp4',       vertical: false, style: { top: '70px',    right: '80px', transform: 'rotate(3deg)'  } },
    { id: 'win3', src: '/motion%20design/Pepsihori.mp4', title: 'Pepsi · Motion Design', label: 'Pepsi.mp4',      vertical: false, style: { bottom: '60px', left: '150px', transform: 'rotate(-1deg)' } },
    { id: 'win4', src: '/motion%20design/velo.mp4', title: 'Vélo · Animation 2D',        label: 'Velo.mp4',       vertical: false, style: { bottom: '60px', right: '80px', transform: 'rotate(2deg)'  } },
  ]

  return (
    <>
      <style>{`
        body { background: #008080 !important; color: #F0EDE6; cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='24'%3E%3Cpath d='M2,1 L2,20 L6,15 L9,22 L12,21 L9,14 L15,14 Z' fill='white' stroke='black' stroke-width='1.5' stroke-linejoin='round' paint-order='stroke'/%3E%3C/svg%3E") 2 1, auto !important; }
        body::before { opacity: 0.08; }
        .cursor { display: none !important; }
        * { cursor: inherit !important; }
        a, button, .win98 { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='24'%3E%3Cpath d='M2,1 L2,20 L6,15 L9,22 L12,21 L9,14 L15,14 Z' fill='white' stroke='black' stroke-width='1.5' stroke-linejoin='round' paint-order='stroke'/%3E%3C/svg%3E") 2 1, pointer !important; }
        nav { background: rgba(0,80,80,0.75) !important; border-bottom-color: rgba(255,255,255,0.15) !important; height: 56px; }
      `}</style>

      <nav>
        <Link href="/" className="nav-back">← DT.</Link>
        <span className="nav-label">Animation &amp; Motion</span>
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

        {/* Windows 98 */}
        {wins.map(w => (
          <div key={w.id} className={`win98${w.vertical ? ' vertical' : ''}`} id={w.id} style={{ position: 'fixed', width: w.vertical ? '260px' : '430px', ...w.style }}>
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
          {wins.map(w => (
            <div key={`m-${w.id}`} className={`mobile-video-card${w.vertical ? ' vertical' : ''}`} onClick={() => openModal(w.src, w.title)} style={{cursor:'pointer'}}>
              <video src={w.src} autoPlay muted loop playsInline preload="none"></video>
              <span className="mobile-video-label">{w.label} ▶</span>
            </div>
          ))}
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
