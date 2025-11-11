/**
 * Model Router - Routes AI actions to appropriate models
 */

import {
  IModelRouter,
  IAIModel,
  AIActionContext,
  AIAction,
  ModelConfig,
  ModelProfile,
} from '@voxforge/core';
import { OllamaModel } from './ollama.js';
import { OpenAIModel } from './openai.js';
import { AnthropicModel } from './anthropic.js';

export class ModelRouter implements IModelRouter {
  private models: Map<string, IAIModel> = new Map();
  private profiles: Map<string, ModelProfile> = new Map();
  private defaultProfile: string;

  constructor(profiles: ModelProfile[], defaultProfile: string) {
    this.defaultProfile = defaultProfile;
    profiles.forEach(profile => {
      this.profiles.set(profile.name, profile);
    });
  }

  async routeAction(context: AIActionContext): Promise<IAIModel> {
    const profile = this.profiles.get(this.defaultProfile);
    if (!profile) {
      throw new Error(`Profile not found: ${this.defaultProfile}`);
    }

    // Route based on action type
    let modelConfig: ModelConfig | undefined;

    switch (context.action) {
      case AIAction.EXPLAIN:
        modelConfig = profile.explainer;
        break;
      case AIAction.REFACTOR:
      case AIAction.TRANSLATE:
        modelConfig = profile.deepRefactor;
        break;
      case AIAction.TESTS:
        modelConfig = profile.testGenerator;
        break;
      case AIAction.FIX:
      case AIAction.DOCS:
      case AIAction.REVIEW:
      case AIAction.COMMIT_MESSAGE:
      case AIAction.PR_DESCRIPTION:
        modelConfig = profile.fastDraft;
        break;
      case AIAction.SCAFFOLD_FEATURE:
        modelConfig = profile.deepRefactor;
        break;
      default:
        modelConfig = profile.fastDraft;
    }

    if (!modelConfig) {
      // Fallback to fastDraft
      modelConfig = profile.fastDraft;
    }

    if (!modelConfig) {
      throw new Error('No model configuration available');
    }

    return this.getOrCreateModel(modelConfig);
  }

  async getModelByProfile(profileName: string): Promise<IAIModel> {
    const profile = this.profiles.get(profileName);
    if (!profile) {
      throw new Error(`Profile not found: ${profileName}`);
    }

    const modelConfig = profile.fastDraft;
    if (!modelConfig) {
      throw new Error(`No model configuration in profile: ${profileName}`);
    }

    return this.getOrCreateModel(modelConfig);
  }

  registerModel(config: ModelConfig): void {
    const key = `${config.provider}:${config.modelId}`;
    const model = this.createModel(config);
    this.models.set(key, model);
  }

  private getOrCreateModel(config: ModelConfig): IAIModel {
    const key = `${config.provider}:${config.modelId}`;
    
    let model = this.models.get(key);
    if (!model) {
      model = this.createModel(config);
      this.models.set(key, model);
    }
    
    return model;
  }

  private createModel(config: ModelConfig): IAIModel {
    switch (config.provider) {
      case 'ollama':
        return new OllamaModel({
          modelId: config.modelId,
          baseUrl: config.baseUrl,
        });
      
      case 'openai':
        if (!config.apiKey) {
          throw new Error('OpenAI API key is required');
        }
        return new OpenAIModel({
          modelId: config.modelId,
          apiKey: config.apiKey,
          baseUrl: config.baseUrl,
        });
      
      case 'anthropic':
        if (!config.apiKey) {
          throw new Error('Anthropic API key is required');
        }
        return new AnthropicModel({
          modelId: config.modelId,
          apiKey: config.apiKey,
          baseUrl: config.baseUrl,
        });
      
      default:
        throw new Error(`Unsupported model provider: ${config.provider}`);
    }
  }
}
