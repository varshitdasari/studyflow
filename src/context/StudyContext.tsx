import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ScreenType, 
  DeviceMode, 
  StudyTask, 
  DayStudyData, 
  TimetableSlot, 
  StudyPartner, 
  StudyRoom, 
  ChatMessage 
} from '../types';
import { 
  INITIAL_STUDY_DAYS, 
  INITIAL_TASKS, 
  INITIAL_TIMETABLE, 
  INITIAL_PARTNERS, 
  INITIAL_ROOMS 
} from '../data/initialData';

interface StudyContextType {
  // Navigation & Display
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  theme: 'dark' | 'midnight' | 'light';
  setTheme: (t: 'dark' | 'midnight' | 'light') => void;
  
  // Weekly Metrics & Chart
  weeklyGoalHours: number;
  setWeeklyGoalHours: (goal: number) => void;
  studyDays: DayStudyData[];
  totalStudiedHours: number;
  studyStreak: number;
  studyPartnersCount: number;
  nextDeadline: { title: string; due: string; subject: string };
  chartViewMode: 'line' | 'bar';
  setChartViewMode: (mode: 'line' | 'bar') => void;
  
  // Tasks CRUD
  tasks: StudyTask[];
  addTask: (task: Omit<StudyTask, 'id'>) => void;
  updateTask: (id: string, updates: Partial<StudyTask>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  
  // Timetable
  timetable: TimetableSlot[];
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  deleteTimetableSlot: (id: string) => void;
  
  // Pomodoro Focus Timer
  pomodoroMode: 'focus' | 'short_break' | 'long_break';
  setPomodoroMode: (mode: 'focus' | 'short_break' | 'long_break') => void;
  pomodoroRemainingSeconds: number;
  pomodoroTotalSeconds: number;
  isPomodoroRunning: boolean;
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  ambientSound: 'none' | 'rain' | 'whitenoise' | 'cafe' | 'forest';
  setAmbientSound: (sound: 'none' | 'rain' | 'whitenoise' | 'cafe' | 'forest') => void;
  selectedPomodoroTaskId: string | null;
  setSelectedPomodoroTaskId: (id: string | null) => void;
  completedPomodoroCount: number;
  
  // Social & Rooms
  partners: StudyPartner[];
  rooms: StudyRoom[];
  activeRoomId: string | null;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  roomMessages: ChatMessage[];
  sendRoomMessage: (text: string) => void;
  
  // Modals & Drawers
  isFlutterHubOpen: boolean;
  setIsFlutterHubOpen: (open: boolean) => void;
  isAITutorOpen: boolean;
  setIsAITutorOpen: (open: boolean) => void;
  isWhiteboardOpen: boolean;
  setIsWhiteboardOpen: (open: boolean) => void;
  isLogTimeOpen: boolean;
  setIsLogTimeOpen: (open: boolean) => void;
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  editingTask: StudyTask | null;
  setEditingTask: (task: StudyTask | null) => void;
  isGoalModalOpen: boolean;
  setIsGoalModalOpen: (open: boolean) => void;
  isNotesDrawerOpen: boolean;
  setIsNotesDrawerOpen: (open: boolean) => void;
  quickNotes: string;
  setQuickNotes: (notes: string) => void;
  
  // Actions
  logStudyHours: (hours: number, subject: string, notes?: string) => void;
  triggerCelebration: () => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

// Web Audio synthesizer for Pomodoro chime & ambient sound
class StudyAudioEngine {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playCompletionChime() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.3); // G5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.5); // C6

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.2);
    } catch {
      // Audio fallback
    }
  }

  setAmbientSound(type: string) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.noiseNode) {
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
      if (type === 'none') return;

      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain' || type === 'whitenoise') {
          // Brown/Pink noise for soothing rain
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        } else {
          data[i] = white * 0.15;
        }
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
      filter.frequency.value = type === 'rain' ? 800 : 1200;

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);
      noiseSource.start();
      this.noiseNode = noiseSource;
    } catch {
      // Audio fallback
    }
  }
}

