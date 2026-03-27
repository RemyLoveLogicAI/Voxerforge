/**
 * Voice Recognition Engine - Web Speech API implementation
 */

import { IVoiceEngine, VoiceRecognitionResult, VoiceIntent } from '@voxforge/core';
import { IntentParser } from '../intent/intent-parser.js';

export class VoiceRecognitionEngine implements IVoiceEngine {
  private recognition: any; // SpeechRecognition
  private isActive = false;
  private intentParser: IntentParser;
  private language: string;
  private continuous: boolean;
  private onResultCallback?: (result: VoiceRecognitionResult) => void;

  constructor(options: VoiceEngineOptions = {}) {
    this.language = options.language || 'en-US';
    this.continuous = options.continuous ?? true;
    this.intentParser = new IntentParser();

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

    this.recognition.continuous = this.continuous;
    this.recognition.interimResults = true;
    this.recognition.lang = this.language;

    this.recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const result = event.results[last];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence;

      const voiceResult: VoiceRecognitionResult = {
        transcript,
        isFinal: result.isFinal,
        confidence,
        alternatives: Array.from(result).map((alt: any) => ({
          transcript: alt.transcript,
          confidence: alt.confidence,
        })),
      };

      if (this.onResultCallback) {
        this.onResultCallback(voiceResult);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    this.recognition.onend = () => {
      if (this.isActive && this.continuous) {
        // Restart if continuous mode
        this.recognition.start();
      } else {
        this.isActive = false;
      }
    };
  }

  async startListening(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported in this environment');
    }

    if (this.isActive) {
      return;
    }

    this.isActive = true;
    this.recognition.start();
  }

  async stopListening(): Promise<void> {
    if (!this.recognition || !this.isActive) {
      return;
    }

    this.isActive = false;
    this.recognition.stop();
  }

  async processVoice(audio: ArrayBuffer): Promise<VoiceRecognitionResult> {
    // This is a placeholder for custom audio processing
    // In a real implementation, this would send audio to a speech recognition service
    throw new Error('Custom audio processing not implemented. Use startListening instead.');
  }

  async parseIntent(transcript: string): Promise<VoiceIntent> {
    return this.intentParser.parse(transcript);
  }

  isListening(): boolean {
    return this.isActive;
  }

  onResult(callback: (result: VoiceRecognitionResult) => void): void {
    this.onResultCallback = callback;
  }
}

export interface VoiceEngineOptions {
  language?: string;
  continuous?: boolean;
}
