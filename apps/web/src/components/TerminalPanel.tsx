/**
 * Terminal Panel Component
 */

import React, { useState, useEffect } from 'react';

function TerminalPanel() {
  const [lines, setLines] = useState<string[]>([
    '$ Welcome to VoxForge AI Terminal',
    '$ Type "ai help" for AI-enhanced commands',
    '',
  ]);

  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <div className="terminal-title">
          TERMINAL
        </div>
        <div className="terminal-actions">
          <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
            + New Terminal
          </button>
        </div>
      </div>

      <div className="terminal-content">
        {lines.map((line, index) => (
          <div key={index} className="terminal-line">
            {line.startsWith('$') ? (
              <>
                <span className="terminal-prompt">$</span>
                {line.substring(1)}
              </>
            ) : (
              line
            )}
          </div>
        ))}
        <div className="terminal-line">
          <span className="terminal-prompt">$</span>
          <span style={{ animation: 'blink 1s infinite' }}>_</span>
        </div>
      </div>
    </div>
  );
}

export default TerminalPanel;
