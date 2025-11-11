import { useEffect, useRef, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { VoxForgeContext } from '@voxforge/core';
import './Editor.css';

interface EditorProps {
  context: VoxForgeContext;
  currentFile: string | null;
}

function Editor({ context, currentFile }: EditorProps) {
  const [code, setCode] = useState('// Welcome to VoxForge IDE\n// Start coding with voice or keyboard!\n\nfunction helloWorld() {\n  console.log("Hello from VoxForge!");\n}\n');
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    if (currentFile) {
      // In a real app, load file content here
      const ext = currentFile.split('.').pop() || 'txt';
      const langMap: Record<string, string> = {
        'js': 'javascript',
        'ts': 'typescript',
        'jsx': 'javascript',
        'tsx': 'typescript',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'html': 'html',
        'css': 'css',
        'json': 'json',
        'md': 'markdown'
      };
      setLanguage(langMap[ext] || 'plaintext');
    }
  }, [currentFile]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      if (currentFile) {
        context.emit('file:change', currentFile, value);
      }
    }
  };

  return (
    <div className="editor-container">
      {currentFile ? (
        <div className="editor-header">
          <span className="editor-filename">{currentFile}</span>
        </div>
      ) : null}
      <MonacoEditor
        height="100%"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={handleEditorChange}
        options={{
          fontSize: 14,
          minimap: { enabled: true },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          tabSize: 2
        }}
      />
    </div>
  );
}

export default Editor;
