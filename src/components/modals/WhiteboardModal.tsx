import React, { useRef, useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Trash2, 
  Eraser, 
  PenTool, 
  Palette, 
  Layers, 
  RotateCcw 
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WhiteboardModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#38bdf8');
  const [lineWidth, setLineWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution backing store
    canvas.width = canvas.parentElement?.clientWidth || 700;
    canvas.height = 420;

    // Fill dark background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Initial placeholder sketch guide for Flutter Widget Tree
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Grid dots
    for (let x = 20; x < canvas.width; x += 30) {
      for (let y = 20; y < canvas.height; y += 30) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, y, 2, 2);
      }
    }
    ctx.setLineDash([]);
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? '#0f172a' : color;
    ctx.lineWidth = isEraser ? 24 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Re-draw subtle grid
    for (let x = 20; x < canvas.width; x += 30) {
      for (let y = 20; y < canvas.height; y += 30) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, y, 2, 2);
      }
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `StudyFlow_Whiteboard_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const drawFlutterTreeTemplate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas();
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';

    const drawBox = (txt: string, x: number, y: number, clr: string) => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x - 60, y - 16, 120, 32);
      ctx.strokeStyle = clr;
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 60, y - 16, 120, 32);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(txt, x, y + 4);
    };

    const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    const cx = canvas.width / 2;
    drawBox('MaterialApp', cx, 40, '#6366f1');
    drawLine(cx, 56, cx, 94);

    drawBox('Scaffold', cx, 110, '#38bdf8');
    drawLine(cx, 126, cx - 120, 174);
    drawLine(cx, 126, cx + 120, 174);

    drawBox('AppBar', cx - 120, 190, '#10b981');
    drawBox('Body (Column)', cx + 120, 190, '#f59e0b');

    drawLine(cx + 120, 206, cx + 40, 254);
    drawLine(cx + 120, 206, cx + 200, 254);

    drawBox('BentoRow', cx + 40, 270, '#ec4899');
    drawBox('StudyTimeChart', cx + 200, 270, '#8b5cf6');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-[#131b2e] border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">StudyFlow Interactive Whiteboard</h3>
              <p className="text-[11px] text-slate-400">Sketch Flutter widget trees, memory layouts, and algorithm diagrams</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-2.5 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-3">
            {/* Tool Toggles */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => setIsEraser(false)}
                className={`p-1.5 rounded-md transition-colors ${
                  !isEraser ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Pen Tool"
              >
                <PenTool className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsEraser(true)}
                className={`p-1.5 rounded-md transition-colors ${
                  isEraser ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Eraser Tool"
              >
                <Eraser className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Color Palette */}
            {!isEraser && (
              <div className="flex items-center gap-1.5">
                {['#ffffff', '#38bdf8', '#818cf8', '#10b981', '#f59e0b', '#f43f5e', '#ec4899'].map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-5 h-5 rounded-full border-2 transition-transform ${
                      color === c ? 'scale-125 border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            )}

            {/* Stroke Width Slider */}
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <span className="text-[10px]">Size</span>
              <input
                type="range"
                min="1"
                max="12"
                value={lineWidth}
                onChange={e => setLineWidth(Number(e.target.value))}
                className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={drawFlutterTreeTemplate}
              className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-semibold transition-colors flex items-center gap-1"
            >
              <Layers className="w-3 h-3" />
              <span>Insert Widget Tree</span>
            </button>

            <button
              onClick={clearCanvas}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 transition-colors border border-slate-700"
              title="Clear Whiteboard"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={downloadCanvas}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save PNG</span>
            </button>
          </div>

        </div>

        {/* Canvas Area */}
        <div className="p-4 bg-[#090d16] flex justify-center">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="rounded-xl border border-slate-800 cursor-crosshair shadow-inner"
          />
        </div>

      </div>
    </div>
  );
};
