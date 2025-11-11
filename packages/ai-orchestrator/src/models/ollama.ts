/**
 * Ollama Model Implementation
 * Provides integration with locally-running Ollama models
 */

import { IAIModel, CompletionOptions } from '@voxforge/core';

export interface OllamaConfig {
  baseUrl?: string;
  modelId: string;
}

export class OllamaModel implements IAIModel {
  readonly provider = 'ollama';
  readonly modelId: string;
  private baseUrl: string;

  constructor(config: OllamaConfig) {
    this.modelId = config.modelId;
    this.baseUrl = config.baseUrl || 'http://localhost:11434';
  }

  async complete(prompt: string, options?: CompletionOptions): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.modelId,
        prompt,
        temperature: options?.temperature ?? 0.7,
        options: {
          num_predict: options?.maxTokens ?? 2048,
          top_p: options?.topP ?? 0.9,
          stop: options?.stopSequences,
        },
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  }

  async streamComplete(
    prompt: string,
    onChunk: (chunk: string) => void,
    options?: CompletionOptions
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.modelId,
        prompt,
        temperature: options?.temperature ?? 0.7,
        options: {
          num_predict: options?.maxTokens ?? 2048,
          top_p: options?.topP ?? 0.9,
          stop: options?.stopSequences,
        },
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      
      // Keep the last incomplete line in buffer
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            const data = JSON.parse(line);
            if (data.response) {
              onChunk(data.response);
            }
          } catch (e) {
            console.error('Failed to parse Ollama response:', e);
          }
        }
      }
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        return false;
      }
      
      const data = await response.json();
      return data.models?.some((m: any) => m.name === this.modelId) ?? false;
    } catch {
      return false;
    }
  }
}
