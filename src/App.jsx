import LogIn from './components/login';
import SignUp from './components/signup';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Home1 from './components/home1';
import Closed from './components/closedtab';
import RNN from './components/RNNmodel';
import CNN from './components/CNNmodel';
import DashBoard from './components/home';
import PatientDetail from './components/patientdetail';
import SkinCases from './components/SkinWithPatient';
import Cases from './components/skinCases';
import History from './components/history';
import Profile from './components/profile';
import { useTranslation } from 'react-i18next';
import ResetPassword from './components/resetPassword';
import { useState, useEffect, useRef } from 'react';
import ForgotPassword from './components/forgotpassword';
import Dermatologist from './components/darmatologist';
import FollowUp from './components/followup';
import api from './api/Intercepter';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const { t, i18n } = useTranslation();

  function logOut() {
    api
      .post('/api/log_out', {}, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        if (res.data.message === 'Logged out') {
          navigate('/log_in');
        }
      });
  }

  const languages = [
    { code: 'en', label: 'English', flag: 'GB' },
    { code: 'am', label: 'አማርኛ', flag: 'ET' },
    { code: 'or', label: 'Afaan Oromoo', flag: 'ET' },
    { code: 'ti', label: 'ትግርኛ', flag: 'ER' },
  ];

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: t('Home'), path: '/', icon: '🏠' },
    { label: t('Profile'), path: '/profile', icon: '👤' },
    { label: t('Sign In'), path: '/log_in', icon: '🔐' },
    { label: t('Settings'), path: '/settings', icon: '⚙️' },
  ];

  const hideNavOn = ['/log_in', '/sign_up', '/forgotpassword'];
  const shouldHideNav =
    hideNavOn.includes(location.pathname) ||
    location.pathname.startsWith('/reset-password');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {!shouldHideNav && (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white dark:bg-slate-900/70 dark:bg-slate-900/70 border-b border-violet-100 dark:border-violet-900/50 shadow-sm">
          <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-300/40 group-hover:shadow-lg group-hover:shadow-violet-400/50 transition-all">
                <span className="text-white text-lg font-bold">D</span>
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-bold bg-gradient-to-r from-violet-700 to-indigo-700 dark:from-violet-300 dark:to-indigo-300 bg-clip-text text-transparent leading-tight">
                  DermaCare
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                  AI Skin Diagnostics
                </div>
              </div>
            </button>

            <div className="flex items-center gap-2 sm:gap-3">


              <div className="relative">
                <select
                  value={i18n.language}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  className="appearance-none cursor-pointer pl-3 pr-8 py-2 text-sm font-medium bg-white dark:bg-slate-900/80 dark:bg-slate-900/80 border border-violet-200 dark:border-violet-800/50 rounded-xl text-slate-700 dark:text-slate-200 hover:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all shadow-sm"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400 dark:text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>



              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-violet-200 dark:border-violet-800/50 text-slate-700 dark:text-slate-200 hover:border-violet-400 dark:hover:border-violet-500 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all shadow-sm"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                )}
              </button>



              <div className="relative" ref={menuRef}>
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-300/40 hover:shadow-lg hover:shadow-violet-400/50 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 transition-all"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="Toggle menu"
                >
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                    />
                  </svg>
                </button>

                {isOpen && (
                  <div className="absolute right-0 mt-3 w-60 origin-top-right rounded-2xl bg-white dark:bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl border border-violet-100 dark:border-violet-900/50 shadow-2xl shadow-violet-200/50 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <div className="px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600">
                      <p className="text-xs font-semibold text-violet-100 uppercase tracking-wider">
                        {t('Menu')}
                      </p>
                    </div>

                    <div className="py-1">
                      {navItems.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                          <button
                            key={item.path}
                            onClick={() => {
                              navigate(item.path);
                              setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left transition-colors ${
                              active
                                ? 'bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300'
                                : 'text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:bg-violet-950/50 hover:text-violet-700 dark:text-violet-300'
                            }`}
                          >
                            <span className="text-base">{item.icon}</span>
                            <span className="flex-1">{item.label}</span>
                            {active && (
                              <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 py-1">
                      <button
                        onClick={() => {
                          logOut();
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left text-rose-600 hover:bg-rose-50 dark:bg-rose-950/40 transition-colors"
                      >
                        <span className="text-base">🚪</span>
                        <span>{t('Logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="min-h-[calc(100vh-4rem)]">
        <Routes>
          <Route path="log_in" element={<LogIn />} />
          <Route path="closed_tab" element={<Closed />} />
          <Route path="sign_up" element={<SignUp />} />
          <Route path="/" element={<DashBoard />} />
          <Route path="home2" element={<Home1 />} />
          <Route path="chat_RNN" element={<RNN />} />
          <Route path="chat_CNN" element={<CNN />} />
          <Route path="detail" element={<PatientDetail />} />
          <Route path="follow_up" element={<History />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="reset-password/:uid/:token" element={<ResetPassword />} />
          <Route path="skin_cases" element={<SkinCases />} />
          <Route path="cases" element={<Cases />} />
          <Route path="profile" element={<Profile />} />
          <Route path="dermatologists" element={<Dermatologist />} />
          <Route path="followup" element={<FollowUp />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
