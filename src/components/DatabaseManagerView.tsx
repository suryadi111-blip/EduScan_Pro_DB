import React, { useState } from 'react';
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
  Plus, 
  QrCode, 
  Search, 
  UserCheck, 
  Users, 
  Droplet, 
  AlertOctagon, 
  CalendarHeart,
  CheckCircle2,
  X,
  Camera,
  Layers,
  Sparkles
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface DatabaseManagerViewProps {
  siswaList: Siswa[];
  setSiswaList: React.Dispatch<React.SetStateAction<Siswa[]>>;
  guruList: Guru[];
  setGuruList: React.Dispatch<React.SetStateAction<Guru[]>>;
  logAbsensiSiswa: LogAbsensiSiswa[];
  setLogAbsensiSiswa: React.Dispatch<React.SetStateAction<LogAbsensiSiswa[]>>;
  logAbsensiGuru: LogAbsensiGuru[];
  setLogAbsensiGuru: React.Dispatch<React.SetStateAction<LogAbsensiGuru[]>>;
  logJelantah: LogMinyakJelantah[];
  setLogJelantah: React.Dispatch<React.SetStateAction<LogMinyakJelantah[]>>;
  logPelanggaran: LogPelanggaran[];
  setLogPelanggaran: React.Dispatch<React.SetStateAction<LogPelanggaran[]>>;
  logHaid: LogMasaHaid[];
  setLogHaid: React.Dispatch<React.SetStateAction<LogMasaHaid[]>>;
}

type SelectedTable = 
  | 'siswa' 
  | 'guru' 
  | 'absen_siswa' 
  | 'absen_guru' 
  | 'jelantah' 
  | 'pelanggaran' 
  | 'haid';

