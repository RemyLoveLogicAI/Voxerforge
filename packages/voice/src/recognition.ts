/**
 * Voice recognition and processing for VoxForge IDE
 */

import { VoiceCommand } from '@voxforge/core';

/**
 * Voice recognition status
 */
export enum VoiceStatus {
  IDLE = 'idle',
  LISTENING = 'listening',
  PROCESSING = 'processing',
  ERROR = 'error'
}

/**
 * Voice recognition configuration
 */
export interface VoiceConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
}

/**
 * Voice recognition result
 */
export interface VoiceResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  alternatives?: string[];
}

/**
 * Abstract base class for voice recognition
 */
export abstract class VoiceRecognition {
  protected config: VoiceConfig;
  protected status: VoiceStatus = VoiceStatus.IDLE;
  protected onResultCallback?: (result: VoiceResult) => void;
  protected onErrorCallback?: (error: Error) => void;

  constructor(config: VoiceConfig) {
    this.config = config;
  }

  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
  abstract isAvailable(): boolean;

  getStatus(): VoiceStatus {
    return this.status;
  }

  onResult(callback: (result: VoiceResult) => void): void {
    this.onResultCallback = callback;
  }

  onError(callback: (error: Error) => void): void {
    this.onErrorCallback = callback;
  }

  protected emitResult(result: VoiceResult): void {
    if (this.onResultCallback) {
      this.onResultCallback(result);
    }
  }

  protected emitError(error: Error): void {
    if (this.onErrorCallback) {
      this.onErrorCallback(error);
    }
  }
}

/**
 * Web Speech API implementation
 */
export class WebSpeechRecognition extends VoiceRecognition {
  private recognition: any;

  constructor(config: VoiceConfig) {
    super(config);
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.setupRecognition();
      }
    }
  }

  private setupRecognition(): void {
    if (!this.recognition) return;

    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.maxAlternatives = this.config.maxAlternatives;
    this.recognition.lang = this.config.language;

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence;
      const isFinal = result.isFinal;

      const alternatives: string[] = [];
      for (let i = 1; i < result.length; i++) {
        alternatives.push(result[i].transcript);
      }

      this.emitResult({
        transcript,
        confidence,
        isFinal,
        alternatives: alternatives.length > 0 ? alternatives : undefined
      });
    };

    this.recognition.onerror = (event: any) => {
      this.status = VoiceStatus.ERROR;
      this.emitError(new Error(event.error));
    };

    this.recognition.onstart = () => {
      this.status = VoiceStatus.LISTENING;
    };

    this.recognition.onend = () => {
      this.status = VoiceStatus.IDLE;
    };
  }

  async start(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not available');
    }
    this.recognition.start();
  }

  async stop(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not available');
    }
    this.recognition.stop();
  }

  isAvailable(): boolean {
    return this.recognition !== undefined && this.recognition !== null;
  }
}

/**
 * Voice command processor
 * Converts voice transcripts into structured commands
 */
export class VoiceCommandProcessor {
  private commandPatterns: Map<string, RegExp> = new Map();

  constructor() {
    this.initializePatterns();
  }

  private initializePatterns(): void {
    // File operations
    this.commandPatterns.set('open', /^open (file|folder) (.+)$/i);
    this.commandPatterns.set('save', /^save( file)?$/i);
    this.commandPatterns.set('close', /^close( file)?$/i);
    this.commandPatterns.set('new', /^(new|create) (file|folder) (.+)$/i);

    // Editor operations
    this.commandPatterns.set('goto', /^go to line (\d+)$/i);
    this.commandPatterns.set('find', /^find (.+)$/i);
    this.commandPatterns.set('replace', /^replace (.+) with (.+)$/i);
    this.commandPatterns.set('undo', /^undo$/i);
    this.commandPatterns.set('redo', /^redo$/i);

    // Code generation
    this.commandPatterns.set('insert', /^insert (.+)$/i);
    this.commandPatterns.set('generate', /^generate (.+)$/i);
    this.commandPatterns.set('refactor', /^refactor (.+)$/i);

    // Navigation
    this.commandPatterns.set('next', /^(next|go to next) (file|tab)$/i);
    this.commandPatterns.set('previous', /^(previous|go to previous) (file|tab)$/i);
  }

  processTranscript(transcript: string, confidence: number): VoiceCommand | null {
    const normalizedTranscript = transcript.trim();

    for (const [, pattern] of this.commandPatterns) {
      const match = normalizedTranscript.match(pattern);
      if (match) {
        return {
          id: this.generateId(),
          transcript: normalizedTranscript,
          confidence,
          timestamp: new Date(),
          processed: false
        };
      }
    }

    // If no pattern matches, return as general command
    if (confidence > 0.7) {
      return {
        id: this.generateId(),
        transcript: normalizedTranscript,
        confidence,
        timestamp: new Date(),
        processed: false
      };
    }

    return null;
  }

  private generateId(): string {
    return `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  addPattern(name: string, pattern: RegExp): void {
    this.commandPatterns.set(name, pattern);
  }

  removePattern(name: string): boolean {
    return this.commandPatterns.delete(name);
  }
}

export default VoiceRecognition;
