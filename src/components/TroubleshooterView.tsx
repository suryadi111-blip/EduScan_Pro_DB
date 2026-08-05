import React, { useState } from 'react';
import { APPSHEET_ERROR_CASES } from '../data/initialData';
import { AlertTriangle, CheckCircle2, XCircle, Search, HelpCircle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export const TroubleshooterView: React.FC = () => {
  const [selectedErrorId, setSelectedErrorId] = useState(APPSHEET_ERROR_CASES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [userPastedError, setUserPastedError] = useState('');
  const [analyzingPasted, setAnalyzingPasted] = useState(false);

  const currentCase = APPSHEET_ERROR_CASES.find(c => c.id === selectedErrorId) || APPSHEET_ERROR_CASES[0];

  const filteredCases = APPSHEET_ERROR_CASES.filter(c => 
    c.kodeError.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.namaError.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.gejala.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAnalyzePastedError = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPastedError.trim()) return;

    setAnalyzingPasted(true);
    setTimeout(() => {
      // Simple intelligent keyword match
      const txt = userPastedError.toLowerCase();
      if (txt.includes('cyclical') || txt.includes('circular') || txt.includes('loop')) {
        setSelectedErrorId('err-1');
      } else if (txt.includes('schema') || txt.includes('column') || txt.includes('not found') || txt.includes('mismatch')) {
        setSelectedErrorId('err-2');
      } else if (txt.includes('key') || txt.includes('duplicate') || txt.includes('unique')) {
        setSelectedErrorId('err-3');
      } else if (txt.includes('scan') || txt.includes('barcode') || txt.includes('camera') || txt.includes('qr')) {
        setSelectedErrorId('err-4');
      }
      setAnalyzingPasted(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Asisten Diagnosa & Pemecah Error AppSheet
            </h2>
            <p className="text-xs text-slate-400">
              Analisis instan pesan eror AppSheet (Cyclical Reference, Schema Error, Duplicate Key) dengan solusi ringkas dan tepat.
            </p>
          </div>
          <span className="text-xs px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full font-mono">
            Error Diagnostic Engine
          </span>
        </div>
      </div>

      {/* Interactive Quick Error Analyzer Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-400" /> Paste Pesan Error AppSheet Anda Di Sini:
        </h3>
        <form onSubmit={handleAnalyzePastedError} className="flex gap-2">
          <input
            type="text"
            placeholder="Contoh: Cyclical reference detected in table Log_Absensi_Siswa atau Key is not unique..."
            value={userPastedError}
            onChange={(e) => setUserPastedError(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition whitespace-nowrap"
          >
            {analyzingPasted ? 'Menganalisis...' : 'Analisis Solusi'}
          </button>
        </form>
      </div>

      {/* Main Grid: Case Selector + Diagnostic Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Common Error Cases List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari jenis error..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            {filteredCases.map((c) => {
              const isActive = c.id === selectedErrorId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedErrorId(c.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex flex-col justify-between space-y-1.5 ${
                    isActive
                      ? 'bg-slate-900 border-amber-500/60 ring-1 ring-amber-500/30 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 font-mono">{c.kodeError}</span>
                  </div>
                  <h4 className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {c.namaError}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {c.gejala}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Diagnostic Result Card */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
            {/* Header */}
            <div className="border-b border-slate-800 pb-3 flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 font-mono block">
                  ERR_CODE: {currentCase.kodeError}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{currentCase.namaError}</h3>
              </div>
            </div>

            {/* Gejala & Penyebab Utama */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Gejala / Pesan Eror:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-900 p-2 rounded border border-slate-800 mt-1">
                  {currentCase.gejala}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Penyebab Utama:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed mt-1">
                  {currentCase.penyebabUtama}
                </p>
              </div>
            </div>

            {/* Solusi Langkah demi Langkah */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Solusi Langkah-demi-Langkah (Bebas Eror):
              </h4>
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-2.5">
                {currentCase.solusiLangkahDemiLangkah.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-200">
                    <span className="w-5 h-5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison Code: Salah vs Benar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-rose-900/40 space-y-1">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Contoh Konfigurasi/Rumus Salah:
                </span>
                <pre className="bg-slate-900 text-rose-300 p-2.5 rounded border border-slate-800 text-xs font-mono overflow-x-auto">
                  {currentCase.contohRumusSalah}
                </pre>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-900/40 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Perbaikan Yang Benar:
                </span>
                <pre className="bg-slate-900 text-emerald-300 p-2.5 rounded border border-slate-800 text-xs font-mono overflow-x-auto">
                  {currentCase.contohRumusBenar}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