export const DatabaseManagerView: React.FC<DatabaseManagerViewProps> = ({
  siswaList, setSiswaList,
  guruList, setGuruList,
  logAbsensiSiswa, setLogAbsensiSiswa,
  logAbsensiGuru, setLogAbsensiGuru,
  logJelantah, setLogJelantah,
  logPelanggaran, setLogPelanggaran,
  logHaid, setLogHaid
}) => {
  const [activeTable, setActiveTable] = useState<SelectedTable>('siswa');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [qrScanSimulating, setQrScanSimulating] = useState(false);

  // Form states for adding new record
  const [newSiswa, setNewSiswa] = useState<Partial<Siswa>>({ jenisKelamin: 'L', kelas: '7-A' });
  const [newGuru, setNewGuru] = useState<Partial<Guru>>({});
  const [selectedNisRef, setSelectedNisRef] = useState<string>('');
  const [selectedNipRef, setSelectedNipRef] = useState<string>('');
  
  // Specific log fields
  const [absenSiswaStatus, setAbsenSiswaStatus] = useState<'Hadir' | 'Izin' | 'Sakit' | 'Alpa'>('Hadir');
  const [absenGuruTipe, setAbsenGuruTipe] = useState<'Masuk' | 'Pulang' | 'Dinas Out'>('Masuk');
  const [jelantahLiter, setJelantahLiter] = useState<number>(2.0);
  const [jelantahPetugas, setJelantahPetugas] = useState<string>('Pak Bambang (Pembina OSIS)');
  const [pelanggaranJenis, setPelanggaranJenis] = useState<string>('Terlambat Masuk Sekolah');
  const [pelanggaranPoin, setPelanggaranPoin] = useState<number>(5);
  const [pelanggaranPetugas, setPelanggaranPetugas] = useState<string>('Tim BK');
  const [haidTglMulai, setHaidTglMulai] = useState<string>(new Date().toISOString().split('T')[0]);
  const [haidCatatan, setHaidCatatan] = useState<string>('Dispensasi Istirahat UKS');

  // Trigger simulated QR scan
  const handleSimulateQRScan = (scannedCode: string) => {
    setQrScanSimulating(true);
    setTimeout(() => {
      // Find if student or teacher
      const s = siswaList.find(item => item.nis === scannedCode);
      const g = guruList.find(item => item.nip === scannedCode);
      
      if (s) {
        setSelectedNisRef(s.nis);
      } else if (g) {
        setSelectedNipRef(g.nip);
      }
      setQrScanSimulating(false);
    }, 600);
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toTimeString().split(' ')[0];
    const nowStr = `${todayStr} ${timeStr}`;

    if (activeTable === 'siswa') {
      if (!newSiswa.nis || !newSiswa.nama) return alert('NIS dan Nama Siswa wajib diisi');
      setSiswaList(prev => [...prev, {
        nis: String(newSiswa.nis),
        nama: String(newSiswa.nama),
        kelas: String(newSiswa.kelas || '7-A'),
        jenisKelamin: (newSiswa.jenisKelamin as 'L' | 'P') || 'L',
        noHp: String(newSiswa.noHp || '')
      }]);
    } else if (activeTable === 'guru') {
      if (!newGuru.nip || !newGuru.nama) return alert('NIP dan Nama Guru wajib diisi');
      setGuruList(prev => [...prev, {
        nip: String(newGuru.nip),
        nama: String(newGuru.nama),
        jabatan: String(newGuru.jabatan || 'Guru Mata Pelajaran'),
        noHp: String(newGuru.noHp || '')
      }]);
    } else if (activeTable === 'absen_siswa') {
      const siswa = siswaList.find(s => s.nis === selectedNisRef);
      if (!siswa) return alert('Pilih/Scan NIS Siswa terlebih dahulu');
      setLogAbsensiSiswa(prev => [{
        idAbsen: `ABS-S-${Math.floor(100 + Math.random() * 900)}`,
        tanggal: todayStr,
        nis: siswa.nis,
        namaSiswa: siswa.nama,
        kelas: siswa.kelas,
        status: absenSiswaStatus,
        waktuScan: timeStr
      }, ...prev]);
    } else if (activeTable === 'absen_guru') {
      const guru = guruList.find(g => g.nip === selectedNipRef);
      if (!guru) return alert('Pilih/Scan NIP Guru terlebih dahulu');
      setLogAbsensiGuru(prev => [{
        idAbsen: `ABS-G-${Math.floor(100 + Math.random() * 900)}`,
        tanggal: todayStr,
        nip: guru.nip,
        namaGuru: guru.nama,
        tipeAbsen: absenGuruTipe,
        waktuScan: timeStr
      }, ...prev]);
    } else if (activeTable === 'jelantah') {
      const siswa = siswaList.find(s => s.nis === selectedNisRef);
      if (!siswa) return alert('Pilih/Scan NIS Siswa terlebih dahulu');
      setLogJelantah(prev => [{
        idTransaksi: `JEL-${Math.floor(100 + Math.random() * 900)}`,
        tanggalWaktu: nowStr,
        nis: siswa.nis,
        namaSiswa: siswa.nama,
        kelas: siswa.kelas,
        jumlahLiter: Number(jelantahLiter),
        petugas: jelantahPetugas
      }, ...prev]);
    } else if (activeTable === 'pelanggaran') {
      const siswa = siswaList.find(s => s.nis === selectedNisRef);
      if (!siswa) return alert('Pilih/Scan NIS Siswa terlebih dahulu');
      setLogPelanggaran(prev => [{
        idPelanggaran: `PLG-${Math.floor(100 + Math.random() * 900)}`,
        tanggalWaktu: nowStr,
        nis: siswa.nis,
        namaSiswa: siswa.nama,
        kelas: siswa.kelas,
        jenisPelanggaran: pelanggaranJenis,
        poin: Number(pelanggaranPoin),
        petugas: pelanggaranPetugas
      }, ...prev]);
    } else if (activeTable === 'haid') {
      const siswi = siswaList.find(s => s.nis === selectedNisRef);
      if (!siswi) return alert('Pilih NIS Siswi terlebih dahulu');
      setLogHaid(prev => [{
        idCatatan: `HAD-${Math.floor(100 + Math.random() * 900)}`,
        tanggalMulai: haidTglMulai,
        tanggalSelesai: '',
        nis: siswi.nis,
        namaSiswa: siswi.nama,
        catatan: haidCatatan
      }, ...prev]);
    }

    setShowModal(false);
  };

  const tablesNav = [
    { id: 'siswa' as SelectedTable, label: '1. Data_Master_Siswa', icon: Users, count: siswaList.length },
    { id: 'guru' as SelectedTable, label: '2. Data_Master_Guru', icon: Users, count: guruList.length },
    { id: 'absen_siswa' as SelectedTable, label: '3. Log_Absensi_Siswa', icon: UserCheck, count: logAbsensiSiswa.length },
    { id: 'absen_guru' as SelectedTable, label: '4. Log_Absensi_Guru', icon: UserCheck, count: logAbsensiGuru.length },
    { id: 'jelantah' as SelectedTable, label: '5. Log_Minyak_Jelantah', icon: Droplet, count: logJelantah.length },
    { id: 'pelanggaran' as SelectedTable, label: '6. Log_Pelanggaran', icon: AlertOctagon, count: logPelanggaran.length },
    { id: 'haid' as SelectedTable, label: '7. Log_Masa_Haid', icon: CalendarHeart, count: logHaid.length },
  ];

  return (
    <div className="space-y-6">
      {/* Top Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Kelola Database 7 Modul & Simulator Scan QR
            </h2>
            <p className="text-xs text-slate-400">
              Sesuai spesifikasi: NIS/NIP ber-tipe Text (Primary Key), Log ber-tipe Ref & Scannable
            </p>
          </div>

          <button
            onClick={() => {
              setShowModal(true);
              if (siswaList.length > 0) setSelectedNisRef(siswaList[0].nis);
              if (guruList.length > 0) setSelectedNipRef(guruList[0].nip);
            }}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Entry / Scan QR Baru</span>
          </button>
        </div>

        {/* Horizontal Sub-tabs */}
        <div className="flex space-x-2 overflow-x-auto mt-4 pt-3 border-t border-slate-800 no-scrollbar">
          {tablesNav.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTable === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTable(tab.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-slate-950 text-slate-300 rounded-full font-mono">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        {/* Search Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari NIS, NIP, Nama Siswa/Guru..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <span className="text-xs text-slate-400">
            Menampilkan tabel <span className="text-emerald-400 font-mono font-bold">{activeTable}</span>
          </span>
        </div>

        {/* Table 1: Data Master Siswa */}
        {activeTable === 'siswa' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800 text-slate-300 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l">NIS (Primary Key / Text)</th>
                  <th className="px-4 py-3">Nama Siswa (Label / Text)</th>
                  <th className="px-4 py-3">Kelas</th>
                  <th className="px-4 py-3">Jenis Kelamin</th>
                  <th className="px-4 py-3">No HP</th>
                  <th className="px-4 py-3 rounded-r text-center">Preview QR Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {siswaList
                  .filter(s => s.nis.includes(searchTerm) || s.nama.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((siswa) => (
                    <tr key={siswa.nis} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 font-mono text-emerald-400 font-semibold">{siswa.nis}</td>
                      <td className="px-4 py-3 font-medium text-white">{siswa.nama}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-slate-800 rounded text-slate-300">{siswa.kelas}</span></td>
                      <td className="px-4 py-3">{siswa.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                      <td className="px-4 py-3 font-mono text-slate-400">{siswa.noHp}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-block p-1 bg-white rounded shadow-sm">
                          <QRCodeSVG value={siswa.nis} size={36} />
                        </div>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table 2: Data Master Guru */}
        {activeTable === 'guru' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800 text-slate-300 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l">NIP (Primary Key / Text)</th>
                  <th className="px-4 py-3">Nama Guru (Label / Text)</th>
                  <th className="px-4 py-3">Jabatan / Mapel</th>
                  <th className="px-4 py-3">No HP</th>
                  <th className="px-4 py-3 rounded-r text-center">Preview QR Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {guruList
                  .filter(g => g.nip.includes(searchTerm) || g.nama.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((guru) => (
                    <tr key={guru.nip} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 font-mono text-blue-400 font-semibold">{guru.nip}</td>
                      <td className="px-4 py-3 font-medium text-white">{guru.nama}</td>
                      <td className="px-4 py-3 text-slate-300">{guru.jabatan}</td>
                      <td className="px-4 py-3 font-mono text-slate-400">{guru.noHp}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-block p-1 bg-white rounded shadow-sm">
                          <QRCodeSVG value={guru.nip} size={36} />
                        </div>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table 3: Log Absensi Siswa */}
        {activeTable === 'absen_siswa' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800 text-slate-300 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l">ID Absen (UNIQUEID)</th>
                  <th className="px-4 py-3">Tanggal (TODAY)</th>
                  <th className="px-4 py-3">NIS (Ref -&gt; Master Siswa, Scannable)</th>
                  <th className="px-4 py-3">Nama Siswa</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r">Waktu Scan (TIMENOW)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {logAbsensiSiswa.map((item) => (
                  <tr key={item.idAbsen} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-mono text-slate-400">{item.idAbsen}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">{item.tanggal}</td>
                    <td className="px-4 py-3 font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-slate-400" />
                      {item.nis}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">{item.namaSiswa}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                        item.status === 'Hadir' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        item.status === 'Izin' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        item.status === 'Sakit' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400">{item.waktuScan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table 4: Log Absensi Guru */}
        {activeTable === 'absen_guru' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800 text-slate-300 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l">ID Absen (UNIQUEID)</th>
                  <th className="px-4 py-3">Tanggal (TODAY)</th>
                  <th className="px-4 py-3">NIP (Ref -&gt; Master Guru, Scannable)</th>
                  <th className="px-4 py-3">Nama Guru</th>
                  <th className="px-4 py-3">Tipe Absen</th>
                  <th className="px-4 py-3 rounded-r">Waktu Scan (TIMENOW)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {logAbsensiGuru.map((item) => (
                  <tr key={item.idAbsen} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-mono text-slate-400">{item.idAbsen}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">{item.tanggal}</td>
                    <td className="px-4 py-3 font-mono text-blue-400 font-semibold flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-slate-400" />
                      {item.nip}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">{item.namaGuru}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
                        {item.tipeAbsen}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400">{item.waktuScan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table 5: Log Minyak Jelantah */}
        {activeTable === 'jelantah' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800 text-slate-300 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l">ID Transaksi (UNIQUEID)</th>
                  <th className="px-4 py-3">Tanggal & Waktu (NOW)</th>
                  <th className="px-4 py-3">NIS (Ref -&gt; Master Siswa, Scannable)</th>
                  <th className="px-4 py-3">Nama Siswa / Kelas</th>
                  <th className="px-4 py-3">Jumlah Liter</th>
                  <th className="px-4 py-3 rounded-r">Petugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {logJelantah.map((item) => (
                  <tr key={item.idTransaksi} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-mono text-slate-400">{item.idTransaksi}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">{item.tanggalWaktu}</td>
                    <td className="px-4 py-3 font-mono text-emerald-400 font-semibold">{item.nis}</td>
                    <td className="px-4 py-3 font-medium text-white">{item.namaSiswa} ({item.kelas})</td>
                    <td className="px-4 py-3 font-bold text-amber-400">{item.jumlahLiter} Liter</td>
                    <td className="px-4 py-3 text-slate-400">{item.petugas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table 6: Log Pelanggaran */}
        {activeTable === 'pelanggaran' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800 text-slate-300 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l">ID Pelanggaran</th>
                  <th className="px-4 py-3">Tanggal & Waktu</th>
                  <th className="px-4 py-3">NIS (Ref, Scannable)</th>
                  <th className="px-4 py-3">Nama Siswa</th>
                  <th className="px-4 py-3">Jenis Pelanggaran</th>
                  <th className="px-4 py-3">Poin</th>
                  <th className="px-4 py-3 rounded-r">Petugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {logPelanggaran.map((item) => (
                  <tr key={item.idPelanggaran} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-mono text-slate-400">{item.idPelanggaran}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">{item.tanggalWaktu}</td>
                    <td className="px-4 py-3 font-mono text-emerald-400 font-semibold">{item.nis}</td>
                    <td className="px-4 py-3 font-medium text-white">{item.namaSiswa} ({item.kelas})</td>
                    <td className="px-4 py-3 text-rose-300 font-medium">{item.jenisPelanggaran}</td>
                    <td className="px-4 py-3 font-bold text-rose-500">+{item.poin} Poin</td>
                    <td className="px-4 py-3 text-slate-400">{item.petugas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table 7: Log Masa Haid */}
        {activeTable === 'haid' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800 text-slate-300 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l">ID Catatan</th>
                  <th className="px-4 py-3">NIS (Ref Siswi)</th>
                  <th className="px-4 py-3">Nama Siswi</th>
                  <th className="px-4 py-3">Tanggal Mulai</th>
                  <th className="px-4 py-3">Tanggal Selesai</th>
                  <th className="px-4 py-3 rounded-r">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {logHaid.map((item) => (
                  <tr key={item.idCatatan} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-mono text-slate-400">{item.idCatatan}</td>
                    <td className="px-4 py-3 font-mono text-emerald-400 font-semibold">{item.nis}</td>
                    <td className="px-4 py-3 font-medium text-white">{item.namaSiswa}</td>
                    <td className="px-4 py-3 font-mono text-pink-300">{item.tanggalMulai}</td>
                    <td className="px-4 py-3 font-mono text-slate-400">{item.tanggalSelesai || 'Aktif'}</td>
                    <td className="px-4 py-3 text-slate-300 italic">{item.catatan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL SIMULATOR ENTRY / SCAN QR */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4 relative text-white">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold">Simulator Input Data / Scan QR Code AppSheet</h3>
            </div>

            {/* Simulated QR Reader Header */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-400" /> Simulated Camera Scanner (Ref Scannable)
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Pilih salah satu NIS/NIP untuk menyimulasikan hasil pemindaian kamera QR Code HP AppSheet:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {siswaList.slice(0, 5).map(s => (
                  <button
                    key={s.nis}
                    type="button"
                    onClick={() => handleSimulateQRScan(s.nis)}
                    className="px-2 py-1 bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-300 text-[11px] font-mono rounded border border-slate-700 transition"
                  >
                    Scan NIS: {s.nis} ({s.nama.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateRecord} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Target Tabel AppSheet:</label>
                <select
                  value={activeTable}
                  onChange={(e) => setActiveTable(e.target.value as SelectedTable)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="siswa">Data_Master_Siswa</option>
                  <option value="guru">Data_Master_Guru</option>
                  <option value="absen_siswa">Log_Absensi_Siswa (Ref Scannable)</option>
                  <option value="absen_guru">Log_Absensi_Guru (Ref Scannable)</option>
                  <option value="jelantah">Log_Minyak_Jelantah (Ref Scannable)</option>
                  <option value="pelanggaran">Log_Pelanggaran (Ref Scannable)</option>
                  <option value="haid">Log_Masa_Haid (Ref Siswi)</option>
                </select>
              </div>

              {/* Dynamic form inputs based on activeTable */}
              {activeTable === 'siswa' && (
                <>
                  <div>
                    <label className="block text-slate-300 mb-1">NIS (Primary Key / Text):</label>
                    <input
                      type="text"
                      placeholder="Contoh: 2024011"
                      value={newSiswa.nis || ''}
                      onChange={(e) => setNewSiswa({ ...newSiswa, nis: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Nama Siswa (Label):</label>
                    <input
                      type="text"
                      placeholder="Nama Lengkap Siswa"
                      value={newSiswa.nama || ''}
                      onChange={(e) => setNewSiswa({ ...newSiswa, nama: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-300 mb-1">Kelas:</label>
                      <input
                        type="text"
                        placeholder="7-A"
                        value={newSiswa.kelas || ''}
                        onChange={(e) => setNewSiswa({ ...newSiswa, kelas: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Jenis Kelamin:</label>
                      <select
                        value={newSiswa.jenisKelamin || 'L'}
                        onChange={(e) => setNewSiswa({ ...newSiswa, jenisKelamin: e.target.value as 'L' | 'P' })}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                      >
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {activeTable === 'absen_siswa' && (
                <>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold text-emerald-400">
                      Hasil Scan NIS (Ref &rarr; Master Siswa):
                    </label>
                    <select
                      value={selectedNisRef}
                      onChange={(e) => setSelectedNisRef(e.target.value)}
                      className="w-full bg-slate-800 border border-emerald-500 rounded p-2 text-white font-mono"
                    >
                      {siswaList.map(s => (
                        <option key={s.nis} value={s.nis}>
                          {s.nis} - {s.nama} ({s.kelas})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Status Presensi:</label>
                    <select
                      value={absenSiswaStatus}
                      onChange={(e) => setAbsenSiswaStatus(e.target.value as any)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                    >
                      <option value="Hadir">Hadir</option>
                      <option value="Izin">Izin</option>
                      <option value="Sakit">Sakit</option>
                      <option value="Alpa">Alpa</option>
                    </select>
                  </div>
                </>
              )}

              {activeTable === 'jelantah' && (
                <>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold text-amber-400">
                      Hasil Scan NIS Siswa:
                    </label>
                    <select
                      value={selectedNisRef}
                      onChange={(e) => setSelectedNisRef(e.target.value)}
                      className="w-full bg-slate-800 border border-amber-500 rounded p-2 text-white font-mono"
                    >
                      {siswaList.map(s => (
                        <option key={s.nis} value={s.nis}>
                          {s.nis} - {s.nama} ({s.kelas})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Jumlah Minyak Jelantah (Liter):</label>
                    <input
                      type="number"
                      step="0.5"
                      value={jelantahLiter}
                      onChange={(e) => setJelantahLiter(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-bold"
                    />
                  </div>
                </>
              )}

              {activeTable === 'pelanggaran' && (
                <>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold text-rose-400">
                      Hasil Scan NIS Siswa:
                    </label>
                    <select
                      value={selectedNisRef}
                      onChange={(e) => setSelectedNisRef(e.target.value)}
                      className="w-full bg-slate-800 border border-rose-500 rounded p-2 text-white font-mono"
                    >
                      {siswaList.map(s => (
                        <option key={s.nis} value={s.nis}>
                          {s.nis} - {s.nama} ({s.kelas})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Jenis Pelanggaran:</label>
                    <input
                      type="text"
                      value={pelanggaranJenis}
                      onChange={(e) => setPelanggaranJenis(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-300 mb-1">Poin Pelanggaran:</label>
                      <input
                        type="number"
                        value={pelanggaranPoin}
                        onChange={(e) => setPelanggaranPoin(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Petugas BK:</label>
                      <input
                        type="text"
                        value={pelanggaranPetugas}
                        onChange={(e) => setPelanggaranPetugas(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md"
                >
                  Simpan Record AppSheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
