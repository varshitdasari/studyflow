import React from 'react';
import { X, Bookmark, Save, Sparkles, BookOpen } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const NotesDrawer: React.FC = () => {
  const { isNotesDrawerOpen, setIsNotesDrawerOpen, quickNotes, setQuickNotes } = useStudy();

  if (!isNotesDrawerOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#131b2e] border-l border-slate-800 shadow-2xl flex flex-col transition-all">
      
      {/* Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Study Notes & Cheat Sheet</h3>
            <p className="text-[10px] text-slate-400">Scratchpad for Flutter formulas & tips</p>
          </div>
        </div>
        <button
          onClick={() => setIsNotesDrawerOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick snippets toolbar */}
      <div className="p-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <button
          onClick={() => setQuickNotes(quickNotes + '\n\n// Provider Access Pattern:\nfinal provider = Provider.of<StudyProvider>(context, listen: false);')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700/60"
        >
          + Provider Snippet
        </button>
        <button
          onClick={() => setQuickNotes(quickNotes + '\n\n// MediaQuery Breakpoint:\nfinal isDesktop = MediaQuery.of(context).size.width > 900;')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700/60"
        >
          + MediaQuery Snippet
        </button>
      </div>

      {/* Textarea */}
      <div className="flex-1 p-4 bg-[#0b0f19]">
        <textarea
          value={quickNotes}
          onChange={e => setQuickNotes(e.target.value)}
          placeholder="Jot down quick thoughts, algorithm pseudocode, or exam reminders..."
          className="w-full h-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs leading-relaxed focus:outline-none focus:border-indigo-500 resize-none"
        />
      </div>

      {/* Footer */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="text-[11px] flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Auto-saved locally</span>
        </span>
        <button
          onClick={() => setIsNotesDrawerOpen(false)}
          className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
        >
          Done
        </button>
      </div>

    </div>
  );
};
