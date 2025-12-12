import React, { useState } from 'react';
import { INITIAL_CLUBS } from '../constants';
import { Search, Users, Network, Filter, Sparkles, X, Loader, AlertTriangle } from 'lucide-react';
import { matchClubs } from '../services/geminiService';

const ClubExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showRecruitingOnly, setShowRecruitingOnly] = useState(false);
  
  // Matchmaker State
  const [showMatchmaker, setShowMatchmaker] = useState(false);
  const [userInterests, setUserInterests] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [matchResults, setMatchResults] = useState<Array<{id: string, reason: string}>>([]);
  const [matchError, setMatchError] = useState<string | null>(null);

  const categories = ['All', 'Theatre', 'Dance', 'Photography', 'Technical', 'Robotics', 'Management'];

  const filteredClubs = INITIAL_CLUBS.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || club.category === activeCategory;
    const matchesStatus = showRecruitingOnly ? club.status === 'RECRUITING' : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleMatchmaking = async () => {
    if (!userInterests.trim()) return;
    setIsMatching(true);
    setMatchResults([]);
    setMatchError(null);
    try {
        const matches = await matchClubs(userInterests);
        setMatchResults(matches);
    } catch (e: any) {
        setMatchError(e.message || "AI Matchmaker Malfunction. Please try again.");
    } finally {
        setIsMatching(false);
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3 font-mono">
             <Network className="text-purple-500" /> FACTION_PROTOCOL
          </h2>
          <p className="text-slate-500 font-mono text-sm uppercase">Access 19+ Guilds. Join the network.</p>
        </div>
        
        <button 
            onClick={() => setShowMatchmaker(true)}
            className="px-6 py-2 border border-purple-500/50 text-purple-400 hover:bg-purple-900/20 transition-all font-mono text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.2)] flex items-center gap-2"
        >
          <Sparkles size={14} /> EXECUTE AI_MATCHMAKER.EXE
        </button>
      </div>

      {/* Filter Matrix */}
      <div className="bg-black/40 border border-slate-800 p-4 space-y-4">
        {/* Search & Main Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search factions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-purple-100 focus:outline-none focus:border-purple-500 font-mono transition-all"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-700 rounded-lg px-4">
            <input 
              type="checkbox"
              id="recruiting"
              checked={showRecruitingOnly}
              onChange={(e) => setShowRecruitingOnly(e.target.checked)}
              className="accent-purple-500 w-4 h-4"
            />
            <label htmlFor="recruiting" className="text-xs font-mono text-slate-400 cursor-pointer select-none">RECRUITING_ONLY</label>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2">
            <Filter size={14} className="text-slate-500 mt-2 mr-2" />
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 text-[10px] uppercase font-mono border rounded-full transition-all ${
                        activeCategory === cat
                        ? 'bg-purple-900/40 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                        : 'bg-transparent border-slate-800 text-slate-500 hover:border-slate-600'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map(club => (
            <div key={club.id} className="group relative bg-black/40 border border-slate-800 p-6 hover:border-purple-500/50 transition-all duration-300">
                <div className="absolute top-0 right-0 p-2">
                    {club.status === 'RECRUITING' ? (
                        <span className="flex items-center gap-1 text-[9px] font-bold bg-green-900/20 text-green-500 px-2 py-1 border border-green-500/20 font-mono uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Open
                        </span>
                    ) : (
                        <span className="text-[9px] font-bold bg-slate-900 text-slate-500 px-2 py-1 border border-slate-800 font-mono uppercase">Full</span>
                    )}
                </div>

                <div className="mb-4 text-4xl group-hover:scale-110 transition-transform duration-300">{club.icon}</div>
                
                <h3 className="text-xl font-bold text-white font-mono mb-1">{club.name}</h3>
                <div className="text-xs text-purple-400 font-mono mb-3 uppercase tracking-wider">{club.category}</div>
                
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{club.description}</p>
                
                <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
                        <Users size={14} />
                        {club.members} Members
                    </div>
                    <button className="text-xs font-bold text-white hover:text-purple-400 font-mono uppercase transition-colors">
                        View_Intel &gt;
                    </button>
                </div>
            </div>
        ))}
      </div>

      {/* Matchmaker Modal */}
      {showMatchmaker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
             <div className="w-full max-w-lg bg-black border border-purple-500/50 rounded-xl shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden animate-[scaleIn_0.2s_ease-out]">
                <div className="p-6 bg-gradient-to-br from-purple-900/20 to-black">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                            <Sparkles className="text-purple-500" /> AI_MATCHMAKER
                        </h3>
                        <button onClick={() => setShowMatchmaker(false)} className="text-slate-500 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <p className="text-slate-300 text-sm font-mono">Input your interests, skills, or hobbies. The system will calculate optimal faction alignment.</p>
                        <textarea 
                            value={userInterests}
                            onChange={(e) => setUserInterests(e.target.value)}
                            placeholder="e.g. I love coding, building robots, and acting in plays..."
                            className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none font-mono text-sm resize-none"
                        />
                        
                        {matchError && (
                            <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-mono flex gap-2 items-start">
                                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                                <span className="whitespace-pre-wrap">{matchError}</span>
                            </div>
                        )}

                        <button 
                            onClick={handleMatchmaking}
                            disabled={isMatching || !userInterests}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono uppercase rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isMatching ? <Loader className="animate-spin" /> : <Network />} 
                            {isMatching ? 'CALCULATING_ALIGNMENT...' : 'RUN_ANALYSIS'}
                        </button>
                    </div>
                </div>

                {/* Results Area */}
                {(matchResults.length > 0) && (
                    <div className="p-6 border-t border-purple-500/20 bg-slate-900/50 max-h-64 overflow-y-auto">
                        <h4 className="text-xs font-bold text-purple-400 font-mono uppercase mb-4 tracking-widest">OPTIMAL_MATCHES_FOUND:</h4>
                        <div className="space-y-3">
                            {matchResults.map((result, idx) => {
                                const club = INITIAL_CLUBS.find(c => c.id === result.id);
                                if (!club) return null;
                                return (
                                    <div key={idx} className="flex items-start gap-4 p-3 border border-slate-700 bg-black/40 rounded-lg animate-[slideUp_0.3s_ease-out]" style={{animationDelay: `${idx * 100}ms`}}>
                                        <div className="text-2xl pt-1">{club.icon}</div>
                                        <div>
                                            <h5 className="font-bold text-white font-mono">{club.name}</h5>
                                            <p className="text-xs text-purple-300 font-mono mt-1">&gt; {result.reason}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
             </div>
        </div>
      )}
    </div>
  );
};

export default ClubExplorer;