/**
 * Core types and interfaces for VoxForge IDE
 */

import { EventEmitter } from 'eventemitter3';

/**
 * Platform types supported by VoxForge IDE
 */
export enum Platform {
  WEB = 'web',
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  VR = 'vr',
  AR = 'ar'
}

/**
 * IDE modes
 */
export enum IDEMode {
  NORMAL = 'normal',
  VOICE = 'voice',
  REMOTE = 'remote',
  COLLABORATIVE = 'collaborative'
}

/**
 * File system item type
 */
export enum FileType {
  FILE = 'file',
  DIRECTORY = 'directory',
  SYMLINK = 'symlink'
}

/**
 * Represents a file or directory in the virtual file system
 */
export interface FileSystemItem {
  path: string;
  name: string;
  type: FileType;
  size?: number;
  modified?: Date;
  created?: Date;
}

/**
 * File content interface
 */
export interface FileContent {
  path: string;
  content: string;
  encoding?: string;
  language?: string;
}

/**
 * Editor position (cursor/selection)
 */
export interface Position {
  line: number;
  column: number;
}

/**
 * Editor selection range
 */
export interface Range {
  start: Position;
  end: Position;
}

/**
 * Editor state
 */
export interface EditorState {
  activeFile?: string;
  openFiles: string[];
  cursor?: Position;
  selection?: Range;
  language?: string;
}

/**
 * Voice command interface
 */
export interface VoiceCommand {
  id: string;
  transcript: string;
  confidence: number;
  timestamp: Date;
  processed: boolean;
}

/**
 * AI request/response interface
 */
export interface AIRequest {
  id: string;
  type: 'completion' | 'explanation' | 'refactor' | 'debug' | 'chat';
  context: string;
  prompt: string;
  model?: string;
}

export interface AIResponse {
  id: string;
  requestId: string;
  content: string;
  confidence?: number;
  suggestions?: string[];
}

/**
 * Base configuration interface
 */
export interface VoxForgeConfig {
  platform: Platform;
  mode: IDEMode;
  voice: {
    enabled: boolean;
    language: string;
    continuous: boolean;
  };
  ai: {
    enabled: boolean;
    provider: string;
    model: string;
    apiKey?: string;
  };
  editor: {
    theme: string;
    fontSize: number;
    tabSize: number;
    autoSave: boolean;
  };
  sync: {
    enabled: boolean;
    provider?: string;
  };
}

/**
 * Event types for the IDE
 */
export interface VoxForgeEvents {
  'file:open': (path: string) => void;
  'file:close': (path: string) => void;
  'file:save': (path: string, content: string) => void;
  'file:change': (path: string, content: string) => void;
  'voice:command': (command: VoiceCommand) => void;
  'voice:start': () => void;
  'voice:stop': () => void;
  'ai:request': (request: AIRequest) => void;
  'ai:response': (response: AIResponse) => void;
  'editor:focus': (path: string) => void;
  'editor:blur': () => void;
  'mode:change': (mode: IDEMode) => void;
}

/**
 * Base IDE context
 */
export class VoxForgeContext extends EventEmitter<VoxForgeEvents> {
  private config: VoxForgeConfig;
  private editorState: EditorState;

  constructor(config: VoxForgeConfig) {
    super();
    this.config = config;
    this.editorState = {
      openFiles: []
    };
  }

  getConfig(): VoxForgeConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<VoxForgeConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  getEditorState(): EditorState {
    return { ...this.editorState };
  }

  updateEditorState(updates: Partial<EditorState>): void {
    this.editorState = { ...this.editorState, ...updates };
  }

  getPlatform(): Platform {
    return this.config.platform;
  }

  getMode(): IDEMode {
    return this.config.mode;
  }

  setMode(mode: IDEMode): void {
    this.config.mode = mode;
    this.emit('mode:change', mode);
  }
}

export default VoxForgeContext;
