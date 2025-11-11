import { useState } from 'react';
import { VoxForgeContext, FileType } from '@voxforge/core';
import './Sidebar.css';

interface SidebarProps {
  context: VoxForgeContext;
}

interface FileNode {
  name: string;
  path: string;
  type: FileType;
  children?: FileNode[];
}

function Sidebar({ context }: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']));
  
  // Mock file tree for demonstration
  const fileTree: FileNode[] = [
    {
      name: 'src',
      path: '/src',
      type: FileType.DIRECTORY,
      children: [
        { name: 'main.ts', path: '/src/main.ts', type: FileType.FILE },
        { name: 'app.ts', path: '/src/app.ts', type: FileType.FILE },
        { name: 'utils.ts', path: '/src/utils.ts', type: FileType.FILE }
      ]
    },
    {
      name: 'tests',
      path: '/tests',
      type: FileType.DIRECTORY,
      children: [
        { name: 'app.test.ts', path: '/tests/app.test.ts', type: FileType.FILE }
      ]
    },
    { name: 'README.md', path: '/README.md', type: FileType.FILE },
    { name: 'package.json', path: '/package.json', type: FileType.FILE }
  ];

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileClick = (path: string) => {
    context.emit('file:open', path);
  };

  const renderFileNode = (node: FileNode, level: number = 0): JSX.Element => {
    const isExpanded = expandedFolders.has(node.path);
    const isFolder = node.type === FileType.DIRECTORY;

    return (
      <div key={node.path} className="file-node">
        <div 
          className={`file-item ${isFolder ? 'folder' : 'file'}`}
          style={{ paddingLeft: `${level * 1}rem` }}
          onClick={() => isFolder ? toggleFolder(node.path) : handleFileClick(node.path)}
        >
          <span className="file-icon">
            {isFolder ? (isExpanded ? '📂' : '📁') : '📄'}
          </span>
          <span className="file-name">{node.name}</span>
        </div>
        {isFolder && isExpanded && node.children && (
          <div className="file-children">
            {node.children.map(child => renderFileNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Explorer</h2>
      </div>
      <div className="sidebar-content">
        <div className="file-tree">
          {fileTree.map(node => renderFileNode(node))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
