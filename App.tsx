
import React, { useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { ActiveTab, AnalysisResult, URLFeatures } from './types';
import { CodeViewer } from './components/CodeViewer';
import { ResultDisplay } from './components/ResultDisplay';
import { extractFeatures, calculateHeuristicRisk } from './utils/phishingUtils';
import { analyzeURLWithAI } from './services/geminiService';
// Added Zap and ShieldCheck to the imports
import { Search, Loader2, Info, BookOpen, AlertCircle, Zap, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.ANALYZER);
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Step 1: Feature Extraction
      const features = extractFeatures(urlInput);
      
      // Step 2: Base Heuristic Check
      const hScore = calculateHeuristicRisk(features);
      
      // Step 3: AI Augmentation
      const aiData = await analyzeURLWithAI(features, hScore);
      
      setResult({
        isPhishing: aiData.isPhishing ?? hScore > 50,
        confidence: aiData.confidence ?? 0.85,
        riskScore: aiData.riskScore ?? hScore,
        aiVerdict: aiData.aiVerdict ?? "Analyzed via local heuristic engine.",
        features
      });
    } catch (err) {
      setError("Analysis failed. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === ActiveTab.ANALYZER && (
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white">Detect Malicious URLs</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Using a hybrid system of Lexical Analysis, Heuristic Scoring, and 
              Generative AI to protect you from phishing attempts.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <form onSubmit={handleAnalyze} className="relative flex flex-col md:flex-row gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-2xl">
              <div className="flex-1 flex items-center px-4 gap-3">
                <Search className="w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Paste URL here (e.g., https://paypal-secure-login.tk)"
                  className="w-full bg-transparent border-none text-white focus:ring-0 placeholder-slate-600 font-mono text-sm h-12"
                />
              </div>
              <button 
                type="submit"
                disabled={loading || !urlInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze URL'}
              </button>
            </form>
          </div>

          {/* Results Area */}
          <div className="min-h-[300px]">
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <div className="text-center">
                  <p className="text-white font-medium">Extracting lexical features...</p>
                  <p className="text-slate-500 text-sm">Cross-referencing with threat intelligence database</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            )}

            {result && !loading && <ResultDisplay result={result} />}

            {!result && !loading && !error && (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                  <InfoBox 
                    icon={<Info className="w-5 h-5 text-blue-400" />}
                    title="How it works"
                    desc="We look at URL syntax like length, special characters, and subdomains to build a fingerprint."
                  />
                  <InfoBox 
                    icon={<ShieldCheck className="w-5 h-5 text-green-400" />}
                    title="Real-time Scoring"
                    desc="Our heuristic engine assigns weights to common phishing tactics used by attackers today."
                  />
                  <InfoBox 
                    icon={<Zap className="w-5 h-5 text-yellow-400" />}
                    title="AI Enhanced"
                    desc="Gemini-3 analyzes the URL's intent and provides semantic insights beyond simple pattern matching."
                  />
               </div>
            )}
          </div>
        </div>
      )}

      {activeTab === ActiveTab.CODEBASE && (
        <div className="space-y-8">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Python ML Workbench</h2>
                <p className="text-slate-400">Implementation guide for a production-grade detection system.</p>
              </div>
              <div className="flex gap-2">
                 <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-mono text-slate-300">Scikit-Learn</span>
                 <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-mono text-slate-300">Random Forest</span>
                 <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-mono text-slate-300">Python 3.10+</span>
              </div>
           </div>
           <CodeViewer />
        </div>
      )}

      {activeTab === ActiveTab.LEARNING && (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-indigo-500" />
              Anatomy of a Phishing URL
            </h2>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white">1. Typosquatting</h3>
                <p className="text-slate-400 leading-relaxed">
                  Attackers register domains that are visually similar to legitimate ones. 
                  Example: <code className="bg-slate-950 px-2 py-1 rounded text-red-400">faceb0ok.com</code> instead of <code className="bg-slate-950 px-2 py-1 rounded text-green-400">facebook.com</code>.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white">2. Subdomain Obfuscation</h3>
                <p className="text-slate-400 leading-relaxed">
                  Legitimate names are often placed as subdomains. 
                  Example: <code className="bg-slate-950 px-2 py-1 rounded text-red-400">paypal.com-verification.net</code>. The actual domain here is <code className="text-indigo-400 underline">verification.net</code>.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white">3. TLD Abuse</h3>
                <p className="text-slate-400 leading-relaxed">
                  Malicious sites often use cheap or "unregulated" Top Level Domains (TLDs) like <code className="text-indigo-400">.tk</code>, <code className="text-indigo-400">.ml</code>, or <code className="text-indigo-400">.ga</code>.
                </p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ShieldCheck className="w-24 h-24 text-indigo-500" />
               </div>
               <h3 className="text-xl font-bold text-white mb-4">Stay Safe Online</h3>
               <ul className="space-y-3 text-slate-400 text-sm">
                 <li className="flex items-start gap-2">
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5" />
                   Always check the padlock in the address bar.
                 </li>
                 <li className="flex items-start gap-2">
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5" />
                   Enable Multi-Factor Authentication (MFA).
                 </li>
                 <li className="flex items-start gap-2">
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5" />
                   Never click links in unexpected emails.
                 </li>
               </ul>
            </div>
            
            <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-600/20">
               <h3 className="text-xl font-bold mb-4">Want to Contribute?</h3>
               <p className="text-indigo-100 mb-6 text-sm leading-relaxed">
                 This project is open-source. Help us improve our datasets by reporting new phishing threats.
               </p>
               <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                 Access API Documentation
               </button>
            </div>
          </section>
        </div>
      )}
    </Layout>
  );
};

const InfoBox: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-2xl hover:bg-slate-900/60 transition-colors">
    <div className="mb-4">{icon}</div>
    <h3 className="text-white font-bold mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default App;
