import React, { useState } from 'react';
import { INITIAL_CLUBS } from '../constants';
import { Search, Users, Network, Filter, CheckCircle2, Sparkles, X, Loader } from 'lucide-react';
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
    try {
        const matches = await matchClubs(userInterests);
        setMatchResults(matches);
    } catch (e) {
        alert("AI Matchmaker Malfunction. Please try again.");
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
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-600" size={18} />
                <input 
                type="text" 
                placeholder="QUERY_DATABASE..." 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-none py-3 pl-12 pr-4 text-purple-100 focus:outline-none focus:border-purple-500 font-mono transition-all uppercase placeholder:text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <button 
                onClick={() => setShowRecruitingOnly(!showRecruitingOnly)}
                className={`flex items-center gap-2 px-4 py-3 font-mono text-xs uppercase tracking-wider border transition-all ${
                    showRecruitingOnly
                    ? 'bg-green-900/20 border-green-500 text-green-400'
                    : 'bg-transparent border-slate-700 text-slate-500 hover:border-slate-500'
                }`}
            >
                {showRecruitingOnly ? <CheckCircle2 size={16} /> : <Filter size={16} />}
                STATUS: {showRecruitingOnly ? 'RECRUITING' : 'ALL'}
            </button>
        </div>

        {/* Categories Type Selector */}
        <div className="border-t border-slate-800 pt-4">
             <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2">FILTER_BY_TYPE ::</div>
             <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider border transition-all ${
                    activeCategory === cat
                        ? 'bg-purple-900/30 border-purple-500 text-purple-400'
                        : 'bg-transparent border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                    }`}
                >
                    {cat}
                </button>
                ))}
            </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClubs.map(club => (
          <div key={club.id} className="bg-black/40 p-5 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/40 transition-all group relative overflow-hidden flex flex-col h-full">
            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-slate-700 group-hover:border-purple-500 transition-colors"></div>
            
            <div className="flex justify-between items-start mb-3">
              <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">{club.icon}</span>
              <span className={`text-[9px] px-2 py-1 font-mono uppercase border ${
                  club.status === 'RECRUITING' 
                  ? 'border-green-500/50 text-green-400 bg-green-900/10' 
                  : 'border-red-500/50 text-red-400 bg-red-900/10'
              }`}>
                {club.status}
              </span>
            </div>
            
            <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors font-mono tracking-wide">{club.name}</h3>
                <div className="mb-2">
                     <span className="text-[10px] px-1.5 py-0.5 bg-slate-900 text-slate-400 border border-slate-700 font-mono uppercase">
                        TYPE: {club.category}
                    </span>
                </div>
                <p className="text-xs text-slate-500 mb-4 font-mono leading-relaxed">{club.description}</p>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-600 font-mono border-t border-slate-800 pt-3 mt-auto">
                <div className="flex items-center gap-1">
                    <Users size={12} />
                    {club.members} OPERATIVES
                </div>
                <button className="text-purple-400 hover:text-purple-300 transition-colors uppercase">
                    [ ACCESS_DATA ]
                </button>
            </div>
          </div>
        ))}
        
        {filteredClubs.length === 0 && (
            <div className="col-span-full py-12 text-center border border-dashed border-slate-800 rounded-lg">
                <p className="text-slate-500 font-mono">NO_FACTIONS_FOUND_MATCHING_CRITERIA</p>
                <button 
                    onClick={() => {setSearchTerm(''); setActiveCategory('All'); setShowRecruitingOnly(false);}}
                    className="mt-2 text-purple-400 hover:text-purple-300 text-xs font-mono uppercase underline"
                >
                    RESET_FILTERS
                </button>
            </div>
        )}
      </div>

      {/* AI Matchmaker Modal */}
      {showMatchmaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-[#0a0a0a] border border-purple-500/50 rounded-lg shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden flex flex-col max-h-[80vh]">
                
                {/* Header */}
                <div className="p-4 bg-purple-950/20 border-b border-purple-500/30 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                        <Sparkles className="text-purple-400" /> 
                        NEURAL_MATCHMAKER v1.0
                    </h3>
                    <button onClick={() => setShowMatchmaker(false)} className="text-slate-500 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {!matchResults.length ? (
                        <div className="space-y-4">
                            <p className="text-slate-400 font-mono text-sm">
                                Enter your hobbies, skills, or what you want to learn. The system will analyze your profile against faction databases.
                            </p>
                            <textarea 
                                value={userInterests}
                                onChange={(e) => setUserInterests(e.target.value)}
                                placeholder="e.g. I love coding, but I also want to learn photography. I enjoy organizing events..."
                                className="w-full h-32 bg-slate-900/50 border border-slate-700 p-4 text-purple-100 font-mono focus:border-purple-500 outline-none rounded-none"
                            />
                            <button 
                                onClick={handleMatchmaking}
                                disabled={isMatching || !userInterests}
                                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono tracking-widest uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isMatching ? <Loader className="animate-spin" /> : <Network />} 
                                {isMatching ? 'ANALYZING_COMPATIBILITY...' : 'INITIATE_SCAN'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-[fadeIn_0.5s_ease-out]">
                            <div className="text-center mb-6">
                                <div className="inline-block px-4 py-1 bg-green-900/20 text-green-400 border border-green-500/30 rounded-full text-xs font-mono mb-2">
                                    ANALYSIS_COMPLETE
                                </div>
                                <h4 className="text-white font-bold text-lg font-mono">TOP MATCHES FOUND</h4>
                            </div>

                            <div className="grid gap-4">
                                {matchResults.map((result, idx) => {
                                    const club = INITIAL_CLUBS.find(c => c.id === result.id);
                                    if (!club) return null;
                                    return (
                                        <div key={idx} className="bg-slate-900/40 border border-purple-500/30 p-4 flex gap-4 items-start hover:bg-purple-900/10 transition-colors">
                                            <div className="text-3xl pt-1">{club.icon}</div>
                                            <div>
                                                <h5 className="text-purple-300 font-bold font-mono text-lg">{club.name}</h5>
                                                <p className="text-slate-400 text-xs uppercase font-mono mb-2">{club.category}</p>
                                                <div className="text-sm text-slate-300 border-l-2 border-purple-500 pl-3 italic">
                                                    "{result.reason}"
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button 
                                onClick={() => setMatchResults([])}
                                className="w-full mt-4 py-2 border border-slate-700 text-slate-400 hover:text-white font-mono text-xs uppercase"
                            >
                                RESET_QUERY
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ClubExplorer;