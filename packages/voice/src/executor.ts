/**
 * Voice Command Executor
 * Executes structured voice commands
 */

import { VoiceCommand, VoxForgeContext } from '@voxforge/core';

export interface CommandAction {
  name: string;
  pattern: RegExp;
  execute: (matches: RegExpMatchArray, context: VoxForgeContext) => Promise<void> | void;
  description: string;
}

export class VoiceCommandExecutor {
  private actions: Map<string, CommandAction> = new Map();
  private context: VoxForgeContext;

  constructor(context: VoxForgeContext) {
    this.context = context;
    this.registerDefaultActions();
  }

  private registerDefaultActions(): void {
    // File operations
    this.registerAction({
      name: 'open-file',
      pattern: /^open (?:file|folder) (.+)$/i,
      description: 'Open a file or folder',
      execute: (matches) => {
        const path = matches[1];
        this.context.emit('file:open', path);
      }
    });

    this.registerAction({
      name: 'save-file',
      pattern: /^save(?: file)?$/i,
      description: 'Save current file',
      execute: () => {
        const state = this.context.getEditorState();
        if (state.activeFile) {
          this.context.emit('file:save', state.activeFile, '');
        }
      }
    });

    this.registerAction({
      name: 'close-file',
      pattern: /^close(?: file)?$/i,
      description: 'Close current file',
      execute: () => {
        const state = this.context.getEditorState();
        if (state.activeFile) {
          this.context.emit('file:close', state.activeFile);
        }
      }
    });

    // Editor operations
    this.registerAction({
      name: 'goto-line',
      pattern: /^go to line (\d+)$/i,
      description: 'Go to specific line number',
      execute: (matches) => {
        const line = parseInt(matches[1], 10);
        this.context.updateEditorState({
          cursor: { line, column: 0 }
        });
      }
    });

    this.registerAction({
      name: 'find-text',
      pattern: /^find (.+)$/i,
      description: 'Find text in file',
      execute: (matches) => {
        const searchText = matches[1];
        console.log('Finding:', searchText);
        // Emit custom event for search
        this.context.emit('editor:focus', searchText);
      }
    });

    // AI commands
    this.registerAction({
      name: 'explain-code',
      pattern: /^(?:explain|what does) (?:this code|this) (?:do|mean)$/i,
      description: 'Explain current code selection',
      execute: () => {
        const state = this.context.getEditorState();
        this.context.emit('ai:request', {
          id: this.generateId(),
          type: 'explanation',
          context: JSON.stringify(state),
          prompt: 'Explain this code'
        });
      }
    });

    this.registerAction({
      name: 'refactor-code',
      pattern: /^refactor (?:this )?(.+)$/i,
      description: 'Get refactoring suggestions',
      execute: (matches) => {
        const what = matches[1] || 'code';
        const state = this.context.getEditorState();
        this.context.emit('ai:request', {
          id: this.generateId(),
          type: 'refactor',
          context: JSON.stringify(state),
          prompt: `Refactor ${what}`
        });
      }
    });

    this.registerAction({
      name: 'generate-code',
      pattern: /^(?:generate|create|write) (?:a )?(.+)$/i,
      description: 'Generate code from description',
      execute: (matches) => {
        const description = matches[1];
        const state = this.context.getEditorState();
        this.context.emit('ai:request', {
          id: this.generateId(),
          type: 'completion',
          context: JSON.stringify(state),
          prompt: `Generate ${description}`
        });
      }
    });

    // Navigation
    this.registerAction({
      name: 'next-file',
      pattern: /^(?:next|go to next) (?:file|tab)$/i,
      description: 'Switch to next file',
      execute: () => {
        const state = this.context.getEditorState();
        const currentIndex = state.openFiles.findIndex(f => f === state.activeFile);
        if (currentIndex < state.openFiles.length - 1) {
          this.context.emit('file:open', state.openFiles[currentIndex + 1]);
        }
      }
    });

    this.registerAction({
      name: 'previous-file',
      pattern: /^(?:previous|go to previous) (?:file|tab)$/i,
      description: 'Switch to previous file',
      execute: () => {
        const state = this.context.getEditorState();
        const currentIndex = state.openFiles.findIndex(f => f === state.activeFile);
        if (currentIndex > 0) {
          this.context.emit('file:open', state.openFiles[currentIndex - 1]);
        }
      }
    });
  }

  registerAction(action: CommandAction): void {
    this.actions.set(action.name, action);
  }

  async executeCommand(command: VoiceCommand): Promise<boolean> {
    const transcript = command.transcript.trim();

    for (const action of this.actions.values()) {
      const matches = transcript.match(action.pattern);
      if (matches) {
        try {
          await action.execute(matches, this.context);
          return true;
        } catch (error) {
          console.error(`Failed to execute command ${action.name}:`, error);
          return false;
        }
      }
    }

    // No matching action found
    console.warn('No action found for command:', transcript);
    return false;
  }

  getAvailableActions(): CommandAction[] {
    return Array.from(this.actions.values());
  }

  private generateId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default VoiceCommandExecutor;
