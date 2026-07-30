import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

// Predefined model list matching the sidebar with custom SVG logos
const MODELS_LIST = [
  { id: 'claude', name: 'Claude 3.5 Sonnet', icon: '/logos/claude.png' },
  { id: 'openai', name: 'OpenAI GPT-4o', icon: '/logos/GPT_2.png' },
  { id: 'gemini', name: 'Gemini 3.5 Flash', icon: '/logos/gemini.png' },
  { id: 'deepseek', name: 'DeepSeek R1', icon: '/logos/deepseek.png' },
  { id: 'mistral', name: 'Mistral Medium', icon: '/logos/mistral.png' },
  { id: 'cohere', name: 'Cohere Command', icon: '/logos/cohere.png' },
  { id: 'groq', name: 'Groq Llama 3.3', icon: '/logos/groq.svg' },
];

const JUDGES_LIST = [
  { id: 'gemini-judge', name: 'Gemini Flash Judge', icon: '/logos/gemini.png' },
  { id: 'claude-judge', name: 'Claude Sonnet Judge', icon: '/logos/claude.png' },
  { id: 'gpt-judge', name: 'GPT-4o Judge', icon: '/logos/GPT_2.png' },
];

const Battel = () => {
  const navigate = useNavigate();
  const setView = (viewName) => {
    if (viewName === 'landing') navigate('/home');
    else if (viewName === 'arena') navigate('/battel');
    else navigate(`/${viewName}`);
  };

  // App States
  const [model1, setModel1] = useState('gemini');
  const [model2, setModel2] = useState('mistral');
  const [judgeModel, setJudgeModel] = useState('gemini-judge');
  const [question, setQuestion] = useState('what is the defination of a creative web developer??');
  const [isLoading, setIsLoading] = useState(false);
  const [battleResults, setBattleResults] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [touchActiveItem, setTouchActiveItem] = useState(null);
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0 });

  // Dynamic placement states (Default false so they must be dragged or chosen to appear)
  const [model1Placed, setModel1Placed] = useState(false);
  const [model2Placed, setModel2Placed] = useState(false);
  const [judgePlaced, setJudgePlaced] = useState(false);
  
  // Selection state for inspector/active node highlight
  const [selectedNodeId, setSelectedNodeId] = useState('question');

  // Canvas Transform State (Pan & Zoom)
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 50, y: 30 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const viewportRef = useRef(null);

  // Nodes Coordinates State (Editable via Dragging)
  const [nodes, setNodes] = useState({
    question: { id: 'question', x: 80, y: 220, width: 280, height: 160, type: 'problem' },
    model1: { id: 'model1', x: 440, y: 60, width: 280, height: 220, type: 'model1' },
    model2: { id: 'model2', x: 440, y: 380, width: 280, height: 220, type: 'model2' },
    judge: { id: 'judge', x: 800, y: 220, width: 280, height: 220, type: 'judge' }
  });

  // State to track which node is currently being dragged
  const [activeDragNode, setActiveDragNode] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Handle canvas zoom with wheel
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = 1.05;
    let newZoom = zoom;
    if (e.deltaY < 0) {
      newZoom = Math.min(zoom * zoomFactor, 2);
    } else {
      newZoom = Math.max(zoom / zoomFactor, 0.5);
    }
    setZoom(newZoom);
  };

  // Attach non-passive wheel event listener to avoid console warnings / scroll blocking
  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (viewport) {
        viewport.removeEventListener('wheel', handleWheel);
      }
    };
  }, [zoom]);

  // Handle canvas pan start
  const handleMouseDown = (e) => {
    // Only pan if clicking the empty canvas space (not a node card, buttons, or inputs)
    const isInteractive = e.target.closest('.arena-node') || 
                          e.target.closest('.canvas-controls') || 
                          e.target.closest('button') || 
                          e.target.closest('select') || 
                          e.target.closest('textarea') || 
                          e.target.closest('input');

    if (!isInteractive) {
      setIsPanning(true);
      panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.current.x,
        y: e.clientY - panStart.current.y
      });
    } else if (activeDragNode) {
      // Dragging a specific node on the canvas
      const newX = (e.clientX - pan.x) / zoom - dragOffset.current.x;
      const newY = (e.clientY - pan.y) / zoom - dragOffset.current.y;
      
      setNodes(prev => ({
        ...prev,
        [activeDragNode]: {
          ...prev[activeDragNode],
          x: Math.max(0, newX),
          y: Math.max(0, newY)
        }
      }));
    }
  };

  // Touch handlers for dragging nodes and panning canvas on mobile
  const handleNodeTouchStart = (e, nodeId) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setActiveDragNode(nodeId);
    
    const node = nodes[nodeId];
    const touch = e.touches[0];
    const clientX = touch.clientX;
    const clientY = touch.clientY;
    
    const mouseInCanvasX = (clientX - pan.x) / zoom;
    const mouseInCanvasY = (clientY - pan.y) / zoom;
    
    dragOffset.current = {
      x: mouseInCanvasX - node.x,
      y: mouseInCanvasY - node.y
    };
  };

  const handleTouchStartCanvas = (e) => {
    const isInteractive = e.target.closest('.arena-node') || 
                          e.target.closest('.canvas-controls') || 
                          e.target.closest('button') || 
                          e.target.closest('select') || 
                          e.target.closest('textarea') || 
                          e.target.closest('input');

    if (!isInteractive) {
      setIsPanning(true);
      const touch = e.touches[0];
      panStart.current = { x: touch.clientX - pan.x, y: touch.clientY - pan.y };
    }
  };

  const handleTouchMoveCanvas = (e) => {
    if (touchActiveItem) {
      const touch = e.touches[0];
      setTouchPos({ x: touch.clientX, y: touch.clientY });
      return;
    }

    if (activeDragNode) {
      const touch = e.touches[0];
      const newX = (touch.clientX - pan.x) / zoom - dragOffset.current.x;
      const newY = (touch.clientY - pan.y) / zoom - dragOffset.current.y;
      
      setNodes(prev => ({
        ...prev,
        [activeDragNode]: {
          ...prev[activeDragNode],
          x: Math.max(0, newX),
          y: Math.max(0, newY)
        }
      }));
    } else if (isPanning) {
      const touch = e.touches[0];
      setPan({
        x: touch.clientX - panStart.current.x,
        y: touch.clientY - panStart.current.y
      });
    }
  };

  const handleTouchEndCanvas = (e) => {
    setIsPanning(false);
    setActiveDragNode(null);
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setActiveDragNode(null);
  };

  // Node Drag Start (on canvas)
  const handleNodeMouseDown = (e, nodeId) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setActiveDragNode(nodeId);
    
    // Calculate drag offset inside the node
    const node = nodes[nodeId];
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    // Node position in scale/canvas coordinate space
    const mouseInCanvasX = (clientX - pan.x) / zoom;
    const mouseInCanvasY = (clientY - pan.y) / zoom;
    
    dragOffset.current = {
      x: mouseInCanvasX - node.x,
      y: mouseInCanvasY - node.y
    };
  };

  // HTML5 Drag and Drop from Left Sidebar
  const handleSidebarDragStart = (e, item, type) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ item, type }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnCanvas = (e) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const { item, type } = JSON.parse(dataStr);

      // Calculate drop position relative to canvas coordinate space
      const rect = viewportRef.current.getBoundingClientRect();
      const dropX = (e.clientX - rect.left - pan.x) / zoom - 140; // centering offset (half node width)
      const dropY = (e.clientY - rect.top - pan.y) / zoom - 30;   // offset

      if (type === 'model') {
        if (!model1Placed) {
          setModel1(item.id);
          setModel1Placed(true);
          setNodes(prev => ({
            ...prev,
            model1: { ...prev.model1, x: Math.max(0, dropX), y: Math.max(0, dropY) }
          }));
        } else {
          setModel2(item.id);
          setModel2Placed(true);
          setNodes(prev => ({
            ...prev,
            model2: { ...prev.model2, x: Math.max(0, dropX), y: Math.max(0, dropY) }
          }));
        }
      } else if (type === 'judge') {
        setJudgeModel(item.id);
        setJudgePlaced(true);
        setNodes(prev => ({
          ...prev,
          judge: { ...prev.judge, x: Math.max(0, dropX), y: Math.max(0, dropY) }
        }));
      }
    } catch (err) {
      console.error("Error processing dropped item:", err);
    }
  };

  // Quick action: side plus button clicked
  const handleSidebarAdd = (id, type) => {
    // Generate a slightly randomized position near the middle
    const rx = 350 + Math.random() * 100;
    const ry = 150 + Math.random() * 150;
    if (type === 'model') {
      if (!model1Placed) {
        setModel1(id);
        setModel1Placed(true);
        setNodes(prev => ({ ...prev, model1: { ...prev.model1, x: rx, y: ry } }));
      } else {
        setModel2(id);
        setModel2Placed(true);
        setNodes(prev => ({ ...prev, model2: { ...prev.model2, x: rx, y: ry + 150 } }));
      }
    } else if (type === 'judge') {
      setJudgeModel(id);
      setJudgePlaced(true);
      setNodes(prev => ({ ...prev, judge: { ...prev.judge, x: rx + 300, y: ry + 50 } }));
    }
  };

  // Dropdowns in Right Panel should auto-enable placement at current or default positions
  const handleSelectModel1 = (val) => {
    setModel1(val);
    if (!model1Placed) {
      setModel1Placed(true);
      setNodes(prev => ({ ...prev, model1: { ...prev.model1, x: 420, y: 80 } }));
    }
  };

  const handleSelectModel2 = (val) => {
    setModel2(val);
    if (!model2Placed) {
      setModel2Placed(true);
      setNodes(prev => ({ ...prev, model2: { ...prev.model2, x: 420, y: 360 } }));
    }
  };

  const handleSelectJudge = (val) => {
    setJudgeModel(val);
    if (!judgePlaced) {
      setJudgePlaced(true);
      setNodes(prev => ({ ...prev, judge: { ...prev.judge, x: 780, y: 220 } }));
    }
  };

  // Touch event handlers for mobile drag-and-drop
  const handleTouchStart = (e, item, type) => {
    const touch = e.touches[0];
    setTouchActiveItem({ item, type });
    setTouchPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e) => {
    if (!touchActiveItem) return;
    const touch = e.touches[0];
    setTouchPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e) => {
    if (!touchActiveItem) return;

    const rect = viewportRef.current.getBoundingClientRect();
    const x = touchPos.x;
    const y = touchPos.y;

    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      const dropX = (x - rect.left - pan.x) / zoom - 140;
      const dropY = (y - rect.top - pan.y) / zoom - 30;

      const { item, type } = touchActiveItem;
      if (type === 'model') {
        if (!model1Placed) {
          setModel1(item.id);
          setModel1Placed(true);
          setNodes(prev => ({
            ...prev,
            model1: { ...prev.model1, x: Math.max(0, dropX), y: Math.max(0, dropY) }
          }));
        } else {
          setModel2(item.id);
          setModel2Placed(true);
          setNodes(prev => ({
            ...prev,
            model2: { ...prev.model2, x: Math.max(0, dropX), y: Math.max(0, dropY) }
          }));
        }
      } else if (type === 'judge') {
        setJudgeModel(item.id);
        setJudgePlaced(true);
        setNodes(prev => ({
          ...prev,
          judge: { ...prev.judge, x: Math.max(0, dropX), y: Math.max(0, dropY) }
        }));
      }
      setIsLeftPanelOpen(false); // auto-close sidebar on successful drop
    }

    setTouchActiveItem(null);
  };

  // Zoom controls
  const zoomIn = () => setZoom(z => Math.min(z + 0.1, 2));
  const zoomOut = () => setZoom(z => Math.max(z - 0.1, 0.5));
  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 50, y: 30 });
  };

  // Calculate connection lines paths (bezier curves)
  const getBezierPath = (startX, startY, endX, endY) => {
    const controlX = startX + (endX - startX) * 0.5;
    return `M ${startX} ${startY} C ${controlX} ${startY}, ${controlX} ${endY}, ${endX} ${endY}`;
  };

  const getConnectorPoints = (fromNode, toNode, fromSide = 'right', toSide = 'left') => {
    if (!fromNode || !toNode) return { sx: 0, sy: 0, ex: 0, ey: 0 };
    
    const sx = fromSide === 'right' ? fromNode.x + fromNode.width : fromNode.x;
    const sy = fromNode.y + fromNode.height / 2;
    
    const ex = toSide === 'left' ? toNode.x : toNode.x + toNode.width;
    const ey = toNode.y + toNode.height / 2;
    
    return { sx, sy, ex, ey };
  };

  // Run the battle!
  const runBattle = async () => {
    // Automatically place all nodes if battle is initiated
    if (!model1Placed) {
      setModel1Placed(true);
      setNodes(prev => ({ ...prev, model1: { ...prev.model1, x: 420, y: 80 } }));
    }
    if (!model2Placed) {
      setModel2Placed(true);
      setNodes(prev => ({ ...prev, model2: { ...prev.model2, x: 420, y: 360 } }));
    }
    if (!judgePlaced) {
      setJudgePlaced(true);
      setNodes(prev => ({ ...prev, judge: { ...prev.judge, x: 780, y: 220 } }));
    }

    setIsLoading(true);
    setBattleResults(null);
    setSelectedNodeId('judge'); // Focus on Judge to see results

    try {
      const response = await fetch('https://ai-battle-arena-mr6l.onrender.com/api/battle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem: question,
          model_1: model1,
          model_2: model2,
          judge_model: judgeModel,
        }),
      });

      if (!response.ok) {
        throw new Error('Backend failed, using client fallback');
      }

      const data = await response.json();
      setBattleResults(data);
    } catch (err) {
      console.warn("Backend connection failed. Falling back to local emulator...", err);
      // Fallback Emulator matching prompt backend format
      setTimeout(() => {
        const score1 = Math.floor(Math.random() * 3) + 8;
        const score2 = Math.floor(Math.random() * 3) + 7;
        const name1 = MODELS_LIST.find(m => m.id === model1)?.name || model1;
        const name2 = MODELS_LIST.find(m => m.id === model2)?.name || model2;

        const fakeData = {
          problem: question,
          solution_1: `### **Solution 1 (generated by ${name1})**\n\nFor the query: *"${question}"*\n\nHere is a comprehensive breakdown:\n\n1. **Core Concept**\n   - This problem requires a structured approach balancing technical rigor with practical usability.\n   - By implementing an optimized pipeline, we can achieve high performance.\n\n2. **Detailed Architecture**\n   - **Data Layer**: Structured relational tables or document store.\n   - **Logic Layer**: Microservice-based event processors.\n   - **Presentation**: Responsive user interfaces focusing on UX metrics.\n\n3. **Key Benefits**\n   - **Scalability**: Can handle high concurrent loads easily.\n   - **Maintainability**: Clear division of concerns.\n\n*Overall, this approach prioritizes standard, scalable industry patterns.*`,
          solution_2: `### **Solution 2 (generated by ${name2})**\n\nHere is an alternative perspective on: *"${question}"*\n\n1. **Creative & Agile Approach**\n   - Instead of standard structures, we focus on a highly interactive and flexible model.\n   - Maximizes responsiveness and user engagement.\n\n2. **Key Implementations**\n   - Web-centric visual flows (canvas, drag-and-drop).\n   - Custom reactive state handlers.\n\n3. **Pros & Cons**\n   - **Pros**: Outstanding visual design, extremely fast prototype cycle.\n   - **Cons**: Requires custom optimizations for large scale datasets.\n\n*This approach focuses on innovation and immediate visual impact.*`,
          judge: {
            solution_1_score: score1,
            solution_2_score: score2,
            solution_1_feedback: `${name1} presented a highly structured, enterprise-ready architecture. The separation of layers is excellent, though it could benefit from more modern, agile paradigms. Score: ${score1}/10.`,
            solution_2_feedback: `${name2} focused on a highly creative and user-centric approach. While visually appealing and innovative, it needs additional consideration for production scalability. Score: ${score2}/10.`,
            question_score: 8
          }
        };
        setBattleResults(fakeData);
      }, 2000);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  // Simple parser to render markdown subset (headers, bold, lists, tables) into beautiful HTML
  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    let insideTable = false;
    let tableRows = [];

    const elements = lines.map((line, idx) => {
      const trimmed = line.trim();

      // Table parsing
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        if (trimmed.includes('---')) return null; // skip separator row
        insideTable = true;
        const cols = trimmed.split('|').filter(c => c !== '').map(c => c.trim());
        tableRows.push(cols);
        return null;
      } else if (insideTable) {
        // Output table
        const currentRows = [...tableRows];
        tableRows = [];
        insideTable = false;
        return (
          <table key={`table-${idx}`}>
            <thead>
              <tr>
                {currentRows[0].map((cell, cIdx) => <th key={cIdx}>{cell}</th>)}
              </tr>
            </thead>
            <tbody>
              {currentRows.slice(1).map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => <td key={cIdx}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        );
      }

      // Header h3
      if (trimmed.startsWith('###')) {
        return <h3 key={idx}>{trimmed.replace('###', '').trim()}</h3>;
      }
      // Header h2
      if (trimmed.startsWith('##')) {
        return <h3 key={idx} style={{fontSize: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px'}}>{trimmed.replace('##', '').trim()}</h3>;
      }

      // Bold text replacements
      let lineContent = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      while ((match = boldRegex.exec(line)) !== null) {
        parts.push(line.substring(lastIndex, match.index));
        parts.push(<strong key={match.index}>{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      parts.push(line.substring(lastIndex));

      // Unordered lists
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        return (
          <ul key={idx}>
            <li>{parts.length > 1 ? parts : line.replace(/^[-*]\s*/, '')}</li>
          </ul>
        );
      }

      // Numbered lists
      if (/^\d+\./.test(trimmed)) {
        return (
          <ol key={idx}>
            <li>{parts.length > 1 ? parts : line.replace(/^\d+\.\s*/, '')}</li>
          </ol>
        );
      }

      // Paragraphs
      return trimmed === '' ? <br key={idx} /> : <p key={idx}>{parts.length > 1 ? parts : line}</p>;
    });

    return elements;
  };

  // Determine winner
  const getWinner = () => {
    if (!battleResults?.judge) return null;
    const { solution_1_score, solution_2_score } = battleResults.judge;
    if (solution_1_score > solution_2_score) return 'model1';
    if (solution_2_score > solution_1_score) return 'model2';
    return 'tie';
  };

  const winner = getWinner();

  // Connector lines endpoints
  const lineQToM1 = getConnectorPoints(nodes.question, nodes.model1, 'right', 'left');
  const lineQToM2 = getConnectorPoints(nodes.question, nodes.model2, 'right', 'left');
  const lineM1ToJ = getConnectorPoints(nodes.model1, nodes.judge, 'right', 'left');
  const lineM2ToJ = getConnectorPoints(nodes.model2, nodes.judge, 'right', 'left');

  return (
    <div className="app-container" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onTouchMove={handleTouchMoveCanvas} onTouchEnd={handleTouchEndCanvas}>
      
      {/* 1. Far-Left Narrow Icon Sidebar */}
      <aside className="icon-sidebar">
        <div className="sidebar-top-icons">
          <div className="logo-container" onClick={() => setView('landing')} style={{ cursor: 'pointer' }} title="Go to Home">
            <img src="/logo.png" alt="AI Battle Arena Logo" className="logo-img" />
          </div>
          <div className="sidebar-icon active" onClick={() => setView('arena')} style={{ cursor: 'pointer' }} title="Arena Workspace">
            <span>🎛️</span>
          </div>
          <div className="sidebar-icon" onClick={() => setView('leaderboard')} style={{ cursor: 'pointer' }} title="Leaderboard">
            <span>📊</span>
          </div>
          <div className="sidebar-icon" onClick={() => setView('prompts')} style={{ cursor: 'pointer' }} title="Prompts">
            <span>💬</span>
          </div>
          
        </div>
        
      </aside>

      {/* 2. Main Left Sidebar (Draggable items list) */}
      <aside className={`left-panel ${isLeftPanelOpen ? 'open' : ''}`}>
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="panel-title">Fields & Entities</h2>
          <button className="btn-close-sidebar" onClick={() => setIsLeftPanelOpen(false)}>✕</button>
        </div>
        <div className="panel-content">
          <h3 className="section-title">AI Models</h3>
          <div className="draggable-items">
            {MODELS_LIST.map(model => (
              <div 
                key={model.id}
                className="drag-item"
                draggable
                onDragStart={(e) => handleSidebarDragStart(e, model, 'model')}
                onTouchStart={(e) => handleTouchStart(e, model, 'model')}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="drag-item-left" style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={model.icon} alt={model.name} style={{ width: 18, height: 18, marginRight: 8, objectFit: 'contain' }} />
                  <span>{model.name}</span>
                </div>
                <span className="drag-item-plus" onClick={() => handleSidebarAdd(model.id, 'model')}>+</span>
              </div>
            ))}
          </div>

          <h3 className="section-title">Judges</h3>
          <div className="draggable-items">
            {JUDGES_LIST.map(judge => (
              <div
                key={judge.id}
                className="drag-item"
                draggable
                onDragStart={(e) => handleSidebarDragStart(e, judge, 'judge')}
                onTouchStart={(e) => handleTouchStart(e, judge, 'judge')}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="drag-item-left" style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={judge.icon} alt={judge.name} style={{ width: 18, height: 18, marginRight: 8, objectFit: 'contain' }} />
                  <span>{judge.name}</span>
                </div>
                <span className="drag-item-plus" onClick={() => handleSidebarAdd(judge.id, 'judge')}>+</span>
              </div>
            ))}
          </div>

        </div>
      </aside>

      {/* 3. Middle Workspace & Canvas */}
      <main className="workspace-area">
        <div className="workspace-topbar">
          <div className="topbar-left">
            <button className="btn-back" onClick={() => setView('landing')}>
              ← Back
            </button>
            <button className={`btn-sidebar-toggle left-toggle ${isLeftPanelOpen ? 'active' : ''}`} onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}>
              ☰ Models
            </button>
            <div className="form-title-container">
              <span className="form-title">AI Battle Arena</span>
            </div>
          </div>
          <div className="topbar-actions">
            <button className={`btn-sidebar-toggle right-toggle ${isRightPanelOpen ? 'active' : ''}`} onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}>
              ☰ Prompt 
            </button>
            <button className="btn-primary-sparkle" onClick={runBattle} disabled={isLoading}>
              ✨ AI Generate
            </button>
          </div>
        </div>

        {/* Viewport for Panning/Zooming */}
        <div 
          className="canvas-viewport" 
          ref={viewportRef}
          onMouseDown={handleMouseDown}
          onDragOver={handleDragOver}
          onDrop={handleDropOnCanvas}
          onTouchStart={handleTouchStartCanvas}
        >
          {/* Zoomable & Pannable Content */}
          <div 
            className="canvas-content" 
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
          >
            {/* Dotted Grid Background */}
            <div className="canvas-grid" />

            {/* Connection Lines Layer (Only render if targets are placed) */}
            <svg className="canvas-svg">
              {model1Placed && (
                <path 
                  d={getBezierPath(lineQToM1.sx, lineQToM1.sy, lineQToM1.ex, lineQToM1.ey)} 
                  className={`connection-line ${isLoading ? 'active' : ''} ${winner === 'model1' ? 'winning' : ''}`} 
                />
              )}
              {model2Placed && (
                <path 
                  d={getBezierPath(lineQToM2.sx, lineQToM2.sy, lineQToM2.ex, lineQToM2.ey)} 
                  className={`connection-line ${isLoading ? 'active' : ''} ${winner === 'model2' ? 'winning' : ''}`} 
                />
              )}
              {model1Placed && judgePlaced && (
                <path 
                  d={getBezierPath(lineM1ToJ.sx, lineM1ToJ.sy, lineM1ToJ.ex, lineM1ToJ.ey)} 
                  className={`connection-line ${isLoading ? 'active' : ''} ${winner === 'model1' ? 'winning' : ''}`} 
                />
              )}
              {model2Placed && judgePlaced && (
                <path 
                  d={getBezierPath(lineM2ToJ.sx, lineM2ToJ.sy, lineM2ToJ.ex, lineM2ToJ.ey)} 
                  className={`connection-line ${isLoading ? 'active' : ''} ${winner === 'model2' ? 'winning' : ''}`} 
                />
              )}
            </svg>

            {/* NODE 1: Problem / Question (Always Shown) */}
            <div 
              className={`arena-node ${selectedNodeId === 'question' ? 'active-selection' : ''}`}
              style={{ left: nodes.question.x, top: nodes.question.y, width: nodes.question.width, height: nodes.question.height }}
              onMouseDown={(e) => handleNodeMouseDown(e, 'question')}
              onTouchStart={(e) => handleNodeTouchStart(e, 'question')}
            >
              <div className="node-header">
                <div className="node-header-left">
                  <span className="node-tag tag-problem">QUESTION</span>
                  <span className="node-name">Battle Prompt</span>
                </div>
              </div>
              <div className="node-body">
                <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{question}</p>
              </div>
            </div>

            {/* NODE 2: Model 1 */}
            {model1Placed && (
              <div 
                className={`arena-node ${selectedNodeId === 'model1' ? 'active-selection' : ''} ${isLoading ? 'loading-node' : ''} ${winner === 'model1' ? 'winner-node' : ''}`}
                style={{ left: nodes.model1.x, top: nodes.model1.y, width: nodes.model1.width, height: nodes.model1.height }}
                onMouseDown={(e) => handleNodeMouseDown(e, 'model1')}
                onTouchStart={(e) => handleNodeTouchStart(e, 'model1')}
              >
                <div className="node-header">
                  <div className="node-header-left">
                    <span className="node-tag tag-model1">MODEL 1</span>
                    <span className="node-name" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {(() => {
                        const m = MODELS_LIST.find(mInfo => mInfo.id === model1);
                        return m ? (
                          <>
                            <img src={m.icon} alt={m.name} style={{ width: 14, height: 14, objectFit: 'contain' }} />
                            <span>{m.name}</span>
                          </>
                        ) : (
                          model1
                        );
                      })()}
                    </span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    {battleResults?.judge && (
                      <span className={`score-badge ${battleResults.judge.solution_1_score >= 9 ? 'high' : 'medium'}`}>
                        {battleResults.judge.solution_1_score}
                      </span>
                    )}
                    <button className="node-action-btn" onClick={(e) => {
                      e.stopPropagation();
                      setModel1Placed(false);
                    }} title="Remove from arena">✕</button>
                  </div>
                </div>
                <div className="node-body" style={{ maxHeight: battleResults ? '130px' : '240px' }}>
                  {isLoading ? (
                    <div className="node-skeleton">
                      <div className="skeleton-line" style={{ width: '80%' }} />
                      <div className="skeleton-line" style={{ width: '90%' }} />
                      <div className="skeleton-line" style={{ width: '60%' }} />
                    </div>
                  ) : battleResults ? (
                    <div>
                      {winner === 'model1' && <div style={{color: 'var(--accent-gold)', marginBottom: '8px', fontSize: '11px', fontWeight: 'bold'}}>🏆 WINNER</div>}
                      {renderMarkdown(battleResults.solution_1)}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px' }}>
                      Drag model here to configure. Waiting for execution...
                    </div>
                  )}
                </div>
                {battleResults && !isLoading && (
                  <div style={{ padding: '0 16px 12px 16px' }}>
                    <button className="btn-see-response" onClick={() => setModalData({
                      title: `${MODELS_LIST.find(m => m.id === model1)?.name || model1} Solution`,
                      content: battleResults.solution_1
                    })}>🔍 See Response</button>
                  </div>
                )}
              </div>
            )}

            {/* NODE 3: Model 2 */}
            {model2Placed && (
              <div 
                className={`arena-node ${selectedNodeId === 'model2' ? 'active-selection' : ''} ${isLoading ? 'loading-node' : ''} ${winner === 'model2' ? 'winner-node' : ''}`}
                style={{ left: nodes.model2.x, top: nodes.model2.y, width: nodes.model2.width, height: nodes.model2.height }}
                onMouseDown={(e) => handleNodeMouseDown(e, 'model2')}
                onTouchStart={(e) => handleNodeTouchStart(e, 'model2')}
              >
                <div className="node-header">
                  <div className="node-header-left">
                    <span className="node-tag tag-model2">MODEL 2</span>
                    <span className="node-name" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {(() => {
                        const m = MODELS_LIST.find(mInfo => mInfo.id === model2);
                        return m ? (
                          <>
                            <img src={m.icon} alt={m.name} style={{ width: 14, height: 14, objectFit: 'contain' }} />
                            <span>{m.name}</span>
                          </>
                        ) : (
                          model2
                        );
                      })()}
                    </span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    {battleResults?.judge && (
                      <span className={`score-badge ${battleResults.judge.solution_2_score >= 9 ? 'high' : 'medium'}`}>
                        {battleResults.judge.solution_2_score}
                      </span>
                    )}
                    <button className="node-action-btn" onClick={(e) => {
                      e.stopPropagation();
                      setModel2Placed(false);
                    }} title="Remove from arena">✕</button>
                  </div>
                </div>
                <div className="node-body" style={{ maxHeight: battleResults ? '130px' : '240px' }}>
                  {isLoading ? (
                    <div className="node-skeleton">
                      <div className="skeleton-line" style={{ width: '90%' }} />
                      <div className="skeleton-line" style={{ width: '70%' }} />
                      <div className="skeleton-line" style={{ width: '85%' }} />
                    </div>
                  ) : battleResults ? (
                    <div>
                      {winner === 'model2' && <div style={{color: 'var(--accent-gold)', marginBottom: '8px', fontSize: '11px', fontWeight: 'bold'}}>🏆 WINNER</div>}
                      {renderMarkdown(battleResults.solution_2)}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px' }}>
                      Drag model here to configure. Waiting for execution...
                    </div>
                  )}
                </div>
                {battleResults && !isLoading && (
                  <div style={{ padding: '0 16px 12px 16px' }}>
                    <button className="btn-see-response" onClick={() => setModalData({
                      title: `${MODELS_LIST.find(m => m.id === model2)?.name || model2} Solution`,
                      content: battleResults.solution_2
                    })}>🔍 See Response</button>
                  </div>
                )}
              </div>
            )}

            {/* NODE 4: Judge */}
            {judgePlaced && (
              <div 
                className={`arena-node ${selectedNodeId === 'judge' ? 'active-selection' : ''} ${isLoading ? 'loading-node' : ''}`}
                style={{ left: nodes.judge.x, top: nodes.judge.y, width: nodes.judge.width, height: nodes.judge.height }}
                onMouseDown={(e) => handleNodeMouseDown(e, 'judge')}
                onTouchStart={(e) => handleNodeTouchStart(e, 'judge')}
              >
                <div className="node-header">
                  <div className="node-header-left">
                    <span className="node-tag tag-judge">JUDGE</span>
                    <span className="node-name" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {(() => {
                        const j = JUDGES_LIST.find(jInfo => jInfo.id === judgeModel);
                        return j ? (
                          <>
                            <img src={j.icon} alt={j.name} style={{ width: 14, height: 14, objectFit: 'contain' }} />
                            <span>{j.name}</span>
                          </>
                        ) : (
                          judgeModel
                        );
                      })()}
                    </span>
                  </div>
                  <button className="node-action-btn" onClick={(e) => {
                    e.stopPropagation();
                    setJudgePlaced(false);
                  }} title="Remove from arena">✕</button>
                </div>
                <div className="node-body" style={{ maxHeight: battleResults ? '130px' : '240px' }}>
                  {isLoading ? (
                    <div className="node-skeleton">
                      <div className="skeleton-line" style={{ width: '80%' }} />
                      <div className="skeleton-line" style={{ width: '60%' }} />
                    </div>
                  ) : battleResults ? (
                    <div>
                      <h3 style={{marginTop: 0}}>Judge Evaluation Summary</h3>
                      <div style={{margin: '8px 0', padding: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px'}}>
                        <p><strong>Model 1 Score:</strong> {battleResults.judge.solution_1_score}/10</p>
                        <p><strong>Model 2 Score:</strong> {battleResults.judge.solution_2_score}/10</p>
                        <p><strong>Question Score:</strong> {battleResults.judge.question_score || 0}/10</p>
                      </div>
                      <h4>Feedback on Model 1</h4>
                      <p style={{fontSize: '11px', fontStyle: 'italic', marginBottom: '8px'}}>{battleResults.judge.solution_1_feedback}</p>
                      <h4>Feedback on Model 2</h4>
                      <p style={{fontSize: '11px', fontStyle: 'italic'}}>{battleResults.judge.solution_2_feedback}</p>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px' }}>
                      Drag judge here to configure. Waiting for execution...
                    </div>
                  )}
                </div>
                {battleResults && !isLoading && (
                  <div style={{ padding: '0 16px 12px 16px' }}>
                    <button className="btn-see-response" onClick={() => setModalData({
                      title: `${JUDGES_LIST.find(j => j.id === judgeModel)?.name || judgeModel} Evaluation`,
                      content: `### **Evaluation Summary**\n\n- **Model 1 Score:** ${battleResults.judge.solution_1_score}/10\n- **Model 2 Score:** ${battleResults.judge.solution_2_score}/10\n- **Question Score:** ${battleResults.judge.question_score || 0}/10\n\n---\n\n### **Model 1 Feedback**\n${battleResults.judge.solution_1_feedback}\n\n---\n\n### **Model 2 Feedback**\n${battleResults.judge.solution_2_feedback}`
                    })}>⚖️ See Evaluation Details</button>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Bottom-left controls */}
          <div className="canvas-controls">
            <button className="control-btn" onClick={zoomIn} title="Zoom In">+</button>
            <button className="control-btn" onClick={zoomOut} title="Zoom Out">-</button>
            <button className="control-btn" onClick={resetZoom} title="Reset View">⛶</button>
            <button className="control-btn" title="Lock Workspace">🔒</button>
          </div>
        </div>
      </main>

      {/* 4. Right Sidebar - AI Battle Inspector */}
      <aside className={`right-panel ${isRightPanelOpen ? 'open' : ''}`}>
        <div className="right-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="right-panel-title">Battle Controller</span>
          <button className="btn-close-sidebar" onClick={() => setIsRightPanelOpen(false)}>✕</button>
        </div>
        <div className="right-panel-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 'calc(100% - 57px)', gap: '16px' }}>
          
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {battleResults && !isLoading ? (
              <div className="battle-results-panel">
                <div className="results-header">
                  <span className="results-title">BATTLE RESULTS</span>
                  {winner !== 'tie' ? (
                    <span className="results-winner">
                      {winner === 'model1' 
                        ? MODELS_LIST.find(m => m.id === model1)?.name 
                        : MODELS_LIST.find(m => m.id === model2)?.name} Wins!
                    </span>
                  ) : (
                    <span className="results-winner" style={{backgroundColor: '#4b5563', color: '#fff'}}>TIE BATTLE</span>
                  )}
                </div>
                <div className="result-model-row">
                  <span className="result-model-name">
                    <span>{MODELS_LIST.find(m => m.id === model1)?.name}</span>
                    <span style={{color: 'var(--accent-green)'}}>{battleResults.judge.solution_1_score}/10</span>
                  </span>
                  <span className="result-model-feedback">{battleResults.judge.solution_1_feedback}</span>
                </div>
                <div className="result-model-row">
                  <span className="result-model-name">
                    <span>{MODELS_LIST.find(m => m.id === model2)?.name}</span>
                    <span style={{color: 'var(--accent-green)'}}>{battleResults.judge.solution_2_score}/10</span>
                  </span>
                  <span className="result-model-feedback">{battleResults.judge.solution_2_feedback}</span>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px', fontSize: '13px' }}>
                Drag AI models and a judge onto the canvas, type your prompt below, and start the battle!
              </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Enter Prompt / Question</label>
              <textarea 
                value={question} 
                onChange={(e) => setQuestion(e.target.value)} 
                className="textarea-box"
                placeholder="Ask a question for the models to fight over..."
              />
            </div>

            <button 
              onClick={runBattle} 
              disabled={isLoading || !question} 
              className="btn-battle-launch"
            >
              {isLoading ? (
                <>Running Battle...</>
              ) : (
                <>⚔️ Initiate AI Battle</>
              )}
            </button>
          </div>

        </div>
      </aside>
      {modalData && (
        <div className="modal-overlay" onClick={() => setModalData(null)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{modalData.title}</span>
              <button className="modal-close-btn" onClick={() => setModalData(null)}>✕</button>
            </div>
            <div className="modal-body">
              {renderMarkdown(modalData.content)}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setModalData(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
      {touchActiveItem && (
        <div 
          style={{
            position: 'fixed',
            top: touchPos.y - 20,
            left: touchPos.x - 70,
            width: 140,
            pointerEvents: 'none',
            zIndex: 9999,
            backgroundColor: 'var(--bg-dark)',
            border: '1px solid #4752C4',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '12px',
            color: 'var(--text-primary)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            opacity: 0.9,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <img src={touchActiveItem.item.icon} alt="" style={{ width: 14, height: 14, objectFit: 'contain' }} />
          <span>{touchActiveItem.item.name}</span>
        </div>
      )}

    </div>
  );
};

export default Battel;
