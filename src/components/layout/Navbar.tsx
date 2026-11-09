import React from 'react';
import { 
  LayoutDashboard, 
  Timer, 
  BookOpen, 
  Users, 
  BarChart3, 
  Bookmark, 
  Sun, 
  Moon, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Code2,
  Sparkles
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { ScreenType, DeviceMode } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    deviceMode, 
    setDeviceMode, 
    theme, 
    setTheme,
    setIsFlutterHubOpen,
    setIsNotesDrawerOpen,
    isNotesDrawerOpen
  } = useStudy();

  const navItems: { id: ScreenType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'study_time', label: 'Study Time', icon: <Timer className="w-4 h-4" /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'social', label: 'Social', icon: <Users className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-lg">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">StudyFlow</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Flutter UI
              </span>
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs (Matches top pill navigation in user reference) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#131b2e]/90 p-1 rounded-xl border border-slate-800">
          {navItems.map(item => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Zone: Simulator Toggle + Tools + Flutter Exam Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Responsive Device Viewport Selector (Desktop / Tablet / Mobile Flutter) */}
          <div className="hidden lg:flex items-center bg-[#131b2e] p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setDeviceMode('desktop')}
              title="Desktop Layout (1440px)"
              className={`p-1.5 rounded-md transition-colors ${
                deviceMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              title="Tablet Layout (768px)"
              className={`p-1.5 rounded-md transition-colors ${
                deviceMode === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              title="Mobile Flutter Simulator (Phone Frame)"
              className={`p-1.5 rounded-md transition-colors ${
                deviceMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Notes / Bookmark Drawer Toggle (as seen in screenshot top right) */}
          <button
            onClick={() => setIsNotesDrawerOpen(!isNotesDrawerOpen)}
            title="Study Notes & Scratchpad"
            className="p-2 rounded-xl bg-[#131b2e] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Theme Toggle (as seen in screenshot top right lightbulb) */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'midnight' : theme === 'midnight' ? 'light' : 'dark')}
            title="Toggle Theme (Dark / Midnight / Light)"
            className="p-2 rounded-xl bg-[#131b2e] border border-slate-800 text-slate-300 hover:text-amber-300 hover:border-slate-700 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* FLUTTER EXAM CODE & SUBMISSION HUB BUTTON (Critical for Student) */}
          <button
            onClick={() => setIsFlutterHubOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            <Code2 className="w-4 h-4 animate-pulse" />
            <span>Flutter Exam Code</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-white/20 px-1.5 py-0.5 rounded">
              <Sparkles className="w-2.5 h-2.5" />
              100% Valid
            </span>
          </button>
        </div>

      </div>

      {/* Mobile Screen Navigation Bar */}
      <div className="md:hidden flex items-center justify-around mt-2 pt-2 border-t border-slate-800/60 overflow-x-auto gap-1">
        {navItems.map(item => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 text-[11px] font-medium transition-colors ${
                isActive ? 'text-indigo-400 font-bold' : 'text-slate-400'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
