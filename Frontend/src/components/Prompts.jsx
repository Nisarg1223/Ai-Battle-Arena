import React, { useState, useEffect } from 'react';
import './Prompts.css';

const Prompts = ({ setView }) => {
  const [activePromptIndex, setActivePromptIndex] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const promptsData = [
    {
      question: "What parameters can I customize for the models?",
      answer: "Every parameter matters. In the Arena Workspace, you can adjust temperature, maximum tokens, frequency penalties, and custom system instructions for each LLM model individually."
    },
    {
      question: "How does the automated LLM Judge work?",
      answer: "Our automated judge utilizes advanced model evaluation frameworks. It runs secondary evaluations on completion metrics, logic checks, and semantic accuracy, generating detailed scoring cards."
    },
    {
      question: "Do we need API keys or setup to run battles?",
      answer: "No. The AI Battle Arena provides a pre-configured playground so you can compare outputs instantly without setting up API configurations or supplying custom tokens."
    },
    {
      question: "Is raw latency and speed measured?",
      answer: "Yes, we monitor latency, time-to-first-token (TTFT), and tokens-per-second (TPS) in real-time. Speed charts help you determine which provider is fastest for your stack."
    },
    {
      question: "What kind of evaluation metrics can we expect?",
      answer: "We support a range of qualitative and quantitative benchmarks, including schema conformance, context retention, instruction following, and reasoning trees."
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:3000/api/prompts?page=${currentPage}&limit=5`)
      .then(res => res.json())
      .then(data => {
        if (data.prompts && data.prompts.length > 0) {
          setPrompts(data.prompts);
          setTotalPages(data.totalPages || 1);
        } else {
          setPrompts(promptsData);
          setTotalPages(1);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.warn("Failed to fetch dynamic prompts, using static defaults:", err);
        setPrompts(promptsData);
        setTotalPages(1);
        setIsLoading(false);
      });
  }, [currentPage]);

  return (
    <div className="prompts-page-container">
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
          <div className="sidebar-icon" onClick={() => setView('leaderboard')} style={{ cursor: 'pointer' }} title="Leaderboard">
            <span>📊</span>
          </div>
          <div className="sidebar-icon active" onClick={() => setView('prompts')} style={{ cursor: 'pointer' }} title="Prompts">
            <span>💬</span>
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
      <main className="prompts-main">
        {/* Header bar */}
        <header className="prompts-header">
          <div className="header-left-title">
            <span className="back-arrow-btn" onClick={() => setView('landing')} title="Go back to Home">‹</span>
            <h1>Prompts</h1>
          </div>
          <div className="header-right-meta">
            <div className="search-box-wrap">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search prompts..." className="search-input" />
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
        <div className="prompts-scrollable-content">
          
          <div className="prompts-capsule-wrapper">
            <span className="prompts-capsule">010 • FAQS</span>
          </div>
          <h2 className="prompts-title-large">Common Questions</h2>

          <div className="prompts-accordion-container">
            {isLoading ? (
              [1, 2, 3, 4, 5].map((num) => (
                <div 
                  key={num} 
                  className="prompt-accordion-item skeleton-pulse"
                  style={{ height: 56, border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16 }}
                >
                  <span className="prompt-num">{num}</span>
                  <div className="skeleton-text" style={{ width: '60%' }} />
                </div>
              ))
            ) : (
              prompts.map((item, index) => {
                const isOpen = activePromptIndex === index;
                return (
                  <div 
                    key={index} 
                    className={`prompt-accordion-item ${isOpen ? 'active' : ''}`}
                    onClick={() => setActivePromptIndex(isOpen ? null : index)}
                  >
                    <div className="prompt-item-header">
                      <span className="prompt-num">{(currentPage - 1) * 5 + index + 1}</span>
                      <span className="prompt-question">{item.question}</span>
                      {item.score !== undefined && (
                        <span style={{ fontSize: 11, backgroundColor: 'rgba(255, 255, 255, 0.08)', padding: '2px 6px', borderRadius: '4px', color: 'var(--accent-gold)' }}>
                          Score: {item.score}/10
                        </span>
                      )}
                      <div className="prompt-toggle-btn">
                        <span>{isOpen ? '✕' : '＋'}</span>
                      </div>
                    </div>
                    {isOpen && (
                      <div className="prompt-item-body" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {totalPages >= 1 && (
            <div className="prompts-pagination-container">
              <div className="prompts-pagination-bar">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1}
                  className="pagination-arrow"
                  title="Previous Page"
                >
                  &lt;
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <span 
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                  >
                    {pageNum}
                  </span>
                ))}

                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages}
                  className="pagination-arrow"
                  title="Next Page"
                >
                  &gt;
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Prompts;
