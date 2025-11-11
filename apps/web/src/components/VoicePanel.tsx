/**
 * Voice Panel Component
 */

import React, { useEffect, useState } from 'react';
import { AIAction } from '@voxforge/core';

interface VoicePanelProps {
  active: boolean;
  transcript: string;
  action: AIAction | null;
  onTranscript: (transcript: string, action: AIAction | null) => void;
}

function VoicePanel({ active, transcript, action, onTranscript }: VoicePanelProps) {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (active) {
      setIsListening(true);
      // Simulate voice recognition
      const timeout = setTimeout(() => {
        onTranscript(
          'Explain the main function in this file',
          AIAction.EXPLAIN
        );
      }, 2000);
      return () => clearTimeout(timeout);
    } else {
      setIsListening(false);
    }
  }, [active]);

  return (
    <div className="voice-panel">
      <div className="voice-status">
        <div className={`voice-indicator ${isListening ? 'active' : ''}`}>
          {isListening ? '🎙' : '🔇'}
        </div>
        <div>
          {isListening ? 'Listening...' : 'Voice Inactive'}
        </div>
      </div>

      <div className="transcript-box">
        <h3>TRANSCRIPT</h3>
        <div className="transcript-text">
          {transcript || 'Say "Hey Vox" to start...'}
        </div>
        {action && (
          <div className="action-badge">
            Action: {action}
          </div>
        )}
      </div>

      <div className="ai-commands">
        <h4>VOICE COMMANDS</h4>
        <ul>
          <li><code>Explain</code> this code</li>
          <li><code>Refactor</code> this function</li>
          <li><code>Generate tests</code> for this</li>
          <li><code>Fix</code> this error</li>
          <li><code>Document</code> this code</li>
          <li><code>Translate</code> to Python</li>
        </ul>
      </div>
    </div>
  );
}

export default VoicePanel;
