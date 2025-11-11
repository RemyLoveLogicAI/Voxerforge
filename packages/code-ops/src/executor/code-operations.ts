/**
 * Code Operations Executor - Implements the plan-diff-confirm-apply workflow
 */

import {
  ICodeOperations,
  AIActionContext,
  AIActionResult,
  AIAction,
  CodeDiff,
  Checkpoint,
  IModelRouter,
} from '@voxforge/core';
import { DiffGenerator } from '../diff/diff-generator.js';
import { CheckpointManager } from '../checkpoint/checkpoint-manager.js';
import * as fs from 'fs/promises';

export class CodeOperationsExecutor implements ICodeOperations {
  private diffGenerator: DiffGenerator;
  private checkpointManager: CheckpointManager;
  private modelRouter: IModelRouter;

  constructor(modelRouter: IModelRouter, checkpointDir: string) {
    this.modelRouter = modelRouter;
    this.diffGenerator = new DiffGenerator();
    this.checkpointManager = new CheckpointManager(checkpointDir);
  }

  /**
   * Execute an AI action with plan-diff-confirm workflow
   */
  async executeAction(context: AIActionContext): Promise<AIActionResult> {
    try {
      // Step 1: Generate plan
      const plan = await this.generatePlan(context);

      // Step 2: Generate code changes
      const output = await this.generateCode(context, plan);

      // Step 3: Generate diff if this is a code modification
      let diff: CodeDiff | undefined;
      if (this.isCodeModification(context.action)) {
        diff = await this.generateDiff(
          context.input,
          output,
          context.metadata?.filePath as string || 'unknown.ts'
        );
      }

      return {
        success: true,
        output,
        plan,
        diff,
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate diff preview
   */
  async generateDiff(
    oldContent: string,
    newContent: string,
    filePath: string
  ): Promise<CodeDiff> {
    return this.diffGenerator.generateDiff(oldContent, newContent, filePath);
  }

  /**
   * Apply diff to files
   */
  async applyDiff(diff: CodeDiff): Promise<void> {
    await fs.writeFile(diff.filePath, diff.newContent, 'utf-8');
  }

  /**
   * Create checkpoint for rollback
   */
  async createCheckpoint(description: string, files: string[]): Promise<Checkpoint> {
    return this.checkpointManager.createCheckpoint(description, files);
  }

  /**
   * Rollback to checkpoint
   */
  async rollback(checkpointId: string): Promise<void> {
    await this.checkpointManager.restoreCheckpoint(checkpointId);
  }

  /**
   * Get rollback history
   */
  async getCheckpoints(): Promise<Checkpoint[]> {
    return this.checkpointManager.getCheckpoints();
  }

  /**
   * Initialize the executor
   */
  async initialize(): Promise<void> {
    await this.checkpointManager.loadCheckpoints();
  }

  /**
   * Generate plan for the action
   */
  private async generatePlan(context: AIActionContext): Promise<string> {
    const model = await this.modelRouter.routeAction(context);
    
    const prompt = this.buildPlanPrompt(context);
    const plan = await model.complete(prompt, { temperature: 0.3, maxTokens: 512 });
    
    return plan;
  }

  /**
   * Generate code based on action and plan
   */
  private async generateCode(context: AIActionContext, plan: string): Promise<string> {
    const model = await this.modelRouter.routeAction(context);
    
    const prompt = this.buildCodePrompt(context, plan);
    const code = await model.complete(prompt, { temperature: 0.3, maxTokens: 4096 });
    
    return code;
  }

  /**
   * Build prompt for plan generation
   */
  private buildPlanPrompt(context: AIActionContext): string {
    const actionDescriptions: Record<AIAction, string> = {
      [AIAction.EXPLAIN]: 'Explain the following code in detail',
      [AIAction.FIX]: 'Analyze and fix issues in the following code',
      [AIAction.REFACTOR]: 'Refactor the following code to improve quality',
      [AIAction.TRANSLATE]: `Translate the following code to ${context.targetLanguage || 'another language'}`,
      [AIAction.DOCS]: 'Generate documentation for the following code',
      [AIAction.TESTS]: 'Generate comprehensive tests for the following code',
      [AIAction.REVIEW]: 'Review the following code and provide feedback',
      [AIAction.SCAFFOLD_FEATURE]: 'Create a scaffold for the requested feature',
      [AIAction.COMMIT_MESSAGE]: 'Generate a commit message for the following changes',
      [AIAction.PR_DESCRIPTION]: 'Generate a PR description for the following changes',
    };

    const description = actionDescriptions[context.action];

    return `You are an expert software engineer. ${description}.

First, create a brief plan (2-4 bullet points) describing the steps you will take.

Input:
${context.input}

Plan:`;
  }

  /**
   * Build prompt for code generation
   */
  private buildCodePrompt(context: AIActionContext, plan: string): string {
    return `You are an expert software engineer executing the following plan:

${plan}

Input:
${context.input}

${context.language ? `Language: ${context.language}` : ''}
${context.framework ? `Framework: ${context.framework}` : ''}

Please provide the ${this.getOutputDescription(context.action)}:`;
  }

  /**
   * Get output description for action
   */
  private getOutputDescription(action: AIAction): string {
    switch (action) {
      case AIAction.EXPLAIN:
        return 'detailed explanation';
      case AIAction.FIX:
      case AIAction.REFACTOR:
      case AIAction.TRANSLATE:
        return 'modified code';
      case AIAction.DOCS:
        return 'documentation';
      case AIAction.TESTS:
        return 'test code';
      case AIAction.REVIEW:
        return 'code review';
      case AIAction.SCAFFOLD_FEATURE:
        return 'scaffolded code';
      case AIAction.COMMIT_MESSAGE:
        return 'commit message';
      case AIAction.PR_DESCRIPTION:
        return 'PR description';
      default:
        return 'output';
    }
  }

  /**
   * Check if action modifies code
   */
  private isCodeModification(action: AIAction): boolean {
    return [
      AIAction.FIX,
      AIAction.REFACTOR,
      AIAction.TRANSLATE,
      AIAction.DOCS,
      AIAction.TESTS,
      AIAction.SCAFFOLD_FEATURE,
    ].includes(action);
  }
}
