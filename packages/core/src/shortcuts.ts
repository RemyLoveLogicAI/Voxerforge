/**
 * Keyboard Shortcuts Manager
 * Manages keyboard shortcuts and command palette
 */

export interface KeyboardShortcut {
  id: string;
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  description: string;
  action: () => void | Promise<void>;
  category?: string;
}

export class KeyboardShortcutsManager {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private enabled: boolean = true;

  constructor() {
    this.setupEventListener();
  }

  private setupEventListener(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.enabled) return;

    const keyCombo = this.createKeyCombo(event);
    const shortcut = this.shortcuts.get(keyCombo);

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }

  private createKeyCombo(event: KeyboardEvent): string {
    const parts: string[] = [];
    
    if (event.ctrlKey) parts.push('ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    if (event.metaKey) parts.push('meta');
    
    parts.push(event.key.toLowerCase());
    
    return parts.join('+');
  }

  private createShortcutKey(shortcut: Omit<KeyboardShortcut, 'id'>): string {
    const parts: string[] = [];
    
    if (shortcut.ctrl) parts.push('ctrl');
    if (shortcut.alt) parts.push('alt');
    if (shortcut.shift) parts.push('shift');
    if (shortcut.meta) parts.push('meta');
    
    parts.push(shortcut.key.toLowerCase());
    
    return parts.join('+');
  }

  register(shortcut: Omit<KeyboardShortcut, 'id'>): string {
    const id = `shortcut_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const key = this.createShortcutKey(shortcut);
    
    this.shortcuts.set(key, {
      ...shortcut,
      id
    });
    
    return id;
  }

  unregister(id: string): boolean {
    for (const [key, shortcut] of this.shortcuts.entries()) {
      if (shortcut.id === id) {
        this.shortcuts.delete(key);
        return true;
      }
    }
    return false;
  }

  getAll(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  getByCategory(category: string): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values())
      .filter(s => s.category === category);
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }
    this.shortcuts.clear();
  }
}

export default KeyboardShortcutsManager;
