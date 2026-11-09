import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  BookOpen, 
  GraduationCap, 
  Trash2, 
  Layers
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const TimetableScreen: React.FC = () => {
  const { timetable, addTimetableSlot, deleteTimetableSlot, setIsFlutterHubOpen } = useStudy();
  const [selectedDay, setSelectedDay] = useState<number>(1); // 1 = Monday
  const [isAddSlotOpen, setIsAddSlotOpen] = useState<boolean>(false);

  // Form state
  const [subject, setSubject] = useState('');
  const [code, setCode] = useState('');
  const [room, setRoom] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [type, setType] = useState<'Lecture' | 'Lab' | 'Study Session'>('Lecture');
  const [color, setColor] = useState('#38bdf8');
  const [formError, setFormError] = useState('');

  const days = [
    { num: 1, name: 'Monday' },
    { num: 2, name: 'Tuesday' },
    { num: 3, name: 'Wednesday' },
    { num: 4, name: 'Thursday' },
    { num: 5, name: 'Friday' },
    { num: 6, name: 'Saturday' },
    { num: 7, name: 'Sunday' },
  ];

  const currentDaySlots = timetable
    .filter(slot => slot.dayOfWeek === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setFormError('Please enter a course or subject name');
      return;
    }
    if (!startTime || !endTime) {
      setFormError('Please select both start and end time');
      return;
    }

    addTimetableSlot({
      dayOfWeek: selectedDay,
      subject: subject.trim(),
      code: code.trim() || 'CS-GEN',
      room: room.trim() || 'Room 101',
      startTime,
      endTime,
      color,
      type,
    });

    setSubject('');
    setCode('');
    setRoom('');
    setFormError('');
    setIsAddSlotOpen(false);
  };

  const courseList = [
    { name: 'Mobile Application Dev (Flutter)', code: 'CS-402', attendance: '96%', progress: '78%', nextExam: 'In 2 days' },
    { name: 'Algorithms & Complexity', code: 'CS-301', attendance: '92%', progress: '85%', nextExam: 'In 6 days' },
    { name: 'Data Structures & OOP', code: 'CS-205', attendance: '94%', progress: '90%', nextExam: 'Completed' },
    { name: 'Discrete Mathematics', code: 'MATH-201', attendance: '88%', progress: '70%', nextExam: 'Tomorrow' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#131b2e] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Courses & Weekly Timetable</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Organize lectures, lab practicals, and structured revision blocks.
          </p>
        </div>

        <button
          onClick={() => setIsAddSlotOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Timetable Slot</span>
        </button>
      </div>

      {/* Course Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {courseList.map(c => (
          <div key={c.code} className="p-4 rounded-xl bg-[#131b2e] border border-slate-800 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                {c.code}
              </span>
              <span className="text-[11px] text-slate-400">{c.attendance} Att.</span>
            </div>
            <h4 className="mt-2 text-xs font-bold text-white line-clamp-1">{c.name}</h4>
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Syllabus Covered</span>
                <span className="font-mono text-slate-200">{c.progress}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full" 
                  style={{ width: c.progress }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {days.map(d => {
          const isSelected = selectedDay === d.num;
          const count = timetable.filter(s => s.dayOfWeek === d.num).length;
          return (
            <button
              key={d.num}
              onClick={() => setSelectedDay(d.num)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-[#131b2e] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{d.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Timetable Schedule Grid for Selected Day */}
      <div className="p-6 rounded-2xl bg-[#131b2e] border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>{days.find(d => d.num === selectedDay)?.name} Schedule</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {currentDaySlots.length} sessions scheduled
          </span>
        </div>

        {currentDaySlots.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <BookOpen className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-medium">No classes or study sessions scheduled for this day.</p>
            <button
              onClick={() => setIsAddSlotOpen(true)}
              className="mt-3 px-3.5 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold hover:bg-indigo-600/30 transition-colors"
            >
              + Add Class Slot
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {currentDaySlots.map(slot => (
              <div
                key={slot.id}
                className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div 
                    className="w-2.5 h-12 sm:h-10 rounded-full shrink-0" 
                    style={{ backgroundColor: slot.color }} 
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{slot.subject}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {slot.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-indigo-300">
                        <Clock className="w-3.5 h-3.5" />
                        {slot.startTime} – {slot.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {slot.room}
                      </span>
                      <span className="text-slate-500 font-mono">
                        {slot.code}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => deleteTimetableSlot(slot.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 rounded"
                    title="Delete Class Slot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Slot Modal */}
      {isAddSlotOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#131b2e] border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">Add Timetable Slot</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Scheduled for {days.find(d => d.num === selectedDay)?.name}
            </p>

            {formError && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateSlot} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject / Course Name *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Flutter Mobile Architecture"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Course Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="e.g. CS-402"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Classroom / Lab</label>
                  <input
                    type="text"
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                    placeholder="e.g. Lab 3B"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Session Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab Practical</option>
                    <option value="Study Session">Study Session</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Accent Color</label>
                  <div className="flex items-center gap-2 pt-1">
                    {['#38bdf8', '#a855f7', '#10b981', '#f59e0b', '#f43f5e'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform ${
                          color === c ? 'scale-110 border-white' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSlotOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-colors"
                >
                  Add to Timetable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
