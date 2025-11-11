import { useState, useEffect } from 'react';
import { VoxForgeContext, Platform, IDEMode } from '@voxforge/core';
import { WebSpeechRecognition, VoiceCommandProcessor } from '@voxforge/voice';
import { MockAIAssistant, AIRequestManager } from '@voxforge/ai';
import Editor from './components/Editor';
import VoiceControl from './components/VoiceControl';
import Sidebar from './components/Sidebar';
import StatusBar from './components/StatusBar';
import './App.css';

function App() {
  const [context] = useState(() => new VoxForgeContext({
    platform: Platform.WEB,
    mode: IDEMode.NORMAL,
    voice: {
      enabled: true,
      language: 'en-US',
      continuous: true
    },
    ai: {
      enabled: true,
      provider: 'mock',
      model: 'mock-model'
    },
    editor: {
      theme: 'vs-dark',
      fontSize: 14,
      tabSize: 2,
      autoSave: true
    },
    sync: {
      enabled: false
    }
  }));

  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [aiAssistant] = useState(() => new MockAIAssistant({
    provider: 'mock' as any,
    model: 'mock-model'
  }));
  const [aiManager] = useState(() => new AIRequestManager(aiAssistant));

  useEffect(() => {
    // Set up event listeners
    context.on('file:open', (path) => {
      setCurrentFile(path);
    });

    context.on('mode:change', (mode) => {
      console.log('Mode changed to:', mode);
    });

    return () => {
      context.removeAllListeners();
    };
  }, [context]);

  const handleVoiceToggle = (enabled: boolean) => {
    setVoiceEnabled(enabled);
    if (enabled) {
      context.setMode(IDEMode.VOICE);
    } else {
      context.setMode(IDEMode.NORMAL);
    }
  };

  return (
    <div className="app">
      <div className="app-header">
        <div className="app-title">
          <h1>🎙️ VoxForge IDE</h1>
          <span className="platform-badge">Web (PWA)</span>
        </div>
        <VoiceControl 
          enabled={voiceEnabled} 
          onToggle={handleVoiceToggle}
        />
      </div>
      <div className="app-body">
        <Sidebar context={context} />
        <div className="app-main">
          <Editor 
            context={context} 
            currentFile={currentFile}
          />
        </div>
      </div>
      <StatusBar 
        context={context} 
        voiceEnabled={voiceEnabled}
        currentFile={currentFile}
      />
    </div>
  );
}

export default App;
