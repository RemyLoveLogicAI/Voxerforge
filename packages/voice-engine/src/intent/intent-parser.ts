/**
 * Intent Parser - Parses voice transcripts into structured intents
 */

import { VoiceIntent, AIAction, VOICE_PATTERNS } from '@voxforge/core';

export class IntentParser {
  /**
   * Parse a transcript into a structured intent
   */
  async parse(transcript: string): Promise<VoiceIntent> {
    const normalized = transcript.toLowerCase().trim();
    
    // Detect action from patterns
    const action = this.detectAction(normalized);
    
    // Extract parameters based on action
    const parameters = this.extractParameters(normalized, action);
    
    return {
      command: transcript,
      confidence: action ? 0.9 : 0.5,
      action,
      parameters,
      timestamp: new Date(),
    };
  }

  /**
   * Detect AI action from transcript
   */
  private detectAction(normalized: string): AIAction | undefined {
    for (const [actionName, pattern] of Object.entries(VOICE_PATTERNS)) {
      if (pattern.test(normalized)) {
        return AIAction[actionName as keyof typeof AIAction];
      }
    }
    return undefined;
  }

  /**
   * Extract parameters from transcript
   */
  private extractParameters(
    normalized: string,
    action?: AIAction
  ): Record<string, unknown> {
    const params: Record<string, unknown> = {};

    // Extract file references
    const fileMatch = normalized.match(/(?:this\s+)?file\s+(\S+)/i);
    if (fileMatch) {
      params.file = fileMatch[1];
    }

    // Extract target language for translation
    if (action === AIAction.TRANSLATE) {
      const langMatch = normalized.match(/(?:to|into)\s+(\w+)/i);
      if (langMatch) {
        params.targetLanguage = langMatch[1];
      }
    }

    // Extract scope keywords
    if (normalized.includes('this function')) {
      params.scope = 'function';
    } else if (normalized.includes('this class')) {
      params.scope = 'class';
    } else if (normalized.includes('this file')) {
      params.scope = 'file';
    } else if (normalized.includes('this project')) {
      params.scope = 'project';
    }

    // Extract feature/component names
    const featureMatch = normalized.match(/(?:feature|component|module)\s+(?:called\s+)?(\w+)/i);
    if (featureMatch) {
      params.name = featureMatch[1];
    }

    return params;
  }

  /**
   * Check if transcript contains wake word
   */
  isWakeWord(transcript: string, wakeWords: string[]): boolean {
    const normalized = transcript.toLowerCase().trim();
    return wakeWords.some(word => normalized.includes(word.toLowerCase()));
  }

  /**
   * Extract command after wake word
   */
  extractCommand(transcript: string, wakeWord: string): string {
    const normalized = transcript.toLowerCase();
    const index = normalized.indexOf(wakeWord.toLowerCase());
    
    if (index === -1) {
      return transcript;
    }
    
    return transcript.substring(index + wakeWord.length).trim();
  }
}
