import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Eye, Image as ImageIcon } from 'lucide-react';

export default function VisualRenderer({ visualData }) {
  const containerRef = useRef(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#0f172a',
        primaryColor: '#10b981',
        primaryTextColor: '#ffffff',
        lineColor: '#38bdf8',
        secondaryColor: '#1e293b',
        tertiaryColor: '#1e293b'
      }
    });

    if (containerRef.current && visualData?.mermaid_markup) {
      containerRef.current.innerHTML = '';
      const uniqueId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      
      try {
        mermaid.render(uniqueId, visualData.mermaid_markup).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        });
      } catch (err) {
        console.error('Mermaid rendering error:', err);
      }
    }
  }, [visualData]);

  if (!visualData) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2 text-cyan-400">
          <Eye className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Agnes Visual Generator (generate_visual)</span>
        </div>
        <span className="text-[11px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-mono">
          Interactive Molecular Diagram
        </span>
      </div>

      {/* SVG Architecture Diagram */}
      <div className="mb-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80 overflow-x-auto">
        <div 
          dangerouslySetInnerHTML={{ __html: visualData.svg_markup || '' }} 
        />
      </div>

      {/* Mermaid Flow Diagram */}
      {visualData.mermaid_markup && (
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 overflow-x-auto">
          <div ref={containerRef} className="flex justify-center" />
        </div>
      )}

      {visualData.caption && (
        <p className="text-xs text-slate-400 mt-3 italic text-center">
          {visualData.caption}
        </p>
      )}
    </div>
  );
}
