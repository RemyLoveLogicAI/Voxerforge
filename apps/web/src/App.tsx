/**
 * Main VoxForge IDE Application
 */

import React, { useState, useEffect } from 'react';
import { AIAction } from '@voxforge/core';
import Header from './components/Header';
import VoicePanel from './components/VoicePanel';
import EditorPanel from './components/EditorPanel';
import TerminalPanel from './components/TerminalPanel';
import './App.css';

function App() {
  const [voiceActive, setVoiceActive] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [currentAction, setCurrentAction] = useState<AIAction | null>(null);

  const handleVoiceToggle = () => {
    setVoiceActive(!voiceActive);
  };

  const handleTranscript = (transcript: string, action: AIAction | null) => {
    setCurrentTranscript(transcript);
    setCurrentAction(action);
  };

  return (
    <div className="app">
      <Header 
        voiceActive={voiceActive} 
        onVoiceToggle={handleVoiceToggle}
      />
      
      <div className="main-container">
        <VoicePanel
          active={voiceActive}
          transcript={currentTranscript}
          action={currentAction}
          onTranscript={handleTranscript}
        />
        
        <div className="content">
          <EditorPanel />
          <TerminalPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
