import { useState, useEffect, useRef } from 'react';
import { KeyboardShortcut } from '@voxforge/core';
import './CommandPalette.css';

interface CommandPaletteProps {
  shortcuts: KeyboardShortcut[];
  isOpen: boolean;
  onClose: () => void;
}

function CommandPalette({ shortcuts, isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredShortcuts = shortcuts.filter(shortcut =>
    shortcut.description.toLowerCase().includes(search.toLowerCase()) ||
    (shortcut.category && shortcut.category.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredShortcuts.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredShortcuts[selectedIndex]) {
          filteredShortcuts[selectedIndex].action();
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  const formatShortcut = (shortcut: KeyboardShortcut): string => {
    const parts: string[] = [];
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.meta) parts.push('⌘');
    parts.push(shortcut.key.toUpperCase());
    return parts.join('+');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="command-palette-overlay" onClick={onClose} />
      <div className="command-palette">
        <div className="command-palette-search">
          <span className="command-palette-search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="command-palette-input"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="command-palette-results">
          {filteredShortcuts.length === 0 ? (
            <div className="command-palette-empty">No commands found</div>
          ) : (
            filteredShortcuts.map((shortcut, index) => (
              <div
                key={shortcut.id}
                className={`command-palette-item ${
                  index === selectedIndex ? 'selected' : ''
                }`}
                onClick={() => {
                  shortcut.action();
                  onClose();
                }}
              >
                <div className="command-palette-item-content">
                  {shortcut.category && (
                    <span className="command-palette-category">
                      {shortcut.category}
                    </span>
                  )}
                  <span className="command-palette-description">
                    {shortcut.description}
                  </span>
                </div>
                <span className="command-palette-shortcut">
                  {formatShortcut(shortcut)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default CommandPalette;
