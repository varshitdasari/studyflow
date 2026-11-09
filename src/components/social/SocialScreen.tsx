import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Flame, 
  Trophy, 
  Send, 
  DoorOpen, 
  LogOut, 
  Sparkles, 
  Radio, 
  Clock 
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const SocialScreen: React.FC = () => {
  const { 
    partners, 
    rooms, 
    activeRoomId, 
    joinRoom, 
    leaveRoom, 
    roomMessages, 
    sendRoomMessage,
    pomodoroRemainingSeconds
  } = useStudy();

  const [chatInput, setChatInput] = useState('');

  const activeRoom = rooms.find(r => r.id === activeRoomId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendRoomMessage(chatInput.trim());
    setChatInput('');
  };

  const minutes = Math.floor(pomodoroRemainingSeconds / 60);
  const seconds = pomodoroRemainingSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#131b2e] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Social & Collaborative Study Rooms</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Stay accountable, join synchronized focus rooms, and climb the cohort leaderboard.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>81 Study Partners Online</span>
          </span>
        </div>
      </div>

      {/* Active Room View if Joined */}
      {activeRoom && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/50 via-[#131b2e] to-slate-900 border border-indigo-500/40 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                  Live Study Room
                </span>
                <span className="text-xs text-slate-400">Target: {activeRoom.targetFocusMinutes} min sprint</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">{activeRoom.name}</h3>
              <p className="text-xs text-slate-300">{activeRoom.topic}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-indigo-500/30">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span className="font-mono text-sm font-bold text-white">{formattedTime}</span>
              </div>
              <button
                onClick={leaveRoom}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Leave Room</span>
              </button>
            </div>
          </div>

          {/* Room Body: Participants + Live Room Chat */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Participants list */}
            <div className="md:col-span-5 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Room Members ({activeRoom.activeMembers})</span>
                <span className="text-[10px] text-emerald-400">All Focused</span>
              </h4>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {partners.map(p => (
                  <div key={p.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{p.avatar}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{p.name}</div>
                        <div className="text-[10px] text-slate-400">{p.currentSubject}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                      {p.hoursToday}h today
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Chat Board */}
            <div className="md:col-span-7 flex flex-col h-[260px] bg-slate-900/80 rounded-xl border border-slate-800 p-3">
              <div className="text-xs font-bold text-slate-300 pb-2 border-b border-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span>Room Chat & Encouragement</span>
              </div>

              <div className="flex-1 overflow-y-auto py-2 space-y-2 pr-1">
                {roomMessages.map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5">
                      <span className="font-semibold text-slate-300">{msg.sender}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl text-xs max-w-[85%] ${
                      msg.isUser
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/60'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Share notes or say hello..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* Available Study Rooms Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>Active Study Rooms</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rooms.map(room => {
            const isJoined = activeRoomId === room.id;
            return (
              <div 
                key={room.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isJoined 
                    ? 'bg-indigo-950/30 border-indigo-500' 
                    : 'bg-[#131b2e] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {room.activeMembers}/{room.maxMembers} Online
                    </span>
                    <span className="font-mono">{room.targetFocusMinutes} min intervals</span>
                  </div>

                  <h4 className="mt-2 text-sm font-bold text-white">{room.name}</h4>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">{room.topic}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {room.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Public Room</span>
                  {isJoined ? (
                    <button
                      onClick={leaveRoom}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-semibold hover:bg-rose-500/30 transition-colors"
                    >
                      Leave
                    </button>
                  ) : (
                    <button
                      onClick={() => joinRoom(room.id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-colors"
                    >
                      <DoorOpen className="w-3.5 h-3.5" />
                      <span>Join Room</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cohort Leaderboard (Showing user at #3 matching reference image!) */}
      <div className="p-6 rounded-2xl bg-[#131b2e] border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Cohort Study Leaderboard</h3>
          </div>
          <span className="text-xs text-slate-400">Updated hourly based on logged Pomodoro sprints</span>
        </div>

        <div className="space-y-2.5">
          {partners.map(p => {
            const isUser = p.rank === 3;
            return (
              <div
                key={p.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  isUser 
                    ? 'bg-indigo-600/15 border-indigo-500/60 shadow-md' 
                    : 'bg-slate-900/40 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                    p.rank === 1 ? 'bg-amber-500 text-slate-950' :
                    p.rank === 2 ? 'bg-slate-300 text-slate-950' :
                    p.rank === 3 ? 'bg-amber-700 text-white' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {p.rank}
                  </div>
                  <span className="text-xl">{p.avatar}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isUser ? 'text-indigo-300 font-extrabold' : 'text-white'}`}>
                        {p.name}
                      </span>
                      {isUser && (
                        <span className="px-1.5 py-0.2 rounded bg-indigo-500 text-white text-[9px] font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{p.currentSubject}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono font-bold text-white">
                    {p.hoursToday} hrs
                  </span>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-0.5">
                    <Flame className="w-3.5 h-3.5" />
                    56d
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
