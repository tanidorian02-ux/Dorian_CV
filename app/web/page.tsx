'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Web() {
  useEffect(() => {
    // Scroll reveal
    const reveals = document.querySelectorAll<HTMLElement>('.reveal')
    reveals.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; el.style.transition = 'opacity 0.7s ease, transform 0.7s ease' })
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { const el = e.target as HTMLElement; el.style.opacity='1'; el.style.transform='translateY(0)'; obs.unobserve(el) } })
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' })
    reveals.forEach(el => obs.observe(el))
    setTimeout(() => reveals.forEach(el => { el.style.opacity='1'; el.style.transform='translateY(0)' }), 1500)
    const nav = document.querySelector('nav')
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll) }
  }, [])

  return (
    <>
      <nav>
        <Link href="/" className="nav-back">← DT.</Link>
        <ul className="nav-links">
          <li><Link href="/web" className="active">Sites Web</Link></li>
          <li><Link href="/animation">Animation &amp; Motion</Link></li>
          <li><a href="/#contact" className="nav-cta">Contact</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero" style={{minHeight:'75vh',borderBottom:'1px solid var(--border)'}}>
        <div className="hero-watermark" aria-hidden="true">WEB</div>
        <div className="hero-blob"></div>
        <div className="hero-label">Sites Web — Projets &amp; exercices</div>
        <h1 className="hero-title">
          Sites Web<br />&amp; <span className="violet">Voice Bot.</span>
        </h1>
        <div className="hero-bottom">
          <p className="hero-sub">De la landing page à l&apos;agent IA — des produits conçus, codés et déployés.</p>
          <div className="hero-count"><strong>5+</strong>projets réalisés</div>
        </div>
      </section>

      {/* PROJETS RÉELS */}
      <section className="real-projects reveal">
        <div className="section-label">Clients réels — 02 projets</div>
        <h2 className="section-title">Ce que je <span className="violet">construis.</span></h2>

        {/* Camille */}
        <div className="project-feature" data-num="01">
          <div className="project-feature-info">
            <div className="project-feature-meta">
              <span className="num">01</span>Ville de Charleroi — Secteur Public
            </div>
            <h3 className="project-feature-name">Camille<br />Charleroi</h3>
            <p className="project-feature-desc">Voice bot secrétaire pour la Ville de Charleroi. Pipeline STT→LLM→TTS, trilingue FR/EN/NL. Aperçu disponible sur demande.</p>
            <div className="project-feature-tags">
              {['Voice Bot','Anthropic API','ElevenLabs','STT · TTS','Trilingue','Vercel'].map((t,i)=><span key={i} className="ptag">{t}</span>)}
            </div>
            <a href="https://camille-charleroi-ybuw.vercel.app/" target="_blank" rel="noopener noreferrer" className="project-feature-link"><span>Voir l&apos;aperçu ↗</span></a>
          </div>
          <div className="project-feature-visual">
            <div className="browser-chrome">
              <span className="dot red"></span><span className="dot yel"></span><span className="dot grn"></span>
              <span className="url">camille-charleroi.vercel.app</span>
            </div>
            <div className="img-wrap">
              <Image src="/picture/camille-preview.png" alt="Camille Charleroi" width={800} height={500} />
              <div className="project-feature-visual-overlay"></div>
            </div>
          </div>
        </div>

        {/* Next Business */}
        <div className="project-feature" data-num="02">
          <div className="project-feature-info">
            <div className="project-feature-meta">
              <span className="num">02</span>Next Business — Réseau B2B
            </div>
            <h3 className="project-feature-name">Next<br />Business</h3>
            <p className="project-feature-desc">Refonte complète, chatbot IA et SEO géolocalisé. Interface néobrutalism — du design au déploiement. Aperçu disponible sur demande.</p>
            <div className="project-feature-tags">
              {['Refonte Complète','Chatbot IA','SEO Géolocalisé','Neobrutalism UI','Vercel'].map((t,i)=><span key={i} className="ptag">{t}</span>)}
            </div>
            <a href="https://nexus-nine-drab.vercel.app/" target="_blank" rel="noopener noreferrer" className="project-feature-link"><span>Voir l&apos;aperçu ↗</span></a>
          </div>
          <div className="project-feature-visual">
            <div className="browser-chrome">
              <span className="dot red"></span><span className="dot yel"></span><span className="dot grn"></span>
              <span className="url">next-business.vercel.app</span>
            </div>
            <div className="img-wrap">
              <Image src="/picture/dd2-preview-1.png" alt="Next Business" width={800} height={500} />
              <div className="project-feature-visual-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* EXERCICES CRÉATIFS */}
      <section className="creative reveal">
        <div className="section-label">Exercices créatifs — Landing pages fictives</div>
        <h2 className="section-title">Terrain de <span className="violet">jeu.</span></h2>
        <div className="creative-grid">
          {[
            { href:'/web_site/Nokabowl.html', cls:'', preview:'preview-noka', badge:'Brand · Food', title:'NOKA', type:'Food & Delivery', name:'Noka Bowl', desc:"Landing page fictive pour une marque de bowls frais.", tags:['Neobrutalism','Green'], disabled:false },
            { href:'/alsole/alsole.html', cls:'', preview:'preview-alsole', badge:'Editorial', title:'AL SOLE', type:'Restaurant · Trattoria', name:'Al Sole', desc:'Landing fictive pour une trattoria italienne.', tags:['Editorial','Food'], disabled:false },
            { href:'/web_site/mindsync-homepage.html', cls:'', preview:'preview-mindsync', badge:'IA · Dark UI', title:'MIND', type:'IA · Génération', name:'MindSync', desc:'Landing dark mode pour un outil IA de contenu.', tags:['Dark Mode','IA'], disabled:false },
            { href:'/web_site/flowy-homepage.html', cls:'', preview:'preview-flowly', badge:'SaaS · B2B', title:'FLOWLY', type:'SaaS · Automatisation', name:'Flowly', desc:"Homepage fictive pour un outil SaaS d'automatisation.", tags:['SaaS','Blue'], disabled:false },
            { href:'#', cls:'', preview:'preview-soon', badge:'À venir', title:'+', type:'Nouveau projet', name:'En brief', desc:'Nouveaux projets en cours de brief — à venir prochainement.', tags:['2025'], disabled:true },
          ].map((c,i) => {
            const cls = `creative-card ${c.cls} ${c.disabled?'disabled':''}`.trim()
            const inner = (
              <>
                <div className={`creative-card-preview ${c.preview}`}>
                  <span className="creative-card-badge">{c.badge}</span>
                  <span className="creative-card-preview-title">{c.title}</span>
                </div>
                <div className="creative-card-body">
                  <span className="creative-card-type">{c.type}</span>
                  <h3 className="creative-card-name">{c.name}</h3>
                  <p className="creative-card-desc">{c.desc}</p>
                  <div className="creative-card-footer">
                    <div className="creative-card-tags">{c.tags.map((t,j)=><span key={j} className="ctag">{t}</span>)}</div>
                    {!c.disabled && <span className="creative-card-arrow">↗</span>}
                  </div>
                </div>
              </>
            )
            return c.disabled
              ? <div key={i} className={cls}>{inner}</div>
              : <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
          })}
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact reveal">
        <div className="contact-left">
          <div className="section-label">Contact — Travaillons ensemble</div>
          <h2 className="contact-title">Disponible pour <span className="violet">vous.</span></h2>
        </div>
        <div className="contact-right">
          <a href="mailto:tani.dorian02@gmail.com" className="contact-email"><span>tani.dorian02@gmail.com</span><span>→</span></a>
          <div className="contact-links">
            <a href="https://github.com/tanidorian02-ux" target="_blank" rel="noopener noreferrer" className="contact-link">GitHub</a>
            <a href="https://www.linkedin.com/in/dorian-tani/" target="_blank" rel="noopener noreferrer" className="contact-link">LinkedIn</a>
            <a href="tel:+32484943651" className="contact-link">+32 484 943 651</a>
          </div>
        </div>
      </section>
      <footer>
        <span className="footer-copy">© 2025 Dorian Tani — Colfontaine, Belgique</span>
        <Link href="/">← Retour au portfolio</Link>
      </footer>
    </>
  )
}
