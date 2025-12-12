import React, { useState, useEffect } from 'react';
import { Subject, User } from '../types';
import { AlertTriangle, CheckCircle, XCircle, ShieldAlert, Settings, Save, X, RefreshCw } from 'lucide-react';
import { db } from '../services/db';

interface AttendanceProps {
  setPanicMode: (isPanic: boolean) => void;
  user: User;
}

const Attendance: React.FC<AttendanceProps> = ({ setPanicMode, user }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{attended: number, total: number}>({ attended: 0, total: 0 });

  useEffect(() => {
    const fetchSubjects = async () => {
        setLoading(true);
        const data = await db.getSubjects(user.uid);
        setSubjects(data);
        setLoading(false);
    };
    fetchSubjects();
  }, [user.uid]);

  // Calculate overall percentage and check for panic mode
  const totalClasses = subjects.reduce((acc, sub) => acc + sub.total, 0);
  const totalAttended = subjects.reduce((acc, sub) => acc + sub.attended, 0);
  const overallPercentage = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 100;

  useEffect(() => {
    setPanicMode(overallPercentage < 85);
  }, [overallPercentage, setPanicMode]);

  const saveSubjectsToDb = async (newSubjects: Subject[]) => {
      setSubjects(newSubjects); // Optimistic UI update
      await db.saveSubjects(user.uid, newSubjects);
  };

  const updateAttendance = async (id: string, type: 'attend' | 'bunk') => {
    const newSubjects = subjects.map(sub => {
      if (sub.id === id) {
        return {
          ...sub,
          attended: type === 'attend' ? sub.attended + 1 : sub.attended,
          total: sub.total + 1
        };
      }
      return sub;
    });
    await saveSubjectsToDb(newSubjects);
  };

  const startEdit = (subject: Subject) => {
      setEditingId(subject.id);
      setEditValues({ attended: subject.attended, total: subject.total });
  };

  const cancelEdit = () => {
      setEditingId(null);
  };

  const saveEdit = async (id: string) => {
      const newSubjects = subjects.map(sub => {
          if (sub.id === id) {
              return {
                  ...sub,
                  attended: Math.min(editValues.attended, editValues.total), 
                  total: editValues.total
              };
          }
          return sub;
      });
      await saveSubjectsToDb(newSubjects);
      setEditingId(null);
  };

  if (loading) {
      return (
          <div className="flex justify-center items-center h-64 text-emerald-500 font-mono gap-2">
              <RefreshCw className="animate-spin" /> DOWNLOADING METRICS...
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
           <h2 className="text-3xl font-bold text-white mb-1 font-mono flex items-center gap-3">
             <ShieldAlert className={overallPercentage < 85 ? "text-red-500" : "text-green-500"} />
             SURVIVAL_METRICS
           </h2>
           <p className="text-slate-500 font-mono text-sm uppercase">Threshold: 85%. Failure leads to system detention.</p>
        </div>
        <div className={`px-4 py-2 border flex items-center gap-2 font-mono ${
            overallPercentage < 85 
            ? 'bg-red-900/20 border-red-500 text-red-500 animate-pulse' 
            : 'bg-green-900/20 border-green-500 text-green-500'
        }`}>
            <span className="text-3xl font-bold">{overallPercentage}%</span>
            <div className="flex flex-col text-[8px] uppercase tracking-widest leading-tight">
                <span>System</span>
                <span>Status</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map(subject => {
            const pct = subject.total > 0 ? Math.round((subject.attended / subject.total) * 100) : 100;
            const isDanger = pct < 85;
            const isEditing = editingId === subject.id;
            
            // Calculate "Safe Bunks" logic
            let safeBunks = 0;
            if (!isDanger) {
                 safeBunks = Math.floor((subject.attended - 0.85 * subject.total) / 0.85);
            }

            return (
                <div key={subject.id} className={`bg-black/40 p-5 border transition-all relative overflow-hidden group ${isDanger ? 'border-red-500/50' : 'border-slate-800 hover:border-white/30'}`}>
                    {/* Background Glitch Effect for Danger */}
                    {isDanger && !isEditing && <div className="absolute inset-0 bg-red-900/10 pointer-events-none animate-pulse"></div>}

                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div>
                            <h3 className="font-bold text-lg text-white font-mono tracking-wide">{subject.name}</h3>
                            {!isEditing && (
                                <div className="text-xs text-slate-500 mt-1 font-mono uppercase">
                                    Logged: {subject.attended}/{subject.total} Sessions
                                </div>
                            )}
                        </div>
                        
                        {!isEditing ? (
                            <div className="flex items-center gap-3">
                                <div className={`font-bold font-mono text-xl ${isDanger ? 'text-red-500' : 'text-green-500'}`}>
                                    {pct}%
                                </div>
                                <button 
                                    onClick={() => startEdit(subject)}
                                    className="text-slate-600 hover:text-white transition-colors"
                                >
                                    <Settings size={16} />
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={cancelEdit}
                                className="text-slate-500 hover:text-red-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="relative z-10 space-y-4 animate-[fadeIn_0.2s_ease-out]">
                             <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-[10px] uppercase text-emerald-500 font-mono mb-1">Attended Classes</label>
                                    <input 
                                        type="number" 
                                        value={editValues.attended}
                                        onChange={e => setEditValues({...editValues, attended: parseInt(e.target.value) || 0})}
                                        className="w-full bg-slate-900 border border-slate-600 text-white p-2 font-mono focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[10px] uppercase text-emerald-500 font-mono mb-1">Total Classes</label>
                                    <input 
                                        type="number" 
                                        value={editValues.total}
                                        onChange={e => setEditValues({...editValues, total: parseInt(e.target.value) || 0})}
                                        className="w-full bg-slate-900 border border-slate-600 text-white p-2 font-mono focus:border-emerald-500 outline-none"
                                    />
                                </div>
                             </div>
                             <button 
                                onClick={() => saveEdit(subject.id)}
                                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold font-mono uppercase flex items-center justify-center gap-2"
                            >
                                <Save size={14} /> SAVE_CONFIGURATION
                             </button>
                        </div>
                    ) : (
                        <>
                            {/* Progress Bar */}
                            <div className="w-full h-1 bg-slate-900 mb-4 overflow-hidden relative z-10">
                                <div 
                                    className={`h-full transition-all duration-500 ${isDanger ? 'bg-red-600' : 'bg-green-500'}`} 
                                    style={{ width: `${pct}%` }}
                                />
                            </div>

                            {/* Controls */}
                            <div className="flex gap-2 mb-3 relative z-10">
                                <button 
                                    onClick={() => updateAttendance(subject.id, 'attend')}
                                    className="flex-1 py-2 bg-green-900/10 border border-green-500/30 text-green-400 text-xs hover:bg-green-500/20 transition-colors flex justify-center items-center gap-1 font-mono uppercase"
                                >
                                    <CheckCircle size={12} /> CONFIRM_PRESENCE
                                </button>
                                <button 
                                    onClick={() => updateAttendance(subject.id, 'bunk')}
                                    className="flex-1 py-2 bg-red-900/10 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/20 transition-colors flex justify-center items-center gap-1 font-mono uppercase"
                                >
                                    <XCircle size={12} /> INITIATE_GHOST
                                </button>
                            </div>

                            {/* Insight */}
                            <div className="text-xs text-center border-t border-white/5 pt-2 font-mono relative z-10">
                                {isDanger ? (
                                    <span className="text-red-500 flex items-center justify-center gap-1 animate-pulse">
                                        <AlertTriangle size={12} /> WARNING: ATTEND NEXT {Math.max(1, Math.ceil((0.85 * subject.total - subject.attended)/0.15))}
                                    </span>
                                ) : (
                                    <span className="text-slate-500">
                                        GHOST PROTOCOL AVAILABLE: <span className="text-green-500 font-bold">{safeBunks}</span> SESSIONS
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default Attendance;