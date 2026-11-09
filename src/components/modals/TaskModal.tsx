import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ListPlus } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Priority } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TaskModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addTask, updateTask, editingTask } = useStudy();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mobile App Dev (Flutter)');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('2026-11-12');
  const [dueTime, setDueTime] = useState('18:00');
  const [estimatedHours, setEstimatedHours] = useState('1.5');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setSubject(editingTask.subject);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate);
      setDueTime(editingTask.dueTime || '18:00');
      setEstimatedHours(editingTask.estimatedHours.toString());
      setNotes(editingTask.notes || '');
    } else {
      setTitle('');
      setSubject('Mobile App Dev (Flutter)');
      setPriority('medium');
      setDueDate('2026-11-12');
      setDueTime('18:00');
      setEstimatedHours('1.5');
      setNotes('');
    }
    setError('');
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation (Forms and Validation concept)
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }
    if (title.trim().length < 3) {
      setError('Task title must be at least 3 characters.');
      return;
    }
    const hrs = parseFloat(estimatedHours);
    if (!estimatedHours || isNaN(hrs) || hrs <= 0) {
      setError('Please provide a valid estimated duration in hours.');
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        subject,
        priority,
        dueDate,
        dueTime,
        estimatedHours: hrs,
        notes: notes.trim(),
      });
    } else {
      addTask({
        title: title.trim(),
        subject,
        priority,
        completed: false,
        dueDate,
        dueTime,
        estimatedHours: hrs,
        notes: notes.trim(),
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#131b2e] border border-slate-800 p-6 shadow-2xl">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <ListPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {editingTask ? 'Edit Study Task' : 'Add Study Task'}
              </h3>
              <p className="text-[11px] text-slate-400">Manage tasks, deadlines, and time estimates</p>
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
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Implement Navigation & Named Routes in Flutter"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Course / Subject *
              </label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Mobile App Dev (Flutter)">Mobile App Dev (Flutter)</option>
                <option value="Algorithms">Algorithms & Complexity</option>
                <option value="Data Structures">Data Structures & OOP</option>
                <option value="Discrete Mathematics">Discrete Mathematics</option>
                <option value="Software Tools">Software Tools</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Due Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={e => setDueTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Est. Hours
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                value={estimatedHours}
                onChange={e => setEstimatedHours(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Task Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Instructions, syllabus references, or checklist items..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
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
              <span>{editingTask ? 'Update Task' : 'Add Task to Flow'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
