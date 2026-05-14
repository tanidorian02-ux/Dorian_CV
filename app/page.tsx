'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  useEffect(() => {

    // Marquee pause
    const track = document.querySelector('.marquee-track') as HTMLElement | null
    if (track) {
      track.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused' })
      track.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running' })
    }

    // Scroll reveal
    const reveals = document.querySelectorAll<HTMLElement>('.reveal')
    reveals.forEach(el => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(20px)'
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease'
    })
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          el.classList.add('visible')
          observer.unobserve(el)
        }
      })
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' })
    reveals.forEach(el => observer.observe(el))
    setTimeout(() => {
      reveals.forEach(el => {
        if (!el.classList.contains('visible')) {
          el.style.opacity = '1'; el.style.transform = 'translateY(0)'
        }
      })
    }, 1500)

    // Nav scroll
    const nav = document.querySelector('nav')
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      <nav>
        <Link href="/" className="nav-logo">DT.</Link>
        <ul className="nav-links">
          <li><Link href="/web">Sites Web</Link></li>
          <li><Link href="/animation">Animation &amp; Motion</Link></li>
          <li><a href="#contact" className="nav-cta">Contact</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid"></div>
        <div className="hero-watermark" aria-hidden="true">
          <span className="wm-line wm-outline">DORIAN</span>
          <span className="wm-line wm-fill">TANI</span>
        </div>
        <div className="hero-blob"></div>
        <div className="hero-blob-2"></div>
        <aside className="hero-sticker" aria-hidden="true">
          <div className="hero-sticker-tag"><span>Note · 026</span><span>FR</span></div>
          <div className="hero-sticker-body">Du brief au déploiement, sans intermédiaire.</div>
          <div className="hero-sticker-foot"><span>Colfontaine</span><span>BE</span></div>
        </aside>
        <div className="hero-label"><span className="hero-status-dot"></span>Disponible · Belgique</div>
        <h1 className="hero-tagline-main">
          Du storyboard<br />au <span className="violet">déploiement.</span>
        </h1>
        <div className="hero-signature">— <span>Dorian Tani</span></div>
        <div className="hero-bottom-row">
          <div className="hero-roles">Developer<span>·</span>Animator<span>·</span>Builder</div>
          <div className="hero-ctas">
            <a href="#projects" className="btn-primary"><span>Voir mes projets ↓</span></a>
            <a href="#contact" className="btn-secondary">Me contacter →</a>
          </div>
        </div>
        <div className="hero-scroll"><div className="scroll-line"></div>Scroll</div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          {['Anthropic API','Voice Bots','Agents Autonomes','N8N','Supabase','RAG','Vercel','After Effects','Motion Design','Toon Boom','MCP Server','Animation 2D','Adobe Suite','Function Calling','Neobrutalism UI','SEO Géolocalisé',
            'Anthropic API','Voice Bots','Agents Autonomes','N8N','Supabase','RAG','Vercel','After Effects','Motion Design','Toon Boom','MCP Server','Animation 2D','Adobe Suite','Function Calling','Neobrutalism UI','SEO Géolocalisé'
          ].map((item, i) => (
            <div key={i} className="marquee-item"><span className="dot"></span>{item}</div>
          ))}
        </div>
      </div>

      {/* DUALITÉ */}
      <section className="duality reveal">
        <div className="duality-inner">
          <div className="duality-title">Conçu.<br />Codé.<br /><span className="violet">Déployé.</span></div>
          <div className="duality-body">
            <strong>Un seul interlocuteur du brief au déploiement.</strong> Je conçois, code et livre des outils IA, des automatisations et des interfaces utilisées par de vrais utilisateurs — pas des prototypes qui impressionnent en démo et s'arrêtent là.
          </div>
        </div>
        <div className="duality-callout">
          Mon background visuel change la qualité du produit livré : des interfaces que vos utilisateurs <strong>comprennent dès la première seconde.</strong>
        </div>
      </section>

      {/* SERVICES */}
      <section className="what-i-do reveal">
        <div className="section-label">Capacités — 06 domaines</div>
        <h2 className="what-title">Ce que je peux<br /><span className="violet">construire.</span></h2>
        <p className="services-intro">Des systèmes IA <strong>utilisables</strong> — pas des démos,<br />des outils déployés en production.</p>
        <div className="services-grid services-grid-2">
          {[
            { n:'01', t:'Voice Bots\nIA', d:'Agents vocaux multilingues capables de répondre, guider et automatiser des interactions clients — FR, EN, NL.', tags:['STT · TTS','LLM','ElevenLabs','Vercel'] },
            { n:'02', t:'Automatisa-\ntion', d:'Workflows automatisés pour réduire les tâches répétitives et connecter vos outils existants sans friction.', tags:['N8N','APIs','CRM','PDF · Emails'] },
            { n:'03', t:'Intégration\nAPI', d:'Connexion entre services, IA et bases de données pour créer des outils opérationnels rapidement.', tags:['REST APIs','Supabase','Webhooks','JSON'] },
            { n:'04', t:'Agents\nIA', d:"Agents capables d'exécuter des actions, rechercher des données et orchestrer plusieurs outils automatiquement.", tags:['RAG','Function Calling','MCP','Claude · OpenAI'] },
            { n:'05', t:'Outils\nMétiers', d:'Outils internes simples et rapides pour PME, artisans et startups — adaptés à votre flux de travail réel.', tags:['Dashboard','Génération PDF','Base de données'] },
            { n:'06', t:'Sites &\nInterfaces', d:'Landing pages et interfaces modernes pensées pour être comprises et converties — du design au déploiement.', tags:['UI','SEO','Vercel','Responsive'] },
          ].map((s, i) => (
            <div key={i} className="service-item" data-bignum={s.n}>
              <span className="service-num">{s.n} — {s.t.split('\n')[0]} {s.t.split('\n')[1]}</span>
              <h3 className="service-title">{s.t.split('\n')[0]}<br />{s.t.split('\n')[1]}</h3>
              <p className="service-desc">{s.d}</p>
              <div className="service-tags">{s.tags.map((tag,j) => <span key={j} className="tag">{tag}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJETS TEASER */}
      <section className="projects reveal" id="projects">
        <div className="section-label">Projets — Clients réels en cours</div>
        <div className="projects-teaser-inner">
          <h2 className="projects-title">Ce que<br />je <span className="violet">construis.</span></h2>
          <div>
            <Link href="/web" className="project-mini">
              <span className="project-mini-num">01</span>
              <span className="project-mini-name">Camille Charleroi</span>
              <span className="project-mini-type">Voice Bot IA<br />Secteur Public</span>
            </Link>
            <Link href="/web" className="project-mini">
              <span className="project-mini-num">02</span>
              <span className="project-mini-name">Next Business</span>
              <span className="project-mini-type">Refonte Web<br />Chatbot IA</span>
            </Link>
            <Link href="/web" className="projects-see-all">Voir les projets complets <span className="arr">→</span></Link>
          </div>
        </div>
      </section>

      {/* PORTAILS */}
      <section className="portals-section reveal">
        <div className="section-label">Explorer — 02 univers</div>
        <h2 className="section-heading">Choisissez<br />votre <span className="violet">univers.</span></h2>
        <div className="portals">
          <Link href="/web" className="portal portal-web">
            <div className="portal-top">
              <span className="portal-index">Portail / 01</span>
              <span className="portal-arrow-corner" aria-hidden="true">↗</span>
            </div>
            <div className="portal-label">Développement Web</div>
            <h3 className="portal-title">Sites<br /><i>Web.</i></h3>
            <div className="portal-preview-grid" aria-hidden="true">
              <div className="pcell solid-violet">01</div><div className="pcell">api</div>
              <div className="pcell">bot</div><div className="pcell solid-ink">vrcl</div>
              <div className="pcell">ui</div><div className="pcell solid-bg">seo</div>
              <div className="pcell">n8n</div><div className="pcell">02</div>
            </div>
            <div className="portal-tags">
              {['Voice Bots','Agents IA','Refonte Web','Automatisation'].map((t,i) => <span key={i} className="portal-tag">{t}</span>)}
            </div>
            <div className="portal-cta"><span>Voir les projets</span><span className="portal-cta-circle">→</span></div>
            <span className="portal-bg-num" aria-hidden="true">01</span>
          </Link>
          <Link href="/animation" className="portal portal-anim">
            <div className="portal-top">
              <span className="portal-index">Portail / 02</span>
              <span className="portal-arrow-corner" aria-hidden="true">↗</span>
            </div>
            <div className="portal-label">Motion &amp; Animation</div>
            <h3 className="portal-title">Animation<br />&amp; <i>Motion</i>.</h3>
            <div className="portal-preview-grid" aria-hidden="true">
              <div className="pcell">ae</div><div className="pcell solid-orange">2d</div>
              <div className="pcell">tb</div><div className="pcell">rig</div>
              <div className="pcell solid-bg">fx</div><div className="pcell">lottie</div>
              <div className="pcell solid-orange">▶</div><div className="pcell">4k</div>
            </div>
            <div className="portal-tags">
              {['Motion Design','After Effects','Toon Boom','Rigging'].map((t,i) => <span key={i} className="portal-tag">{t}</span>)}
            </div>
            <div className="portal-cta"><span>Voir les animations</span><span className="portal-cta-circle">→</span></div>
            <span className="portal-bg-num" aria-hidden="true">02</span>
          </Link>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact reveal" id="contact">
        <div className="contact-left">
          <div className="section-label">Contact — Travaillons ensemble</div>
          <h2 className="contact-title">Disponible<br />pour <span className="violet">vous.</span></h2>
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
        <span className="footer-copy">Developer · Animator · Builder</span>
      </footer>
    </>
  )
}
