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
import { INITIAL_SUBJECTS } from './constants';
import { db } from './services/db';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isPanicMode, setIsPanicMode] = useState(false);

  useEffect(() => {
    // Initialize Database
    db.init();

    // Check for active session
    const sessionUser = db.getSession();
    if (sessionUser) {
      setUser(sessionUser);
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    db.logout();
    setUser(null);
    setCurrentView(AppView.DASHBOARD);
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
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

        <main className="max-w-7xl mx-auto px-4 pb-20">
            {currentView === AppView.DASHBOARD && (
                <Dashboard setView={setCurrentView} subjects={INITIAL_SUBJECTS} />
            )}
            {currentView === AppView.TIMETABLE && (
                <Timetable />
            )}
            {currentView === AppView.CLUBS && (
                <ClubExplorer />
            )}
            {currentView === AppView.ATTENDANCE && (
                <Attendance setPanicMode={setIsPanicMode} />
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