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
    <div className={`min-h-screen transition-colors duration-1000 ${
        isPanicMode ? 'panic-mode-bg' : 'bg-[#050505]'
    }`}>
      {/* Matrix Overlay Effect */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20"></div>

      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]"></div>
         {isPanicMode && (
             <div className="absolute inset-0 bg-red-900/10 animate-pulse z-0"></div>
         )}
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