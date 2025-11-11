/**
 * Anthropic Model Implementation
 */

import { IAIModel, CompletionOptions } from '@voxforge/core';

export interface AnthropicConfig {
  apiKey: string;
  modelId: string;
  baseUrl?: string;
}

export class AnthropicModel implements IAIModel {
  readonly provider = 'anthropic';
  readonly modelId: string;
  private apiKey: string;
  private baseUrl: string;

  constructor(config: AnthropicConfig) {
    this.modelId = config.modelId;
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.anthropic.com/v1';
  }

  async complete(prompt: string, options?: CompletionOptions): Promise<string> {
    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.modelId,
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2048,
        top_p: options?.topP ?? 0.9,
        stop_sequences: options?.stopSequences,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  async streamComplete(
    prompt: string,
    onChunk: (chunk: string) => void,
    options?: CompletionOptions
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.modelId,
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2048,
        top_p: options?.topP ?? 0.9,
        stop_sequences: options?.stopSequences,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic request failed: ${response.statusText}`);
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
      
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta') {
              const text = parsed.delta?.text;
              if (text) {
                onChunk(text);
              }
            }
          } catch (e) {
            console.error('Failed to parse Anthropic response:', e);
          }
        }
      }
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Anthropic doesn't have a simple availability endpoint
      // We'll just check if the API key is set
      return this.apiKey.length > 0;
    } catch {
      return false;
    }
  }
}
