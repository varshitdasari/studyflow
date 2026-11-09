import React, { useState } from 'react';
import { X, Send, Bot, Sparkles, User, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AITutorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Hello Varshit! I'm your StudyFlow AI Tutor. How can I help you prepare for your Flutter exam or review algorithms today? Ask me about Flutter widgets, MediaQuery responsiveness, Provider state management, or exam tips!",
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Explain MediaQuery vs LayoutBuilder',
    'How does Provider & ChangeNotifier work?',
    'Difference between Row and Column',
    'Tips for Flutter UI Exam tomorrow',
  ];

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const apiKey = (window as any).GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
      let reply = '';

      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: `You are an expert Flutter & Computer Science tutor for a student taking their Flutter UI Exam. Keep your answer encouraging, concise, code-accurate, and well-structured.\n\nStudent question: ${userText}` }]
            }
          ]
        });
        reply = response.text || '';
      }

      if (!reply) {
        // High quality educational fallback response engine
        const q = userText.toLowerCase();
        if (q.includes('mediaquery') || q.includes('responsive') || q.includes('layoutbuilder')) {
          reply = `In Flutter responsive design:
1. **MediaQuery.of(context).size**: Returns screen dimensions (width & height). Use it for high-level breakpoints (e.g. \`if (size.width > 900) DesktopRow() else MobileColumn()\`).
2. **LayoutBuilder**: Provides the \`BoxConstraints\` of the *parent widget*, allowing widgets to adapt to their container size rather than the full screen.
3. For your exam, demonstrate both! Check out \`lib/screens/dashboard_screen.dart\` in our Flutter Exam Code tab for the exact implementation.`;
        } else if (q.includes('provider') || q.includes('state') || q.includes('changenotifier')) {
          reply = `In Flutter, **Provider** is the standard recommended state management technique:
1. **ChangeNotifier**: Holds the state and notifies listeners via \`notifyListeners()\` when data changes (e.g., \`StudyProvider\`).
2. **ChangeNotifierProvider**: Injects the provider into the widget tree (often at \`MultiProvider\` in \`main.dart\`).
3. **Consumer<T>** or \`Provider.of<T>(context)\`: Listens to state changes and rebuilds only the widgets that depend on that state!`;
        } else if (q.includes('widget') || q.includes('row') || q.includes('column') || q.includes('stack')) {
          reply = `Key Flutter Layout Widgets:
- **Container**: Box decoration, padding, margin, border, color, dimensions.
- **Row & Column**: Flex layouts horizontally and vertically. Control spacing with \`mainAxisAlignment\` and \`crossAxisAlignment\`.
- **Stack**: Positions children on top of each other using z-index layering (great for badges, background graphics, and timers).
- **ListView.builder**: Scrollable list with lazy loading for memory efficiency (e.g., tasks list).
- **GridView**: 2D grid of items (ideal for timetables or bento cards).`;
        } else {
          reply = `Great question! In Flutter:
- Remember to structure your code into **Models, Providers, Screens, and Widgets**.
- For your exam, ensure you have **Form validation** with \`GlobalKey<FormState>\`, responsive layouts via **MediaQuery**, and transitions via **AnimationController**.
- Everything requested by your instructor is ready and documented in our **Flutter Exam Code Hub**!`;
        }
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: "Flutter tip: Remember to wrap dynamic lists with `ListView.builder` for smooth scrolling performance, and use `Provider` to keep your business logic separated from your UI tree!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[560px] rounded-2xl bg-[#131b2e] border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>StudyFlow AI Tutor</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Online
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Ask questions about Flutter, Dart, state management, or exam concepts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#0b0f19]/70">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                m.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-[#131b2e] text-slate-200 border border-slate-800 rounded-tl-none shadow-sm'
              }`}>
                {m.text}
                <div className={`text-[9px] mt-1 text-right ${m.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {m.time}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic py-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>AI Tutor is thinking...</span>
            </div>
          )}
        </div>

        {/* Quick prompt pills */}
        <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Try:</span>
          </span>
          {quickPrompts.map(prompt => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-white border border-slate-700/80 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a question about Flutter, Dart, widgets, or algorithms..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
