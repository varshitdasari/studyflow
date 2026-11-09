import React from 'react';
import { StudyProvider, useStudy } from './context/StudyContext';
import { Navbar } from './components/layout/Navbar';
import { DeviceFrameSimulator } from './components/layout/DeviceFrameSimulator';
import { OverviewScreen } from './components/dashboard/OverviewScreen';
import { PomodoroScreen } from './components/pomodoro/PomodoroScreen';
import { TimetableScreen } from './components/timetable/TimetableScreen';
import { SocialScreen } from './components/social/SocialScreen';
import { AnalyticsScreen } from './components/analytics/AnalyticsScreen';
import { FlutterExamHubModal } from './components/flutterHub/FlutterExamHubModal';
import { AITutorModal } from './components/modals/AITutorModal';
import { WhiteboardModal } from './components/modals/WhiteboardModal';
import { LogTimeModal } from './components/modals/LogTimeModal';
import { TaskModal } from './components/modals/TaskModal';
import { GoalModal } from './components/modals/GoalModal';
import { NotesDrawer } from './components/modals/NotesDrawer';

const AppContent: React.FC = () => {
  const { 
    currentScreen, 
    theme,
    isFlutterHubOpen, 
    setIsFlutterHubOpen,
    isAITutorOpen,
    setIsAITutorOpen,
    isWhiteboardOpen,
    setIsWhiteboardOpen,
    isLogTimeOpen,
    setIsLogTimeOpen,
    isTaskModalOpen,
    setIsTaskModalOpen,
    isGoalModalOpen,
    setIsGoalModalOpen
  } = useStudy();

  const themeClasses = 
    theme === 'midnight'
      ? 'bg-[#060b17] text-slate-100'
      : theme === 'light'
      ? 'bg-[#f8fafc] text-slate-900'
      : 'bg-[#0b0f19] text-slate-100';

  return (
    <div className={`min-h-screen ${themeClasses} transition-colors flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200`}>
      {/* Top Bar matching Top Bar contract and screenshot */}
      <Navbar />

      {/* Main Content Viewport wrapped in Responsive Frame Simulator */}
      <DeviceFrameSimulator>
        {currentScreen === 'overview' && <OverviewScreen />}
        {currentScreen === 'study_time' && <PomodoroScreen />}
        {currentScreen === 'courses' && <TimetableScreen />}
        {currentScreen === 'social' && <SocialScreen />}
        {currentScreen === 'analytics' && <AnalyticsScreen />}
      </DeviceFrameSimulator>

      {/* Global Modals */}
      <FlutterExamHubModal
        isOpen={isFlutterHubOpen}
        onClose={() => setIsFlutterHubOpen(false)}
      />

      <AITutorModal
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
      />

      <WhiteboardModal
        isOpen={isWhiteboardOpen}
        onClose={() => setIsWhiteboardOpen(false)}
      />

      <LogTimeModal
        isOpen={isLogTimeOpen}
        onClose={() => setIsLogTimeOpen(false)}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />

      <NotesDrawer />
    </div>
  );
};

export default function App() {
  return (
    <StudyProvider>
      <AppContent />
    </StudyProvider>
  );
}
