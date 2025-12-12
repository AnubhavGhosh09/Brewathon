import React, { useEffect, useState } from 'react';
import { AppView, User } from '../types';
import { Clock, Calendar, Users, Terminal, Loader } from 'lucide-react';
import { db } from '../services/db';

interface DashboardProps {
  setView: (view: AppView) => void;
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ setView, user }) => {
  const [nextClass, setNextClass] = useState("SCANNING...");
  const [stealthSlots, setStealthSlots] = useState(0);
  const [survivalStats, setSurvivalStats] = useState({ percent: 100, attended: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        setLoading(true);
        try {
            // 1. Calculate Survival Metrics (Attendance)
            const subjects = await db.getSubjects(user.uid);
            const total = subjects.reduce((acc, sub) => acc + sub.total, 0);
            const attended = subjects.reduce((acc, sub) => acc + sub.attended, 0);
            const percent = total > 0 ? Math.round((attended / total) * 100) : 100;
            setSurvivalStats({ percent, attended, total });

            // 2. Real-time Timetable Logic
            const timetable = await db.getTimetable(user.uid);
            const now = new Date();
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const currentDayName = days[now.getDay()];

            if (currentDayName === 'Sunday') {
                setNextClass("WEEKEND_PROTOCOL");
            } else {
                const todaySchedule = timetable.find(d => d.day === currentDayName);

                if (todaySchedule && todaySchedule.slots.length > 0) {
                    // Count Stealth Slots (Free)
                    const freeCount = todaySchedule.slots.filter(s => s.type === 'Free' || s.type === 'Lunch').length;
                    setStealthSlots(freeCount);

                    // Find Next Class
                    const currentHour = now.getHours();
                    const currentMin = now.getMinutes();
                    
                    const sortedSlots = [...todaySchedule.slots].sort((a, b) => a.time.localeCompare(b.time));

                    const upcoming = sortedSlots.find(slot => {
                        const [h, m] = slot.time.split(':').map(Number);
                        if (h > currentHour) return true;
                        if (h === currentHour && m > currentMin) return true;
                        return false;
                    });

                    if (upcoming) {
                        setNextClass(`${upcoming.subject} @ ${upcoming.time}`);
                    } else {
                        setNextClass("ALL_OPS_COMPLETE");
                    }
                } else {
                    setNextClass("NO_SCHEDULE_DATA");
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, [user.uid]);

  const isCritical = survivalStats.percent < 85;

  if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin text-cyan-500" size={32} />
        </div>
      );
  }

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
        <div className="text-center py-8 relative">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 mb-2 font-mono tracking-tighter">
                SYSTEM_STATUS
            </h1>
            <p className="text-emerald-500/70 font-mono text-sm tracking-widest typing-effect">WELCOME BACK, OPERATOR {user.username.toUpperCase()}.</p>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<Calendar size={18} />} label="Active Protocols" value="5" color="text-cyan-400" />
            <StatCard icon={<Clock size={18} />} label="Next Sync" value="10:00 AM" color="text-white" />
            <StatCard icon={<Users size={18} />} label="Faction Events" value="3" color="text-purple-400" />
            <StatCard icon={<Terminal size={18} />} label="Stealth Slots" value={stealthSlots.toString()} color="text-emerald-400" />
        </div>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Attendance (Large) */}
            <div 
                onClick={() => setView(AppView.ATTENDANCE)}
                className={`md:col-span-1 bg-black/40 p-6 rounded-none border transition-all cursor-pointer group relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] ${
                    isCritical ? 'border-red-900/30 hover:border-red-500' : 'border-green-900/30 hover:border-green-500'
                }`}
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Terminal size={100} className={isCritical ? "text-red-500" : "text-green-500"} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                    <h3 className="text-lg font-bold text-white font-mono tracking-wider">SURVIVAL_ODDS</h3>
                </div>
                <p className="text-slate-500 text-xs font-mono mb-6 uppercase">Monitor Academic Integrity.</p>
                <div className="flex items-center gap-4">
                    <div className={`text-4xl font-bold font-mono ${isCritical ? 'text-red-500' : 'text-green-500'}`}>
                        {survivalStats.percent}<span className="text-sm text-slate-500">%</span>
                    </div>
                    <div className="h-full w-[1px] bg-slate-800"></div>
                    <div>
                         {isCritical ? (
                            <div className="text-red-500 border border-red-500/30 px-2 py-0.5 text-[10px] inline-block mb-1 font-mono uppercase bg-red-900/10">Critical</div>
                         ) : (
                            <div className="text-green-500 border border-green-500/30 px-2 py-0.5 text-[10px] inline-block mb-1 font-mono uppercase bg-green-900/10">Stable</div>
                         )}
                         <div className="text-[10px] text-slate-400 font-mono">{survivalStats.attended}/{survivalStats.total} COMPLETED</div>
                    </div>
                </div>
            </div>

            {/* Smart Timetable */}
            <div 
                onClick={() => setView(AppView.TIMETABLE)}
                className="md:col-span-1 bg-black/40 p-6 rounded-none border border-cyan-900/30 hover:border-cyan-500 transition-all cursor-pointer group"
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-white font-mono tracking-wider">TEMPORAL_GRID</h3>
                </div>
                <p className="text-slate-500 text-xs font-mono mb-4 uppercase">AI Schedule Parser Online.</p>
                <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center gap-3 text-cyan-300/80 bg-cyan-900/10 p-2 border border-cyan-500/10">
                        <span className="text-cyan-500">&gt;</span> NEXT_OP: {nextClass}
                    </div>
                    <div className="flex items-center gap-3 text-emerald-300/80 bg-emerald-900/10 p-2 border border-emerald-500/10">
                        <span className="text-emerald-500">&gt;</span> STEALTH_OPS: {stealthSlots} AVAILABLE
                    </div>
                </div>
            </div>

            {/* Club Explorer */}
            <div 
                onClick={() => setView(AppView.CLUBS)}
                className="md:col-span-1 bg-black/40 p-6 rounded-none border border-purple-900/30 hover:border-purple-500 transition-all cursor-pointer"
            >
                 <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-white font-mono tracking-wider">FACTION_DB</h3>
                </div>
                <p className="text-slate-500 text-xs font-mono mb-4 uppercase">Access Guild Data.</p>
                <div className="flex flex-wrap gap-2">
                    {['TECH', 'OPS', 'INTEL'].map(tag => (
                        <span key={tag} className="px-2 py-1 bg-purple-900/20 border border-purple-500/20 text-[10px] text-purple-300 font-mono">{tag}</span>
                    ))}
                </div>
            </div>

             {/* AI Tools (Wide) */}
             <div 
                onClick={() => setView(AppView.AI_TOOLS)}
                className="md:col-span-2 bg-black/40 p-6 rounded-none border border-yellow-900/30 hover:border-yellow-500 transition-all cursor-pointer bg-[url('https://media.giphy.com/media/U3qYN8S0j3bpK/giphy.gif')] bg-cover bg-center relative group"
            >
                <div className="absolute inset-0 bg-black/80 group-hover:bg-black/70 transition-all"></div>
                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-yellow-500 font-mono mb-2 flex items-center gap-2">
                        <Terminal size={18} /> AI_CORE_MODULES
                    </h3>
                    <p className="text-slate-300 text-xs font-mono uppercase tracking-widest">Excuse Generator // Class Radar // Professor Profiler</p>
                </div>
            </div>
             
             {/* Stats Small */}
            <div className="md:col-span-1 bg-black/40 p-6 rounded-none border border-white/10 flex flex-col justify-center items-start hover:bg-white/5 transition-all cursor-pointer">
                 <h3 className="text-lg font-bold text-white font-mono">ADVISOR_LOGS</h3>
                 <p className="text-[10px] text-slate-500 mt-1 font-mono uppercase">Predictions: 92% Accuracy</p>
            </div>

        </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-black/40 border border-white/5 p-4 flex flex-col items-center justify-center text-center hover:border-white/20 transition-all group">
        <div className={`mb-2 ${color} group-hover:scale-110 transition-transform`}>{icon}</div>
        <div className="text-2xl font-bold text-white font-mono">{value}</div>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">{label}</div>
    </div>
);

export default Dashboard;