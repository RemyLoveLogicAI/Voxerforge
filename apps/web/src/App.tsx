import { useState, useEffect } from 'react';
import { VoxForgeContext, Platform, IDEMode, KeyboardShortcutsManager, NotificationManager } from '@voxforge/core';
import { MockAIAssistant, AIRequestManager } from '@voxforge/ai';
import { VoiceCommandExecutor, WebSpeechRecognition, VoiceCommandProcessor } from '@voxforge/voice';
import Editor from './components/Editor';
import VoiceControl from './components/VoiceControl';
import Sidebar from './components/Sidebar';
import StatusBar from './components/StatusBar';
import CommandPalette from './components/CommandPalette';
import NotificationPanel from './components/NotificationPanel';
import AIPanel from './components/AIPanel';
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
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [aiPanelOpen, setAIPanelOpen] = useState(false);
  
  const [aiAssistant] = useState(() => new MockAIAssistant({
    provider: 'mock' as any,
    model: 'mock-model'
  }));

  const [aiManager] = useState(() => new AIRequestManager(aiAssistant));
  const [notificationManager] = useState(() => new NotificationManager());
  const [shortcutsManager] = useState(() => new KeyboardShortcutsManager());
  const [voiceExecutor] = useState(() => new VoiceCommandExecutor(context));
  const [voiceProcessor] = useState(() => new VoiceCommandProcessor());
  const [voiceRecognition] = useState(() => new WebSpeechRecognition({
    language: 'en-US',
    continuous: true,
    interimResults: true,
    maxAlternatives: 3
  }));

  useEffect(() => {
    // Set up event listeners
    context.on('file:open', (path) => {
      setCurrentFile(path);
      notificationManager.info(`Opened file: ${path}`);
    });

    context.on('file:save', (path) => {
      notificationManager.success(`Saved file: ${path}`);
    });

    context.on('mode:change', (mode) => {
      console.log('Mode changed to:', mode);
    });

    context.on('ai:response', () => {
      notificationManager.info('AI response received', 'AI Assistant');
    });

    // Register keyboard shortcuts
    shortcutsManager.register({
      key: 'k',
      meta: true,
      description: 'Open command palette',
      category: 'General',
      action: () => setCommandPaletteOpen(true)
    });

    shortcutsManager.register({
      key: 'k',
      ctrl: true,
      description: 'Open command palette',
      category: 'General',
      action: () => setCommandPaletteOpen(true)
    });

    shortcutsManager.register({
      key: 'i',
      meta: true,
      description: 'Toggle AI panel',
      category: 'AI',
      action: () => setAIPanelOpen(prev => !prev)
    });

    shortcutsManager.register({
      key: 'i',
      ctrl: true,
      description: 'Toggle AI panel',
      category: 'AI',
      action: () => setAIPanelOpen(prev => !prev)
    });

    shortcutsManager.register({
      key: 's',
      meta: true,
      description: 'Save current file',
      category: 'File',
      action: () => {
        if (currentFile) {
          context.emit('file:save', currentFile, '');
        }
      }
    });

    shortcutsManager.register({
      key: 's',
      ctrl: true,
      description: 'Save current file',
      category: 'File',
      action: () => {
        if (currentFile) {
          context.emit('file:save', currentFile, '');
        }
      }
    });

    // Voice recognition setup
    if (voiceRecognition.isAvailable()) {
      voiceRecognition.onResult((result) => {
        if (result.isFinal) {
          const command = voiceProcessor.processTranscript(result.transcript, result.confidence);
          if (command) {
            voiceExecutor.executeCommand(command);
            notificationManager.info(`Executed: ${result.transcript}`, 'Voice Command');
          }
        }
      });

      voiceRecognition.onError((error) => {
        notificationManager.error(error.message, 'Voice Recognition Error');
      });
    }

    return () => {
      context.removeAllListeners();
      shortcutsManager.destroy();
    };
  }, [context, shortcutsManager, notificationManager, voiceExecutor, voiceProcessor, voiceRecognition, currentFile]);

  const handleVoiceToggle = async (enabled: boolean) => {
    setVoiceEnabled(enabled);
    if (enabled) {
      context.setMode(IDEMode.VOICE);
      try {
        await voiceRecognition.start();
        notificationManager.success('Voice recognition started', 'Voice Control');
      } catch (error) {
        notificationManager.error('Failed to start voice recognition', 'Voice Control');
        setVoiceEnabled(false);
      }
    } else {
      context.setMode(IDEMode.NORMAL);
      try {
        await voiceRecognition.stop();
        notificationManager.info('Voice recognition stopped', 'Voice Control');
      } catch (error) {
        console.error('Failed to stop voice recognition:', error);
      }
    }
  };

  return (
    <div className="app">
      <div className="app-header">
        <div className="app-title">
          <h1>🎙️ VoxForge IDE</h1>
          <span className="platform-badge">Web (PWA)</span>
        </div>
        <div className="app-header-actions">
          <button
            className="header-action-button"
            onClick={() => setAIPanelOpen(!aiPanelOpen)}
            title="Toggle AI Assistant (Ctrl/Cmd+I)"
          >
            🤖 AI
          </button>
          <button
            className="header-action-button"
            onClick={() => setCommandPaletteOpen(true)}
            title="Command Palette (Ctrl/Cmd+K)"
          >
            ⌘ Commands
          </button>
          <VoiceControl 
            enabled={voiceEnabled} 
            onToggle={handleVoiceToggle}
          />
        </div>
      </div>
      <div className="app-body">
        <Sidebar context={context} />
        <div className="app-main">
          <Editor 
            context={context} 
            currentFile={currentFile}
          />
        </div>
        {aiPanelOpen && (
          <AIPanel
            aiManager={aiManager}
            context={context}
            isOpen={aiPanelOpen}
            onClose={() => setAIPanelOpen(false)}
          />
        )}
      </div>
      <StatusBar 
        context={context} 
        voiceEnabled={voiceEnabled}
        currentFile={currentFile}
      />
      
      <CommandPalette
        shortcuts={shortcutsManager.getAll()}
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
      
      <NotificationPanel manager={notificationManager} />
    </div>
  );
}

export default App;
