/**
 * Core interfaces for VoxForge IDE components
 */

import {
  AIAction,
  AIActionContext,
  AIActionResult,
  ModelConfig,
  VoiceIntent,
  VoiceRecognitionResult,
  CodeDiff,
  Checkpoint,
  ProjectContext,
} from './types.js';

/**
 * AI Model interface - abstraction for different AI providers
 */
export interface IAIModel {
  readonly provider: string;
  readonly modelId: string;
  
  /**
   * Generate completion from a prompt
   */
  complete(prompt: string, options?: CompletionOptions): Promise<string>;
  
  /**
   * Stream completion with callback
   */
  streamComplete(
    prompt: string,
    onChunk: (chunk: string) => void,
    options?: CompletionOptions
  ): Promise<void>;
  
  /**
   * Check if model is available
   */
  isAvailable(): Promise<boolean>;
}

export interface CompletionOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stopSequences?: string[];
}

/**
 * Model Router - selects appropriate model for tasks
 */
export interface IModelRouter {
  /**
   * Route an AI action to the appropriate model
   */
  routeAction(context: AIActionContext): Promise<IAIModel>;
  
  /**
   * Get model by profile name
   */
  getModelByProfile(profileName: string): Promise<IAIModel>;
  
  /**
   * Register a new model
   */
  registerModel(config: ModelConfig): void;
}

/**
 * Voice Recognition Engine
 */
export interface IVoiceEngine {
  /**
   * Start listening for voice input
   */
  startListening(): Promise<void>;
  
  /**
   * Stop listening
   */
  stopListening(): Promise<void>;
  
  /**
   * Process voice input and extract intent
   */
  processVoice(audio: ArrayBuffer): Promise<VoiceRecognitionResult>;
  
  /**
   * Parse command from transcript
   */
  parseIntent(transcript: string): Promise<VoiceIntent>;
  
  /**
   * Check if engine is listening
   */
  isListening(): boolean;
}

/**
 * Code Operations - safe code transformations
 */
export interface ICodeOperations {
  /**
   * Execute an AI action with plan-diff-confirm workflow
   */
  executeAction(context: AIActionContext): Promise<AIActionResult>;
  
  /**
   * Generate diff preview
   */
  generateDiff(oldContent: string, newContent: string, filePath: string): Promise<CodeDiff>;
  
  /**
   * Apply diff to files
   */
  applyDiff(diff: CodeDiff): Promise<void>;
  
  /**
   * Create checkpoint for rollback
   */
  createCheckpoint(description: string, files: string[]): Promise<Checkpoint>;
  
  /**
   * Rollback to checkpoint
   */
  rollback(checkpointId: string): Promise<void>;
  
  /**
   * Get rollback history
   */
  getCheckpoints(): Promise<Checkpoint[]>;
}

/**
 * Terminal Integration
 */
export interface ITerminal {
  /**
   * Execute command in terminal
   */
  execute(command: string, options?: TerminalOptions): Promise<TerminalResult>;
  
  /**
   * Execute AI-enhanced command
   */
  executeAI(command: string): Promise<TerminalResult>;
  
  /**
   * Get terminal output
   */
  getOutput(): string[];
  
  /**
   * Clear terminal
   */
  clear(): void;
}

export interface TerminalOptions {
  cwd?: string;
  env?: Record<string, string>;
  shell?: string;
}

export interface TerminalResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  duration: number;
}

/**
 * MCP Tool Integration
 */
export interface IMCPTool {
  readonly name: string;
  readonly description: string;
  
  /**
   * Execute tool with parameters
   */
  execute(params: Record<string, unknown>): Promise<unknown>;
  
  /**
   * Get tool schema
   */
  getSchema(): Record<string, unknown>;
}

/**
 * Remote Bridge - for remote client connections
 */
export interface IRemoteBridge {
  /**
   * Start relay server
   */
  startServer(port: number): Promise<void>;
  
  /**
   * Connect to relay server
   */
  connect(url: string, credentials: RemoteCredentials): Promise<void>;
  
  /**
   * Send event to remote clients
   */
  broadcast(event: RemoteEvent): Promise<void>;
  
  /**
   * Handle incoming remote commands
   */
  onCommand(handler: (cmd: RemoteCommand) => Promise<void>): void;
  
  /**
   * Disconnect
   */
  disconnect(): Promise<void>;
}

export interface RemoteCredentials {
  deviceId: string;
  token: string;
}

export interface RemoteEvent {
  type: string;
  payload: unknown;
  timestamp: Date;
}

export interface RemoteCommand {
  id: string;
  type: string;
  payload: unknown;
  requiresConfirmation: boolean;
}

/**
 * Project Manager - manages project context
 */
export interface IProjectManager {
  /**
   * Load project context
   */
  loadProject(rootPath: string): Promise<ProjectContext>;
  
  /**
   * Get current project
   */
  getCurrentProject(): ProjectContext | null;
  
  /**
   * Update project context
   */
  updateContext(updates: Partial<ProjectContext>): Promise<void>;
  
  /**
   * Get project files
   */
  getFiles(pattern?: string): Promise<string[]>;
}
