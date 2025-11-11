/**
 * Header Component
 */

import React from 'react';

interface HeaderProps {
  voiceActive: boolean;
  onVoiceToggle: () => void;
}

function Header({ voiceActive, onVoiceToggle }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-title">
        <span className="logo">🎤</span>
        <h1>VoxForge IDE</h1>
      </div>
      
      <div className="header-actions">
        <button 
          className={`btn btn-primary ${voiceActive ? 'active' : ''}`}
          onClick={onVoiceToggle}
        >
          {voiceActive ? '⏹ Stop Voice' : '🎙 Start Voice'}
        </button>
        <button className="btn btn-secondary">
          ⚙ Settings
        </button>
      </div>
    </header>
  );
}

export default Header;
