import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Award, 
  Calendar, 
  Download, 
  Sparkles 
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const AnalyticsScreen: React.FC = () => {
  const { 
    studyDays, 
    weeklyGoalHours, 
    totalStudiedHours, 
    studyStreak, 
    tasks, 
    completedPomodoroCount,
    setIsFlutterHubOpen 
  } = useStudy();

  const completedTasks = tasks.filter(t => t.completed);
  const pendingTasks = tasks.filter(t => !t.completed);

  // Subject breakdown calculations
  const totalCoding = studyDays.reduce((acc, d) => acc + d.breakdown.coding, 0);
  const totalAlgorithms = studyDays.reduce((acc, d) => acc + d.breakdown.algorithms, 0);
  const totalSoftwareTool = studyDays.reduce((acc, d) => acc + d.breakdown.softwareTool, 0);
  const totalDataStructures = studyDays.reduce((acc, d) => acc + d.breakdown.dataStructures, 0);

  const subjects = [
    { name: 'Algorithms & Complexity', hours: totalAlgorithms, color: '#06b6d4' },
    { name: 'Data Structures & OOP', hours: totalDataStructures, color: '#eab308' },
    { name: 'Mobile App Dev (Flutter)', hours: totalCoding, color: '#38bdf8' },
    { name: 'Software Tools & Labs', hours: totalSoftwareTool, color: '#10b981' },
  ];

  const exportReport = () => {
    const reportText = `STUDYFLOW ACADEMIC PERFORMANCE REPORT
Generated: ${new Date().toLocaleDateString()}
--------------------------------------------------
Total Weekly Hours: ${totalStudiedHours} hrs / ${weeklyGoalHours} hrs Goal
Study Streak: ${studyStreak} Consecutive Days
Completed Pomodoro Sprints: ${completedPomodoroCount}
Completed Tasks: ${completedTasks.length}

SUBJECT BREAKDOWN:
- Algorithms & Complexity: ${totalAlgorithms.toFixed(1)} hrs
- Data Structures & OOP: ${totalDataStructures.toFixed(1)} hrs
- Mobile App Dev (Flutter): ${totalCoding.toFixed(1)} hrs
- Software Tools & Labs: ${totalSoftwareTool.toFixed(1)} hrs

COMPLETED TASK HISTORY:
${completedTasks.map(t => `[x] ${t.title} (${t.subject} - ${t.estimatedHours}h)`).join('\n')}
--------------------------------------------------
Prepared for Flutter UI Examination Submission.
`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudyFlow_Performance_Report_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#131b2e] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Analytics & Completion History</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Subject-wise breakdown, historical task logs, and focus distribution.
          </p>
        </div>

        <button
          onClick={exportReport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          <span>Export Summary (.txt)</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#131b2e] border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Weekly Study Total</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">{totalStudiedHours} hrs</div>
          <p className="mt-1 text-[11px] text-slate-400 font-mono">Goal: {weeklyGoalHours} hrs ({Math.round((totalStudiedHours/weeklyGoalHours)*100)}%)</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#131b2e] border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Habit Consistency</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400 font-mono">{studyStreak} Days</div>
          <p className="mt-1 text-[11px] text-slate-400">Active daily sprint streak</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#131b2e] border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Task Completion</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">
            {completedTasks.length} / {tasks.length}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">{pendingTasks.length} pending assignments</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#131b2e] border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <TrendingUp className="w-4 h-4 text-sky-400" />
            <span>Pomodoro Sprints</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-sky-400 font-mono">{completedPomodoroCount} Sprints</div>
          <p className="mt-1 text-[11px] text-slate-400">~{completedPomodoroCount * 25} mins deep focus</p>
        </div>
      </div>

      {/* 2-Column: Subject Breakdown & Completed Task History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Subject Breakdown Chart Bars */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#131b2e] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Subject-Wise Study Allocation</h3>
          <p className="text-xs text-slate-400">Hours invested across subjects this week</p>

          <div className="space-y-4 pt-2">
            {subjects.map(sub => {
              const pct = totalStudiedHours > 0 ? (sub.hours / totalStudiedHours) * 100 : 0;
              return (
                <div key={sub.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{sub.name}</span>
                    <span className="font-mono text-slate-400">{sub.hours.toFixed(1)}h ({Math.round(pct)}%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-700" 
                      style={{ width: `${pct}%`, backgroundColor: sub.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completed-Task History (Feature from image_1be57471.png) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#131b2e] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Completed-Task History</h3>
              <p className="text-xs text-slate-400">Archive of solved problem sets and submitted lab reports</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {completedTasks.length} Completed
            </span>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 pt-1">
            {completedTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No tasks completed yet. Check off items in the Overview screen to see them here!
              </div>
            ) : (
              completedTasks.map(task => (
                <div 
                  key={task.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-slate-200 line-through">{task.title}</h5>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                      <span>{task.subject}</span>
                      <span>•</span>
                      <span>{task.estimatedHours}h spent</span>
                      <span>•</span>
                      <span className="text-emerald-400">Finished</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
