import React, { useState } from 'react';
import { Siswa, Guru } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Check, QrCode, Sparkles, Image, FileSpreadsheet, ShieldCheck } from 'lucide-react';

interface CanvaExportViewProps {
  siswaList: Siswa[];
  guruList: Guru[];
}

export const CanvaExportView: React.FC<CanvaExportViewProps> = ({ siswaList, guruList }) => {
  const [activeType, setActiveType] = useState<'siswa' | 'guru'>('siswa');
  const [copied, setCopied] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  // Generate Canva CSV Content
  const generateCSV = () => {
    if (activeType === 'siswa') {
      const headers = ['NIS', 'Nama_Siswa', 'Kelas', 'Jenis_Kelamin', 'No_HP', 'QR_Code_URL'];
      const rows = siswaList.map(s => {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(s.nis)}`;
        return `"${s.nis}","${s.nama}","${s.kelas}","${s.jenisKelamin}","${s.noHp}","${qrUrl}"`;
      });
      return [headers.join(','), ...rows].join('\n');
    } else {
      const headers = ['NIP', 'Nama_Guru', 'Jabatan', 'No_HP', 'QR_Code_URL'];
      const rows = guruList.map(g => {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(g.nip)}`;
        return `"${g.nip}","${g.nama}","${g.jabatan}","${g.noHp}","${qrUrl}"`;
      });
      return [headers.join(','), ...rows].join('\n');
    }
  };

  const csvContent = generateCSV();

  const handleCopyCSV = () => {
    navigator.clipboard.writeText(csvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Canva_Bulk_Create_${activeType.toUpperCase()}_QR.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentSiswa = siswaList[selectedItemIndex] || siswaList[0];
  const currentGuru = guruList[selectedItemIndex] || guruList[0];

  return (
    <div className="space-y-6">
      {/* Top Explanation & Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Integrasi Canva Bulk Create / Google Sheets API
            </h2>
            <p className="text-xs text-slate-400">
              Ekspor CSV otomatis ber-URL QR Code siap pakai untuk pembuatan Kartu Pelajar & Guru massal di Canva.
            </p>
          </div>

          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => { setActiveType('siswa'); setSelectedItemIndex(0); }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                activeType === 'siswa' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Kartu Pelajar Siswa ({siswaList.length})
            </button>
            <button
              onClick={() => { setActiveType('guru'); setSelectedItemIndex(0); }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                activeType === 'guru' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Kartu Guru / Staff ({guruList.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Card Preview + CSV Exporter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Card Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center justify-between">
              <span>Visual Live Preview Kartu QR</span>
              <span className="text-xs text-slate-400 font-mono">Format ID Card Canva</span>
            </h3>

            {/* Select Card Subject */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Pilih Data yang Di-preview:</label>
              <select
                value={selectedItemIndex}
                onChange={(e) => setSelectedItemIndex(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                {activeType === 'siswa'
                  ? siswaList.map((s, idx) => (
                      <option key={s.nis} value={idx}>
                        {s.nis} - {s.nama} ({s.kelas})
                      </option>
                    ))
                  : guruList.map((g, idx) => (
                      <option key={g.nip} value={idx}>
                        {g.nip} - {g.nama} ({g.jabatan})
                      </option>
                    ))}
              </select>
            </div>

            {/* The ID Card Graphic Design */}
            <div className="w-full aspect-[1.58/1] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 border-2 border-emerald-500/40 rounded-2xl p-4 flex flex-col justify-between text-white relative overflow-hidden shadow-xl">
              {/* Background Accents */}
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 bg-emerald-500 text-slate-950 font-bold rounded-lg flex items-center justify-center text-xs">
                    SMP
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-tight text-white leading-tight">
                      SMP NEGERI INDONESIA
                    </h4>
                    <p className="text-[9px] text-emerald-300 font-medium">
                      {activeType === 'siswa' ? 'KARTU PELAJAR RESMI' : 'KARTU IDENTITAS GURU'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                  @belajar.id
                </span>
              </div>

              {/* Card Body */}
              <div className="flex items-center justify-between my-auto py-2">
                <div className="space-y-1 max-w-[65%]">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400">
                      {activeType === 'siswa' ? 'NAMA SISWA' : 'NAMA GURU'}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-snug truncate">
                      {activeType === 'siswa' ? currentSiswa?.nama : currentGuru?.nama}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-3 text-[11px]">
                    <div>
                      <span className="text-[9px] text-slate-400 block">
                        {activeType === 'siswa' ? 'NIS' : 'NIP'}
                      </span>
                      <span className="font-mono font-bold text-emerald-400">
                        {activeType === 'siswa' ? currentSiswa?.nis : currentGuru?.nip}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-400 block">
                        {activeType === 'siswa' ? 'KELAS' : 'JABATAN'}
                      </span>
                      <span className="font-semibold text-slate-200">
                        {activeType === 'siswa' ? currentSiswa?.kelas : currentGuru?.jabatan}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Code Graphic */}
                <div className="p-2 bg-white rounded-xl shadow-lg border border-emerald-400/30 flex flex-col items-center">
                  <QRCodeSVG
                    value={activeType === 'siswa' ? currentSiswa?.nis || '' : currentGuru?.nip || ''}
                    size={72}
                  />
                  <span className="text-[8px] font-mono font-bold text-slate-800 mt-1">
                    SCAN APPSHEET
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[9px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Scannable barcode
                </span>
                <span>Tahun Ajaran 2026/2027</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="font-semibold text-slate-200 block">Petunjuk Cetak Canva Bulk Create:</span>
              <p>1. Buat Desain Kartu (Size 85.6mm x 53.9mm) di Canva.</p>
              <p>2. Tambahkan elemen gambar placeholder untuk QR Code.</p>
              <p>3. Buka menu Apps &rarr; Bulk Create &rarr; Upload CSV.</p>
              <p>4. Hubungkan field `Nama_Siswa`, `NIS`, dan `QR_Code_URL` secara instan.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Generated CSV Tool */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">
                  File Data CSV Siap Import Canva ({activeType.toUpperCase()})
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyCSV}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition border border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tercopy!' : 'Copy Text CSV'}</span>
                </button>
                <button
                  onClick={handleDownloadCSV}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File CSV</span>
                </button>
              </div>
            </div>

            {/* CSV Code Output */}
            <div className="relative">
              <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl border border-slate-800 text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
                {csvContent}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