const audioEngine = new StudyAudioEngine();

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Display
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('overview');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [theme, setTheme] = useState<'dark' | 'midnight' | 'light'>('dark');

  // Metrics
  const [weeklyGoalHours, setWeeklyGoalHours] = useState<number>(56.0);
  const [studyDays, setStudyDays] = useState<DayStudyData[]>(INITIAL_STUDY_DAYS);
  const [studyStreak, setStudyStreak] = useState<number>(56);
  const [studyPartnersCount] = useState<number>(81);
  const [chartViewMode, setChartViewMode] = useState<'line' | 'bar'>('line');
  const [nextDeadline] = useState({
    title: 'Maths Assignment',
    due: 'Due in 1 day (Tomorrow 11:59 PM)',
    subject: 'Discrete Mathematics',
  });

  // Calculate total studied this week
  const totalStudiedHours = Math.round(studyDays.reduce((acc, curr) => acc + curr.hours, 0) * 10) / 10;

  // Tasks
  const [tasks, setTasks] = useState<StudyTask[]>(INITIAL_TASKS);
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);

  // Timetable
  const [timetable, setTimetable] = useState<TimetableSlot[]>(INITIAL_TIMETABLE);

  // Pomodoro
  const [pomodoroMode, setPomodoroMode] = useState<'focus' | 'short_break' | 'long_break'>('focus');
  const [pomodoroTotalSeconds, setPomodoroTotalSeconds] = useState<number>(25 * 60);
  const [pomodoroRemainingSeconds, setPomodoroRemainingSeconds] = useState<number>(25 * 60);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState<boolean>(false);
  const [ambientSound, setAmbientSoundState] = useState<'none' | 'rain' | 'whitenoise' | 'cafe' | 'forest'>('none');
  const [selectedPomodoroTaskId, setSelectedPomodoroTaskId] = useState<string | null>(null);
  const [completedPomodoroCount, setCompletedPomodoroCount] = useState<number>(4);

  // Social
  const [partners] = useState<StudyPartner[]>(INITIAL_PARTNERS);
  const [rooms] = useState<StudyRoom[]>(INITIAL_ROOMS);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [roomMessages, setRoomMessages] = useState<ChatMessage[]>([
    { id: 'm1', sender: 'Sarah Chen', text: 'Hey team, reviewing Provider and ChangeNotifier patterns for tomorrow!', timestamp: '10:14 AM', isUser: false },
    { id: 'm2', sender: 'Alex Rivera', text: 'Working on binary trees. Let’s do a 25 min focus sprint!', timestamp: '10:16 AM', isUser: false },
  ]);

  // Modals
  const [isFlutterHubOpen, setIsFlutterHubOpen] = useState<boolean>(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState<boolean>(false);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState<boolean>(false);
  const [isLogTimeOpen, setIsLogTimeOpen] = useState<boolean>(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState<boolean>(false);
  const [isNotesDrawerOpen, setIsNotesDrawerOpen] = useState<boolean>(false);
  const [quickNotes, setQuickNotes] = useState<string>(
    'StudyFlow Flutter Exam Key Reminders:\n• Container, Row, Column, Stack, ListView, GridView\n• MediaQuery.of(context).size for responsive layouts\n• MultiProvider with ChangeNotifierProvider\n• GlobalKey<FormState> & TextFormField validators'
  );

  // Ambient sound handler
  const setAmbientSound = (sound: 'none' | 'rain' | 'whitenoise' | 'cafe' | 'forest') => {
    setAmbientSoundState(sound);
    audioEngine.setAmbientSound(sound);
  };

  // Celebration helper
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#38bdf8', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch {
      // Confetti fallback
    }
  };

  // Pomodoro Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPomodoroRunning && pomodoroRemainingSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroRemainingSeconds(prev => prev - 1);
      }, 1000);
    } else if (isPomodoroRunning && pomodoroRemainingSeconds === 0) {
      setIsPomodoroRunning(false);
      audioEngine.playCompletionChime();
      triggerCelebration();
      setCompletedPomodoroCount(c => c + 1);
      
      // Auto-log 25 min study time if focus mode
      if (pomodoroMode === 'focus') {
        logStudyHours(0.4, 'Pomodoro Focus Sprint', 'Completed 25-minute study sprint');
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPomodoroRunning, pomodoroRemainingSeconds, pomodoroMode]);

  const startPomodoro = () => setIsPomodoroRunning(true);
  const pausePomodoro = () => setIsPomodoroRunning(false);
  const resetPomodoro = () => {
    setIsPomodoroRunning(false);
    setPomodoroRemainingSeconds(pomodoroTotalSeconds);
  };

  const handleSetPomodoroMode = (mode: 'focus' | 'short_break' | 'long_break') => {
    setPomodoroMode(mode);
    setIsPomodoroRunning(false);
    const secs = mode === 'focus' ? 25 * 60 : mode === 'short_break' ? 5 * 60 : 15 * 60;
    setPomodoroTotalSeconds(secs);
    setPomodoroRemainingSeconds(secs);
  };

  // Task Actions
  const addTask = (newTask: Omit<StudyTask, 'id'>) => {
    const task: StudyTask = {
      ...newTask,
      id: `task-${Date.now()}`,
    };
    setTasks(prev => [task, ...prev]);
    triggerCelebration();
  };

  const updateTask = (id: string, updates: Partial<StudyTask>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            triggerCelebration();
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  // Log study hours
  const logStudyHours = (hours: number, subject: string, _notes?: string) => {
    setStudyDays(prev => {
      const updated = [...prev];
      const todayIndex = updated.length - 1; // Wed or current day
      const current = updated[todayIndex];
      const newHours = Math.round((current.hours + hours) * 10) / 10;
      
      const newBreakdown = { ...current.breakdown };
      const subLower = subject.toLowerCase();
      if (subLower.includes('coding') || subLower.includes('flutter')) {
        newBreakdown.coding += hours;
      } else if (subLower.includes('algo')) {
        newBreakdown.algorithms += hours;
      } else if (subLower.includes('tool')) {
        newBreakdown.softwareTool += hours;
      } else {
        newBreakdown.dataStructures += hours;
      }

      updated[todayIndex] = {
        ...current,
        hours: newHours,
        breakdown: newBreakdown,
      };
      return updated;
    });
    triggerCelebration();
  };

  // Timetable Actions
  const addTimetableSlot = (slot: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = {
      ...slot,
      id: `slot-${Date.now()}`,
    };
    setTimetable(prev => [...prev, newSlot]);
  };

  const deleteTimetableSlot = (id: string) => {
    setTimetable(prev => prev.filter(s => s.id !== id));
  };

  // Social & Rooms
  const joinRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    setCurrentScreen('social');
  };

  const leaveRoom = () => {
    setActiveRoomId(null);
  };

  const sendRoomMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'You (Varshit)',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
    };
    setRoomMessages(prev => [...prev, newMsg]);
  };

  return (
    <StudyContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        deviceMode,
        setDeviceMode,
        theme,
        setTheme,
        weeklyGoalHours,
        setWeeklyGoalHours,
        studyDays,
        totalStudiedHours,
        studyStreak,
        studyPartnersCount,
        nextDeadline,
        chartViewMode,
        setChartViewMode,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        timetable,
        addTimetableSlot,
        deleteTimetableSlot,
        pomodoroMode,
        setPomodoroMode: handleSetPomodoroMode,
        pomodoroRemainingSeconds,
        pomodoroTotalSeconds,
        isPomodoroRunning,
        startPomodoro,
        pausePomodoro,
        resetPomodoro,
        ambientSound,
        setAmbientSound,
        selectedPomodoroTaskId,
        setSelectedPomodoroTaskId,
        completedPomodoroCount,
        partners,
        rooms,
        activeRoomId,
        joinRoom,
        leaveRoom,
        roomMessages,
        sendRoomMessage,
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
        editingTask,
        setEditingTask,
        isGoalModalOpen,
        setIsGoalModalOpen,
        isNotesDrawerOpen,
        setIsNotesDrawerOpen,
        quickNotes,
        setQuickNotes,
        logStudyHours,
        triggerCelebration,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
