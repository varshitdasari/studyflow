import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  Flame, 
  Target, 
  Sparkles, 
  Music, 
  CloudRain, 
  Coffee, 
  Trees 
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const PomodoroScreen: React.FC = () => {
  const { 
    pomodoroMode, 
    setPomodoroMode, 
    pomodoroRemainingSeconds, 
    pomodoroTotalSeconds, 
    isPomodoroRunning, 
    startPomodoro, 
    pausePomodoro, 
    resetPomodoro,
    ambientSound,
    setAmbientSound,
    tasks,
    selectedPomodoroTaskId,
    setSelectedPomodoroTaskId,
    completedPomodoroCount,
    studyStreak,
    setIsFlutterHubOpen
  } = useStudy();

  const minutes = Math.floor(pomodoroRemainingSeconds / 60);
  const seconds = pomodoroRemainingSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const progress = ((pomodoroTotalSeconds - pomodoroRemainingSeconds) / pomodoroTotalSeconds) * 100;
  const strokeDashoffset = 754 - (754 * progress) / 100; // Radius 120 -> 2 * PI * 120 = 753.98

  const selectedTask = tasks.find(t => t.id === selectedPomodoroTaskId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#131b2e] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Flame className="w-5 h-5 fill-indigo-400/20" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Pomodoro Focus Sprint</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Science-backed intervals for maximum retention and cognitive stamina.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-4 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800">
          <div className="text-center">
            <div className="text-sm font-bold text-white font-mono">{completedPomodoroCount}</div>
            <div className="text-[10px] text-slate-400">Sprints Today</div>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-center">
            <div className="text-sm font-bold text-emerald-400 font-mono">{studyStreak}d</div>
            <div className="text-[10px] text-slate-400">Streak</div>
          </div>
        </div>
      </div>

      {/* Main Timer Stage */}
      <div className="p-8 rounded-3xl bg-[#131b2e] border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
        
        {/* Glow ambient background */}
        <div className={`absolute w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${
          isPomodoroRunning 
            ? 'bg-indigo-600/15 scale-125' 
            : 'bg-indigo-900/10 scale-90'
        }`} />

        {/* Mode Selector Tabs (Focus, Short Break, Long Break) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800 z-10 mb-8">
          <button
            onClick={() => setPomodoroMode('focus')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              pomodoroMode === 'focus'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Focus (25m)
          </button>
          <button
            onClick={() => setPomodoroMode('short_break')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              pomodoroMode === 'short_break'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => setPomodoroMode('long_break')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              pomodoroMode === 'long_break'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Circular SVG Timer */}
        <div className="relative w-72 h-72 flex items-center justify-center z-10">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 280 280">
            {/* Background track circle */}
            <circle
              cx="140"
              cy="140"
              r="120"
              fill="transparent"
              stroke="#1e293b"
              strokeWidth="8"
            />
            {/* Animated progress circle */}
            <circle
              cx="140"
              cy="140"
              r="120"
              fill="transparent"
              stroke={
                pomodoroMode === 'focus' 
                  ? '#6366f1' 
                  : pomodoroMode === 'short_break' 
                  ? '#10b981' 
                  : '#38bdf8'
              }
              strokeWidth="8"
              strokeDasharray="754"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Time digits and status in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-5xl font-extrabold text-white font-mono tracking-tight">
              {formattedTime}
            </span>
            <span className="mt-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              {isPomodoroRunning ? 'In Progress' : 'Paused'}
            </span>
            {selectedTask && (
              <span className="mt-1 text-[11px] text-indigo-300 max-w-[180px] truncate">
                🎯 {selectedTask.title}
              </span>
            )}
          </div>
        </div>

        {/* Primary Controls: Play, Pause, Reset */}
        <div className="mt-8 flex items-center gap-4 z-10">
          <button
            onClick={resetPomodoro}
            title="Reset Timer"
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {isPomodoroRunning ? (
            <button
              onClick={pausePomodoro}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:scale-105 active:scale-95"
            >
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause Focus</span>
            </button>
          ) : (
            <button
              onClick={startPomodoro}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Focus</span>
            </button>
          )}

          <button
            onClick={() => {
              setAmbientSound(ambientSound === 'none' ? 'rain' : 'none');
            }}
            title="Toggle Ambient Audio"
            className={`p-3 rounded-xl transition-colors border ${
              ambientSound !== 'none'
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 border-slate-700'
            }`}
          >
            {ambientSound !== 'none' ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Ambient Audio Selector Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 z-10">
          <span className="text-[11px] text-slate-400 mr-2 flex items-center gap-1">
            <Music className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ambient Sound:</span>
          </span>
          {[
            { id: 'none', label: 'Off', icon: <VolumeX className="w-3 h-3" /> },
            { id: 'rain', label: 'Rain Storm', icon: <CloudRain className="w-3 h-3" /> },
            { id: 'whitenoise', label: 'White Noise', icon: <Volume2 className="w-3 h-3" /> },
            { id: 'cafe', label: 'Study Cafe', icon: <Coffee className="w-3 h-3" /> },
            { id: 'forest', label: 'Pine Forest', icon: <Trees className="w-3 h-3" /> },
          ].map(snd => (
            <button
              key={snd.id}
              onClick={() => setAmbientSound(snd.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
                ambientSound === snd.id
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50'
              }`}
            >
              {snd.icon}
              <span>{snd.label}</span>
            </button>
          ))}
        </div>

      </div>

      {/* Task Binding Section: Link Focus Session to Task */}
      <div className="p-6 rounded-2xl bg-[#131b2e] border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Focus Target Task</h3>
          </div>
          <span className="text-[11px] text-slate-400">Select which task to advance during this sprint</span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {tasks.filter(t => !t.completed).map(task => {
            const isTarget = selectedPomodoroTaskId === task.id;
            return (
              <div
                key={task.id}
                onClick={() => setSelectedPomodoroTaskId(isTarget ? null : task.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isTarget
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                    {task.subject}
                  </span>
                  {isTarget && <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <h5 className="mt-1 text-xs font-semibold line-clamp-1">{task.title}</h5>
                <p className="mt-1 text-[10px] text-slate-400 font-mono">{task.estimatedHours}h estimated</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exam Concept Card: How this is built in Flutter */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Flutter Exam Concept Demonstrated</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Uses <code className="text-indigo-300 font-mono">AnimationController</code>, <code className="text-indigo-300 font-mono">CustomPainter</code>, and <code className="text-indigo-300 font-mono">Timer.periodic</code> with Provider.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsFlutterHubOpen(true)}
          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold whitespace-nowrap"
        >
          View Flutter Code
        </button>
      </div>

    </div>
  );
};
