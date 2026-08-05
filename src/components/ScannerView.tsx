import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
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
  Camera, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  UserCheck, 
  Droplet, 
  AlertOctagon, 
  CalendarHeart, 
  Search, 
  Zap, 
  Volume2, 
  History,
  QrCode,
  Sparkles,
  Shield,
  RefreshCw
} from 'lucide-react';

interface ScannerViewProps {
  siswaList: Siswa[];
  guruList: Guru[];
  onAddAbsensiSiswa: (entry: LogAbsensiSiswa) => void;
  onAddAbsensiGuru: (entry: LogAbsensiGuru) => void;
  onAddJelantah: (entry: LogMinyakJelantah) => void;
  onAddPelanggaran: (entry: LogPelanggaran) => void;
  onAddHaid: (entry: LogMasaHaid) => void;
}

type ScanModuleMode = 'absensi_siswa' | 'absensi_guru' | 'jelantah' | 'pelanggaran' | 'haid';
type InputMode = 'camera' | 'upload' | 'manual';

export const ScannerView: React.FC<ScannerViewProps> = ({
  siswaList,
  guruList,
  onAddAbsensiSiswa,
  onAddAbsensiGuru,
  onAddJelantah,
  onAddPelanggaran,
  onAddHaid
}) => {
  const [activeModule, setActiveModule] = useState<ScanModuleMode>('absensi_siswa');
  const [inputMode, setInputMode] = useState<InputMode>('camera');
  
  // Camera state
  const [isCameraScanning, setIsCameraScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Module parameter inputs
  const [siswaStatus, setSiswaStatus] = useState<'Hadir' | 'Izin' | 'Sakit' | 'Alpa'>('Hadir');
  const [guruTipe, setGuruTipe] = useState<'Masuk' | 'Pulang' | 'Dinas Out'>('Masuk');
  const [jumlahLiter, setJumlahLiter] = useState<number>(2.5);
  const [jenisPelanggaran, setJenisPelanggaran] = useState<string>('Atribut Tidak Lengkap');
  const [poinPelanggaran, setPoinPelanggaran] = useState<number>(10);
  const [catatanHaid, setCatatanHaid] = useState<string>('Haid Hari ke-1 (Dispensasi Sholat)');
  const [petugasName, setPetugasName] = useState<string>('Suryadi, S.Pd (Operator)');

  // Manual search/simulator input
  const [searchTerm, setSearchTerm] = useState('');
  
  // Scan result feedback
  const [lastScannedResult, setLastScannedResult] = useState<{
    id: string;
    nama: string;
    detail: string;
    tipe: string;
    waktu: string;
  } | null>(null);
  const [scanHistory, setScanHistory] = useState<Array<{
    id: string;
    nama: string;
    detail: string;
    waktu: string;
  }>>([]);

  // Audio feedback synthesizer
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio context fallbacks
    }
  };

  // Start QR Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop().catch(() => {});
      }
      
      const html5Qrcode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5Qrcode;

      await html5Qrcode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScannedCode(decodedText);
        },
        () => {
          // Ignore frame decode errors
        }
      );
      setIsCameraScanning(true);
    } catch (err: unknown) {
      console.error('Camera start error:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setCameraError(
        'Kamera tidak dapat diakses atau diblokir oleh peramban. Anda dapat menggunakan tab "Simulasi Scan" atau "Upload Gambar QR". Error: ' + errMsg
      );
      setIsCameraScanning(false);
    }
  };

  // Stop QR Camera
  const stopCamera = async () => {
    if (scannerRef.current && isCameraScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error('Error stopping camera:', err);
      }
      setIsCameraScanning(false);
    }
  };

  useEffect(() => {
    if (inputMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [inputMode]);

  // Handle uploaded QR code image
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const html5Qrcode = new Html5Qrcode('qr-file-decoder');
      const result = await html5Qrcode.scanFile(file, true);
      handleScannedCode(result);
    } catch (err) {
      console.error('Upload QR scan error:', err);
      alert('QR Code tidak terdeteksi pada gambar yang diunggah. Pastikan gambar jelas dan memiliki QR code valid.');
    }
  };

  // Process decoded text (NIS or NIP or JSON string)
  const handleScannedCode = (rawCode: string) => {
    playBeep();
    const cleanCode = rawCode.trim();
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateToday = new Date().toISOString().split('T')[0];

    // Try finding student by NIS or Name
    const targetSiswa = siswaList.find(s => s.nis === cleanCode || s.nama.toLowerCase() === cleanCode.toLowerCase());
    // Try finding teacher by NIP or Name
    const targetGuru = guruList.find(g => g.nip === cleanCode || g.nama.toLowerCase() === cleanCode.toLowerCase());

    if (activeModule === 'absensi_siswa') {
      const nis = targetSiswa ? targetSiswa.nis : cleanCode;
      const nama = targetSiswa ? targetSiswa.nama : `Siswa (${cleanCode})`;
      const kelas = targetSiswa ? targetSiswa.kelas : 'X-A';

      const newRecord: LogAbsensiSiswa = {
        idAbsen: 'ABS-' + Math.floor(100000 + Math.random() * 900000),
        tanggal: dateToday,
        nis,
        namaSiswa: nama,
        kelas,
        status: siswaStatus,
        waktuScan: timeNow
      };

      onAddAbsensiSiswa(newRecord);
      showSuccessFeedback(nama, `Absensi Siswa: ${siswaStatus} (${kelas})`, 'Presensi Siswa');
    } else if (activeModule === 'absensi_guru') {
      const nip = targetGuru ? targetGuru.nip : cleanCode;
      const nama = targetGuru ? targetGuru.nama : `Guru (${cleanCode})`;

      const newRecord: LogAbsensiGuru = {
        idAbsen: 'ABG-' + Math.floor(100000 + Math.random() * 900000),
        tanggal: dateToday,
        nip,
        namaGuru: nama,
        tipeAbsen: guruTipe,
        waktuScan: timeNow
      };

      onAddAbsensiGuru(newRecord);
      showSuccessFeedback(nama, `Absensi Guru: ${guruTipe}`, 'Presensi Guru');
    } else if (activeModule === 'jelantah') {
      const nis = targetSiswa ? targetSiswa.nis : cleanCode;
      const nama = targetSiswa ? targetSiswa.nama : `Siswa (${cleanCode})`;
      const kelas = targetSiswa ? targetSiswa.kelas : 'X-A';

      const newRecord: LogMinyakJelantah = {
        idTransaksi: 'JEL-' + Math.floor(100000 + Math.random() * 900000),
        tanggalWaktu: `${dateToday} ${timeNow}`,
        nis,
        namaSiswa: nama,
        kelas,
        jumlahLiter,
        petugas: petugasName
      };

      onAddJelantah(newRecord);
      showSuccessFeedback(nama, `Setoran Jelantah: +${jumlahLiter} Liter`, 'Minyak Jelantah');
    } else if (activeModule === 'pelanggaran') {
      const nis = targetSiswa ? targetSiswa.nis : cleanCode;
      const nama = targetSiswa ? targetSiswa.nama : `Siswa (${cleanCode})`;
      const kelas = targetSiswa ? targetSiswa.kelas : 'X-A';

      const newRecord: LogPelanggaran = {
        idPelanggaran: 'PLG-' + Math.floor(100000 + Math.random() * 900000),
        tanggalWaktu: `${dateToday} ${timeNow}`,
        nis,
        namaSiswa: nama,
        kelas,
        jenisPelanggaran,
        poin: poinPelanggaran,
        petugas: petugasName
      };

      onAddPelanggaran(newRecord);
      showSuccessFeedback(nama, `Pelanggaran: ${jenisPelanggaran} (-${poinPelanggaran} pts)`, 'Disiplin BK');
    } else if (activeModule === 'haid') {
      const nis = targetSiswa ? targetSiswa.nis : cleanCode;
      const nama = targetSiswa ? targetSiswa.nama : `Siswi (${cleanCode})`;

      const newRecord: LogMasaHaid = {
        idCatatan: 'HAD-' + Math.floor(100000 + Math.random() * 900000),
        tanggalMulai: dateToday,
        tanggalSelesai: '',
        nis,
        namaSiswa: nama,
        catatan: catatanHaid
      };

      onAddHaid(newRecord);
      showSuccessFeedback(nama, `Catatan Haid: ${catatanHaid}`, 'Kesehatan Siswi');
    }
  };

  const showSuccessFeedback = (nama: string, detail: string, tipe: string) => {
    const waktu = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const res = { id: String(Date.now()), nama, detail, tipe, waktu };
    setLastScannedResult(res);
    setScanHistory(prev => [res, ...prev.slice(0, 9)]);
  };

  // Filter lists for simulator
  const filteredSiswa = siswaList.filter(s => 
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.nis.includes(searchTerm) ||
    s.kelas.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGuru = guruList.filter(g =>
    g.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.nip.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner / Header Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg">
              <QrCode className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">Aplikasi Pemindai & Engine Scan QR Code</h2>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold animate-pulse">
              Live Scanner Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pindai QR Kartu Siswa/Guru menggunakan Kamera Web, Upload File Gambar, atau Gunakan Simulator Quick-Scan.
          </p>
        </div>

        {/* Input Mode Selector */}
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 space-x-1">
          <button
            onClick={() => setInputMode('camera')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition ${
              inputMode === 'camera'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Kamera Live</span>
          </button>
          <button
            onClick={() => setInputMode('upload')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition ${
              inputMode === 'upload'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload File QR</span>
          </button>
          <button
            onClick={() => setInputMode('manual')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition ${
              inputMode === 'manual'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Simulasi Scan</span>
          </button>
        </div>
      </div>

      {/* Target Module Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
          Pilih Modul & Aksi Target Saat QR Terpindai:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <button
            onClick={() => setActiveModule('absensi_siswa')}
            className={`p-3 rounded-lg border text-left transition ${
              activeModule === 'absensi_siswa'
                ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold">Absensi Siswa</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Catat Kehadiran Siswa</p>
          </button>

          <button
            onClick={() => setActiveModule('absensi_guru')}
            className={`p-3 rounded-lg border text-left transition ${
              activeModule === 'absensi_guru'
                ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold">Absensi Guru</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Presensi Pendidik</p>
          </button>

          <button
            onClick={() => setActiveModule('jelantah')}
            className={`p-3 rounded-lg border text-left transition ${
              activeModule === 'jelantah'
                ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Droplet className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold">Setoran Jelantah</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Input Minyak Jelantah</p>
          </button>

          <button
            onClick={() => setActiveModule('pelanggaran')}
            className={`p-3 rounded-lg border text-left transition ${
              activeModule === 'pelanggaran'
                ? 'bg-rose-600/20 border-rose-500 text-rose-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-bold">Pelanggaran BK</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Catat Poin Kedisiplinan</p>
          </button>

          <button
            onClick={() => setActiveModule('haid')}
            className={`p-3 rounded-lg border text-left transition ${
              activeModule === 'haid'
                ? 'bg-pink-600/20 border-pink-500 text-pink-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CalendarHeart className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-bold">Catatan Haid</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Dispensasi Sholat Siswi</p>
          </button>
        </div>

        {/* Dynamic Parameter Options */}
        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/60 text-xs flex flex-wrap items-center gap-4">
          <span className="font-semibold text-slate-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Parameter Otomatis Hasil Scan:
          </span>

          {activeModule === 'absensi_siswa' && (
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Status Absen:</span>
              <select
                value={siswaStatus}
                onChange={(e) => setSiswaStatus(e.target.value as 'Hadir' | 'Izin' | 'Sakit' | 'Alpa')}
                className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-1 font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="Hadir">HADIR (Sesuai Jam)</option>
                <option value="Izin">IZIN (Dengan Surat)</option>
                <option value="Sakit">SAKIT (Keterangan Dokter)</option>
                <option value="Alpa">ALPA (Tanpa Keterangan)</option>
              </select>
            </div>
          )}

          {activeModule === 'absensi_guru' && (
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Tipe Absen Guru:</span>
              <select
                value={guruTipe}
                onChange={(e) => setGuruTipe(e.target.value as 'Masuk' | 'Pulang' | 'Dinas Out')}
                className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-1 font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="Masuk">Masuk Datang</option>
                <option value="Pulang">Pulang Selesai Tugas</option>
                <option value="Dinas Out">Dinas Luar / Tugas Luar</option>
              </select>
            </div>
          )}

          {activeModule === 'jelantah' && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Jumlah Setoran:</span>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={jumlahLiter}
                  onChange={(e) => setJumlahLiter(parseFloat(e.target.value) || 1)}
                  className="w-24 bg-slate-900 border border-slate-700 text-amber-400 rounded px-2 py-1 font-bold text-center focus:outline-none focus:border-amber-500"
                />
                <span className="text-amber-300 font-bold">Liter</span>
              </div>
            </div>
          )}

          {activeModule === 'pelanggaran' && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Jenis:</span>
                <select
                  value={jenisPelanggaran}
                  onChange={(e) => setJenisPelanggaran(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-rose-300 rounded px-2 py-1 font-semibold focus:outline-none focus:border-rose-500"
                >
                  <option value="Atribut Tidak Lengkap">Atribut Tidak Lengkap (Dasi/Sabuk)</option>
                  <option value="Terlambat Masuk Sekolah">Terlambat Masuk Sekolah (&gt;07:15)</option>
                  <option value="Rambut Tidak Rapi / Panjang">Rambut Tidak Rapi / Panjang</option>
                  <option value="Meninggalkan Kelas Tanpa Izin">Meninggalkan Kelas Tanpa Izin</option>
                  <option value="Menggunakan HP Saat KBM">Menggunakan HP Saat KBM</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Poin:</span>
                <input
                  type="number"
                  value={poinPelanggaran}
                  onChange={(e) => setPoinPelanggaran(parseInt(e.target.value) || 5)}
                  className="w-16 bg-slate-900 border border-slate-700 text-rose-400 rounded px-2 py-1 font-bold text-center focus:outline-none focus:border-rose-500"
                />
                <span className="text-rose-400">pts</span>
              </div>
            </div>
          )}

          {activeModule === 'haid' && (
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Catatan/Dispensasi:</span>
              <input
                type="text"
                value={catatanHaid}
                onChange={(e) => setCatatanHaid(e.target.value)}
                className="w-64 bg-slate-900 border border-slate-700 text-pink-300 rounded px-2 py-1 focus:outline-none focus:border-pink-500"
              />
            </div>
          )}

          <div className="flex items-center space-x-2 ml-auto">
            <span className="text-slate-400">Petugas Log:</span>
            <input
              type="text"
              value={petugasName}
              onChange={(e) => setPetugasName(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-300 rounded px-2 py-1 font-mono text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Scanner Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Scanner Area */}
        <div className="lg:col-span-2 space-y-4">
          {inputMode === 'camera' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-center">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 text-slate-200">
                  <Camera className="w-5 h-5 text-blue-400 animate-pulse" />
                  <span className="font-bold text-sm">Pemindai Kamera Live (Webcam Scanner)</span>
                </div>
                {isCameraScanning ? (
                  <button
                    onClick={stopCamera}
                    className="px-3 py-1 bg-rose-600/20 text-rose-300 border border-rose-500/40 rounded text-xs font-semibold hover:bg-rose-600/30"
                  >
                    Hentikan Kamera
                  </button>
                ) : (
                  <button
                    onClick={startCamera}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Aktifkan Kamera</span>
                  </button>
                )}
              </div>

              {cameraError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-lg text-xs text-left mb-3 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Akses Kamera Terhalang</span>
                    {cameraError}
                  </div>
                </div>
              )}

              {/* Camera Scanner Viewport Container */}
              <div className="relative w-full max-w-md mx-auto bg-slate-950 border-2 border-slate-800 rounded-xl overflow-hidden min-h-[280px] flex items-center justify-center shadow-inner">
                <div id="qr-reader" className="w-full"></div>
                {!isCameraScanning && !cameraError && (
                  <div className="p-6 text-slate-400 space-y-2">
                    <QrCode className="w-12 h-12 mx-auto text-slate-600 animate-bounce" />
                    <p className="text-xs">Klik &quot;Aktifkan Kamera&quot; di atas untuk memulai pemindaian QR Code secara otomatis.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {inputMode === 'upload' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm text-center">
              <div className="flex items-center space-x-2 text-slate-200 mb-4 justify-center">
                <Upload className="w-6 h-6 text-blue-400" />
                <h3 className="font-bold text-base">Unggah Gambar QR Code</h3>
              </div>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                Pilih atau seret berkas gambar kartu QR (.png, .jpg) dari Canva Bulk Export atau galeri Anda untuk didekode secara instan.
              </p>

              <div className="w-full max-w-md mx-auto border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-8 bg-slate-950 transition flex flex-col items-center justify-center cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <QrCode className="w-12 h-12 text-blue-400 mb-2" />
                <span className="text-xs font-bold text-slate-200">Klik di sini untuk memilih gambar QR</span>
                <span className="text-[10px] text-slate-500 mt-1">Format didukung: PNG, JPG, WEBP, GIF</span>
              </div>
              <div id="qr-file-decoder" className="hidden"></div>
            </div>
          )}

          {inputMode === 'manual' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-sm text-white">Simulator Quick-Scan Kartu Siswa & Guru</h3>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono">
                  1-Click Instant Scan
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Klik tombol &quot;Scan QR&quot; pada daftar anggota sekolah di bawah ini untuk mensimulasikan hasil pembacaan QR Code secara langsung.
              </p>

              {/* Search filter */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama, NIS, NIP, atau kelas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* List of Students */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Daftar Siswa ({filteredSiswa.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {filteredSiswa.map((siswa) => (
                    <div
                      key={siswa.nis}
                      className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between hover:border-slate-700 transition"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{siswa.nama}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          NIS: {siswa.nis} | Kelas {siswa.kelas} ({siswa.jenisKelamin})
                        </div>
                      </div>
                      <button
                        onClick={() => handleScannedCode(siswa.nis)}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold flex items-center space-x-1"
                      >
                        <QrCode className="w-3 h-3" />
                        <span>Scan QR</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* List of Teachers */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Daftar Guru / Tenaga Pendidik ({filteredGuru.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                  {filteredGuru.map((guru) => (
                    <div
                      key={guru.nip}
                      className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between hover:border-slate-700 transition"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{guru.nama}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          NIP: {guru.nip} | {guru.jabatan}
                        </div>
                      </div>
                      <button
                        onClick={() => handleScannedCode(guru.nip)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center space-x-1"
                      >
                        <QrCode className="w-3 h-3" />
                        <span>Scan QR</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Scan Result Feedback & Log Feed */}
        <div className="space-y-4">
          {/* Last Scan Status Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-400" /> Hasil Pemindaian Terakhir
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                Audio Beep OK
              </span>
            </div>

            {lastScannedResult ? (
              <div className="p-4 bg-emerald-950/50 border border-emerald-800/80 rounded-lg space-y-2 animate-pulse">
                <div className="flex items-center space-x-2 text-emerald-300">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">{lastScannedResult.tipe}</span>
                </div>
                <div className="text-lg font-bold text-white">{lastScannedResult.nama}</div>
                <div className="text-xs text-emerald-200 font-medium">{lastScannedResult.detail}</div>
                <div className="text-[10px] text-emerald-400 font-mono pt-1 border-t border-emerald-900/60">
                  Waktu Pemindaian: {lastScannedResult.waktu} | Status: Terekam ke Google Sheets
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-lg text-center text-slate-500 text-xs">
                Belum ada data QR yang dipindai. Gunakan kamera atau simulator di sebelah kiri.
              </div>
            )}
          </div>

          {/* Recent Scan History Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <History className="w-4 h-4 text-blue-400" /> Log Sesi Pemindaian
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {scanHistory.length} Item
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {scanHistory.length > 0 ? (
                scanHistory.map((item) => (
                  <div key={item.id} className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg text-xs space-y-0.5">
                    <div className="flex justify-between font-bold text-white">
                      <span>{item.nama}</span>
                      <span className="text-[10px] font-mono text-slate-400">{item.waktu}</span>
                    </div>
                    <div className="text-[11px] text-blue-300">{item.detail}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-slate-500 text-xs">
                  Riwayat pemindaian akan muncul di sini.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
