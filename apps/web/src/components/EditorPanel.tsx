/**
 * Editor Panel Component
 */

import React, { useState } from 'react';

function EditorPanel() {
  const [activeTab, setActiveTab] = useState('welcome.ts');

  const tabs = ['welcome.ts', 'app.tsx', 'utils.ts'];

  return (
    <div className="editor-panel">
      <div className="editor-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="editor-content">
        {activeTab === 'welcome.ts' ? (
          <pre>{`/**
 * Welcome to VoxForge IDE
 * 
 * An AI-first, voice-driven development environment
 */

export function greet(name: string): string {
  return \`Hello, \${name}! Welcome to VoxForge IDE.\`;
}

export function main(): void {
  console.log(greet('Developer'));
  console.log('Try saying: "Explain this function"');
}

main();`}</pre>
        ) : (
          <div className="placeholder">
            Select a file to edit or use voice commands to generate code
          </div>
        )}
      </div>
    </div>
  );
}

export default EditorPanel;
