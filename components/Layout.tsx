
import React from 'react';
import { Shield, Code, BookOpen, Lock } from 'lucide-react';
import { ActiveTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen text-slate-200 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Phishing Detector <span className="text-indigo-500 font-mono text-xs ml-1">v2.1</span>
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-1">
            <TabButton 
              active={activeTab === ActiveTab.ANALYZER} 
              onClick={() => setActiveTab(ActiveTab.ANALYZER)}
              icon={<Shield className="w-4 h-4" />}
              label="Live Analyzer"
            />
            <TabButton 
              active={activeTab === ActiveTab.CODEBASE} 
              onClick={() => setActiveTab(ActiveTab.CODEBASE)}
              icon={<Code className="w-4 h-4" />}
              label="Python Lab"
            />
            <TabButton 
              active={activeTab === ActiveTab.LEARNING} 
              onClick={() => setActiveTab(ActiveTab.LEARNING)}
              icon={<BookOpen className="w-4 h-4" />}
              label="Learning Center"
            />
          </nav>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] uppercase font-bold text-green-500 tracking-wider">System Operational</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 Cybersecurity Research Lab. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Documentation</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
            <div className="flex items-center gap-1 text-slate-500 text-xs font-mono">
              <Lock className="w-3 h-3" />
              ENCRYPTED CONNECTION
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
      active 
        ? 'bg-slate-800 text-white shadow-lg' 
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);
