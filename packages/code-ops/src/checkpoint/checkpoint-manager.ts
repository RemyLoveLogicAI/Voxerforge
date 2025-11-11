/**
 * Checkpoint Manager - Manages rollback checkpoints
 */

import { Checkpoint, MAX_ROLLBACK_DEPTH } from '@voxforge/core';
import * as fs from 'fs/promises';
import * as path from 'path';

export class CheckpointManager {
  private checkpoints: Checkpoint[] = [];
  private checkpointDir: string;
  private maxDepth: number;

  constructor(checkpointDir: string, maxDepth: number = MAX_ROLLBACK_DEPTH) {
    this.checkpointDir = checkpointDir;
    this.maxDepth = maxDepth;
  }

  /**
   * Create a new checkpoint
   */
  async createCheckpoint(description: string, files: string[]): Promise<Checkpoint> {
    const id = this.generateId();
    const fileContents = new Map<string, string>();

    // Read current content of all files
    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        fileContents.set(file, content);
      } catch (error) {
        console.warn(`Failed to read file for checkpoint: ${file}`, error);
      }
    }

    const checkpoint: Checkpoint = {
      id,
      timestamp: new Date(),
      description,
      files: fileContents,
    };

    // Save checkpoint to disk
    await this.saveCheckpoint(checkpoint);

    // Add to in-memory list
    this.checkpoints.push(checkpoint);

    // Prune old checkpoints if exceeding max depth
    if (this.checkpoints.length > this.maxDepth) {
      const removed = this.checkpoints.shift();
      if (removed) {
        await this.deleteCheckpoint(removed.id);
      }
    }

    return checkpoint;
  }

  /**
   * Restore from a checkpoint
   */
  async restoreCheckpoint(checkpointId: string): Promise<void> {
    const checkpoint = await this.loadCheckpoint(checkpointId);
    if (!checkpoint) {
      throw new Error(`Checkpoint not found: ${checkpointId}`);
    }

    // Restore all files
    for (const [filePath, content] of checkpoint.files.entries()) {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content, 'utf-8');
    }
  }

  /**
   * Get all checkpoints
   */
  async getCheckpoints(): Promise<Checkpoint[]> {
    return [...this.checkpoints];
  }

  /**
   * Delete a checkpoint
   */
  async deleteCheckpoint(checkpointId: string): Promise<void> {
    const checkpointPath = path.join(this.checkpointDir, `${checkpointId}.json`);
    try {
      await fs.unlink(checkpointPath);
    } catch (error) {
      console.warn(`Failed to delete checkpoint: ${checkpointId}`, error);
    }

    this.checkpoints = this.checkpoints.filter(cp => cp.id !== checkpointId);
  }

  /**
   * Load checkpoints from disk
   */
  async loadCheckpoints(): Promise<void> {
    try {
      await fs.mkdir(this.checkpointDir, { recursive: true });
      const files = await fs.readdir(this.checkpointDir);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const checkpoint = await this.loadCheckpoint(path.basename(file, '.json'));
          if (checkpoint) {
            this.checkpoints.push(checkpoint);
          }
        }
      }

      // Sort by timestamp
      this.checkpoints.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    } catch (error) {
      console.warn('Failed to load checkpoints', error);
    }
  }

  /**
   * Save checkpoint to disk
   */
  private async saveCheckpoint(checkpoint: Checkpoint): Promise<void> {
    await fs.mkdir(this.checkpointDir, { recursive: true });
    const checkpointPath = path.join(this.checkpointDir, `${checkpoint.id}.json`);
    
    const serialized = {
      ...checkpoint,
      files: Array.from(checkpoint.files.entries()),
    };
    
    await fs.writeFile(checkpointPath, JSON.stringify(serialized, null, 2), 'utf-8');
  }

  /**
   * Load checkpoint from disk
   */
  private async loadCheckpoint(checkpointId: string): Promise<Checkpoint | null> {
    const checkpointPath = path.join(this.checkpointDir, `${checkpointId}.json`);
    
    try {
      const content = await fs.readFile(checkpointPath, 'utf-8');
      const data = JSON.parse(content);
      
      return {
        ...data,
        timestamp: new Date(data.timestamp),
        files: new Map(data.files),
      };
    } catch (error) {
      console.warn(`Failed to load checkpoint: ${checkpointId}`, error);
      return null;
    }
  }

  /**
   * Generate unique checkpoint ID
   */
  private generateId(): string {
    return `checkpoint_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}
