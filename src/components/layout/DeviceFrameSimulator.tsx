import React from 'react';
import { Monitor, Tablet, Smartphone, Wifi, Battery, Sparkles } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

interface Props {
  children: React.ReactNode;
}

export const DeviceFrameSimulator: React.FC<Props> = ({ children }) => {
  const { deviceMode, setDeviceMode } = useStudy();

  if (deviceMode === 'desktop') {
    return <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>;
  }

  if (deviceMode === 'tablet') {
    return (
      <main className="py-6 flex flex-col items-center justify-center">
        {/* Tablet Banner */}
        <div className="mb-3 flex items-center gap-2 bg-[#131b2e] px-4 py-1.5 rounded-full border border-slate-800 text-xs text-slate-300">
          <Tablet className="w-3.5 h-3.5 text-indigo-400" />
          <span>Tablet Viewport Simulator (768px × 1024px)</span>
          <button
            onClick={() => setDeviceMode('desktop')}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold ml-2 underline"
          >
            Reset to Desktop
          </button>
        </div>

        {/* Tablet Bezel */}
        <div className="w-[768px] max-w-[95vw] bg-slate-900 p-4 rounded-[32px] border-[10px] border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="bg-[#0b0f19] rounded-[20px] p-4 min-h-[640px] max-h-[82vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </main>
    );
  }

  // Mobile Flutter Phone Simulator Frame
  return (
    <main className="py-6 flex flex-col items-center justify-center">
      {/* Mobile Mode Banner */}
      <div className="mb-3 flex items-center gap-2 bg-[#131b2e] px-4 py-1.5 rounded-full border border-slate-800 text-xs text-slate-300">
        <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
        <span>Flutter Mobile Simulator (390px × 844px)</span>
        <button
          onClick={() => setDeviceMode('desktop')}
          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold ml-2 underline"
        >
          Reset to Desktop
        </button>
      </div>

      {/* Phone Shell */}
      <div className="w-[390px] max-w-[95vw] h-[780px] bg-slate-950 p-3 rounded-[48px] border-[10px] border-slate-800 shadow-2xl shadow-indigo-950/30 flex flex-col relative overflow-hidden">
        
        {/* Top Status Bar with Dynamic Island / Notch */}
        <div className="h-7 w-full flex items-center justify-between px-6 shrink-0 text-[11px] font-semibold text-slate-300 select-none">
          <span>9:41</span>
          
          {/* Dynamic Island Pill */}
          <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800 ml-8" />
          </div>

          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3 text-slate-300" />
            <Battery className="w-3.5 h-3.5 text-slate-300" />
          </div>
        </div>

        {/* Internal Screen Viewport */}
        <div className="flex-1 bg-[#0b0f19] rounded-[36px] overflow-y-auto p-3 space-y-4">
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="h-5 w-full flex items-center justify-center shrink-0">
          <div className="w-32 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </main>
  );
};
