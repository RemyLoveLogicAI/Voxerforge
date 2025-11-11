import { VoxForgeContext, IDEMode } from '@voxforge/core';
import './StatusBar.css';

interface StatusBarProps {
  context: VoxForgeContext;
  voiceEnabled: boolean;
  currentFile: string | null;
}

function StatusBar({ context, voiceEnabled, currentFile }: StatusBarProps) {
  const mode = context.getMode();
  const platform = context.getPlatform();

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="status-item">
          Platform: {platform.toUpperCase()}
        </span>
        <span className="status-item">
          Mode: {mode}
        </span>
        {currentFile && (
          <span className="status-item">
            {currentFile}
          </span>
        )}
      </div>
      <div className="status-right">
        <span className={`status-item ${voiceEnabled ? 'status-active' : ''}`}>
          {voiceEnabled ? '🎙️ Voice Active' : '🎙️ Voice Inactive'}
        </span>
        <span className="status-item">
          AI: Ready
        </span>
      </div>
    </div>
  );
}

export default StatusBar;
