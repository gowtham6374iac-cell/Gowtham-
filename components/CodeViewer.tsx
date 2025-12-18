
import React, { useState } from 'react';
import { PYTHON_PROJECT } from '../constants';
import { Copy, Check, Terminal, FolderOpen, FileCode } from 'lucide-react';

export const CodeViewer: React.FC = () => {
  const [activeFile, setActiveFile] = useState(PYTHON_PROJECT[1]); // train_model.py
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
      {/* File Tree */}
      <div className="w-full lg:w-64 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-sm">PROJECT_ROOT</span>
        </div>
        <div className="flex-1 p-2 space-y-1 overflow-y-auto">
          {PYTHON_PROJECT.map((file) => (
            <button
              key={file.name}
              onClick={() => setActiveFile(file)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${
                activeFile.name === file.name 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-4 h-4 opacity-70" />
              {file.name}
            </button>
          ))}
          <div className="pt-4 px-3">
             <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
               <div className="flex items-center gap-2 mb-2">
                 <Terminal className="w-3 h-3 text-slate-500" />
                 <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Quick Note</span>
               </div>
               <p className="text-[11px] text-slate-400 leading-relaxed">
                 Use <strong>Random Forest</strong> for the best balance between speed and detection accuracy in production environments.
               </p>
             </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl">
        <div className="h-12 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">./phishing_system/</span>
            <span className="text-sm font-medium text-slate-200">{activeFile.name}</span>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6 font-mono text-sm leading-relaxed text-slate-300">
          <pre>
            <code>{activeFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
