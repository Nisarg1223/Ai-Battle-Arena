import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Leaderboard.css';

const Leaderboard = ({ setView: propSetView, MODELS_LIST }) => {
  const navigate = useNavigate();
  const setView = propSetView || ((viewName) => {
    if (viewName === 'landing') navigate('/home');
    else if (viewName === 'arena') navigate('/battel');
    else navigate(`/${viewName}`);
  });
  const [countdown, setCountdown] = useState({ days: 12, hours: 6, minutes: 42, seconds: 59 });
  const [globalStandings, setGlobalStandings] = useState([]);
  const [totalBattles, setTotalBattles] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dynamic leaderboard data on mount
  useEffect(() => {
    setIsLoading(true);
    fetch('https://ai-battle-arena-mr6l.onrender.com/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data.standings && data.standings.length > 0) {
          setGlobalStandings(data.standings);
          setTotalBattles(data.totalBattles || 0);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.warn("Failed to fetch dynamic leaderboard, using static defaults:", err);
        setGlobalStandings([
          { rank: 1, name: 'Claude 3.5 Sonnet', provider: 'Anthropic', handle: '@anthropic', wins: 443, matches: 778, successRate: '94.2%', speed: '1.2s', elo: 44872, icon: '/logos/claude.png', id: '1587667', victories: 43, bestWin: '1:05' },
          { rank: 2, name: 'OpenAI GPT-4o', provider: 'OpenAI', handle: '@openai', wins: 440, matches: 887, successRate: '92.5%', speed: '1.1s', elo: 42515, icon: '/logos/GPT_2.png', id: '1587634', victories: 43, bestWin: '1:03' },
          { rank: 3, name: 'Gemini 3.5 Flash', provider: 'Google', handle: '@google', wins: 412, matches: 756, successRate: '90.4%', speed: '0.8s', elo: 40550, icon: '/logos/gemini.png', id: '1587699', victories: 43, bestWin: '1:15' },
          { rank: 4, name: 'DeepSeek R1', provider: 'DeepSeek', handle: '@deepseek', wins: 398, matches: 720, successRate: '88.7%', speed: '1.5s', elo: 38210, icon: '/logos/deepseek.png', id: '1587712', victories: 40, bestWin: '1:24' },
          { rank: 5, name: 'Mistral Medium', provider: 'Mistral', handle: '@mistral', wins: 375, matches: 810, successRate: '84.3%', speed: '1.4s', elo: 35430, icon: '/logos/mistral.png', id: '1587789', victories: 38, bestWin: '1:45' },
          { rank: 6, name: 'Cohere Command', provider: 'Cohere', handle: '@cohere', wins: 342, matches: 790, successRate: '81.2%', speed: '1.3s', elo: 32180, icon: '/logos/cohere.png', id: '1587823', victories: 35, bestWin: '1:38' },
          { rank: 7, name: 'Groq Llama 3.3', provider: 'Groq', handle: '@groq', wins: 320, matches: 690, successRate: '79.5%', speed: '0.3s', elo: 29500, icon: '/logos/groq.svg', id: '1587901', victories: 32, bestWin: '0:35' },
        ]);
        setTotalBattles(12785);
        setIsLoading(false);
      });
  }, []);

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

  return (
    <div className="leaderboard-page-container">
      {/* 1. Far-Left Narrow Icon Sidebar */}
      <aside className="icon-sidebar">
        <div className="sidebar-top-icons">
          <div className="logo-container" onClick={() => setView('landing')} style={{ cursor: 'pointer' }} title="Go to Home">
            <img src="/logo.png" alt="AI Battle Arena Logo" className="logo-img" />
          </div>
          <div className="sidebar-icon" onClick={() => setView('arena')} style={{ cursor: 'pointer' }} title="Arena Workspace">
            <span>🎛️</span>
          </div>
          <div className="sidebar-icon active" onClick={() => setView('leaderboard')} style={{ cursor: 'pointer' }} title="Leaderboard">
            <span>📊</span>
          </div>
          <div className="sidebar-icon" onClick={() => setView('prompts')} style={{ cursor: 'pointer' }} title="Prompts">
            <span>💬</span>
          </div>
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
        </header>

        {/* Inner Scrollable Panel */}
        <div className="leaderboard-scrollable-content">
          
          {/* Top Info Cards */}
          <div className="top-stats-row">
            <div className="stat-card">
              <div className="stat-card-left">
                <span className="stat-label">Total Battles Run</span>
                <span className="stat-value">{totalBattles.toLocaleString()}</span>
              </div>
              <div className="stat-icon-wrap green-bg">
                <span>📈</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-left">
                <span className="stat-label">Total Participating LLMs</span>
                <span className="stat-value">7 Models</span>
              </div>
              <div className="stat-icon-wrap blue-bg">
                <span>🌐</span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <>
              {/* Podium Skeleton */}
              <div className="podium-row">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="podium-card skeleton-pulse" style={{ height: 220, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{ display: 'flex', gap: 12, padding: 16 }}>
                      <div className="skeleton-avatar" />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div className="skeleton-text" style={{ width: '80%', height: 16 }} />
                        <div className="skeleton-text" style={{ width: '50%', height: 12 }} />
                      </div>
                    </div>
                    <div style={{ padding: '0 16px 16px 16px', display: 'flex', gap: 12 }}>
                      <div className="skeleton-text" style={{ flex: 1, height: 40 }} />
                      <div className="skeleton-text" style={{ flex: 1, height: 40 }} />
                      <div className="skeleton-text" style={{ flex: 1, height: 40 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Table Skeleton */}
              <div className="global-ranking-section">
                <h2>Global Ranking</h2>
                <div className="ranking-table-wrapper">
                  <table className="ranking-table">
                    <tbody>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <tr key={num} className="ranking-row skeleton-pulse" style={{ height: 60, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '12px 24px' }}><div className="skeleton-text" style={{ width: 20 }} /></td>
                          <td style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div className="skeleton-avatar" />
                            <div className="skeleton-text" style={{ width: 120 }} />
                          </td>
                          <td style={{ padding: '12px 24px' }}><div className="skeleton-text" style={{ width: 30 }} /></td>
                          <td style={{ padding: '12px 24px' }}><div className="skeleton-text" style={{ width: 30 }} /></td>
                          <td style={{ padding: '12px 24px' }}><div className="skeleton-text" style={{ width: 30 }} /></td>
                          <td style={{ padding: '12px 24px' }}><div className="skeleton-text" style={{ width: 40 }} /></td>
                          <td style={{ padding: '12px 24px' }}><div className="skeleton-text" style={{ width: 50 }} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
