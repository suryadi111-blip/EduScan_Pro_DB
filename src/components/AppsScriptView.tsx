import React, { useState } from 'react';
import { APPS_SCRIPT_CODES } from '../data/initialData';
import { FileCode, Copy, Check, Terminal, ExternalLink, HelpCircle } from 'lucide-react';

export const AppsScriptView: React.FC = () => {
  const [selectedScriptId, setSelectedScriptId] = useState(APPS_SCRIPT_CODES[0].id);
  const [copied, setCopied] = useState(false);

  const selectedScript = APPS_SCRIPT_CODES.find(s => s.id === selectedScriptId) || APPS_SCRIPT_CODES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedScript.kode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-emerald-400" />
              Google Apps Script (GAS) Code Suite & Web App Generator
            </h2>
            <p className="text-xs text-slate-400">
              Kode Apps Script siap pakai untuk membuat Dashboard Analytics Web, Bot WhatsApp otomatis, dan Rumus Sheets.
            </p>
          </div>
          <span className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full font-mono">
            GAS + Google Sheets API
          </span>
        </div>
      </div>

      {/* Main Grid: Script List + Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Script Selector */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Daftar Modul Google Apps Script
          </h3>
          <div className="space-y-2">
            {APPS_SCRIPT_CODES.map((script) => {
              const isActive = script.id === selectedScriptId;
              return (
                <button
                  key={script.id}
                  onClick={() => setSelectedScriptId(script.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex flex-col justify-between space-y-2 ${
                    isActive
                      ? 'bg-slate-900 border-emerald-500/60 ring-1 ring-emerald-500/30 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {script.kategori}
                    </span>
                  </div>
                  <h4 className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {script.judul}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {script.deskripsi}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Editor View & Guide */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold font-mono">
                  {selectedScript.kategori}
                </span>
                <h3 className="text-base font-bold text-white">{selectedScript.judul}</h3>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Kode Tercopy!' : 'Salin Semua Kode'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{selectedScript.deskripsi}</p>

            {/* Code Box */}
            <div className="relative">
              <div className="flex items-center justify-between bg-slate-950 px-4 py-2 border-t border-x border-slate-800 rounded-t-xl text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Google Apps Script (Kode.gs)
                </span>
                <span>JavaScript / ES6</span>
              </div>
              <pre className="bg-slate-950 text-emerald-400 p-4 rounded-b-xl border border-slate-800 text-xs font-mono overflow-x-auto max-h-[420px] leading-relaxed">
                {selectedScript.kode}
              </pre>
            </div>

            {/* How to deployment guide */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
              <h4 className="font-semibold text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-400" /> Petunjuk Pemasangan di Google Sheets:
              </h4>
              <div className="text-slate-300 space-y-1 whitespace-pre-line leading-relaxed">
                {selectedScript.petunjukCaraPakai}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
