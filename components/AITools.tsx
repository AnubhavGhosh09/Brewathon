import React, { useState } from 'react';
import { generateExcuse, generateDraftEmail } from '../services/geminiService';
import { Sparkles, Mail, Ghost, Copy, RefreshCw, CheckCheck } from 'lucide-react';

const AITools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'EXCUSE' | 'EMAIL'>('EXCUSE');
  
  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3 font-mono">
           <Sparkles className="text-purple-500" /> AI_CORE_MODULES
        </h2>
        <p className="text-slate-500 font-mono text-sm uppercase">Manipulate Reality using Generative Algorithms.</p>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('EXCUSE')}
          className={`px-6 py-3 border font-mono uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeTab === 'EXCUSE' 
              ? 'bg-purple-900/30 border-purple-500 text-purple-400' 
              : 'border-slate-800 text-slate-500 hover:border-slate-600'
          }`}
        >
          <Ghost size={18} /> Quantum Excuse Gen
        </button>
        <button 
          onClick={() => setActiveTab('EMAIL')}
          className={`px-6 py-3 border font-mono uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeTab === 'EMAIL' 
              ? 'bg-cyan-900/30 border-cyan-500 text-cyan-400' 
              : 'border-slate-800 text-slate-500 hover:border-slate-600'
          }`}
        >
          <Mail size={18} /> Diplomacy Protocol
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        {activeTab === 'EXCUSE' ? <ExcuseGenerator /> : <EmailDrafter />}
      </div>
    </div>
  );
};

const ExcuseGenerator: React.FC = () => {
  const [reason, setReason] = useState('');
  const [intensity, setIntensity] = useState(50);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!reason) return;
    setLoading(true);
    setCopied(false);
    
    // Direct Call
    const text = await generateExcuse(reason, intensity);
    
    setResult(text);
    setLoading(false);
  };

  const handleCopy = () => {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-black/40 border border-purple-900/50 p-6 rounded-lg relative overflow-hidden">
      <div className="space-y-4 relative z-10">
        <div>
          <label className="block text-purple-400 font-mono text-xs uppercase mb-2">Situation / Disaster</label>
          <input 
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Late for Lab, Missed Assignment..."
            className="w-full bg-slate-900/80 border border-slate-700 p-3 text-white rounded focus:border-purple-500 outline-none font-mono"
          />
        </div>

        <div>
           <label className="block text-purple-400 font-mono text-xs uppercase mb-2 flex justify-between">
              <span>Chaos Level</span>
              <span>{intensity}%</span>
           </label>
           <input 
              type="range" 
              min="0" 
              max="100" 
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
           />
           <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-1">
              <span>SAFE (Family Emergency)</span>
              <span>EXTREME (Alien Abduction)</span>
           </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || !reason}
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono rounded transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <RefreshCw className="animate-spin" /> : <Sparkles />} GENERATE_EXCUSE
        </button>

        {result && (
          <div className="mt-6 p-4 bg-slate-900 border border-purple-500/30 rounded relative group">
            <p className="text-purple-100 font-mono text-lg italic">"{result}"</p>
            <button 
              onClick={handleCopy}
              className="absolute top-2 right-2 text-slate-500 hover:text-white transition-colors"
              title="Copy"
            >
              {copied ? <CheckCheck size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
          </div>
        )}
      </div>
      {/* Background decoration */}
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};

const EmailDrafter: React.FC = () => {
    const [recipient, setRecipient] = useState('');
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('Professional');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
  
    const handleGenerate = async () => {
      if (!topic) return;
      setLoading(true);
      setCopied(false);
      
      // Direct Call
      const text = await generateDraftEmail(recipient || 'Professor', topic, tone);
      
      setResult(text);
      setLoading(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
  
    return (
      <div className="bg-black/40 border border-cyan-900/50 p-6 rounded-lg relative overflow-hidden">
        <div className="space-y-4 relative z-10">
          <div className="flex gap-4">
             <div className="flex-1">
                <label className="block text-cyan-400 font-mono text-xs uppercase mb-2">Recipient (Optional)</label>
                <input 
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Prof. Snape"
                  className="w-full bg-slate-900/80 border border-slate-700 p-3 text-white rounded focus:border-cyan-500 outline-none font-mono"
                />
             </div>
             <div className="w-1/3">
                <label className="block text-cyan-400 font-mono text-xs uppercase mb-2">Tone</label>
                <select 
                   value={tone}
                   onChange={(e) => setTone(e.target.value)}
                   className="w-full bg-slate-900/80 border border-slate-700 p-3 text-white rounded focus:border-cyan-500 outline-none font-mono"
                >
                   <option>Professional</option>
                   <option>Apologetic</option>
                   <option>Desperate</option>
                   <option>Urgent</option>
                </select>
             </div>
          </div>
  
          <div>
            <label className="block text-cyan-400 font-mono text-xs uppercase mb-2">Context / Reason</label>
            <textarea 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Need extension for assignment because I was sick..."
              className="w-full bg-slate-900/80 border border-slate-700 p-3 text-white rounded focus:border-cyan-500 outline-none font-mono h-24"
            />
          </div>
  
          <button 
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-mono rounded transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <Mail />} DRAFT_EMAIL
          </button>
  
          {result && (
            <div className="mt-6 p-4 bg-slate-900 border border-cyan-500/30 rounded relative group">
              <pre className="text-cyan-100 font-mono text-sm whitespace-pre-wrap overflow-x-auto">{result}</pre>
              <button 
                onClick={handleCopy}
                className="absolute top-2 right-2 text-slate-500 hover:text-white transition-colors"
                title="Copy"
              >
                {copied ? <CheckCheck size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
          )}
        </div>
        {/* Background decoration */}
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    );
  };

export default AITools;