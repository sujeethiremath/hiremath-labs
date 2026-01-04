"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut,
  signInAnonymously,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  User,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  deleteDoc,
  serverTimestamp,
  getDoc,
  Firestore,
  query
} from 'firebase/firestore';
import { 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Flame, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  Target, 
  User as UserIcon,
  LogIn,
  Lock,
  AlertCircle,
  X,
  Columns,
  Rows,
  Layout,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

// --- CONFIGURATION & INITIALIZATION ---

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseApp: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth: Auth = getAuth(firebaseApp);
const db: Firestore = getFirestore(firebaseApp);



const appId = typeof window !== 'undefined' && (window as any).__app_id 
  ? (window as any).__app_id 
  : 'habit-tracker-pro';

// --- INTEGRATED ANALYTICS UTILITY ---

const trackEvent = async (eventName: string, details: Record<string, any> = {}) => {
  try {
    const response = await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        eventName, 
        details: {
          ...details,
          appId,
          platform: 'web',
          page: 'Habit Tracker',
          url: typeof window !== 'undefined' ? window.location.href : '',
          timestamp: new Date().toISOString()
        } 
      }),
    });
  } catch (error) {
    console.error("Error sending analytics request:", error);
  }
};

// --- INTEGRATED LOGIN MODAL ---

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" className="mr-1">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
  </svg>
);

const InternalLoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    trackEvent("Auth Attempt Start", { method: 'email' });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      trackEvent("Auth Success", { method: "email" });
      onClose();
    } catch (err: any) {
      trackEvent("Auth Failed", { method: "email", error: err.code });
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    trackEvent("Auth Attempt Start", { method: 'google' });
    try {
      await signInWithPopup(auth, provider);
      trackEvent("Auth Success", { method: "google" });
      onClose();
    } catch (err: any) {
      trackEvent("Auth Failed", { method: "google", error: err.code });
      setError("Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  // --- Custom Google Icon Component ---
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
  </svg>
);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative bg-gray-900 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl w-full max-w-md text-white overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />
            <button 
              onClick={() => {
                onClose();
                trackEvent("Auth Modal Closed");
              }} 
              className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black mb-3 tracking-tight">Welcome Back</h2>
              <p className="text-gray-400 text-sm font-medium">Log in to sync your habits and progress.</p>
            </div>
            <div className="space-y-4 mb-8">
              <button onClick={handleGoogleLogin} disabled={loading} className="w-full flex items-center justify-center gap-3 py-4 bg-white text-gray-900 rounded-2xl font-black hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50 shadow-xl text-sm">
                <GoogleIcon />
                Continue with Google
              </button>
              <div className="flex items-center gap-4 text-gray-700 text-[10px] font-black uppercase tracking-[0.2em]">
                <div className="h-px bg-white/5 flex-1" />
                <span>Secure Entry</span>
                <div className="h-px bg-white/5 flex-1" />
              </div>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:border-blue-500 outline-none transition-all text-sm" required />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:border-blue-500 outline-none transition-all text-sm" required />
              {error && <p className="text-rose-400 text-xs text-center font-bold uppercase tracking-wider">{error}</p>}
              <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50 text-sm">
                {loading ? "Verifying..." : "Sign In"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- DATA INTERFACES ---
interface Habit {
  id: string;
  name: string;
  createdAt: any;
  active: boolean;
}

interface DayLog {
  completedHabits: string[];
  date: string;
  updatedAt?: any;
}

interface StreakMap {
  [habitId: string]: number;
}

interface CalendarDay {
  date: Date;
  key: string;
  label: string;
  num: number;
}

type TrackerView = 'daily' | 'weekly' | 'monthly';

export default function HabitTrackerPage() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'tracker' | 'stats'>('tracker');
  const [trackerView, setTrackerView] = useState<TrackerView>('weekly'); 
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<{ [dateKey: string]: DayLog }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const dateKey = selectedDate.toISOString().split('T')[0];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        trackEvent("Session Started", { is_guest: u.isAnonymous, user_id: u.uid });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const habitsPath = collection(db, 'artifacts', appId, 'users', user.uid, 'habits');
    const logsPath = collection(db, 'artifacts', appId, 'users', user.uid, 'logs');
    const settingsPath = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'preferences');

    const unsubHabits = onSnapshot(query(habitsPath), (snapshot) => {
      setHabits(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Habit)));
      setError(null);
    }, (err) => {
      if (err.code === 'permission-denied') setError("Permission Error: Check Firestore Rules");
    });

    const unsubLogs = onSnapshot(query(logsPath), (snapshot) => {
      const logMap: { [key: string]: DayLog } = {};
      snapshot.docs.forEach(d => { logMap[d.id] = d.data() as DayLog; });
      setLogs(logMap);
    });

    const unsubPrefs = onSnapshot(settingsPath, (snap) => {
      if (snap.exists() && snap.data().preferredView) {
        setTrackerView(snap.data().preferredView);
      }
    });

    return () => { unsubHabits(); unsubLogs(); unsubPrefs(); };
  }, [user]);

  const streaks = useMemo<StreakMap>(() => {
    const res: StreakMap = {};
    const todayStr = new Date().toISOString().split('T')[0];

    habits.forEach(habit => {
      let count = 0;
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      
      while (true) {
        const k = d.toISOString().split('T')[0];
        if (logs[k]?.completedHabits?.includes(habit.id)) {
          count++;
          d.setDate(d.getDate() - 1);
        } else {
          if (k === todayStr) {
            d.setDate(d.getDate() - 1);
            continue;
          }
          break;
        }
      }
      res[habit.id] = count;
    });
    return res;
  }, [habits, logs]);

  const toggleHabit = async (habitId: string, specificDateKey?: string) => {
    if (!user) return;
    const targetKey = specificDateKey || dateKey;
    const habit = habits.find(h => h.id === habitId);
    const currentLog = logs[targetKey] || { completedHabits: [], date: targetKey };
    const isCompleted = currentLog.completedHabits?.includes(habitId);
    
    const newCompleted = isCompleted 
      ? currentLog.completedHabits.filter(id => id !== habitId)
      : [...(currentLog.completedHabits || []), habitId];

    trackEvent("Habit Toggled", { 
      habit_id: habitId,
      habit_name: habit?.name,
      new_status: !isCompleted ? 'completed' : 'incomplete',
      date: targetKey,
      view_context: trackerView
    });

    try {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'logs', targetKey), {
        completedHabits: newCompleted,
        date: targetKey,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewChange = async (newView: TrackerView) => {
    trackEvent("View Switched", { from: trackerView, to: newView });
    setTrackerView(newView);
    if (!user) return;
    try {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'preferences'), {
        preferredView: newView,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {}
  };

  const navigateDate = (amount: number) => {
    const d = new Date(selectedDate);
    const mode = trackerView === 'monthly' ? 'month' : trackerView === 'weekly' ? 'week' : 'day';
    
    if (trackerView === 'monthly') d.setMonth(d.getMonth() + amount);
    else if (trackerView === 'weekly') d.setDate(d.getDate() + (amount * 7));
    else d.setDate(d.getDate() + amount);
    
    trackEvent("Date Navigation", { direction: amount > 0 ? 'next' : 'prev', mode });
    setSelectedDate(d);
  };

  const handleLogout = async () => {
    trackEvent("Logout Initiated");
    await signOut(auth);
  };

  const handleGuestLogin = async () => {
    trackEvent("Auth Attempt Start", { method: 'guest' });
    try {
      await signInAnonymously(auth);
      trackEvent("Auth Success", { method: 'guest' });
    } catch (err) {
      trackEvent("Auth Failed", { method: 'guest' });
      alert("Anonymous login is disabled.");
    }
  };

  const currentWeekDays = useMemo<CalendarDay[]>(() => {
    const days: CalendarDay[] = [];
    const start = new Date(selectedDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push({ 
        date: d, 
        key: d.toISOString().split('T')[0], 
        label: d.toLocaleDateString('en-US', { weekday: 'short' }), 
        num: d.getDate() 
      });
    }
    return days;
  }, [selectedDate]);

  const currentMonthDays = useMemo<CalendarDay[]>(() => {
    const days: CalendarDay[] = [];
    const last = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    for (let i = 1; i <= last.getDate(); i++) {
      const d = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
      days.push({ 
        date: d, 
        key: d.toISOString().split('T')[0], 
        label: '', // Empty label for monthly view
        num: i 
      });
    }
    return days;
  }, [selectedDate]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-950">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user || error) return (
    <div className="flex h-screen items-center justify-center bg-gray-950 p-4 font-sans">
      <InternalLoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <div className="max-w-md w-full bg-gray-900 p-10 rounded-[3rem] border border-white/5 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
        <div className={`w-20 h-20 ${error ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-600/10 text-blue-500'} rounded-3xl flex items-center justify-center mx-auto mb-8`}>
          {error ? <AlertCircle size={40} /> : <Lock size={40} />}
        </div>
        <h1 className="text-3xl font-black text-white mb-4 tracking-tight">
          {error ? "Access Required" : "Focus Habit Tracker"}
        </h1>
        <p className="text-gray-400 mb-10 leading-relaxed font-medium">
          The cleanest, most minimalist habit tracker to build streaks and master your routines. A powerful alternative to Habitify and Habitica.
        </p>
        <div className="space-y-4">
          <button 
            onClick={() => { 
              setIsLoginModalOpen(true); 
              trackEvent("Login Modal Opened"); 
            }} 
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-500 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-blue-600/20 text-sm"
          >
            <LogIn size={20} /> Sign In to Start
          </button>
          <button onClick={handleGuestLogin} className="w-full bg-white/5 text-gray-400 py-4 rounded-2xl font-bold hover:bg-white/10 hover:text-white transition-all active:scale-95 border border-white/5 text-sm">
            Try as Guest
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0 font-sans mt-20">
      <div className="max-w-6xl mx-auto md:flex gap-8 p-4 md:p-8">
        <aside className="md:w-64 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="font-black text-xl mb-6 tracking-tight flex items-center gap-2">
              <Target className="text-indigo-600" /> Focus Tracker
            </h2>
            <nav className="space-y-1">
              <SidebarItem 
                active={activeTab === 'tracker'} 
                onClick={() => { setActiveTab('tracker'); trackEvent("Navigation Click", { target: 'tracker' }); }} 
                icon={<Calendar size={18}/>} label="Dashboard" 
              />
              <SidebarItem 
                active={activeTab === 'stats'} 
                onClick={() => { setActiveTab('stats'); trackEvent("Navigation Click", { target: 'stats' }); }} 
                icon={<BarChart3 size={18}/>} label="Analytics" 
              />
              <div className="pt-4 mt-4 border-t border-slate-100">
                <SidebarItem active={false} onClick={handleLogout} icon={<LogOut size={18}/>} label="Logout" />
              </div>
            </nav>
          </div>
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
            <Flame className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12" />
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">Consistency Streak</p>
            <p className="text-4xl font-black">{habits.length > 0 ? Math.max(0, ...Object.values(streaks)) : 0} Days</p>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          {activeTab === 'tracker' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex flex-col lg:flex-row items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex bg-slate-100 rounded-xl p-1 shrink-0">
                    <button onClick={() => navigateDate(-1)} className="group flex flex-col items-center justify-center p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all min-w-[80px]">
                      <ChevronLeft size={16} className="mb-0.5 text-slate-400 group-hover:text-indigo-600" />
                      <span className="text-[8px] font-black uppercase opacity-60">Prev {trackerView === 'daily' ? 'Day' : trackerView.replace('ly', '')}</span>
                    </button>
                    <button onClick={() => { setSelectedDate(new Date()); trackEvent("Date Reset Clicked"); }} className="group flex flex-col items-center justify-center px-4 hover:bg-white hover:shadow-sm rounded-lg transition-all border-x border-slate-200/50">
                      <RefreshCcw size={14} className="mb-1 text-indigo-600" />
                      <span className="text-[8px] font-black uppercase">Current {trackerView === 'daily' ? 'Day' : trackerView.replace('ly', '')}</span>
                    </button>
                    <button onClick={() => navigateDate(1)} className="group flex flex-col items-center justify-center p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all min-w-[80px]">
                      <ChevronRight size={16} className="mb-0.5 text-slate-400 group-hover:text-indigo-600" />
                      <span className="text-[8px] font-black uppercase opacity-60">Next {trackerView === 'daily' ? 'Day' : trackerView.replace('ly', '')}</span>
                    </button>
                  </div>
                  <div className="ml-2">
                    <h2 className="font-bold text-sm leading-tight text-slate-800">
                      {trackerView === 'monthly' ? selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) :
                       trackerView === 'weekly' ? `Week of ${currentWeekDays[0].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` :
                       selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h2>
                  </div>
                </div>

                <div className="flex bg-slate-100 rounded-xl p-1 w-full lg:w-auto">
                  <ViewToggle active={trackerView === 'daily'} onClick={() => handleViewChange('daily')} icon={<Layout size={14}/>} label="Daily" />
                  <ViewToggle active={trackerView === 'weekly'} onClick={() => handleViewChange('weekly')} icon={<Columns size={14}/>} label="Weekly" />
                  <ViewToggle active={trackerView === 'monthly'} onClick={() => handleViewChange('monthly')} icon={<Rows size={14}/>} label="Monthly" />
                </div>
              </div>

              <section className="grid gap-3">
                {habits.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium">Your minimalist routine is empty. Start your first goal below!</div>
                )}

                {(trackerView === 'weekly' || trackerView === 'monthly') && habits.length > 0 && (
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 sticky left-0 bg-white/95 backdrop-blur-sm z-10 min-w-[160px] border-r border-slate-100">Habit Name</th>
                          {(trackerView === 'weekly' ? currentWeekDays : currentMonthDays).map(day => (
                            <th key={day.key} className="p-3 text-center min-w-[44px]">
                              <span className={`text-[9px] font-black uppercase block ${day.key === new Date().toISOString().split('T')[0] ? 'text-indigo-600' : 'text-slate-400'}`}>{trackerView === 'weekly' ? day.label : ''}</span>
                              <span className={`text-[11px] font-bold ${day.key === new Date().toISOString().split('T')[0] ? 'text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full' : 'text-slate-600'}`}>{day.num}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {habits.map(h => (
                          <tr key={h.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-all">
                            <td className="p-4 font-bold text-slate-700 sticky left-0 bg-white/95 backdrop-blur-sm z-10 border-r border-slate-100"><p className="truncate w-36 text-sm">{h.name}</p></td>
                            {(trackerView === 'weekly' ? currentWeekDays : currentMonthDays).map(day => {
                              const done = logs[day.key]?.completedHabits?.includes(h.id);
                              return (
                                <td key={day.key} className="p-2 text-center">
                                  <button onClick={() => toggleHabit(h.id, day.key)} className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-all ${done ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 text-transparent hover:bg-slate-200'}`}>
                                    <CheckCircle2 size={16} strokeWidth={4} />
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {trackerView === 'daily' && habits.map(h => {
                  const done = logs[dateKey]?.completedHabits?.includes(h.id);
                  return (
                    <article key={h.id} className={`group flex items-center justify-between p-5 rounded-3xl border transition-all duration-300 ${done ? 'bg-emerald-50 border-emerald-200 shadow-none' : 'bg-white border-slate-100 shadow-sm hover:border-slate-300'}`}>
                      <div className="flex items-center gap-5">
                        <button onClick={() => toggleHabit(h.id)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${done ? 'bg-emerald-500 text-white scale-105' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'}`}>
                          <CheckCircle2 size={24} strokeWidth={3} />
                        </button>
                        <div>
                          <p className={`font-bold text-lg ${done ? 'text-emerald-900' : 'text-slate-800'}`}>{h.name}</p>
                          <span className="text-[10px] font-black uppercase text-orange-500 flex items-center gap-1.5"><Flame size={12} fill="currentColor" /> {streaks[h.id] || 0} DAY STREAK</span>
                        </div>
                      </div>
                      <button onClick={() => { trackEvent("Habit Deleted Clicked", { name: h.name }); deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'habits', h.id)); }} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all rounded-lg hover:bg-rose-50"><Trash2 size={18} /></button>
                    </article>
                  );
                })}

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const name = formData.get('habitName') as string;
                  if (!name || !user) return;
                  const id = crypto.randomUUID();
                  trackEvent("Habit Creation Started", { name });
                  setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'habits', id), { name, createdAt: serverTimestamp(), active: true });
                  e.currentTarget.reset();
                }} className="flex gap-3 mt-6">
                  <input name="habitName" autoComplete="off" placeholder="E.g. 30 min Morning Workout" className="flex-1 px-6 py-4 bg-white border border-slate-200 rounded-[2rem] focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm font-medium transition-all text-sm" />
                  <button type="submit" className="bg-slate-900 text-white px-8 rounded-[2rem] font-bold hover:bg-black transition-all shadow-lg active:scale-95 text-sm">Add Habit</button>
                </form>
              </section>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in zoom-in-95 duration-500">
              {habits.map(h => (
                <div key={h.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-36">
                  <div className="flex justify-between items-start">
                    <p className="font-black text-slate-400 uppercase text-[10px] tracking-widest">{h.name}</p>
                    <div className="flex items-center gap-1 text-indigo-600 font-black text-2xl">{streaks[h.id] || 0}<Flame size={16} fill="currentColor" className="text-orange-400" /></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase"><span>Progress Goal (30 Days)</span><span>{Math.min(100, Math.round((streaks[h.id] || 0) / 30 * 100))}%</span></div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${Math.min((streaks[h.id] || 0) / 30 * 100, 100)}%` }} /></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 md:hidden flex justify-around items-center z-50 rounded-t-3xl shadow-2xl">
        <MobileItem active={activeTab === 'tracker'} onClick={() => setActiveTab('tracker')} icon={<Calendar size={22}/>} />
        <MobileItem active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<BarChart3 size={22}/>} />
        <button onClick={handleLogout} className="p-3 text-slate-400 hover:text-rose-500 transition-all"><LogOut size={22} /></button>
      </nav>
    </div>
  );
}

function SidebarItem({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>{icon} {label}</button>;
}

function MobileItem({ active, icon, onClick }: { active: boolean, icon: React.ReactNode, onClick: () => void }) {
  return <button onClick={onClick} className={`p-4 rounded-2xl transition-all duration-300 ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-slate-600'}`}>{icon}</button>;
}

function ViewToggle({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button onClick={onClick} className={`flex flex-1 lg:flex-none items-center justify-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
      {icon} <span className="hidden sm:inline">{label}</span>
    </button>
  );
}