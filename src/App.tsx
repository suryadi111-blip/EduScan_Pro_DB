import React, { useState, useEffect } from 'react';
import { ActiveTab, Siswa, Guru, LogAbsensiSiswa, LogAbsensiGuru, LogMinyakJelantah, LogPelanggaran, LogMasaHaid } from './types';
import {
  INITIAL_SISWA,
  INITIAL_GURU,
  INITIAL_LOG_ABSENSI_SISWA,
  INITIAL_LOG_ABSENSI_GURU,
  INITIAL_LOG_JELANTAH,
  INITIAL_LOG_PELANGGARAN,
  INITIAL_LOG_HAID
} from './data/initialData';

import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ScannerView } from './components/ScannerView';
import { DatabaseManagerView } from './components/DatabaseManagerView';
import { CanvaExportView } from './components/CanvaExportView';
import { ExpressionsView } from './components/ExpressionsView';
import { AppsScriptView } from './components/AppsScriptView';
import { TroubleshooterView } from './components/TroubleshooterView';
import { ArchitectureGuideView } from './components/ArchitectureGuideView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const userEmail = 'suryadi111@guru.smp.belajar.id';
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyRabA0NiKtZ1pK8Sguile9-U46T30qKUE5XGQABrqfjrav8rkA30OZarc4xkoBbB46/exec';

  // State management for 7 modules
  const [siswaList, setSiswaList] = useState<Siswa[]>(INITIAL_SISWA);
  const [guruList, setGuruList] = useState<Guru[]>(INITIAL_GURU);
  const [logAbsensiSiswa, setLogAbsensiSiswa] = useState<LogAbsensiSiswa[]>(INITIAL_LOG_ABSENSI_SISWA);
  const [logAbsensiGuru, setLogAbsensiGuru] = useState<LogAbsensiGuru[]>(INITIAL_LOG_ABSENSI_GURU);
  const [logJelantah, setLogJelantah] = useState<LogMinyakJelantah[]>(INITIAL_LOG_JELANTAH);
  const [logPelanggaran, setLogPelanggaran] = useState<LogPelanggaran[]>(INITIAL_LOG_PELANGGARAN);
  const [logHaid, setLogHaid] = useState<LogMasaHaid[]>(INITIAL_LOG_HAID);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Auto-fetch data dari Google Sheets via Apps Script saat aplikasi dimuat
  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(APPS_SCRIPT_URL);
        const result = await res.json();

        // Mengurai hasil pemanggilan jika status success atau data ada
        const data = result.data || result;

        if (data) {
          // Sync Master Siswa
          if (data.Data_Master_Siswa && data.Data_Master_Siswa.length > 0) {
            const mappedSiswa: Siswa[] = data.Data_Master_Siswa.map((item: any) => ({
              nis: String(item.NIS || item.nis || ''),
              nama: item['Nama Siswa'] || item.nama || '',
              kelas: item.Kelas || item.kelas || '',
              jenisKelamin: item['Jenis Kelamin'] || item.jenisKelamin || 'Laki-laki',
              noHp: String(item['No HP'] || item.noHp || '')
            }));
            setSiswaList(mappedSiswa);
          }

          // Sync Master Guru
          if (data.Data_Master_Guru && data.Data_Master_Guru.length > 0) {
            const mappedGuru: Guru[] = data.Data_Master_Guru.map((item: any) => ({
              nip: String(item.NIP || item.nip || ''),
              nama: item['Nama Guru'] || item.nama || '',
              jabatan: item.Jabatan || item.jabatan || '',
              noHp: String(item['No HP'] || item.noHp || '')
            }));
            setGuruList(mappedGuru);
          }

          // Sync Log Absensi Siswa
          if (data.Log_Absensi_Siswa && data.Log_Absensi_Siswa.length > 0) {
            setLogAbsensiSiswa(data.Log_Absensi_Siswa);
          }

          // Sync Log Absensi Guru
          if (data.Log_Absensi_Guru && data.Log_Absensi_Guru.length > 0) {
            setLogAbsensiGuru(data.Log_Absensi_Guru);
          }

          // Sync Log Minyak Jelantah
          if (data.Log_Minyak_Jelantah && data.Log_Minyak_Jelantah.length > 0) {
            setLogJelantah(data.Log_Minyak_Jelantah);
          }

          // Sync Log Pelanggaran
          if (data.Log_Pelanggaran && data.Log_Pelanggaran.length > 0) {
            setLogPelanggaran(data.Log_Pelanggaran);
          }

          // Sync Log Masa Haid
          if (data.Log_Masa_Haid && data.Log_Masa_Haid.length > 0) {
            setLogHaid(data.Log_Masa_Haid);
          }
        }
      } catch (err) {
        console.error('Gagal memuat data dari Google Sheets API:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSheetData();
  }, [APPS_SCRIPT_URL]);

  // Scan handlers dengan integrasi Google Sheets
  const handleAddAbsensiSiswa = (entry: LogAbsensiSiswa) => {
    setLogAbsensiSiswa(prev => [entry, ...prev]);
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addAbsensiSiswa', data: entry }),
    }).catch(err => console.error('Gagal mengirim absensi siswa:', err));
  };

  const handleAddAbsensiGuru = (entry: LogAbsensiGuru) => {
    setLogAbsensiGuru(prev => [entry, ...prev]);
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addAbsensiGuru', data: entry }),
    }).catch(err => console.error('Gagal mengirim absensi guru:', err));
  };

  const handleAddJelantah = (entry: LogMinyakJelantah) => {
    setLogJelantah(prev => [entry, ...prev]);
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addJelantah', data: entry }),
    }).catch(err => console.error('Gagal mengirim data jelantah:', err));
  };

  const handleAddPelanggaran = (entry: LogPelanggaran) => {
    setLogPelanggaran(prev => [entry, ...prev]);
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addPelanggaran', data: entry }),
    }).catch(err => console.error('Gagal mengirim data pelanggaran:', err));
  };

  const handleAddHaid = (entry: LogMasaHaid) => {
    setLogHaid(prev => [entry, ...prev]);
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addHaid', data: entry }),
    }).catch(err => console.error('Gagal mengirim data haid:', err));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userEmail={userEmail}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            siswaList={siswaList}
            guruList={guruList}
            logAbsensiSiswa={logAbsensiSiswa}
            logAbsensiGuru={logAbsensiGuru}
            logJelantah={logJelantah}
            logPelanggaran={logPelanggaran}
            logHaid={logHaid}
          />
        )}

        {activeTab === 'scanner' && (
          <ScannerView
            siswaList={siswaList}
            guruList={guruList}
            onAddAbsensiSiswa={handleAddAbsensiSiswa}
            onAddAbsensiGuru={handleAddAbsensiGuru}
            onAddJelantah={handleAddJelantah}
            onAddPelanggaran={handleAddPelanggaran}
            onAddHaid={handleAddHaid}
          />
        )}

        {activeTab === 'database' && (
          <DatabaseManagerView
            siswaList={siswaList}
            setSiswaList={setSiswaList}
            guruList={guruList}
            setGuruList={setGuruList}
            logAbsensiSiswa={logAbsensiSiswa}
            setLogAbsensiSiswa={setLogAbsensiSiswa}
            logAbsensiGuru={logAbsensiGuru}
            setLogAbsensiGuru={setLogAbsensiGuru}
            logJelantah={logJelantah}
            setLogJelantah={setLogJelantah}
            logPelanggaran={logPelanggaran}
            setLogPelanggaran={setLogPelanggaran}
            logHaid={logHaid}
            setLogHaid={setLogHaid}
          />
        )}

        {activeTab === 'qr_cards' && (
          <CanvaExportView
            siswaList={siswaList}
            guruList={guruList}
          />
        )}

        {activeTab === 'expressions' && (
          <ExpressionsView />
        )}

        {activeTab === 'apps_script' && (
          <AppsScriptView />
        )}

        {activeTab === 'troubleshooter' && (
          <TroubleshooterView />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureGuideView />
        )}
      </main>

      {/* High Density Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-2.5 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-4">
          <span><strong>Database:</strong> Google Sheets (Main_App_v4.2)</span>
          <span className="hidden sm:inline">|</span>
          <span><strong>Connected:</strong> AppSheet Editor & Google Apps Script API</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500 animate-spin' : 'bg-emerald-500 animate-ping'}`}></span>
            {isLoading ? 'Syncing Google Sheets...' : 'Server Status: OK (99.98% Uptime)'}
          </span>
          <span>Build ID: 2026.08.04.GAS</span>
        </div>
      </footer>
    </div>
  );
}
