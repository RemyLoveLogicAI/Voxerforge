/**
 * Constants used throughout VoxForge IDE
 */

/**
 * Default model configurations
 */
export const DEFAULT_MODELS = {
  OLLAMA_FAST: {
    provider: 'ollama' as const,
    modelId: 'llama3.1',
    temperature: 0.7,
    maxTokens: 2048,
  },
  OLLAMA_CODE: {
    provider: 'ollama' as const,
    modelId: 'codellama:7b',
    temperature: 0.3,
    maxTokens: 4096,
  },
  OLLAMA_CODER: {
    provider: 'ollama' as const,
    modelId: 'qwen2.5-coder',
    temperature: 0.3,
    maxTokens: 4096,
  },
};

/**
 * Wake words for voice activation
 */
export const WAKE_WORDS = ['hey vox', 'voxforge', 'hey forge'];

/**
 * Voice command patterns
 */
export const VOICE_PATTERNS = {
  EXPLAIN: /^(explain|what is|what does|describe|tell me about)/i,
  FIX: /^(fix|repair|debug|solve)/i,
  REFACTOR: /^(refactor|improve|optimize|clean up)/i,
  TRANSLATE: /^(translate|convert|transform).*(?:to|into)\s+(\w+)/i,
  DOCS: /^(document|add docs|generate docs|write docs)/i,
  TESTS: /^(test|add tests|generate tests|write tests)/i,
  REVIEW: /^(review|check|analyze|inspect)/i,
  SCAFFOLD: /^(scaffold|create|generate|setup).*(?:feature|component|module)/i,
};

/**
 * Terminal AI command prefixes
 */
export const AI_COMMANDS = {
  EXPLAIN: 'ai explain',
  FIX: 'ai fix',
  COMMIT: 'ai commit',
  DOC: 'ai doc',
  SUGGEST: 'ai suggest',
};

/**
 * File patterns to exclude from operations
 */
export const EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.git/**',
  '**/coverage/**',
  '**/*.log',
  '**/tmp/**',
  '**/temp/**',
];

/**
 * Supported programming languages
 */
export const SUPPORTED_LANGUAGES = [
  'typescript',
  'javascript',
  'python',
  'go',
  'rust',
  'java',
  'csharp',
  'cpp',
  'c',
  'ruby',
  'php',
  'swift',
  'kotlin',
] as const;

/**
 * Maximum rollback depth
 */
export const MAX_ROLLBACK_DEPTH = 50;

/**
 * Default configuration
 */
export const DEFAULT_CONFIG = {
  models: {
    profiles: [
      {
        name: 'default',
        description: 'Balanced profile using local models',
        fastDraft: DEFAULT_MODELS.OLLAMA_FAST,
        deepRefactor: DEFAULT_MODELS.OLLAMA_CODER,
        testGenerator: DEFAULT_MODELS.OLLAMA_CODE,
        explainer: DEFAULT_MODELS.OLLAMA_FAST,
      },
    ],
    defaultProfile: 'default',
  },
  voice: {
    enabled: true,
    pushToTalk: false,
    language: 'en-US',
    subtitles: true,
  },
  terminal: {
    defaultShell: 'bash' as const,
    aiCommands: true,
  },
  mcp: {
    servers: [],
  },
  remote: {
    enabled: false,
    encryption: true,
  },
  safety: {
    requireConfirmation: true,
    autoBackup: true,
    maxRollbackDepth: MAX_ROLLBACK_DEPTH,
  },
};
