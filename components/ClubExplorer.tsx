import React, { useState } from 'react';
import { INITIAL_CLUBS } from '../constants';
import { Search, Users, Network, Filter, CheckCircle2 } from 'lucide-react';

const ClubExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showRecruitingOnly, setShowRecruitingOnly] = useState(false);

  const categories = ['All', 'Theatre', 'Dance', 'Photography', 'Technical', 'Robotics', 'Management'];

  const filteredClubs = INITIAL_CLUBS.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || club.category === activeCategory;
    const matchesStatus = showRecruitingOnly ? club.status === 'RECRUITING' : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3 font-mono">
             <Network className="text-purple-500" /> FACTION_PROTOCOL
          </h2>
          <p className="text-slate-500 font-mono text-sm uppercase">Access 19+ Guilds. Join the network.</p>
        </div>
        
        <button className="px-6 py-2 border border-purple-500/50 text-purple-400 hover:bg-purple-900/20 transition-all font-mono text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          EXECUTE AI_MATCHMAKER.EXE
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
    </div>
  );
};

export default ClubExplorer;