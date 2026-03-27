/**
 * Plugin System for VoxForge IDE
 * 
 * Allows third-party extensions to add functionality
 */

import { AIAction } from '@voxforge/core';

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  repository?: string;
  
  // Capabilities
  contributes?: {
    commands?: CommandContribution[];
    voicePatterns?: VoicePatternContribution[];
    modelProviders?: ModelProviderContribution[];
    themes?: ThemeContribution[];
    languages?: LanguageContribution[];
  };
  
  // Activation
  activationEvents?: string[];
  main?: string;
}

export interface CommandContribution {
  id: string;
  title: string;
  category?: string;
  keybinding?: string;
}

export interface VoicePatternContribution {
  pattern: string;
  action: string;
  description: string;
}

export interface ModelProviderContribution {
  id: string;
  name: string;
  models: string[];
}

export interface ThemeContribution {
  id: string;
  label: string;
  path: string;
}

export interface LanguageContribution {
  id: string;
  extensions: string[];
  configuration?: string;
}

export interface Plugin {
  manifest: PluginManifest;
  
  /**
   * Called when plugin is activated
   */
  activate?(context: PluginContext): Promise<void> | void;
  
  /**
   * Called when plugin is deactivated
   */
  deactivate?(): Promise<void> | void;
}

export interface PluginContext {
  /**
   * Register a command
   */
  registerCommand(id: string, handler: CommandHandler): void;
  
  /**
   * Register a voice pattern
   */
  registerVoicePattern(pattern: RegExp, handler: VoiceHandler): void;
  
  /**
   * Register a model provider
   */
  registerModelProvider(provider: CustomModelProvider): void;
  
  /**
   * Get workspace path
   */
  getWorkspacePath(): string;
  
  /**
   * Show notification
   */
  showNotification(message: string, type?: 'info' | 'warning' | 'error'): void;
}

export type CommandHandler = (...args: any[]) => Promise<void> | void;
export type VoiceHandler = (transcript: string, params: Record<string, any>) => Promise<void> | void;

export interface CustomModelProvider {
  id: string;
  name: string;
  complete(prompt: string, options?: any): Promise<string>;
}

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private commands: Map<string, CommandHandler> = new Map();
  private voicePatterns: Array<{ pattern: RegExp; handler: VoiceHandler }> = [];
  private modelProviders: Map<string, CustomModelProvider> = new Map();

  /**
   * Load a plugin
   */
  async loadPlugin(manifest: PluginManifest, plugin: Plugin): Promise<void> {
    this.plugins.set(manifest.id, plugin);

    // Create context
    const context: PluginContext = {
      registerCommand: (id, handler) => {
        this.commands.set(id, handler);
      },
      registerVoicePattern: (pattern, handler) => {
        this.voicePatterns.push({ pattern, handler });
      },
      registerModelProvider: (provider) => {
        this.modelProviders.set(provider.id, provider);
      },
      getWorkspacePath: () => process.cwd(),
      showNotification: (message, type = 'info') => {
        console.log(`[${type.toUpperCase()}] ${message}`);
      },
    };

    // Activate plugin
    if (plugin.activate) {
      await plugin.activate(context);
    }
  }

  /**
   * Unload a plugin
   */
  async unloadPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (plugin?.deactivate) {
      await plugin.deactivate();
    }
    this.plugins.delete(pluginId);
  }

  /**
   * Execute a command
   */
  async executeCommand(commandId: string, ...args: any[]): Promise<void> {
    const handler = this.commands.get(commandId);
    if (!handler) {
      throw new Error(`Command not found: ${commandId}`);
    }
    await handler(...args);
  }

  /**
   * Match voice input against registered patterns
   */
  async matchVoicePattern(transcript: string): Promise<boolean> {
    for (const { pattern, handler } of this.voicePatterns) {
      const match = pattern.exec(transcript);
      if (match) {
        const params = match.groups || {};
        await handler(transcript, params);
        return true;
      }
    }
    return false;
  }

  /**
   * Get all loaded plugins
   */
  getPlugins(): PluginManifest[] {
    return Array.from(this.plugins.values()).map(p => p.manifest);
  }
}
