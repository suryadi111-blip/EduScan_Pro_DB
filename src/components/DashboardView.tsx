import React from 'react';
import { 
  Siswa, 
  Guru, 
  LogAbsensiSiswa, 
  LogAbsensiGuru, 
  LogMinyakJelantah, 
  LogPelanggaran, 
  LogMasaHaid 
} from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Users, 
  UserCheck, 
  Droplet, 
  AlertOctagon, 
  CalendarHeart, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet
} from 'lucide-react';

interface DashboardViewProps {
  siswaList: Siswa[];
  guruList: Guru[];
  logAbsensiSiswa: LogAbsensiSiswa[];
  logAbsensiGuru: LogAbsensiGuru[];
  logJelantah: LogMinyakJelantah[];
  logPelanggaran: LogPelanggaran[];
  logHaid: LogMasaHaid[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  siswaList,
  guruList,
  logAbsensiSiswa,
  logAbsensiGuru,
  logJelantah,
  logPelanggaran,
  logHaid
}) => {
  // Metrics calculation
  const totalSiswa = siswaList.length;
  const totalGuru = guruList.length;
  const totalHadirSiswa = logAbsensiSiswa.filter(a => a.status === 'Hadir').length;
  const totalHadirGuru = logAbsensiGuru.filter(a => a.tipeAbsen === 'Masuk').length;
  const totalLiterJelantah = logJelantah.reduce((acc, item) => acc + item.jumlahLiter, 0);
  const totalPelanggaran = logPelanggaran.length;
  const totalPoinPelanggaran = logPelanggaran.reduce((acc, item) => acc + item.poin, 0);
  const totalSiswiHaid = logHaid.length;

  // Pie chart data for student attendance status
  const absensiSiswaStatusCount = {
    Hadir: logAbsensiSiswa.filter(a => a.status === 'Hadir').length,
    Izin: logAbsensiSiswa.filter(a => a.status === 'Izin').length,
    Sakit: logAbsensiSiswa.filter(a => a.status === 'Sakit').length,
    Alpa: logAbsensiSiswa.filter(a => a.status === 'Alpa').length,
  };

  const pieAbsensiData = [
    { name: 'Hadir', value: absensiSiswaStatusCount.Hadir, color: '#10b981' },
    { name: 'Izin', value: absensiSiswaStatusCount.Izin, color: '#3b82f6' },
    { name: 'Sakit', value: absensiSiswaStatusCount.Sakit, color: '#f59e0b' },
    { name: 'Alpa', value: absensiSiswaStatusCount.Alpa, color: '#ef4444' },
  ].filter(d => d.value > 0);

  // Class infractions data
  const pelanggaranPerKelasMap: Record<string, number> = {};
  logPelanggaran.forEach(p => {
    const kls = p.kelas || 'Lainnya';
    pelanggaranPerKelasMap[kls] = (pelanggaranPerKelasMap[kls] || 0) + p.poin;
  });

  const barPelanggaranData = Object.keys(pelanggaranPerKelasMap).map(kls => ({
    kelas: kls,
    poin: pelanggaranPerKelasMap[kls]
  }));

  // Minyak Jelantah per Siswa/Kelas Data
  const jelantahBarData = logJelantah.map(j => ({
    nama: j.namaSiswa || j.nis,
    liter: j.jumlahLiter
  }));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Presensi Siswa */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Presensi Siswa</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{totalHadirSiswa} / {totalSiswa}</span>
            <span className="text-xs font-medium text-emerald-400">
              ({totalSiswa > 0 ? Math.round((totalHadirSiswa / totalSiswa) * 100) : 0}%)
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Siswa Hadir Scan QR Hari Ini</p>
        </div>

        {/* Card 2: Presensi Guru */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Presensi Guru</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{totalHadirGuru} / {totalGuru}</span>
            <span className="text-xs font-medium text-blue-400">
              ({totalGuru > 0 ? Math.round((totalHadirGuru / totalGuru) * 100) : 0}%)
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Guru/Tenaga Pendidik Masuk</p>
        </div>

        {/* Card 3: Minyak Jelantah */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Minyak Jelantah</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Droplet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{totalLiterJelantah} Liter</span>
            <span className="text-xs font-medium text-amber-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Eco Program
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Total Minyak Jelantah Setoran Siswa</p>
        </div>

        {/* Card 4: Pelanggaran & Poin */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Log Pelanggaran</span>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{totalPelanggaran} Kasus</span>
            <span className="text-xs font-medium text-rose-400">({totalPoinPelanggaran} Total Poin)</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Catatan BK & Kedisiplinan</p>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Status Absensi Siswa */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Distribusi Absensi Siswa</h3>
              <p className="text-xs text-slate-400">Berdasarkan data Log_Absensi_Siswa hari ini</p>
            </div>
            <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2.5 py-1 rounded">TODAY()</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieAbsensiData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieAbsensiData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Poin Pelanggaran per Kelas */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Aktivitas Poin Pelanggaran per Kelas</h3>
              <p className="text-xs text-slate-400">Grafik akumulasi poin dari Log_Pelanggaran</p>
            </div>
            <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2.5 py-1 rounded">Log_Pelanggaran</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barPelanggaranData}>
                <XAxis dataKey="kelas" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                />
                <Bar dataKey="poin" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Total Poin" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Tables & Health Tracking Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Minyak Jelantah Top Contributors */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Droplet className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-semibold text-white">Log Setoran Minyak Jelantah Terbaru</h3>
            </div>
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
              Eco-School
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800 text-slate-300 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-3 py-2 rounded-l">Tanggal & Waktu</th>
                  <th className="px-3 py-2">Siswa / Kelas</th>
                  <th className="px-3 py-2">Jumlah</th>
                  <th className="px-3 py-2 rounded-r">Petugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {logJelantah.slice(0, 4).map((j) => (
                  <tr key={j.idTransaksi} className="hover:bg-slate-800/40 transition">
                    <td className="px-3 py-2.5 font-mono text-slate-400">{j.tanggalWaktu}</td>
                    <td className="px-3 py-2.5 font-medium text-white">{j.namaSiswa} <span className="text-slate-400 font-normal">({j.kelas})</span></td>
                    <td className="px-3 py-2.5 font-bold text-amber-400">{j.jumlahLiter} Liter</td>
                    <td className="px-3 py-2.5 text-slate-400">{j.petugas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Log Masa Haid Siswi */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <CalendarHeart className="w-5 h-5 text-pink-400" />
              <h3 className="text-base font-semibold text-white">Log Masa Haid Siswi (Kesehatan)</h3>
            </div>
            <span className="text-xs bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full">
              Kesehatan Siswi
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800 text-slate-300 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-3 py-2 rounded-l">Nama Siswi</th>
                  <th className="px-3 py-2">Tgl Mulai</th>
                  <th className="px-3 py-2">Tgl Selesai</th>
                  <th className="px-3 py-2 rounded-r">Catatan / Dispensasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {logHaid.map((h) => (
                  <tr key={h.idCatatan} className="hover:bg-slate-800/40 transition">
                    <td className="px-3 py-2.5 font-medium text-white">{h.namaSiswa}</td>
                    <td className="px-3 py-2.5 font-mono text-pink-300">{h.tanggalMulai}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-400">{h.tanggalSelesai || 'Aktif (Berjalan)'}</td>
                    <td className="px-3 py-2.5 text-slate-300 italic">{h.catatan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
