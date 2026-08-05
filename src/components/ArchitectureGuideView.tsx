import React from 'react';
import { BookOpen, Database, ShieldCheck, QrCode, ArrowRight, CheckCircle2, Lock, Cpu, Globe } from 'lucide-react';

export const ArchitectureGuideView: React.FC = () => {
  const schemaModules = [
    {
      nama: '1. Data_Master_Siswa',
      key: 'NIS (Primary Key / Text)',
      label: 'Nama Siswa (Label / Text)',
      kolom: ['NIS', 'Nama Siswa', 'Kelas', 'Jenis Kelamin', 'No HP', 'QR Code'],
      tipe: 'Tabel Master. Kunci NIS bertipe Text untuk mencegah kehilangan leading zero (misal: 002345).'
    },
    {
      nama: '2. Data_Master_Guru',
      key: 'NIP (Primary Key / Text)',
      label: 'Nama Guru (Label / Text)',
      kolom: ['NIP', 'Nama Guru', 'Jabatan / Mapel', 'No HP', 'QR Code'],
      tipe: 'Tabel Master. NIP bertipe Text 18 digit resmi.'
    },
    {
      nama: '3. Log_Absensi_Siswa',
      key: 'ID Absen (UNIQUEID)',
      label: 'N/A (Log Entry)',
      kolom: ['ID Absen (UNIQUEID)', 'Tanggal (TODAY)', 'NIS (Ref -> Data_Master_Siswa, Scannable)', 'Status', 'Waktu Scan (TIMENOW)'],
      tipe: 'Tabel Transaksi. NIS wajib bertipe Ref dan bertanda Scannable di AppSheet Column Settings.'
    },
    {
      nama: '4. Log_Absensi_Guru',
      key: 'ID Absen (UNIQUEID)',
      label: 'N/A (Log Entry)',
      kolom: ['ID Absen (UNIQUEID)', 'Tanggal (TODAY)', 'NIP (Ref -> Data_Master_Guru, Scannable)', 'Tipe Absen', 'Waktu Scan (TIMENOW)'],
      tipe: 'Tabel Transaksi. Presensi Guru Masuk/Pulang/Dinas Out.'
    },
    {
      nama: '5. Log_Minyak_Jelantah',
      key: 'ID Transaksi (UNIQUEID)',
      label: 'N/A (Log Entry)',
      kolom: ['ID Transaksi (UNIQUEID)', 'Tanggal & Waktu (NOW)', 'NIS (Ref -> Data_Master_Siswa, Scannable)', 'Jumlah Liter', 'Petugas'],
      tipe: 'Program Eco-School. Penyetoran minyak jelantah oleh siswa.'
    },
    {
      nama: '6. Log_Pelanggaran',
      key: 'ID Pelanggaran (UNIQUEID)',
      label: 'N/A (Log Entry)',
      kolom: ['ID Pelanggaran (UNIQUEID)', 'Tanggal & Waktu (NOW)', 'NIS (Ref -> Data_Master_Siswa, Scannable)', 'Jenis Pelanggaran', 'Poin', 'Foto Bukti', 'Petugas'],
      tipe: 'Catatan Kedisiplinan BK dengan bukti foto kamera.'
    },
    {
      nama: '7. Log_Masa_Haid',
      key: 'ID Catatan (UNIQUEID)',
      label: 'N/A (Log Entry)',
      kolom: ['ID Catatan (UNIQUEID)', 'Tanggal Mulai', 'Tanggal Selesai', 'NIS (Ref -> Data_Master_Siswa, Scannable)', 'Catatan'],
      tipe: 'Catatan Kesehatan Siswi & dispensasi jam pelajaran.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Spesifikasi Arsitektur Sistem & Struktur Database AppSheet
            </h2>
            <p className="text-xs text-slate-400">
              Dokumentasi teknis pembuatan tabel Google Sheets, penentuan tipe data, dan aturan integrasi domain sekolah.
            </p>
          </div>
          <span className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full font-mono">
            Full Blueprint Specs
          </span>
        </div>
      </div>

      {/* Core Architectural Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>1. Mandatory Text Primary Keys</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Semua kunci utama (<code className="text-emerald-300">NIS</code> pada Siswa & <code className="text-emerald-300">NIP</code> pada Guru) wajib bertipe <strong className="text-white">Text</strong> di Google Sheets & AppSheet agar angka 0 di depan digit tidak hilang.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-blue-400 font-semibold text-xs">
            <QrCode className="w-4 h-4" />
            <span>2. Scannable Ref Columns</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Kolom <code className="text-blue-300">NIS/NIP</code> pada 5 tabel Log/Transaksi bertipe <strong className="text-white">Ref</strong> ke tabel Master dan dicentang properti <strong className="text-white">Scannable</strong> agar kamera HP langsung membuka pemindai QR Code.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
            <Lock className="w-4 h-4" />
            <span>3. Domain Auth @belajar.id</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Autentikasi diatur menggunakan Google Workspace / akun <strong className="text-white font-mono">@...belajar.id</strong> dengan Security Filter: <code className="text-amber-300">ENDSWITH(USEREMAIL(), ".belajar.id")</code>.
          </p>
        </div>
      </div>

      {/* Detailed Module Specs List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Database className="w-4 h-4 text-emerald-400" />
          Rincian 7 Struktur Tabel Google Sheets & Modul AppSheet
        </h3>

        <div className="space-y-4">
          {schemaModules.map((mod, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center text-xs font-mono font-bold">
                    {idx + 1}
                  </span>
                  {mod.nama}
                </h4>
                <div className="flex items-center space-x-2 text-[11px]">
                  <span className="bg-slate-900 text-emerald-300 px-2 py-0.5 rounded border border-slate-800 font-mono">
                    Key: {mod.key}
                  </span>
                  {mod.label !== 'N/A (Log Entry)' && (
                    <span className="bg-slate-900 text-blue-300 px-2 py-0.5 rounded border border-slate-800 font-mono">
                      Label: {mod.label}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {mod.kolom.map((col, cIdx) => (
                  <span key={cIdx} className="px-2.5 py-1 bg-slate-900 text-slate-200 border border-slate-800 rounded text-xs font-mono">
                    {col}
                  </span>
                ))}
              </div>

              <p className="text-xs text-slate-400 italic">
                {mod.tipe}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
