import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  FolderTree, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Smartphone, 
  Compass, 
  Cpu, 
  FileText 
} from 'lucide-react';
import { FLUTTER_CODEBASE } from '../../data/flutterCodebase';
import { FlutterCodeFile } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterExamHubModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<FlutterCodeFile>(FLUTTER_CODEBASE[1]); // main.dart
  const [copiedFile, setCopiedFile] = useState<boolean>(false);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'code' | 'rubric' | 'report'>('code');

  if (!isOpen) return null;

  const handleCopyCurrent = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleCopyAll = () => {
    const fullText = FLUTTER_CODEBASE.map(f => `// ======================================\n// FILE: ${f.path}\n// ======================================\n${f.code}`).join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const rubricItems = [
    {
      concept: 'Different Widgets',
      description: 'Used Container, Row, Column, Stack, ListView.builder, GridView, Card, ElevatedButton, ChoiceChip, Checkbox, Icon, Text.',
      file: 'dashboard_screen.dart & custom_widgets.dart',
      status: 'Implemented & Verified',
    },
    {
      concept: 'Responsive UI Design',
      description: 'MediaQuery.of(context).size & LayoutBuilder dynamically switch between 3-column desktop and single-column tablet/mobile viewports.',
      file: 'dashboard_screen.dart',
      status: 'Implemented & Verified',
    },
    {
      concept: 'Navigation (Named Routes)',
      description: "Implemented MaterialApp routes table ('/', '/pomodoro', '/timetable', '/tasks', '/analytics') and Navigator.pushNamed().",
      file: 'main.dart & dashboard_screen.dart',
      status: 'Implemented & Verified',
    },
    {
      concept: 'Animations & Transitions',
      description: 'AnimationController with SingleTickerProviderStateMixin, AnimatedBuilder, and pulsating circular glow for Pomodoro timer.',
      file: 'pomodoro_screen.dart',
      status: 'Implemented & Verified',
    },
    {
      concept: 'State Management (Provider)',
      description: 'StudyProvider extends ChangeNotifier with reactive methods for tasks CRUD, study hours, timer ticks, and notifyListeners().',
      file: 'study_provider.dart',
      status: 'Implemented & Verified',
    },
    {
      concept: 'Themes & Custom Widgets',
      description: 'Custom Dark Neon ThemeData with Plus Jakarta Sans, plus reusable StatCard, BentoCard, and CustomProgressBar widgets.',
      file: 'main.dart & custom_widgets.dart',
      status: 'Implemented & Verified',
    },
    {
      concept: 'Forms & Validation',
      description: 'GlobalKey<FormState>, Form, TextFormField with regex length and numeric validation for adding tasks and logging hours.',
      file: 'tasks_screen.dart & dashboard_screen.dart',
      status: 'Implemented & Verified',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="w-full max-w-6xl h-[90vh] bg-[#0d1322] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-[#131b2e] border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Flutter UI Exam Codebase & Submission Hub
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  Ready for Submission
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Complete, authentic Dart source code fulfilling all laboratory evaluation instructions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher Tabs */}
            <div className="hidden sm:flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Source Code
              </button>
              <button
                onClick={() => setActiveTab('rubric')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'rubric' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Teacher Rubric
              </button>
              <button
                onClick={() => setActiveTab('report')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'report' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Exam Readme
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Source Code Explorer */}
        {activeTab === 'code' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Left File Tree Sidebar */}
            <div className="w-full md:w-64 bg-[#0f172a] border-r border-slate-800 p-4 overflow-y-auto shrink-0 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <FolderTree className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Project Files</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">{FLUTTER_CODEBASE.length} files</span>
              </div>

              <div className="space-y-1">
                {FLUTTER_CODEBASE.map(file => {
                  const isSelected = selectedFile.filename === file.filename;
                  return (
                    <button
                      key={file.filename}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 text-white border border-indigo-500/50 font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="truncate">{file.path}</span>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                        {file.category}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={handleCopyAll}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'Entire Codebase Copied!' : 'Copy Entire Codebase'}</span>
                </button>
              </div>
            </div>

            {/* Code Viewer Panel */}
            <div className="flex-1 flex flex-col bg-[#0b0f19] overflow-hidden">
              
              {/* File details bar */}
              <div className="px-6 py-3 bg-[#131b2e]/60 border-b border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-300">{selectedFile.path}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCurrent}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                  >
                    {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFile ? 'Copied!' : 'Copy File'}</span>
                  </button>
                  <button
                    onClick={handleDownloadFile}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                    title="Download this .dart file"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Code Pre Block */}
              <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-200 leading-relaxed bg-[#070a13]">
                <pre>
                  <code>{selectedFile.code}</code>
                </pre>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Teacher Rubric & Concepts Checklist */}
        {activeTab === 'rubric' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#0b0f19]">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
                <p className="text-xs text-slate-300">
                  This checklist verifies how every single instruction given by your instructor is fulfilled with working code in this project.
                </p>
              </div>

              <div className="space-y-3">
                {rubricItems.map(item => (
                  <div key={item.concept} className="p-4 rounded-xl bg-[#131b2e] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <h4 className="text-sm font-bold text-white">{item.concept}</h4>
                      </div>
                      <p className="text-xs text-slate-400 pl-6 leading-relaxed">{item.description}</p>
                      <p className="text-[11px] text-indigo-300 pl-6 font-mono">Location: lib/{item.file}</p>
                    </div>

                    <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold shrink-0">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Exam Submission Report Generator */}
        {activeTab === 'report' && (
          <div className="flex-1 p-6 overflow-y-auto bg-[#0b0f19]">
            <div className="max-w-3xl mx-auto space-y-4 bg-[#131b2e] p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white">Project README & Submission Report</h4>
                </div>
                <button
                  onClick={() => {
                    const report = `# StudyFlow - Smart Study Planner
## Flutter UI Laboratory Examination Project

### 1. Executive Summary
StudyFlow is a modern, responsive productivity application developed with Flutter to manage study schedules, Pomodoro focus intervals, academic timetables, and task tracking.

### 2. Implementation of Laboratory Concepts
- **Widgets Used**: Container, Row, Column, Stack, ListView.builder, GridView, Card, ElevatedButton, ChoiceChip, LinearProgressIndicator, CustomPaint.
- **Responsive UI**: Implemented responsive breakpoints using MediaQuery.of(context).size and LayoutBuilder (Desktop 3-column layout vs Mobile stacked layout).
- **Navigation**: Named routes configured in MaterialApp routes dictionary with Navigator.pushNamed().
- **Animations**: SingleTickerProviderStateMixin with AnimationController and AnimatedBuilder for pulsing Pomodoro focus timer.
- **State Management**: Centralized Provider pattern utilizing ChangeNotifier (StudyProvider) for reactive tasks CRUD, goal updates, and study time logs.
- **Theme & Custom Widgets**: Consistent Dark Neon ThemeData with Google Fonts Plus Jakarta Sans and reusable widgets (StatCard, BentoCard, CustomProgressBar).
- **Forms & Validation**: GlobalKey<FormState> with TextFormField and validator callbacks ensuring data integrity.

### 3. Folder Structure
- lib/main.dart
- lib/models/study_task.dart
- lib/providers/study_provider.dart
- lib/screens/dashboard_screen.dart
- lib/screens/pomodoro_screen.dart
- lib/screens/timetable_screen.dart
- lib/screens/tasks_screen.dart
- lib/screens/analytics_screen.dart
- lib/widgets/custom_widgets.dart
- pubspec.yaml
`;
                    navigator.clipboard.writeText(report);
                    alert('Submission Report copied to clipboard!');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Report</span>
                </button>
              </div>

              <div className="font-mono text-xs text-slate-300 space-y-3 leading-relaxed">
                <p className="text-white font-bold"># StudyFlow - Smart Study Planner (Flutter Project)</p>
                <p>This report documents the architecture, concepts, and working functionality implemented for the Flutter UI exam.</p>
                <p className="text-indigo-300 font-semibold">Concepts demonstrated:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                  <li>Different Widgets: Container, Row, Column, Stack, ListView, GridView, Cards, Buttons</li>
                  <li>Responsive Design: MediaQuery and adaptive desktop/tablet/phone layouts</li>
                  <li>Navigation: Multi-screen navigation with named routes</li>
                  <li>Animations: Timer animations and transitions</li>
                  <li>State Management: Provider & ChangeNotifier architecture</li>
                  <li>Themes: Consistent dark theme with custom reusable widgets</li>
                  <li>Forms: Form validation for adding study tasks and logging hours</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer info bar */}
        <div className="px-6 py-3 bg-[#131b2e] border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Built for student exam success</span>
            <span>•</span>
            <span className="text-indigo-400 font-mono">Flutter 3.x / Dart 3.x compatible</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold self-end sm:self-auto transition-colors"
          >
            Close Hub
          </button>
        </div>

      </div>
    </div>
  );
};
