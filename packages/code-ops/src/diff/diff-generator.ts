/**
 * Diff Generator - Creates diff representations for code changes
 */

import { CodeDiff, DiffHunk } from '@voxforge/core';

export class DiffGenerator {
  /**
   * Generate a diff between old and new content
   */
  generateDiff(oldContent: string, newContent: string, filePath: string): CodeDiff {
    const oldLines = oldContent.split('\n');
    const newLines = newContent.split('\n');
    
    const hunks = this.computeHunks(oldLines, newLines);
    
    return {
      filePath,
      oldContent,
      newContent,
      hunks,
    };
  }

  /**
   * Compute diff hunks using a simple LCS-based algorithm
   */
  private computeHunks(oldLines: string[], newLines: string[]): DiffHunk[] {
    const hunks: DiffHunk[] = [];
    const changes = this.computeLCS(oldLines, newLines);
    
    let i = 0;
    while (i < changes.length) {
      const hunk = this.extractHunk(changes, i, oldLines, newLines);
      if (hunk) {
        hunks.push(hunk);
        i = hunk.oldStart + hunk.oldLines;
      } else {
        i++;
      }
    }
    
    return hunks;
  }

  /**
   * Extract a single hunk from the changes
   */
  private extractHunk(
    changes: Array<{ type: 'add' | 'remove' | 'same'; line: string; oldIdx?: number; newIdx?: number }>,
    startIdx: number,
    oldLines: string[],
    newLines: string[]
  ): DiffHunk | null {
    const hunkChanges = [];
    let oldStart = -1;
    let newStart = -1;
    let oldLines_count = 0;
    let newLines_count = 0;
    
    for (let i = startIdx; i < changes.length; i++) {
      const change = changes[i];
      
      if (change.type === 'same' && hunkChanges.length > 0) {
        // Include up to 3 context lines after changes
        if (hunkChanges.filter(c => c.type !== 'same').length > 0) {
          hunkChanges.push(change);
          if (hunkChanges.filter(c => c.type === 'same' && c !== change).length >= 3) {
            break;
          }
        }
      } else if (change.type !== 'same') {
        if (oldStart === -1) {
          oldStart = change.oldIdx ?? 0;
          newStart = change.newIdx ?? 0;
          // Add up to 3 context lines before
          for (let j = Math.max(0, i - 3); j < i; j++) {
            hunkChanges.push(changes[j]);
          }
        }
        hunkChanges.push(change);
      }
    }
    
    if (hunkChanges.length === 0) {
      return null;
    }
    
    // Count old and new lines
    for (const change of hunkChanges) {
      if (change.type === 'remove' || change.type === 'same') {
        oldLines_count++;
      }
      if (change.type === 'add' || change.type === 'same') {
        newLines_count++;
      }
    }
    
    const lines = hunkChanges.map(change => {
      if (change.type === 'add') return '+' + change.line;
      if (change.type === 'remove') return '-' + change.line;
      return ' ' + change.line;
    });
    
    return {
      oldStart,
      oldLines: oldLines_count,
      newStart,
      newLines: newLines_count,
      lines,
    };
  }

  /**
   * Compute Longest Common Subsequence for diff
   */
  private computeLCS(
    oldLines: string[],
    newLines: string[]
  ): Array<{ type: 'add' | 'remove' | 'same'; line: string; oldIdx?: number; newIdx?: number }> {
    const m = oldLines.length;
    const n = newLines.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    // Build LCS table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (oldLines[i - 1] === newLines[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    
    // Backtrack to find changes
    const changes: Array<{ type: 'add' | 'remove' | 'same'; line: string; oldIdx?: number; newIdx?: number }> = [];
    let i = m;
    let j = n;
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
        changes.unshift({ type: 'same', line: oldLines[i - 1], oldIdx: i - 1, newIdx: j - 1 });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        changes.unshift({ type: 'add', line: newLines[j - 1], newIdx: j - 1 });
        j--;
      } else if (i > 0) {
        changes.unshift({ type: 'remove', line: oldLines[i - 1], oldIdx: i - 1 });
        i--;
      }
    }
    
    return changes;
  }

  /**
   * Format diff as unified diff string
   */
  formatUnified(diff: CodeDiff): string {
    const lines: string[] = [];
    lines.push(`--- ${diff.filePath}`);
    lines.push(`+++ ${diff.filePath}`);
    
    for (const hunk of diff.hunks) {
      lines.push(`@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`);
      lines.push(...hunk.lines);
    }
    
    return lines.join('\n');
  }
}
