import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ setView: propSetView }) => {
  const navigate = useNavigate();
  const setView = propSetView || ((viewName) => {
    if (viewName === 'landing') navigate('/home');
    else if (viewName === 'arena') navigate('/battel');
    else navigate(`/${viewName}`);
  });
  const [isLightMode, setIsLightMode] = useState(false);
  const [indianTime, setIndianTime] = useState('');
  const [hoveredWord, setHoveredWord] = useState(null);
  const [trailLogos, setTrailLogos] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const logoIndex = useRef(0);
  const heroRef = useRef(null);

  const logoList = [
    '/logos/GPT_2.png',
    '/logos/claude.png',
    '/logos/gemini.png',
    '/logos/deepseek.png',
    '/logos/mistral.png',
    '/logos/cohere.png',
    '/logos/groq.svg'
  ];

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - lastPos.current.x;
    const dy = y - lastPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only spawn logo if cursor moved at least 50px
    if (distance > 50) {
      const id = Date.now() + Math.random();
      const src = logoList[logoIndex.current % logoList.length];
      logoIndex.current += 1;
      lastPos.current = { x, y };

      setTrailLogos((prev) => [...prev, { id, x, y, src }]);

      // Remove the logo after 800ms
      setTimeout(() => {
        setTrailLogos((prev) => prev.filter((logo) => logo.id !== id));
      }, 800);
    }
  };

  // Update India clock every second
  useEffect(() => {
    const updateClock = () => {
      const timeString = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
      });
      setIndianTime(timeString);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`namma-container ${isLightMode ? 'namma-light' : 'namma-dark'}`}>
      
      {/* Header */}
      <header className="namma-header">
        <div className="namma-header-left">
          <button 
            className={`namma-hamburger-btn ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Navigation"
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
          <a href="#" className="namma-logo" onClick={(e) => { e.preventDefault(); setView('landing'); }}>
            AI BATTLE ARENA
          </a>
        </div>
        <div className="namma-header-center desktop-nav">
          <button 
            className="namma-header-btn" 
            onClick={() => setIsLightMode(!isLightMode)}
          >
            {isLightMode ? 'DARK MODE' : 'LIGHT MODE'}
          </button>
          <a href="#battles" className="namma-header-btn">
            BATTLES
          </a>
          <a href="#" className="namma-header-btn" onClick={(e) => { e.preventDefault(); setView('leaderboard'); }}>
            LEADERBOARD
          </a>
          <a href="#" className="namma-header-btn" onClick={(e) => { e.preventDefault(); setView('prompts'); }}>
            PROMPTS
          </a>
          <a href="#capabilities" className="namma-header-btn">
            CAPABILITIES
          </a>
        </div>
        <div className="namma-header-right desktop-nav">
          <button className="namma-talk-btn" onClick={() => setView('arena')}>
            LET'S FIGHT!
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="namma-mobile-menu">
            <button 
              className="namma-mobile-menu-btn" 
              onClick={() => { setIsLightMode(!isLightMode); setIsMenuOpen(false); }}
            >
              {isLightMode ? 'DARK MODE' : 'LIGHT MODE'}
            </button>
            <a href="#battles" className="namma-mobile-menu-btn" onClick={() => setIsMenuOpen(false)}>
              BATTLES
            </a>
            <a href="#" className="namma-mobile-menu-btn" onClick={(e) => { e.preventDefault(); setView('leaderboard'); setIsMenuOpen(false); }}>
              LEADERBOARD
            </a>
            <a href="#" className="namma-mobile-menu-btn" onClick={(e) => { e.preventDefault(); setView('prompts'); setIsMenuOpen(false); }}>
              PROMPTS
            </a>
            <a href="#capabilities" className="namma-mobile-menu-btn" onClick={() => setIsMenuOpen(false)}>
              CAPABILITIES
            </a>
            <button className="namma-mobile-menu-talk-btn" onClick={() => { setView('arena'); setIsMenuOpen(false); }}>
              LET'S FIGHT!
            </button>
          </div>
        )}
      </header>

      {/* Scrollable Content Wrapper */}
      <div className="namma-scroll-wrapper">

        {/* Section 1: Hero Headline */}
        <section 
          className="namma-hero"
          ref={heroRef}
          onMouseMove={handleMouseMove}
        >
          {trailLogos.map((logo) => (
            <img
              key={logo.id}
              src={logo.src}
              className="trail-logo"
              style={{
                left: `${logo.x}px`,
                top: `${logo.y}px`,
              }}
              alt="AI Logo"
            />
          ))}
          <div className="hero-text-wrap">
            <h1 
              className="hero-line"
              onMouseEnter={() => setHoveredWord('compare')}
              onMouseLeave={() => setHoveredWord(null)}
              onClick={() => setView('arena')}
            >
              WE COMPARE
            </h1>
            <h1 
              className="hero-line"
              onMouseEnter={() => setHoveredWord('battle')}
              onMouseLeave={() => setHoveredWord(null)}
              onClick={() => setView('arena')}
            >
              BATTLE AND
            </h1>
            <h1 
              className="hero-line"
              onMouseEnter={() => setHoveredWord('benchmark')}
              onMouseLeave={() => setHoveredWord(null)}
              onClick={() => setView('arena')}
            >
              BENCHMARK
            </h1>
          </div>
          
          <div className="hero-caption">
            <span>WE RUN RAPID BATTLES & DEEP LLM EVALUATIONS.</span>
          </div>
        </section>

        {/* Section 2: Introduction Statement */}
        <section className="namma-intro-section">
          <div className="intro-grid">
            <div className="intro-left">
              <span className="section-label">01 / CONCEPT</span>
              <h2 className="serif-title">Interactive playground evaluating premium LLMs</h2>
            </div>
            <div className="intro-right">
              <p className="intro-text">
                It’s never “just a prompt.” Every parameter matters. We evaluate completions.
                Your models. Our obsession. Your logic. Our playground.
              </p>
              <div className="intro-bullets">
                <span> ULTRA-FAST BENCHMARKS</span>
                <span> UNBIASED EVALUATIONS</span>
                <span> NODE-BASED GRAPH</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Selected Projects Grid */}
        <section id="battles" className="namma-projects-section">
          <div className="section-header">
            <span className="section-label">02 / BATTLES</span>
            <h2 className="section-title-large">FEATURED BATTLES</h2>
          </div>
          <div className="projects-grid">
            
            {/* Project 1 */}
            <div className="project-card" onClick={() => setView('arena')}>
              <div className="project-media-placeholder">
                <svg className="blueprint-svg" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                  <defs>
                    <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.07)" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <path d="M 60 120 L 140 120 M 140 120 L 195 70 M 140 120 L 195 170 M 295 70 L 340 120 M 295 170 L 340 120" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                  <circle cx="60" cy="120" r="24" stroke="rgba(255,255,255,0.25)" fill="#1e1f22" strokeWidth="1.5" />
                  <text x="60" y="124" fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="middle" fontFamily="Space Mono">PROMPT</text>
                  
                  {/* Claude Node */}
                  <rect x="195" y="50" width="100" height="40" rx="4" stroke="rgba(255,255,255,0.25)" fill="#1e1f22" strokeWidth="1.5" />
                  <image href="/logos/claude.png" x="203" y="60" width="20" height="20" />
                  <text x="256" y="74" fill="rgba(255,255,255,0.7)" fontSize="9" fontFamily="Space Mono">CLAUDE</text>
                  
                  {/* GPT Node */}
                  <rect x="195" y="150" width="100" height="40" rx="4" stroke="rgba(255,255,255,0.25)" fill="#1e1f22" strokeWidth="1.5" />
                  <image href="/logos/GPT_2.png" x="203" y="160" width="20" height="20" />
                  <text x="256" y="174" fill="rgba(255,255,255,0.7)" fontSize="9" fontFamily="Space Mono">GPT-4O</text>
                  
                  {/* Judge Node */}
                  <circle cx="340" cy="120" r="24" stroke="rgba(255,255,255,0.25)" fill="#1e1f22" strokeWidth="1.5" />
                  <image href="/logos/gemini.png" x="329" y="109" width="22" height="22" />
                  <text x="140" y="110" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="Space Mono">FIG. 1</text>
                  <text x="310" y="150" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="Space Mono">FIG. 2</text>
                </svg>
                <span className="play-hint">LAUNCH ARENA</span>
              </div>
              <div className="project-meta">
                <span className="project-name">CLAUDE 3.5 VS GPT-4O</span>
                <span className="project-desc">CLASH OF LOGIC AND ARTISTIC SYNTAX</span>
              </div>
            </div>

            {/* Project 2 */}
            <div className="project-card" onClick={() => setView('arena')}>
              <div className="project-media-placeholder">
                <svg className="blueprint-svg" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <circle cx="200" cy="120" r="60" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <path d="M 100 120 L 140 120 M 260 120 L 300 120" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                  <rect x="60" y="100" width="80" height="40" rx="4" stroke="rgba(255,255,255,0.25)" fill="#1e1f22" strokeWidth="1.5" />
                  <text x="100" y="124" fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="middle" fontFamily="Space Mono">INPUT</text>
                  
                  {/* Central DeepSeek Node */}
                  <circle cx="200" cy="120" r="24" stroke="rgba(255,255,255,0.25)" fill="#1e1f22" strokeWidth="1.5" />
                  <image href="/logos/deepseek.png" x="189" y="109" width="22" height="22" />
                  
                  <circle cx="200" cy="50" r="20" stroke="rgba(255,255,255,0.25)" fill="#1e1f22" strokeWidth="1.5" />
                  <text x="200" y="54" fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="middle" fontFamily="Space Mono">MATH</text>
                  
                  <circle cx="200" cy="190" r="20" stroke="rgba(255,255,255,0.25)" fill="#1e1f22" strokeWidth="1.5" />
                  <text x="200" y="194" fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="middle" fontFamily="Space Mono">LOGIC</text>
                  
                  <rect x="260" y="100" width="80" height="40" rx="4" stroke="rgba(255,255,255,0.25)" fill="#1e1f22" strokeWidth="1.5" />
                  <text x="300" y="124" fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="middle" fontFamily="Space Mono">TEST</text>
                  <text x="200" y="156" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle" fontFamily="Space Mono">DEEPSEEK V3</text>
                </svg>
                <span className="play-hint">LAUNCH ARENA</span>
              </div>
              <div className="project-meta">
                <span className="project-name">DEEPSEEK V3 STRESS TEST</span>
                <span className="project-desc">LIMIT TESTING A GIANT REASONER</span>
              </div>
            </div>

            {/* Project 3 */}
            <div className="project-card" onClick={() => setView('arena')}>
              <div className="project-media-placeholder">
                <svg className="blueprint-svg" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <path d="M 200 65 L 200 180 M 120 80 L 280 80 M 120 80 L 120 120 M 280 80 L 280 120 M 160 180 L 240 180" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                  <rect x="90" y="120" width="60" height="30" rx="2" stroke="rgba(255,255,255,0.25)" fill="#1e1f22" strokeWidth="1.5" />
                  <text x="120" y="138" fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="middle" fontFamily="Space Mono">OUT 1</text>
                  <rect x="250" y="120" width="60" height="30" rx="2" stroke="rgba(255,255,255,0.25)" fill="#1e1f22" strokeWidth="1.5" />
                  <text x="280" y="138" fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="middle" fontFamily="Space Mono">OUT 2</text>
                  
                  {/* Gemini Judge Node */}
                  <circle cx="200" cy="48" r="18" stroke="rgba(255,255,255,0.25)" fill="#1e1f22" strokeWidth="1.5" />
                  <image href="/logos/gemini.png" x="189" y="37" width="22" height="22" />
                  
                  <text x="200" y="95" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle" fontFamily="Space Mono">GEMINI JUDGE</text>
                </svg>
                <span className="play-hint">LAUNCH ARENA</span>
              </div>
              <div className="project-meta">
                <span className="project-name">GEMINI FLASH JUDGMENT</span>
                <span className="project-desc">SUB-SECOND QUALITATIVE SCORING</span>
              </div>
            </div>

            {/* Project 4 */}
            <div className="project-card" onClick={() => setView('arena')}>
              <div className="project-media-placeholder">
                <svg className="blueprint-svg" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <path d="M 40 120 L 360 120 M 120 100 L 120 140 M 200 100 L 200 140 M 280 100 L 280 140" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                  
                  {/* Groq LPU Circle */}
                  <circle cx="70" cy="120" r="20" stroke="rgba(255,255,255,0.25)" fill="#1e1f22" strokeWidth="1.5" />
                  <image href="/logos/groq.svg" x="59" y="109" width="22" height="22" />
                  
                  <circle cx="160" cy="120" r="20" stroke="rgba(255,255,255,0.25)" fill="#1e1f22" strokeWidth="1.5" />
                  <text x="160" y="124" fill="rgba(255,255,255,0.6)" fontSize="8" textAnchor="middle" fontFamily="Space Mono">300+</text>
                  <circle cx="250" cy="120" r="20" stroke="rgba(255,255,255,0.25)" fill="#1e1f22" strokeWidth="1.5" />
                  <text x="250" y="124" fill="rgba(255,255,255,0.6)" fontSize="8" textAnchor="middle" fontFamily="Space Mono">TPS</text>
                  <circle cx="330" cy="120" r="20" stroke="rgba(255,255,255,0.25)" fill="#1e1f22" strokeWidth="1.5" />
                  <text x="330" y="124" fill="rgba(255,255,255,0.6)" fontSize="8" textAnchor="middle" fontFamily="Space Mono">OUT</text>
                  <text x="200" y="70" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle" fontFamily="Space Mono">GROQ LPU RUN</text>
                </svg>
                <span className="play-hint">LAUNCH ARENA</span>
              </div>
              <div className="project-meta">
                <span className="project-name">GROQ FLAME RUN</span>
                <span className="project-desc">70B LLAMA SPITTING 300+ TPS</span>
              </div>
            </div>

          </div>
        </section>

        {/* Section 4: Services */}
        <section id="capabilities" className="namma-services-section">
          <div className="services-grid">
            <div className="services-left">
              <span className="section-label">03 / CAPABILITIES</span>
              <h2 className="serif-title">Our Capabilities</h2>
              <p className="services-subtext">Benchmark with us if average completions aren't your thing.</p>
            </div>
            <div className="services-right">
              <div className="service-row">
                <span className="service-num">01</span>
                <span className="service-name">DRAG-AND-DROP NODE GRAPH</span>
              </div>
              <div className="service-row">
                <span className="service-num">02</span>
                <span className="service-name">MULTI-PROVIDER API ROUTING</span>
              </div>
              <div className="service-row">
                <span className="service-num">03</span>
                <span className="service-name">AUTOMATED JUDGE EVALUATION</span>
              </div>
              <div className="service-row">
                <span className="service-num">04</span>
                <span className="service-name">REAL-TIME METRIC SCORING</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Call to Action */}
        <section className="namma-cta-section">
          <span className="section-label">04 / BATTLEGROUND</span>
          <h2 className="cta-headline">Let's run a battle</h2>
          <p className="cta-paragraph">Draft your prompt, we'll run it! Ready to launch the arena?</p>
          <button className="cta-huge-btn" onClick={() => setView('arena')}>
            LAUNCH BATTLE ARENA →
          </button>
        </section>

        {/* Detailed Footer */}
        <footer className="namma-footer-extended">
          <div className="footer-grid">
            <div className="footer-col">
              <span className="footer-title">AI BATTLE ARENA</span>
              <a href="mailto:battle@arena.ai" className="footer-mail">battle@arena.ai</a>
            </div>
            <div className="footer-col">
              <span className="footer-title">NAV</span>
              <div className="footer-links">
                <a href="#battles">BATTLES</a>
                <a href="#capabilities">CAPABILITIES</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setView('arena'); }}>ARENA</a>
              </div>
            </div>
            <div className="footer-col">
              <span className="footer-title">LLM PARTNERS</span>
              <div className="footer-links">
                <a href="https://openai.com" target="_blank" rel="noreferrer">OPENAI</a>
                <a href="https://anthropic.com" target="_blank" rel="noreferrer">ANTHROPIC</a>
                <a href="https://groq.com" target="_blank" rel="noreferrer">GROQ CLOUD</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© AI BATTLE ARENA. ALL RIGHTS RESERVED.</span>
            <span>GUJARAT, INDIA {indianTime}</span>
          </div>
        </footer>

      </div>

    </div>
  );
};

export default Home;
