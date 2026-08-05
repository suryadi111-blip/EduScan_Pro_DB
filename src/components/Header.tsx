import React from 'react';
import { ActiveTab } from '../types';
import { 
  BarChart3, 
  Database, 
  QrCode, 
  Code2, 
  FileCode, 
  AlertTriangle, 
  BookOpen, 
  ShieldCheck,
  UserCheck,
  Camera,
  Radio
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userEmail: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, userEmail }) => {
  const tabs = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard Analitik', icon: BarChart3 },
    { id: 'scanner' as ActiveTab, label: 'Pemindai QR (Scanner)', icon: Camera, badge: 'LIVE' },
    { id: 'database' as ActiveTab, label: 'Data & Simulator Log', icon: Database },
    { id: 'qr_cards' as ActiveTab, label: 'Canva QR & Kartu', icon: QrCode },
    { id: 'expressions' as ActiveTab, label: 'Rumus AppSheet', icon: Code2 },
    { id: 'apps_script' as ActiveTab, label: 'Google Apps Script', icon: FileCode },
    { id: 'troubleshooter' as ActiveTab, label: 'Diagnosa Error', icon: AlertTriangle },
    { id: 'architecture' as ActiveTab, label: 'Panduan Arsitektur', icon: BookOpen },
  ];

  return (
    <header className="bg-[#0f172a] text-slate-100 border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top Action Bar / Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-blue-900/50">
            QR
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                EduScan Pro — System Scanner & Hub No-Code
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> Live Sync Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Absensi Siswa, Guru, Minyak Jelantah, Pelanggaran BK & Log Haid via QR Code
            </p>
          </div>
        </div>

        {/* Header Right Action Area */}
        <div className="flex items-center space-x-3">
          {/* Quick Scan Button */}
          <button
            onClick={() => setActiveTab('scanner')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-2 shadow-sm shadow-blue-900/40"
          >
            <Camera className="w-4 h-4" />
            <span>Scan QR Code</span>
          </button>

          {/* User Workspace Info */}
          <div className="hidden sm:flex items-center space-x-2 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400">Admin:</span>
            <span className="font-mono text-blue-300 font-semibold truncate max-w-[200px]">
              {userEmail}
            </span>
          </div>
        </div>
      </div>

      {/* High Density Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-950/60 border-t border-slate-800/80">
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar py-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 text-[9px] font-bold bg-emerald-500 text-slate-950 rounded uppercase tracking-wider">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
