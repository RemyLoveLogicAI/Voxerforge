import { useState } from 'react';
import './VoiceControl.css';

interface VoiceControlProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

function VoiceControl({ enabled, onToggle }: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);

  const handleToggle = () => {
    const newState = !enabled;
    onToggle(newState);
    if (!newState) {
      setIsListening(false);
    }
  };

  const handleVoiceActivation = () => {
    if (enabled) {
      setIsListening(!isListening);
    }
  };

  return (
    <div className="voice-control">
      <button 
        className={`voice-toggle ${enabled ? 'active' : ''}`}
        onClick={handleToggle}
        title={enabled ? 'Disable voice control' : 'Enable voice control'}
      >
        🎙️ {enabled ? 'Voice: ON' : 'Voice: OFF'}
      </button>
      {enabled && (
        <button 
          className={`voice-activate ${isListening ? 'listening' : ''}`}
          onClick={handleVoiceActivation}
          title={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? '🔴 Listening...' : '⚪ Click to speak'}
        </button>
      )}
    </div>
  );
}

export default VoiceControl;
