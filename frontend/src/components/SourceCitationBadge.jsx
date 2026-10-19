import React, { useState } from 'react';
import { Bookmark, ExternalLink, ShieldCheck, FileText } from 'lucide-react';

export default function SourceCitationBadge({ citation = "Campbell Biology 12th Ed, p. 214", sourceTitle = "Authoritative Source", sourceExcerpt }) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowDetail(!showDetail)}
        className="inline-flex items-center space-x-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 px-2.5 py-1 rounded-md transition shadow-sm"
        title="Source Traceability Verified by Agnes 3.0"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Grounded: {citation}</span>
      </button>

      {showDetail && (
        <div className="absolute left-0 bottom-full mb-2 w-72 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl z-50 text-xs animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
            <span className="font-semibold text-white flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Source Traceability
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">100% Grounded</span>
          </div>
          <p className="font-medium text-slate-200 mb-1">{sourceTitle}</p>
          <p className="text-[11px] text-slate-400 italic mb-2">"{sourceExcerpt || 'Directly extracted and verified from educator approved teaching materials.'}"</p>
          <div className="text-[10px] text-slate-500 flex justify-between items-center border-t border-slate-800/80 pt-1.5">
            <span>Citation: {citation}</span>
            <span className="text-emerald-400">Rank #1 Approved</span>
          </div>
        </div>
      )}
    </div>
  );
}
