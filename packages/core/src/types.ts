/**
 * Core type definitions for VoxForge IDE
 */

/**
 * AI Model providers supported by VoxForge
 */
export type ModelProvider = 'ollama' | 'openai' | 'anthropic' | 'gemini' | 'custom';

/**
 * Model configuration
 */
export interface ModelConfig {
  provider: ModelProvider;
  modelId: string;
  apiKey?: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

/**
 * Model profile for different task types
 */
export interface ModelProfile {
  name: string;
  description: string;
  fastDraft?: ModelConfig;
  deepRefactor?: ModelConfig;
  testGenerator?: ModelConfig;
  explainer?: ModelConfig;
}

/**
 * AI Action types supported by VoxForge
 */
export enum AIAction {
  EXPLAIN = 'EXPLAIN',
  FIX = 'FIX',
  REFACTOR = 'REFACTOR',
  TRANSLATE = 'TRANSLATE',
  DOCS = 'DOCS',
  TESTS = 'TESTS',
  REVIEW = 'REVIEW',
  SCAFFOLD_FEATURE = 'SCAFFOLD_FEATURE',
  COMMIT_MESSAGE = 'COMMIT_MESSAGE',
  PR_DESCRIPTION = 'PR_DESCRIPTION',
}

/**
 * AI action context
 */
export interface AIActionContext {
  action: AIAction;
  input: string;
  language?: string;
  framework?: string;
  targetLanguage?: string; // For TRANSLATE action
  metadata?: Record<string, unknown>;
}

/**
 * AI action result
 */
export interface AIActionResult {
  success: boolean;
  output: string;
  plan?: string;
  diff?: CodeDiff;
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Code diff representation
 */
export interface CodeDiff {
  filePath: string;
  oldContent: string;
  newContent: string;
  hunks: DiffHunk[];
}

/**
 * Individual diff hunk
 */
export interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: string[];
}

/**
 * Voice command intent
 */
export interface VoiceIntent {
  command: string;
  confidence: number;
  action?: AIAction;
  parameters?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Voice recognition result
 */
export interface VoiceRecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
  alternatives?: Array<{ transcript: string; confidence: number }>;
}

/**
 * Configuration for VoxForge instance
 */
export interface VoxForgeConfig {
  models: {
    profiles: ModelProfile[];
    defaultProfile: string;
  };
  voice: {
    enabled: boolean;
    wakeWord?: string;
    pushToTalk?: boolean;
    language: string;
    subtitles: boolean;
  };
  terminal: {
    defaultShell: 'bash' | 'zsh' | 'pwsh';
    aiCommands: boolean;
  };
  mcp: {
    servers: MCPServerConfig[];
  };
  remote: {
    enabled: boolean;
    relayUrl?: string;
    encryption: boolean;
  };
  safety: {
    requireConfirmation: boolean;
    autoBackup: boolean;
    maxRollbackDepth: number;
  };
}

/**
 * MCP Server configuration
 */
export interface MCPServerConfig {
  name: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

/**
 * Project context for AI operations
 */
export interface ProjectContext {
  rootPath: string;
  language: string;
  framework?: string;
  dependencies?: Record<string, string>;
  gitBranch?: string;
  openFiles?: string[];
}

/**
 * Checkpoint for rollback functionality
 */
export interface Checkpoint {
  id: string;
  timestamp: Date;
  description: string;
  files: Map<string, string>; // filePath -> content
  metadata?: Record<string, unknown>;
}
