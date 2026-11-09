import React, { useState } from 'react';
import { 
  BarChart2, 
  Flame, 
  Users, 
  Clock, 
  Bot, 
  PenTool, 
  Plus, 
  Target, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  TrendingUp,
  SlidersHorizontal,
  Calendar as CalendarIcon,
  Trash2,
  Edit2
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { StudyTask } from '../../types';

export const OverviewScreen: React.FC = () => {
  const { 
    studyDays, 
    weeklyGoalHours, 
    totalStudiedHours, 
    studyStreak, 
    studyPartnersCount, 
    nextDeadline,
    chartViewMode,
    setChartViewMode,
    tasks,
    toggleTask,
    deleteTask,
    setCurrentScreen,
    setIsLogTimeOpen,
    setIsGoalModalOpen,
    setIsAITutorOpen,
    setIsWhiteboardOpen,
    setIsTaskModalOpen,
    setEditingTask,
    joinRoom
  } = useStudy();

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(4); // Mon
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Math for progress
  const progressPercent = Math.min(100, Math.round((totalStudiedHours / weeklyGoalHours) * 100));
  const remainingHours = Math.max(0, Math.round((weeklyGoalHours - totalStudiedHours) * 10) / 10);

  // Category totals
  const totalCoding = studyDays.reduce((acc, d) => acc + d.breakdown.coding, 0);
  const totalAlgorithms = studyDays.reduce((acc, d) => acc + d.breakdown.algorithms, 0);
  const totalSoftwareTool = studyDays.reduce((acc, d) => acc + d.breakdown.softwareTool, 0);
  const totalDataStructures = studyDays.reduce((acc, d) => acc + d.breakdown.dataStructures, 0);

  // SVG Spline chart calculations
  const maxChartHours = 12; // Maximum scale for 11h peak
  const chartHeight = 150;
  const chartWidth = 560;
  const paddingX = 40;
  const paddingY = 20;

  const points = studyDays.map((d, i) => {
    const x = paddingX + (i * (chartWidth - 2 * paddingX)) / (studyDays.length - 1);
    const normalizedY = d.hours / maxChartHours;
    const y = chartHeight - paddingY - normalizedY * (chartHeight - 2 * paddingY);
    return { x, y, ...d, index: i };
  });

  // Generate smooth SVG curve path using cubic Bezier control points
  const generateSmoothPath = (pts: typeof points) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const linePath = generateSmoothPath(points);
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z` 
    : '';

  // Calendar days strip mock
  const calendarDays = [
    { dayName: 'S', dayNum: 15, dateStr: 'Feb 15' },
    { dayName: 'M', dayNum: 16, dateStr: 'Feb 16' },
    { dayName: 'T', dayNum: 17, dateStr: 'Feb 17' },
    { dayName: 'W', dayNum: 18, dateStr: 'Feb 18' },
    { dayName: 'T', dayNum: 19, dateStr: 'Feb 19' },
  ];

  return (
    <div className="space-y-6">
      
      {/* 3-Column Responsive Grid Architecture matching reference image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ================= LEFT COLUMN (Stats Cards) ================= */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* 1. Weekly Progress Card */}
          <div className="p-5 rounded-2xl bg-[#131b2e] border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                <BarChart2 className="w-4 h-4 text-amber-400" />
                <span>Weekly Progress</span>
              </div>
              <span className="font-mono text-slate-400">Goal: {weeklyGoalHours}h</span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
                {totalStudiedHours.toFixed(1)}
              </span>
              <span className="text-sm font-medium text-slate-400">hrs</span>
            </div>

            {/* Progress Bar with Blue to Orange/Amber Gradient matching reference */}
            <div className="mt-3 w-full h-2 rounded-full bg-slate-800/80 overflow-hidden relative">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
              <span>🎯 {remainingHours}h more to goal</span>
              <span className="font-mono font-bold text-amber-400">{progressPercent}%</span>
            </div>

            {/* Subtle decorative chart watermark */}
            <div className="absolute -bottom-2 -right-2 opacity-10 pointer-events-none">
              <BarChart2 className="w-20 h-20 text-slate-100" />
            </div>
          </div>

          {/* 2. Study Streak Card */}
          <div className="p-5 rounded-2xl bg-[#131b2e] border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all shadow-md">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <Flame className="w-4 h-4 fill-emerald-400/20" />
                <span>Study Streak</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                Active
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {studyStreak}
              </span>
              <span className="text-sm font-medium text-slate-400">days</span>
            </div>

            <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
              <span>Building great habits!</span>
              <span>🎯</span>
            </p>

            {/* Concentric rings graphic in corner */}
            <div className="absolute right-3 bottom-3 w-12 h-12 rounded-full border border-emerald-500/20 flex items-center justify-center opacity-70">
              <div className="w-8 h-8 rounded-full border border-emerald-500/30 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-emerald-500/40" />
              </div>
            </div>
          </div>

          {/* 3. Study Partners Card */}
          <div 
            onClick={() => setCurrentScreen('social')}
            className="p-5 rounded-2xl bg-[#131b2e] border border-slate-800 relative overflow-hidden group hover:border-indigo-500/50 cursor-pointer transition-all shadow-md"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-indigo-400">
                <Users className="w-4 h-4" />
                <span>Study Partners</span>
              </div>
              <span className="text-amber-400">🌟</span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {studyPartnersCount}
              </span>
              <span className="text-sm font-medium text-slate-400">partners</span>
            </div>

            <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
              <span>Community star!</span>
              <span>🌟</span>
            </p>
          </div>

          {/* 4. Next Deadline Card */}
          <div className="p-5 rounded-2xl bg-[#131b2e] border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all shadow-md">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
              <Clock className="w-4 h-4" />
              <span>Next Deadline</span>
            </div>

            <div className="mt-3">
              <h4 className="text-sm font-bold text-white tracking-tight">{nextDeadline.title}</h4>
              <p className="text-[11px] text-rose-400/90 font-medium mt-0.5">{nextDeadline.due}</p>
              <p className="text-[10px] text-slate-500 mt-1">{nextDeadline.subject}</p>
            </div>

            {/* Decorative clock graphic */}
            <div className="absolute -bottom-3 -right-3 opacity-15 pointer-events-none">
              <Clock className="w-16 h-16 text-rose-500" />
            </div>
          </div>

        </div>

        {/* ================= MIDDLE COLUMN (Bento Cards + Weekly Study Time Spline Chart) ================= */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Top 3 Bento Cards (Matching Reference: Did You Know, Study Challenge, Tool of Day) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            
            {/* Bento 1: Did You Know? (Sky Blue) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-600 to-blue-700 text-white shadow-lg shadow-sky-900/30 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold tracking-tight">Did You Know?</h4>
                <p className="mt-2 text-xs text-sky-100 leading-relaxed font-normal">
                  🚫 Multitasking cuts efficiency—switching costs can waste up to 40% time.
                </p>
              </div>
              <div className="mt-3 text-[10px] text-sky-200/80 font-medium">
                Cognitive Study Tip
              </div>
            </div>

            {/* Bento 2: Study Challenge (Purple) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 text-white shadow-lg shadow-purple-900/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold tracking-tight">Study Challenge</h4>
                  <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-semibold">
                    Your rank: #3
                  </span>
                </div>
                <p className="mt-2 text-xs text-purple-100 leading-relaxed font-normal">
                  Do Pomodoro sprints and reward yourself after finishing.
                </p>
              </div>
              <button 
                onClick={() => setCurrentScreen('study_time')}
                className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-purple-200 hover:text-white transition-colors"
              >
                <span>View full challenge</span>
                <span>→</span>
              </button>
            </div>

            {/* Bento 3: Tool of the Day (Pink / Rose) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-700 text-white shadow-lg shadow-rose-900/30 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold tracking-tight">Tool of the Day</h4>
                <p className="mt-1 font-semibold text-xs text-rose-100">Study Rooms</p>
                <p className="mt-1 text-[11px] text-rose-100/90 leading-tight">
                  Join or create real-time study rooms to stay accountable.
                </p>
              </div>
              <button
                onClick={() => joinRoom('room-1')}
                className="mt-3 self-start px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold transition-colors"
              >
                Try it
              </button>
            </div>

          </div>

          {/* Weekly Study Time Chart Card */}
          <div className="p-6 rounded-2xl bg-[#131b2e] border border-slate-800 shadow-md">
            
            {/* Card Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold text-white tracking-tight">Weekly Study Time</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Track your study hours and progress</p>
              </div>

              {/* Action Buttons: Goal, Line/Bar Toggle, Log Time */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsGoalModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors border border-slate-700"
                  title="Adjust Weekly Goal"
                >
                  <Target className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Goal</span>
                </button>

                <button
                  onClick={() => setChartViewMode(chartViewMode === 'line' ? 'bar' : 'line')}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
                  title={`Switch to ${chartViewMode === 'line' ? 'Bar Chart' : 'Spline Chart'}`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsLogTimeOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Time</span>
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Your weekly study journey</span>
              {hoveredPointIndex !== null && (
                <span className="text-xs text-indigo-300 font-mono">
                  {studyDays[hoveredPointIndex].day}: {studyDays[hoveredPointIndex].hours} hrs
                </span>
              )}
            </div>

            {/* Interactive SVG Chart (Spline Curve with Gradient Fill matching screenshot) */}
            <div className="mt-3 relative w-full h-[180px] bg-slate-900/40 rounded-xl p-2 border border-slate-800/60 overflow-hidden">
              
              {/* Horizontal Reference Grid Lines */}
              <div className="absolute inset-x-8 inset-y-4 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-dashed border-slate-500 flex justify-between text-[9px] text-slate-400">
                  <span>11h</span>
                </div>
                <div className="border-b border-dashed border-slate-500 flex justify-between text-[9px] text-slate-400">
                  <span>6h</span>
                </div>
                <div className="border-b border-dashed border-slate-500 flex justify-between text-[9px] text-slate-400">
                  <span>3h</span>
                </div>
                <div className="border-b border-slate-600 flex justify-between text-[9px] text-slate-400">
                  <span>0h</span>
                </div>
              </div>

              {chartViewMode === 'line' ? (
                <svg 
                  className="w-full h-full overflow-visible" 
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
                      <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Shaded Area Fill */}
                  <path d={areaPath} fill="url(#chartGradient)" />

                  {/* Luminous Curve Line */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="3"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />

                  {/* Interactive Data Dots with Tooltip triggers */}
                  {points.map((pt, i) => {
                    const isSelected = selectedDayIndex === i;
                    const isHovered = hoveredPointIndex === i;
                    const isPeak = pt.day === 'Mon';

                    return (
                      <g 
                        key={pt.day} 
                        className="cursor-pointer transition-transform"
                        onMouseEnter={() => setHoveredPointIndex(i)}
                        onMouseLeave={() => setHoveredPointIndex(null)}
                        onClick={() => setSelectedDayIndex(i)}
                      >
                        {/* Pulse effect on high peak */}
                        {isPeak && (
                          <circle cx={pt.x} cy={pt.y} r="10" fill="#6366f1" opacity="0.3" className="animate-ping" />
                        )}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isSelected || isHovered ? "6" : isPeak ? "5" : "3.5"}
                          fill={isSelected ? "#38bdf8" : isPeak ? "#ffffff" : "#6366f1"}
                          stroke="#0b0f19"
                          strokeWidth="2"
                        />
                      </g>
                    );
                  })}
                </svg>
              ) : (
                /* Bar Chart Mode */
                <div className="w-full h-full flex items-end justify-between px-6 pb-2 pt-4">
                  {studyDays.map((d, i) => {
                    const heightPct = Math.min(100, Math.max(8, (d.hours / maxChartHours) * 100));
                    const isSelected = selectedDayIndex === i;
                    return (
                      <div 
                        key={d.day}
                        onClick={() => setSelectedDayIndex(i)}
                        className="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
                      >
                        <span className="text-[10px] font-mono text-slate-400 group-hover:text-white transition-colors">
                          {d.hours}h
                        </span>
                        <div className="w-6 sm:w-8 h-28 bg-slate-800 rounded-t-lg flex items-end overflow-hidden">
                          <div 
                            className={`w-full rounded-t-lg transition-all duration-500 ${
                              isSelected || d.day === 'Mon'
                                ? 'bg-gradient-to-t from-indigo-600 to-sky-400 shadow-lg shadow-indigo-500/30'
                                : 'bg-slate-700 group-hover:bg-indigo-500/60'
                            }`}
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Day Labels along bottom axis */}
              <div className="flex justify-between px-6 pt-1 text-[11px] font-medium text-slate-400">
                {studyDays.map((d, i) => (
                  <button
                    key={d.day}
                    onClick={() => setSelectedDayIndex(i)}
                    className={`transition-colors ${selectedDayIndex === i ? 'text-indigo-400 font-bold' : 'hover:text-slate-200'}`}
                  >
                    {d.day}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Category Breakdown Tags (Matching screenshot bottom pills) */}
            <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Coding {totalCoding.toFixed(1)}h</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Algorithms {totalAlgorithms.toFixed(1)}h</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Software Tool {totalSoftwareTool.toFixed(1)}h</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Data Structures {totalDataStructures.toFixed(1)}h</span>
              </span>
            </div>

            {/* Weekly Goal Footer Summary with Progress Bar (Matching screenshot) */}
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                <span>Weekly goal: {weeklyGoalHours} hours</span>
                <span className="font-mono font-bold text-indigo-400">{progressPercent}%</span>
              </div>
              <div className="mt-1.5 w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">
                You've studied <span className="text-white font-medium">{totalStudiedHours} hours</span> this week ({remainingHours} hours to go)
              </p>
            </div>

          </div>

        </div>

        {/* ================= RIGHT COLUMN (Quick Actions, Calendar Schedule, To-do List) ================= */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Quick Actions (AI Tutor, Whiteboard) */}
          <div className="p-4 rounded-2xl bg-[#131b2e] border border-slate-800 shadow-md">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>⚡ Quick Actions</span>
            </h4>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setIsAITutorOpen(true)}
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-indigo-600/20 border border-slate-700/80 hover:border-indigo-500/50 flex flex-col items-center text-center transition-all group"
              >
                <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="mt-2 text-xs font-bold text-slate-200 group-hover:text-white">AI Tutor</span>
                <span className="text-[10px] text-slate-400">Ask doubts</span>
              </button>

              <button
                onClick={() => setIsWhiteboardOpen(true)}
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-purple-600/20 border border-slate-700/80 hover:border-purple-500/50 flex flex-col items-center text-center transition-all group"
              >
                <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400 group-hover:scale-110 transition-transform">
                  <PenTool className="w-5 h-5" />
                </div>
                <span className="mt-2 text-xs font-bold text-slate-200 group-hover:text-white">WhiteBoard</span>
                <span className="text-[10px] text-slate-400">Sketch & notes</span>
              </button>
            </div>
          </div>

          {/* Calendar Day Strip & Schedule (Matching reference calendar section) */}
          <div className="p-4 rounded-2xl bg-[#131b2e] border border-slate-800 shadow-md">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">February 2026</span>
              <div className="flex items-center gap-1 text-slate-400">
                <button className="p-1 hover:text-white rounded hover:bg-slate-800">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 hover:text-white rounded hover:bg-slate-800">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Days row */}
            <div className="mt-3 flex items-center justify-between gap-1">
              {calendarDays.map((cd, idx) => {
                const isSelected = idx === 1; // M 16 is active in reference
                return (
                  <button
                    key={cd.dayNum}
                    className={`flex flex-col items-center justify-center w-9 py-1.5 rounded-xl text-xs transition-all ${
                      isSelected
                        ? 'bg-white text-slate-950 font-bold shadow-md shadow-white/10 scale-105'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="text-[10px] opacity-75">{cd.dayName}</span>
                    <span className="text-xs font-bold">{cd.dayNum}</span>
                  </button>
                );
              })}
            </div>

            {/* Scheduled sessions for today */}
            <div className="mt-4 space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-white">Morning Review</h5>
                  <p className="text-[10px] text-slate-400">6:00 PM – 7:00 PM</p>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-400 text-[10px] font-semibold border border-sky-500/30">
                  Planned
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-white">Reading Assign...</h5>
                  <p className="text-[10px] text-slate-400">8:00 PM – 9:00 PM</p>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-400 text-[10px] font-semibold border border-purple-500/30">
                  Planned
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span>2 remaining for today</span>
              <button 
                onClick={() => setCurrentScreen('courses')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Timetable →
              </button>
            </div>
          </div>

          {/* To-Do List Card (Matching reference todo list section) */}
          <div className="p-4 rounded-2xl bg-[#131b2e] border border-slate-800 shadow-md">
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">To-do List</h4>
                <p className="text-[11px] text-slate-400">Check off your todos and feel good</p>
              </div>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setIsTaskModalOpen(true);
                }}
                className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                title="Add New Study Task"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Task list items */}
            <div className="mt-3 space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {tasks.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  No tasks left! Click + to add your next study goal.
                </div>
              ) : (
                tasks.map(task => {
                  return (
                    <div
                      key={task.id}
                      className={`group p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2.5 ${
                        task.completed 
                          ? 'bg-slate-900/30 border-slate-800/40 opacity-60' 
                          : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                      }`}
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-indigo-400 transition-colors shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0" onClick={() => toggleTask(task.id)}>
                        <p className={`text-xs font-medium leading-snug cursor-pointer ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-100'
                        }`}>
                          {task.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                          <span className="truncate max-w-[110px]">{task.subject}</span>
                          <span>•</span>
                          <span>{task.estimatedHours}h</span>
                          {task.priority === 'high' && (
                            <span className="text-rose-400 font-semibold">• High</span>
                          )}
                        </div>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0">
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setIsTaskModalOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-white rounded"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>{tasks.filter(t => !t.completed).length} pending tasks</span>
              <button
                onClick={() => setCurrentScreen('study_time')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Start Focus Timer →
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
