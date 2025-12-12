import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { db } from '../services/db';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  
  // Matrix typing effect
  useEffect(() => {
    const targetText = "ESTABLISHING SECURE CONNECTION... FIREBASE AUTH PROTOCOL...";
    let i = 0;
    const interval = setInterval(() => {
        setText(targetText.slice(0, i));
        i++;
        if (i > targetText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        let userData;
        if (isLogin) {
            userData = await db.login(email, password);
        } else {
            if (!username) throw new Error("ID_REQUIRED");
            if (!department) throw new Error("DEPT_REQUIRED");
            userData = await db.register(email, password, username, department);
        }
        // App.tsx auth listener will handle the state update, 
        // but we can call onLogin here for immediate feedback if needed.
        // For Firebase, relying on the auth listener is safer.
    } catch (err: any) {
        let msg = err.message;
        if (msg.includes('auth/invalid-email')) msg = "INVALID_EMAIL_FORMAT";
        if (msg.includes('auth/wrong-password')) msg = "ACCESS_DENIED: CREDENTIALS INVALID";
        if (msg.includes('auth/user-not-found')) msg = "USER_NOT_FOUND_IN_DATABASE";
        if (msg.includes('auth/email-already-in-use')) msg = "EMAIL_ALREADY_REGISTERED";
        setError(msg);
    } finally {
        setLoading(false);
    }
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
                    <span className="text-4xl">🔥</span>
                </div>
                <h1 className="text-3xl font-bold text-white tracking-wider mb-2">COLLEGE HUB</h1>
                <p className="text-cyan-400 font-mono text-xs h-6">{text}<span className="animate-pulse">_</span></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Email Field */}
                <div>
                    <label className="block text-slate-400 text-[10px] uppercase tracking-widest mb-1">Email Address</label>
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/50 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] outline-none transition-all font-mono"
                        placeholder="student@college.edu"
                    />
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-slate-400 text-[10px] uppercase tracking-widest mb-1">Password</label>
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/50 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] outline-none transition-all font-mono"
                        placeholder="••••••••"
                    />
                </div>
                
                {!isLogin && (
                    <>
                        <div>
                            <label className="block text-slate-400 text-[10px] uppercase tracking-widest mb-1">Username / Codename</label>
                            <input 
                                type="text" 
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black/50 border border-slate-700 rounded-lg p-3 text-white focus:border-pink-500 focus:shadow-[0_0_15px_rgba(255,94,98,0.2)] outline-none transition-all font-mono"
                                placeholder="ENTER_ID"
                            />
                        </div>
                        <div>
                             <label className="block text-slate-400 text-[10px] uppercase tracking-widest mb-1">Department Code</label>
                             <input 
                                type="text" 
                                required
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="w-full bg-black/50 border border-slate-700 rounded-lg p-3 text-white focus:border-pink-500 focus:shadow-[0_0_15px_rgba(255,94,98,0.2)] outline-none transition-all font-mono"
                                placeholder="CS / EC / ME"
                            />
                        </div>
                    </>
                )}
                
                {error && (
                    <div className="text-red-500 text-xs font-mono text-center border border-red-500/30 bg-red-900/10 p-2">
                        ERROR: {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform hover:scale-[1.02] flex justify-center items-center gap-2 mt-4"
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
                    {isLogin ? "New Student? Initialize Protocol" : "Back to Login"}
                </button>
            </div>
        </div>
    </div>
  );
};

export default AuthScreen;