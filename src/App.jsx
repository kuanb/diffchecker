import { useState } from 'react';
import DiffView from './DiffView.jsx';

export default function App() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const [viewMode, setViewMode] = useState('split');

  const handleCompare = () => setShowDiff(true);

  const handleClear = () => {
    setLeft('');
    setRight('');
    setShowDiff(false);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Diffchecker</h1>
        <p className="subtitle">Find the difference between two text blocks</p>
      </header>

      {!showDiff ? (
        <main className="panes">
          <div className="pane">
            <label className="pane-label">Original text</label>
            <textarea
              className="textarea"
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              placeholder="Paste original text here..."
              spellCheck={false}
            />
          </div>
          <div className="pane">
            <label className="pane-label">Changed text</label>
            <textarea
              className="textarea"
              value={right}
              onChange={(e) => setRight(e.target.value)}
              placeholder="Paste changed text here..."
              spellCheck={false}
            />
          </div>
        </main>
      ) : (
        <main className="diff-wrapper">
          <div className="diff-toolbar">
            <div className="view-toggle" role="tablist" aria-label="Diff view">
              <button
                role="tab"
                aria-selected={viewMode === 'split'}
                className={`toggle-btn ${viewMode === 'split' ? 'active' : ''}`}
                onClick={() => setViewMode('split')}
              >
                Side by side
              </button>
              <button
                role="tab"
                aria-selected={viewMode === 'unified'}
                className={`toggle-btn ${viewMode === 'unified' ? 'active' : ''}`}
                onClick={() => setViewMode('unified')}
              >
                Stacked
              </button>
            </div>
          </div>
          <DiffView left={left} right={right} mode={viewMode} />
        </main>
      )}

      <footer className="toolbar">
        {!showDiff ? (
          <button className="btn btn-primary" onClick={handleCompare}>
            Compare
          </button>
        ) : (
          <button className="btn" onClick={() => setShowDiff(false)}>
            Edit
          </button>
        )}
        <button className="btn btn-ghost" onClick={handleClear}>
          Clear
        </button>
      </footer>
    </div>
  );
}
