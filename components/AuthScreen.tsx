import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { db } from '../services/db';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  
  // Matrix typing effect
  useEffect(() => {
    const targetText = "INITIATING SYSTEM... CONNECTING TO COLLEGE SERVER...";
    let i = 0;
    const interval = setInterval(() => {
        setText(targetText.slice(0, i));
        i++;
        if (i > targetText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    setError('');
    setLoading(true);

    // Simulate Network Latency for aesthetic
    setTimeout(() => {
        try {
            let userData;
            if (isLogin) {
                // Login
                userData = db.login(username);
                if (!userData) {
                    throw new Error("ACCESS_DENIED: User ID not found in mainframe.");
                }
            } else {
                // Register
                if (!department) throw new Error("DEPT_CODE_MISSING");
                userData = db.register(username, department);
            }
            onLogin(userData);
        } catch (err: any) {
            setError(err.message || "SYSTEM_FAILURE");
            setLoading(false);
        }
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden">
        {/* Background Grid Animation */}
        <div className="absolute inset-0 z-0 opacity-20" 
             style={{ 
                 backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', 
                 backgroundSize: '40px 40px',
                 transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)'
             }}>
        </div>

        <div className="z-10 w-full max-w-md p-8 glass-panel rounded-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            
            <div className="text-center mb-8">
                <div className="inline-block p-4 rounded-full bg-cyan-950/50 border border-cyan-500/50 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <span className="text-4xl">🎓</span>
                </div>
                <h1 className="text-3xl font-bold text-white tracking-wider mb-2">COLLEGE HUB</h1>
                <p className="text-cyan-400 font-mono text-sm h-6">{text}<span className="animate-pulse">_</span></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-slate-400 text-xs uppercase tracking-widest mb-2">Username</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-black/50 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] outline-none transition-all font-mono"
                        placeholder="ENTER_ID"
                    />
                </div>
                
                {!isLogin && (
                    <div>
                         <label className="block text-slate-400 text-xs uppercase tracking-widest mb-2">Department Code</label>
                         <input 
                            type="text" 
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full bg-black/50 border border-slate-700 rounded-lg p-3 text-white focus:border-pink-500 focus:shadow-[0_0_15px_rgba(255,94,98,0.2)] outline-none transition-all font-mono"
                            placeholder="CS / EC / ME"
                        />
                    </div>
                )}
                
                {error && (
                    <div className="text-red-500 text-xs font-mono text-center border border-red-500/30 bg-red-900/10 p-2">
                        ERROR: {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform hover:scale-[1.02] flex justify-center items-center gap-2"
                >
                    {loading ? (
                        <>Processing <span className="animate-spin">⟳</span></>
                    ) : (
                        isLogin ? 'ACCESS SYSTEM' : 'INITIATE REGISTRATION'
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button 
                    onClick={() => { setIsLogin(!isLogin); setError(''); }}
                    className="text-slate-500 text-sm hover:text-cyan-400 transition-colors"
                >
                    {isLogin ? "New Student? Initialize Protocol" : "Already Registered? Login"}
                </button>
            </div>
        </div>
    </div>
  );
};

export default AuthScreen;