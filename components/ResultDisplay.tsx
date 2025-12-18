
import React from 'react';
import { AnalysisResult } from '../types';
import { ShieldCheck, ShieldAlert, Zap, Globe, AlertTriangle, Fingerprint } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ResultDisplayProps {
  result: AnalysisResult;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const isDanger = result.isPhishing;
  const data = [
    { name: 'Risk', value: result.riskScore },
    { name: 'Safe', value: 100 - result.riskScore },
  ];
  const COLORS = [isDanger ? '#ef4444' : '#22c55e', '#1e293b'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Risk Gauge */}
      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-1 ${isDanger ? 'bg-red-500' : 'bg-green-500'}`} />
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Risk Assessment</h3>
        <div className="w-full h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
            <span className="text-4xl font-bold font-mono">{result.riskScore}%</span>
            <span className={`text-xs font-bold uppercase tracking-widest ${isDanger ? 'text-red-400' : 'text-green-400'}`}>
              {isDanger ? 'High Risk' : 'Low Risk'}
            </span>
          </div>
        </div>
        <div className={`mt-6 w-full py-3 px-4 rounded-xl flex items-center justify-center gap-3 border ${
          isDanger ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'
        }`}>
          {isDanger ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          <span className="font-bold text-lg">{isDanger ? 'PHISHING DETECTED' : 'SECURE WEBSITE'}</span>
        </div>
      </div>

      {/* AI Verdict */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-indigo-600/5 border border-indigo-500/20 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">AI Forensics</h3>
          </div>
          <p className="text-slate-300 leading-relaxed italic">
            "{result.aiVerdict}"
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FeatureCard 
            icon={<Fingerprint className="w-4 h-4" />} 
            label="URL Length" 
            value={`${result.features.length} chars`} 
            status={result.features.length > 54 ? 'warning' : 'ok'} 
          />
          <FeatureCard 
            icon={<AlertTriangle className="w-4 h-4" />} 
            label="@ Symbol" 
            value={result.features.hasAtSymbol ? 'Present' : 'None'} 
            status={result.features.hasAtSymbol ? 'danger' : 'ok'} 
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-4 h-4" />} 
            label="Protocol" 
            value={result.features.hasHttps ? 'HTTPS' : 'HTTP'} 
            status={result.features.hasHttps ? 'ok' : 'danger'} 
          />
          <FeatureCard 
            icon={<Globe className="w-4 h-4" />} 
            label="IP Domain" 
            value={result.features.isIPAddress ? 'IP Used' : 'Domain'} 
            status={result.features.isIPAddress ? 'danger' : 'ok'} 
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; label: string; value: string; status: 'ok' | 'warning' | 'danger' }> = ({ icon, label, value, status }) => {
  const statusColor = status === 'ok' ? 'text-green-400' : status === 'warning' ? 'text-yellow-400' : 'text-red-400';
  const bgColor = status === 'ok' ? 'bg-green-400/5' : status === 'warning' ? 'bg-yellow-400/5' : 'bg-red-400/5';
  
  return (
    <div className={`p-4 rounded-xl border border-slate-800 ${bgColor} transition-all hover:scale-105 cursor-default`}>
      <div className="text-slate-500 mb-2">{icon}</div>
      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">{label}</div>
      <div className={`text-sm font-mono font-bold ${statusColor}`}>{value}</div>
    </div>
  );
};
