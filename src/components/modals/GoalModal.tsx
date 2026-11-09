import React, { useState } from 'react';
import { X, Target, CheckCircle2 } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GoalModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { weeklyGoalHours, setWeeklyGoalHours, totalStudiedHours } = useStudy();
  const [goal, setGoal] = useState(weeklyGoalHours.toString());
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const g = parseFloat(goal);
    if (!goal || isNaN(g) || g < 1) {
      setError('Please set a weekly goal of at least 1 hour.');
      return;
    }
    if (g > 120) {
      setError('Weekly goal cannot exceed 120 hours.');
      return;
    }
    setWeeklyGoalHours(g);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#131b2e] border border-slate-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Adjust Weekly Goal</h3>
              <p className="text-[11px] text-slate-400">Set target hours for your study charts</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Weekly Target Hours
            </label>
            <input
              type="number"
              step="1"
              min="5"
              max="100"
              value={goal}
              onChange={e => {
                setGoal(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-lg font-bold focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Currently studied: <span className="text-indigo-300 font-mono font-bold">{totalStudiedHours}h</span> this week.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Update Goal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
