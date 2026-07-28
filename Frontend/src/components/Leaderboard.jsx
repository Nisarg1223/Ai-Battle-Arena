import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

const Leaderboard = ({ setView, MODELS_LIST }) => {
  const [countdown, setCountdown] = useState({ days: 12, hours: 6, minutes: 42, seconds: 59 });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (num) => String(num).padStart(2, '0');

  // Static leaderboard data mapping the Pinterest UI structure
  const globalStandings = [
    { rank: 1, name: 'Claude 3.5 Sonnet', provider: 'Anthropic', handle: '@anthropic', wins: 443, matches: 778, successRate: '94.2%', speed: '1.2s', elo: 44872, icon: '/logos/claude.png', id: '1587667', victories: 43, bestWin: '1:05' },
    { rank: 2, name: 'OpenAI GPT-4o', provider: 'OpenAI', handle: '@openai', wins: 440, matches: 887, successRate: '92.5%', speed: '1.1s', elo: 42515, icon: '/logos/GPT_2.png', id: '1587634', victories: 43, bestWin: '1:03' },
    { rank: 3, name: 'Gemini 3.5 Flash', provider: 'Google', handle: '@google', wins: 412, matches: 756, successRate: '90.4%', speed: '0.8s', elo: 40550, icon: '/logos/gemini.png', id: '1587699', victories: 43, bestWin: '1:15' },
    { rank: 4, name: 'DeepSeek V3', provider: 'DeepSeek', handle: '@deepseek', wins: 398, matches: 720, successRate: '88.7%', speed: '1.5s', elo: 38210, icon: '/logos/deepseek.png', id: '1587712', victories: 40, bestWin: '1:24' },
    { rank: 5, name: 'Mistral Medium', provider: 'Mistral', handle: '@mistral', wins: 375, matches: 810, successRate: '84.3%', speed: '1.4s', elo: 35430, icon: '/logos/mistral.png', id: '1587789', victories: 38, bestWin: '1:45' },
    { rank: 6, name: 'Cohere Command', provider: 'Cohere', handle: '@cohere', wins: 342, matches: 790, successRate: '81.2%', speed: '1.3s', elo: 32180, icon: '/logos/cohere.png', id: '1587823', victories: 35, bestWin: '1:38' },
    { rank: 7, name: 'Groq Llama 3.3', provider: 'Groq', handle: '@groq', wins: 320, matches: 690, successRate: '79.5%', speed: '0.3s', elo: 29500, icon: '/logos/groq.svg', id: '1587901', victories: 32, bestWin: '0:35' },
  ];

  return (
    <div className="leaderboard-page-container">
      {/* 1. Far-Left Narrow Icon Sidebar */}
      <aside className="icon-sidebar">
        <div className="sidebar-top-icons">
          <div className="logo-container" onClick={() => setView('landing')} style={{ cursor: 'pointer' }} title="Go to Home">
            <svg viewBox="0 0 32 32" className="logo-svg">
              <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 4c5.523 0 10 4.477 10 10 0 1.63-.39 3.17-1.08 4.54l-1.84-1.84c.59-.83.92-1.82.92-2.7 0-2.76-2.24-5-5-5-.88 0-1.87.33-2.7.92l-1.84-1.84C12.83 6.39 14.37 6 16 6zm-5.46 3.46l1.84 1.84C11.55 12.13 11 13.5 11 15c0 2.76 2.24 5 5 5 1.5 0 2.87-.55 3.7-1.38l1.84 1.84C20.17 21.83 18.2 22 16 22c-3.87 0-7-3.13-7-7 0-2.2.17-4.17 1.54-5.54zm-2.08 6.08L6.62 17.38c-.39-.83-.62-1.74-.62-2.7 0-5.52 4.48-10 10-10 .96 0 1.87.23 2.7.62l-1.84 1.84c-.28-.15-.57-.28-.86-.38-4.42 0-8 3.58-8 8z" />
            </svg>
          </div>
          <div className="sidebar-icon" onClick={() => setView('arena')} style={{ cursor: 'pointer' }} title="Arena Workspace">
            <span>🎛️</span>
          </div>
          <div className="sidebar-icon active" onClick={() => setView('leaderboard')} style={{ cursor: 'pointer' }} title="Leaderboard">
            <span>📊</span>
          </div>
          <div className="sidebar-icon">
            <span>🗺️</span>
          </div>
          <div className="sidebar-icon">
            <span>⚙️</span>
          </div>
        </div>
        <div className="sidebar-bottom-icons">
          <div className="profile-avatar">N</div>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <main className="leaderboard-main">
        {/* Header bar */}
        <header className="leaderboard-header">
          <div className="header-left-title">
            <span className="back-arrow-btn" onClick={() => setView('landing')} title="Go back to Home">‹</span>
            <h1>Leaderboard</h1>
          </div>
          <div className="header-right-meta">
            <div className="search-box-wrap">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search models, rankings..." className="search-input" />
            </div>
            <div className="notification-bell">🔔</div>
            <div className="profile-badge">
              <div className="profile-avatar-small">N</div>
              <span className="profile-name">Nisarg</span>
              <span className="profile-dropdown-arrow">▼</span>
            </div>
          </div>
        </header>

        {/* Inner Scrollable Panel */}
        <div className="leaderboard-scrollable-content">
          
          {/* Top Info Cards */}
          <div className="top-stats-row">
            <div className="stat-card">
              <div className="stat-card-left">
                <span className="stat-label">Total Battles Run</span>
                <span className="stat-value">12,785</span>
              </div>
              <div className="stat-icon-wrap green-bg">
                <span>📈</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-left">
                <span className="stat-label">Total Participating LLMs</span>
                <span className="stat-value">18 Models</span>
              </div>
              <div className="stat-icon-wrap blue-bg">
                <span>🌐</span>
              </div>
            </div>

            <div className="stat-card countdown-card">
              <div className="countdown-info">
                <span className="stat-label">Remaining time for evaluation🔥</span>
                <span className="countdown-subtext">Only the top 3 positions will be awarded the Golden Aura badge</span>
              </div>
              <div className="countdown-timer">
                <div className="time-unit">
                  <span className="time-num">{formatNum(countdown.days)}</span>
                  <span className="time-lbl">DAYS</span>
                </div>
                <span className="time-separator">:</span>
                <div className="time-unit">
                  <span className="time-num">{formatNum(countdown.hours)}</span>
                  <span className="time-lbl">HRS</span>
                </div>
                <span className="time-separator">:</span>
                <div className="time-unit">
                  <span className="time-num">{formatNum(countdown.minutes)}</span>
                  <span className="time-lbl">MINS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Podium Top 3 Cards */}
          <div className="podium-row">
            
            {/* Rank 1 Card (Highlighted Gold) */}
            <div className="podium-card first-place">
              <div className="podium-header">
                <div className="avatar-wrapper">
                  <img src={globalStandings[0].icon} alt="Claude" className="podium-avatar" />
                  <span className="rank-badge gold-bg">1</span>
                </div>
                <div className="podium-model-info">
                  <span className="model-name">{globalStandings[0].name}</span>
                  <span className="model-handle">{globalStandings[0].handle}</span>
                </div>
                <div className="medal-icon-gold">
                  <div className="gold-medal">
                    <span className="medal-star">★</span>
                  </div>
                </div>
              </div>
              <div className="podium-stats-grid">
                <div className="p-stat">
                  <span className="p-stat-lbl">WINS</span>
                  <span className="p-stat-val">{globalStandings[0].wins}</span>
                </div>
                <div className="p-stat">
                  <span className="p-stat-lbl">MATCHES</span>
                  <span className="p-stat-val">{globalStandings[0].matches}</span>
                </div>
                <div className="p-stat">
                  <span className="p-stat-lbl">POINTS</span>
                  <span className="p-stat-val font-accent-gold">{globalStandings[0].elo.toLocaleString()}</span>
                </div>
              </div>
              <div className="podium-badges">
                <div className="p-badge gift-badge">
                  🎁 {globalStandings[0].successRate}
                </div>
                <div className="p-badge gem-badge">
                  💎 {globalStandings[0].speed} Response
                </div>
              </div>
            </div>

            {/* Rank 2 Card (Silver) */}
            <div className="podium-card second-place">
              <div className="podium-header">
                <div className="avatar-wrapper">
                  <img src={globalStandings[1].icon} alt="GPT" className="podium-avatar" />
                  <span className="rank-badge silver-bg">2</span>
                </div>
                <div className="podium-model-info">
                  <span className="model-name">{globalStandings[1].name}</span>
                  <span className="model-handle">{globalStandings[1].handle}</span>
                </div>
              </div>
              <div className="podium-stats-grid">
                <div className="p-stat">
                  <span className="p-stat-lbl">WINS</span>
                  <span className="p-stat-val">{globalStandings[1].wins}</span>
                </div>
                <div className="p-stat">
                  <span className="p-stat-lbl">MATCHES</span>
                  <span className="p-stat-val">{globalStandings[1].matches}</span>
                </div>
                <div className="p-stat">
                  <span className="p-stat-lbl">POINTS</span>
                  <span className="p-stat-val">{globalStandings[1].elo.toLocaleString()}</span>
                </div>
              </div>
              <div className="podium-badges">
                <div className="p-badge gift-badge">
                  🎁 {globalStandings[1].successRate}
                </div>
                <div className="p-badge gem-badge">
                  💎 {globalStandings[1].speed} Response
                </div>
              </div>
            </div>

            {/* Rank 3 Card (Bronze) */}
            <div className="podium-card third-place">
              <div className="podium-header">
                <div className="avatar-wrapper">
                  <img src={globalStandings[2].icon} alt="Gemini" className="podium-avatar" />
                  <span className="rank-badge bronze-bg">3</span>
                </div>
                <div className="podium-model-info">
                  <span className="model-name">{globalStandings[2].name}</span>
                  <span className="model-handle">{globalStandings[2].handle}</span>
                </div>
              </div>
              <div className="podium-stats-grid">
                <div className="p-stat">
                  <span className="p-stat-lbl">WINS</span>
                  <span className="p-stat-val">{globalStandings[2].wins}</span>
                </div>
                <div className="p-stat">
                  <span className="p-stat-lbl">MATCHES</span>
                  <span className="p-stat-val">{globalStandings[2].matches}</span>
                </div>
                <div className="p-stat">
                  <span className="p-stat-lbl">POINTS</span>
                  <span className="p-stat-val">{globalStandings[2].elo.toLocaleString()}</span>
                </div>
              </div>
              <div className="podium-badges">
                <div className="p-badge gift-badge">
                  🎁 {globalStandings[2].successRate}
                </div>
                <div className="p-badge gem-badge">
                  💎 {globalStandings[2].speed} Response
                </div>
              </div>
            </div>

          </div>

          {/* 3. Global Ranking Section */}
          <div className="global-ranking-section">
            <h2>Global Ranking</h2>
            
            <div className="ranking-table-wrapper">
              <table className="ranking-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>User name</th>
                    <th>Match Wins</th>
                    <th>Spent time</th>
                    <th>Victories</th>
                    <th>Best Win (mins)</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {globalStandings.map((model) => (
                    <tr key={model.rank} className="ranking-row">
                      <td>
                        <span className="table-rank-num">{model.rank}</span>
                      </td>
                      <td className="table-model-cell">
                        <img src={model.icon} alt={model.name} className="table-model-avatar" />
                        <div className="table-model-desc">
                          <span className="table-model-name">{model.name}</span>
                          <span className="table-model-id">ID {model.id}</span>
                        </div>
                      </td>
                      <td>
                        <span className="table-cell-bold">{model.wins}</span>
                      </td>
                      <td>
                        <span className="table-cell-muted">{model.matches}</span>
                      </td>
                      <td>
                        <span className="table-cell-muted">{model.victories}</span>
                      </td>
                      <td>
                        <span className="table-cell-muted">{model.bestWin}</span>
                      </td>
                      <td>
                        <span className="table-cell-points">{model.elo.toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
