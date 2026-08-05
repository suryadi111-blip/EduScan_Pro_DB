import React, { useState } from 'react';
import { AppSheetExpression } from '../types';
import { APPSHEET_EXPRESSIONS } from '../data/initialData';
import { Code2, Copy, Check, Search, Sparkles, Filter, Terminal, BookOpen } from 'lucide-react';

export const ExpressionsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Builder states
  const [builderTable, setBuilderTable] = useState('Log_Absensi_Siswa');
  const [builderType, setBuilderType] = useState('valid_if_duplicate');
  const [builderDomain, setBuilderDomain] = useState('guru.smp.belajar.id');

  const categories = ['All', 'Valid_If', 'Initial Value', 'Ref Lookup', 'Security Filter', 'Automation Bot'];

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Generate Interactive AppSheet Expression
  const getGeneratedExpression = () => {
    switch (builderType) {
      case 'valid_if_duplicate':
        return {
          rumus: `ISBLANK(FILTER("${builderTable}", AND([NIS] = [_THISROW].[NIS], [Tanggal] = TODAY())))`,
          penjelasan: `Mencegah scan absensi ganda pada tabel ${builderTable} di mana NIS siswa yang sama sudah terdaftar pada tanggal TODAY().`,
          kategori: 'Valid_If'
        };
      case 'ref_lookup':
        return {
          rumus: `[NIS].[Nama Siswa]`,
          penjelasan: `Mengambil Nama Siswa dari Data_Master_Siswa secara otomatis menggunakan dereference link Ref NIS.`,
          kategori: 'Ref Lookup'
        };
      case 'initial_value':
        return {
          rumus: `UNIQUEID()`,
          penjelasan: `Primary Key unik untuk tabel ${builderTable}. Mencegah eror bentrok key saat offline/online sync.`,
          kategori: 'Initial Value'
        };
      case 'security_filter':
        return {
          rumus: `ENDSWITH(USEREMAIL(), "@${builderDomain}") OR ENDSWITH(USEREMAIL(), ".belajar.id")`,
          penjelasan: `Membatasi akses pengguna agar hanya akun berdomain @${builderDomain} yang dapat membuka tabel ${builderTable}.`,
          kategori: 'Security Filter'
        };
      default:
        return {
          rumus: `TODAY()`,
          penjelasan: `Mengisi tanggal otomatis.`,
          kategori: 'Initial Value'
        };
    }
  };

  const generated = getGeneratedExpression();

  const filteredExpressions = APPSHEET_EXPRESSIONS.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.rumus.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.penjelasan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.kategori === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Interactive AppSheet Expression Generator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-base font-bold text-white">Generator & Builder Rumus AppSheet (AppSheet Expressions)</h2>
            <p className="text-xs text-slate-400">
              Buat rumus AppSheet persis sesuai kebutuhan tabel dan kolom spesifikasi sekolah Anda.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Target Tabel AppSheet:</label>
            <select
              value={builderTable}
              onChange={(e) => setBuilderTable(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
            >
              <option value="Log_Absensi_Siswa">Log_Absensi_Siswa</option>
              <option value="Log_Absensi_Guru">Log_Absensi_Guru</option>
              <option value="Log_Minyak_Jelantah">Log_Minyak_Jelantah</option>
              <option value="Log_Pelanggaran">Log_Pelanggaran</option>
              <option value="Log_Masa_Haid">Log_Masa_Haid</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Jenis Rumus & Aturan:</label>
            <select
              value={builderType}
              onChange={(e) => setBuilderType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
            >
              <option value="valid_if_duplicate">Valid_If: Mencegah Absen/Record Ganda (1x Per Hari)</option>
              <option value="ref_lookup">App Formula: Lookup [NIS].[Nama Siswa] via Ref</option>
              <option value="initial_value">Initial Value: UNIQUEID() Primary Key</option>
              <option value="security_filter">Security Filter: Batasi Domain Belajar.id</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Domain Belajar.id / Workspace:</label>
            <input
              type="text"
              value={builderDomain}
              onChange={(e) => setBuilderDomain(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
            />
          </div>
        </div>

        {/* Live Code Box */}
        <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 font-mono flex items-center gap-1.5">
              <Terminal className="w-4 h-4" /> Hasil Rumus AppSheet ({generated.kategori})
            </span>
            <button
              onClick={() => handleCopy(generated.rumus, 'generated')}
              className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition"
            >
              {copiedId === 'generated' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'generated' ? 'Tercopy!' : 'Copy Rumus'}</span>
            </button>
          </div>

          <pre className="bg-slate-900 text-emerald-300 p-3 rounded-lg border border-slate-800 text-xs font-mono overflow-x-auto">
            {generated.rumus}
          </pre>

          <p className="text-xs text-slate-300">
            <span className="font-semibold text-slate-100">Penjelasan Aturan:</span> {generated.penjelasan}
          </p>
        </div>
      </div>

      {/* Pre-built Expression Library Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Katalog Rumus AppSheet Paling Sering Digunakan
            </h3>
            <p className="text-xs text-slate-400">Koleksi rumus siap salin untuk aplikasi sekolah QR Code</p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari rumus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Library Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExpressions.map((exp) => (
            <div key={exp.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between hover:border-slate-700 transition">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                    {exp.kategori}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono truncate max-w-[50%]">
                    Target: {exp.tabelTarget}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{exp.nama}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{exp.penjelasan}</p>

                <div className="relative group">
                  <pre className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg border border-slate-800 text-xs font-mono overflow-x-auto">
                    {exp.rumus}
                  </pre>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 italic">
                  {exp.contohPenggunaan}
                </span>
                <button
                  onClick={() => handleCopy(exp.rumus, exp.id)}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 rounded text-xs transition"
                >
                  {copiedId === exp.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === exp.id ? 'Tercopy' : 'Copy'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
