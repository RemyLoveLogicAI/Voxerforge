/**
 * AI integration and assistants for VoxForge IDE
 */

import { AIRequest, AIResponse } from '@voxforge/core';

/**
 * AI provider types
 */
export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  LOCAL = 'local',
  CUSTOM = 'custom'
}

/**
 * AI model configuration
 */
export interface AIModelConfig {
  provider: AIProvider;
  model: string;
  apiKey?: string;
  endpoint?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Code context for AI requests
 */
export interface CodeContext {
  language: string;
  code: string;
  cursor?: {
    line: number;
    column: number;
  };
  selection?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
  fileName?: string;
  projectContext?: string;
}

/**
 * Abstract base class for AI assistants
 */
export abstract class AIAssistant {
  protected config: AIModelConfig;

  constructor(config: AIModelConfig) {
    this.config = config;
  }

  abstract generateCompletion(context: CodeContext, prompt: string): Promise<string>;
  abstract explainCode(context: CodeContext): Promise<string>;
  abstract suggestRefactoring(context: CodeContext): Promise<string[]>;
  abstract debugCode(context: CodeContext, error?: string): Promise<string>;
  abstract chat(message: string, history?: Array<{ role: string; content: string }>): Promise<string>;

  abstract isAvailable(): Promise<boolean>;
}

/**
 * Mock AI Assistant for development/testing
 */
export class MockAIAssistant extends AIAssistant {
  async generateCompletion(context: CodeContext, prompt: string): Promise<string> {
    // Simulate AI response
    const lang = context.language;
    return `// AI-generated code based on: ${prompt}\n// Language: ${lang}\nfunction example() {\n  // Implementation\n}`;
  }

  async explainCode(context: CodeContext): Promise<string> {
    const lang = context.language;
    const file = context.fileName || 'your file';
    return `This code in ${lang} appears to define functionality for ${file}. The implementation handles the core logic and returns the expected results.`;
  }

  async suggestRefactoring(context: CodeContext): Promise<string[]> {
    const lang = context.language;
    return [
      `Extract method for better code organization in ${lang}`,
      'Use more descriptive variable names',
      'Add error handling',
      'Consider using async/await pattern'
    ];
  }

  async debugCode(context: CodeContext, error?: string): Promise<string> {
    if (error) {
      return `The error "${error}" suggests checking for null values and ensuring proper type handling in your ${context.language} code.`;
    }
    return 'No immediate issues detected. Consider adding more error handling and edge case validation.';
  }

  async chat(message: string, history?: Array<{ role: string; content: string }>): Promise<string> {
    const hasHistory = history && history.length > 0;
    const context = hasHistory ? ` (with ${history.length} previous messages)` : '';
    return `I understand you're asking about: "${message}"${context}. As an AI coding assistant, I can help with code generation, explanation, debugging, and refactoring. What would you like me to do?`;
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}

/**
 * AI Request Manager
 * Handles queuing and processing of AI requests
 */
export class AIRequestManager {
  private assistant: AIAssistant;
  private requestQueue: AIRequest[] = [];
  private processing: boolean = false;

  constructor(assistant: AIAssistant) {
    this.assistant = assistant;
  }

  async submitRequest(request: AIRequest): Promise<AIResponse> {
    this.requestQueue.push(request);
    return this.processNextRequest();
  }

  private async processNextRequest(): Promise<AIResponse> {
    if (this.processing || this.requestQueue.length === 0) {
      return this.createErrorResponse('No pending requests or already processing');
    }

    this.processing = true;
    const request = this.requestQueue.shift()!;

    try {
      let content: string;

      switch (request.type) {
        case 'completion':
          content = await this.assistant.generateCompletion(
            this.parseContext(request.context),
            request.prompt
          );
          break;
        case 'explanation':
          content = await this.assistant.explainCode(this.parseContext(request.context));
          break;
        case 'refactor':
          const suggestions = await this.assistant.suggestRefactoring(
            this.parseContext(request.context)
          );
          content = suggestions.join('\n');
          break;
        case 'debug':
          content = await this.assistant.debugCode(this.parseContext(request.context));
          break;
        case 'chat':
          content = await this.assistant.chat(request.prompt);
          break;
        default:
          content = 'Unknown request type';
      }

      return {
        id: this.generateId(),
        requestId: request.id,
        content,
        confidence: 0.9
      };
    } catch (error) {
      return this.createErrorResponse((error as Error).message, request.id);
    } finally {
      this.processing = false;
    }
  }

  private parseContext(contextString: string): CodeContext {
    try {
      return JSON.parse(contextString);
    } catch {
      return {
        language: 'text',
        code: contextString
      };
    }
  }

  private createErrorResponse(message: string, requestId?: string): AIResponse {
    return {
      id: this.generateId(),
      requestId: requestId || 'unknown',
      content: `Error: ${message}`,
      confidence: 0
    };
  }

  private generateId(): string {
    return `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getQueueSize(): number {
    return this.requestQueue.length;
  }

  isProcessing(): boolean {
    return this.processing;
  }
}

export default AIAssistant;
