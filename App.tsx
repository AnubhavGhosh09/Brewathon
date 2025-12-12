import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import Timetable from './components/Timetable';
import ClubExplorer from './components/ClubExplorer';
import Attendance from './components/Attendance';
import Marketplace from './components/Marketplace';
import AITools from './components/AITools';
import AuthScreen from './components/AuthScreen';
import SeniorBot from './components/SeniorBot';
import { AppView, User } from './types';
import { db } from './services/db';
import { auth } from './services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { dbInstance } from './services/firebaseConfig';
import { Loader, WifiOff } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let userData: any = {};
        try {
            // Attempt to fetch additional user data from Firestore
            const userDoc = await getDoc(doc(dbInstance, "users", firebaseUser.uid));
            if (userDoc.exists()) {
                userData = userDoc.data();
            }
            setIsOffline(false);
        } catch (e) {
            console.warn("Firestore unreachable, falling back to basic auth:", e);
            setIsOffline(true);
            // Fallback: Use what we have from the Auth object
        }
        
        setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            username: firebaseUser.displayName || userData.username || 'Student',
            department: userData.department || 'General',
            isLoggedIn: true
        });
      } else {
        setUser(null);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    db.logout();
    setCurrentView(AppView.DASHBOARD);
  };

  if (isLoadingAuth) {
      return (
          <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="text-cyan-500 font-mono flex flex-col items-center gap-4">
                  <Loader className="animate-spin" size={32} />
                  <span className="animate-pulse">CONNECTING TO MAINFRAME...</span>
              </div>
          </div>
      );
  }

  if (!user) {
    return <AuthScreen onLogin={(u) => setUser(u)} />;
  }

  return (
    // REMOVED 'hue-cycle' from here to prevent breaking fixed/sticky positioning of children
    <div className={`min-h-screen relative overflow-hidden bg-[#02040a] transition-colors duration-1000`}>
      
      {/* --- ANIMATED BACKGROUND SYSTEM --- */}
      {/* ADDED 'hue-cycle' here so only the background shifts colors, not the UI layout context */}
      <div className={`fixed inset-0 pointer-events-none z-0 ${!isPanicMode ? 'hue-cycle' : ''}`}>
        
        {/* 1. Deep Space Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1e293b_0%,_#02040a_80%)] opacity-80"></div>

        {/* 2. Horizon Glow Line */}
        <div className="absolute top-[30%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-sm opacity-50"></div>

        {/* 3. Moving Perspective Grid */}
        <div className={`perspective-grid ${isPanicMode ? 'opacity-20' : 'opacity-80'}`}></div>
        
        {/* 4. Scanning Beam */}
        {!isPanicMode && <div className="scanline-beam"></div>}

        {/* 5. Floating Neon Blobs (Enhanced) */}
        {!isPanicMode && (
          <>
            <div className="neon-blob w-[500px] h-[500px] bg-purple-600/30 top-[-10%] left-[-10%] animate-[blob-float_20s_infinite_alternate] mix-blend-screen"></div>
            <div className="neon-blob w-[400px] h-[400px] bg-cyan-600/20 bottom-[-10%] right-[-10%] animate-[blob-float_15s_infinite_alternate-reverse] mix-blend-screen"></div>
            <div className="neon-blob w-[300px] h-[300px] bg-emerald-600/20 top-[40%] left-[40%] animate-[blob-float_25s_infinite_alternate] mix-blend-screen"></div>
          </>
        )}

        {/* 6. Panic Mode Red Overlay (Pulsing) */}
        {isPanicMode && (
            <div className="absolute inset-0 bg-red-950/40 mix-blend-overlay animate-pulse"></div>
        )}
        
        {/* 7. Scanlines/Noise Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
        
        {/* 8. Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-60"></div>
      </div>

      <div className="relative z-10">
        <NavBar 
            currentView={currentView} 
            setView={setCurrentView} 
            onLogout={handleLogout}
        />

        {isOffline && (
            <div className="max-w-7xl mx-auto px-4 mb-4">
                <div className="bg-yellow-900/20 border border-yellow-500/50 text-yellow-500 p-2 text-xs font-mono flex items-center justify-center gap-2">
                    <WifiOff size={14} />
                    OFFLINE MODE ENGAGED :: DATABASE UNREACHABLE :: USING CACHED/DEFAULT PROTOCOLS
                </div>
            </div>
        )}

        <main className="max-w-7xl mx-auto px-4 pb-20">
            {currentView === AppView.DASHBOARD && (
                <Dashboard setView={setCurrentView} user={user} />
            )}
            {currentView === AppView.TIMETABLE && (
                <Timetable user={user} />
            )}
            {currentView === AppView.CLUBS && (
                <ClubExplorer />
            )}
            {currentView === AppView.ATTENDANCE && (
                <Attendance setPanicMode={setIsPanicMode} user={user} />
            )}
            {currentView === AppView.MARKETPLACE && (
                <Marketplace user={user} />
            )}
            {currentView === AppView.AI_TOOLS && (
                <AITools />
            )}
        </main>

        <SeniorBot />
      </div>
    </div>
  );
};

export default App;