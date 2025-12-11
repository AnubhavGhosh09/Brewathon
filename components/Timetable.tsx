import React, { useState, useEffect } from 'react';
import { DaySchedule, TimetableSlot } from '../types';
import { Upload, Loader, Calendar as CalIcon, Cpu } from 'lucide-react';
import { parseTimetableImage } from '../services/geminiService';
import { db } from '../services/db';

const Timetable: React.FC = () => {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [activeDay, setActiveDay] = useState('Monday');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Load from DB on mount
    const savedTimetable = db.getTimetable();
    if (savedTimetable.length > 0) {
        setSchedule(savedTimetable);
    }
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDaySchedule = schedule.find(d => d.day === activeDay)?.slots || [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
        const base64String = reader.result as string;
        // Strip prefix for API
        const base64Data = base64String.split(',')[1];
        
        try {
            const jsonString = await parseTimetableImage(base64Data);
            const parsedSchedule = JSON.parse(jsonString);
            
            if (Array.isArray(parsedSchedule) && parsedSchedule.length > 0) {
                setSchedule(parsedSchedule);
                // Save and Sync
                db.saveTimetable(parsedSchedule);
                db.syncSubjectsFromTimetable(parsedSchedule);
                alert("SYSTEM UPDATE: Timetable deciphered. Attendance metrics re-calibrated.");
            }
        } catch (err) {
            alert('Decryption Failed. Image data corrupted.');
        } finally {
            setIsUploading(false);
        }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2 font-mono">
            <span className="text-cyan-500">></span> TEMPORAL_GRID
          </h2>
          <p className="text-slate-500 font-mono text-sm uppercase">Synchronize your schedule to the College Mainframe.</p>
        </div>
        
        <label className="cursor-pointer px-6 py-2 border border-cyan-500/50 bg-cyan-900/10 text-cyan-400 hover:bg-cyan-500/20 transition-all flex items-center gap-2 font-mono text-sm tracking-wide group">
            {isUploading ? <Loader className="animate-spin" size={16} /> : <Upload size={16} />}
            <span className="group-hover:text-white transition-colors">UPLOAD_DATA_SHARD</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
        </label>
      </div>

      {/* AI Suggestion Banner */}
      <div className="p-4 border border-emerald-500/30 bg-emerald-900/10 flex flex-col md:flex-row gap-4 items-center">
        <div className="p-2 border border-emerald-500/50 text-emerald-400">
            <Cpu size={20} />
        </div>
        <div className="flex-1">
            <h4 className="font-bold text-emerald-400 font-mono uppercase tracking-wider text-sm">OPTIMIZATION PROTOCOL: ACTIVE</h4>
            <div className="flex gap-2 mt-2 flex-wrap">
                <span className="text-[10px] px-2 py-1 bg-emerald-900/40 text-emerald-300 border border-emerald-700 font-mono uppercase">Mon 16:00 :: Stealth Op Recommended</span>
                <span className="text-[10px] px-2 py-1 bg-emerald-900/40 text-emerald-300 border border-emerald-700 font-mono uppercase">Fri 15:00 :: Weekend Protocol</span>
            </div>
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex justify-between md:justify-start gap-1 overflow-x-auto pb-2 border-b border-white/10">
        {days.map(day => (
            <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`flex-1 md:flex-none px-6 py-3 text-xs font-mono uppercase tracking-widest border-t border-l border-r transition-all ${
                    activeDay === day
                    ? 'bg-slate-900 border-cyan-500 text-cyan-400'
                    : 'bg-transparent border-transparent text-slate-600 hover:text-slate-400'
                }`}
            >
                {day}
            </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentDaySchedule.length > 0 ? currentDaySchedule.map((slot, idx) => (
             <SlotCard key={idx} slot={slot} />
        )) : (
            <div className="col-span-full py-12 text-center text-slate-600 font-mono uppercase tracking-widest border border-dashed border-slate-800">
                // NO_DATA_FOUND // SYSTEM_IDLE
            </div>
        )}
      </div>
    </div>
  );
};

const SlotCard: React.FC<{ slot: TimetableSlot }> = ({ slot }) => {
    const isFree = slot.type === 'Free' || slot.type === 'Lunch';
    const colorClass = 
        slot.type === 'Lecture' ? 'border-l-4 border-l-indigo-500 bg-indigo-900/10' :
        slot.type === 'Lab' ? 'border-l-4 border-l-emerald-500 bg-emerald-900/10' :
        'border-l-4 border-l-slate-700 bg-slate-900/20 opacity-50';

    return (
        <div className={`p-5 border border-white/5 ${colorClass} transition-all hover:translate-x-1`}>
            <div className="flex justify-between items-start mb-2">
                <div className="text-xl font-bold font-mono text-white">{slot.time}</div>
                <span className="px-1.5 py-0.5 text-[9px] bg-black border border-white/20 uppercase font-mono tracking-widest text-slate-400">{slot.type}</span>
            </div>
            <div className="text-sm font-bold mb-1 text-slate-200 font-mono">{slot.subject}</div>
            {slot.room && <div className="text-xs text-slate-500 font-mono">LOC :: {slot.room}</div>}
        </div>
    );
};

export default Timetable;