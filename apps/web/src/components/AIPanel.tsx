import { useState, useRef, useEffect } from 'react';
import { AIRequestManager } from '@voxforge/ai';
import { VoxForgeContext, AIRequest, AIResponse } from '@voxforge/core';
import './AIPanel.css';

interface AIPanelProps {
  aiManager: AIRequestManager;
  context: VoxForgeContext;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function AIPanel({ aiManager, context, isOpen, onClose }: AIPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI coding assistant. Ask me anything about your code, or request code generation, explanations, refactoring suggestions, and more!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const editorState = context.getEditorState();
      const request: AIRequest = {
        id: `req_${Date.now()}`,
        type: 'chat',
        context: JSON.stringify(editorState),
        prompt: input
      };

      const response: AIResponse = await aiManager.submitRequest(request);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `Error: ${(error as Error).message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: '💡 Explain Code', prompt: 'Explain the current code selection' },
    { label: '🔧 Suggest Refactoring', prompt: 'Suggest refactoring improvements' },
    { label: '🐛 Debug Help', prompt: 'Help me debug this code' },
    { label: '✨ Generate Code', prompt: 'Generate code for: ' }
  ];

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <div className="ai-panel-title">
          <span className="ai-panel-icon">🤖</span>
          <h2>AI Assistant</h2>
        </div>
        <button className="ai-panel-close" onClick={onClose} aria-label="Close AI panel">
          ×
        </button>
      </div>

      <div className="ai-panel-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`ai-message ai-message-${message.role}`}
          >
            <div className="ai-message-avatar">
              {message.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="ai-message-content">
              <div className="ai-message-text">{message.content}</div>
              <div className="ai-message-time">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="ai-message ai-message-assistant">
            <div className="ai-message-avatar">🤖</div>
            <div className="ai-message-content">
              <div className="ai-message-loading">
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-panel-quick-actions">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className="ai-quick-action"
            onClick={() => handleQuickAction(action.prompt)}
          >
            {action.label}
          </button>
        ))}
      </div>

      <form className="ai-panel-input" onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          className="ai-input-field"
          placeholder="Ask anything... (Shift+Enter for new line)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          rows={2}
        />
        <button
          type="submit"
          className="ai-submit-button"
          disabled={!input.trim() || loading}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default AIPanel;
