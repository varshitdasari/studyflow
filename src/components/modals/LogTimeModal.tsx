import React, { useState } from 'react';
import { X, Clock, CheckCircle2 } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LogTimeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { logStudyHours } = useStudy();

  const [hours, setHours] = useState('');
  const [subject, setSubject] = useState('Mobile App Dev (Flutter)');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(hours);

    // Validation (Teacher concept: Form and Validation)
    if (!hours || isNaN(h)) {
      setError('Please enter the number of hours studied.');
      return;
    }
    if (h <= 0) {
      setError('Study time must be greater than 0.');
      return;
    }
    if (h > 16) {
      setError('Study time cannot exceed 16 hours in a single log.');
      return;
    }

    logStudyHours(h, subject, notes.trim());
    setHours('');
    setNotes('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#131b2e] border border-slate-800 p-6 shadow-2xl">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Log Study Session</h3>
              <p className="text-[11px] text-slate-400">Add hours to your weekly study graph</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Hours Studied * (e.g. 1.5 or 2.0)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="16"
              value={hours}
              onChange={e => {
                setHours(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. 2.0"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Subject Category *
            </label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="Mobile App Dev (Flutter)">Mobile App Dev (Flutter - Coding)</option>
              <option value="Algorithms & Complexity">Algorithms & Complexity</option>
              <option value="Data Structures & OOP">Data Structures & OOP</option>
              <option value="Software Engineering Tools">Software Engineering Tools</option>
              <option value="Discrete Mathematics">Discrete Mathematics</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Session Focus Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g., Reviewed Flutter state management & tested responsive breakpoints..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Save & Update Graph</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
