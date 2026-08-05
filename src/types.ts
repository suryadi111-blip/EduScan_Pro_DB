export type ActiveTab = 
  | 'dashboard'
  | 'scanner'
  | 'database'
  | 'qr_cards'
  | 'expressions'
  | 'apps_script'
  | 'troubleshooter'
  | 'architecture';

export interface Siswa {
  nis: string; // Primary Key Text
  nama: string; // Label
  kelas: string;
  jenisKelamin: 'L' | 'P';
  noHp: string;
  qrCodeUrl?: string;
}

export interface Guru {
  nip: string; // Primary Key Text
  nama: string; // Label
  jabatan: string; // Jabatan / Mapel
  noHp: string;
  qrCodeUrl?: string;
}

export interface LogAbsensiSiswa {
  idAbsen: string; // UNIQUEID
  tanggal: string; // TODAY
  nis: string; // Ref -> Data_Master_Siswa
  namaSiswa?: string;
  kelas?: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
  waktuScan: string; // TIMENOW
}

export interface LogAbsensiGuru {
  idAbsen: string; // UNIQUEID
  tanggal: string; // TODAY
  nip: string; // Ref -> Data_Master_Guru
  namaGuru?: string;
  tipeAbsen: 'Masuk' | 'Pulang' | 'Dinas Out';
  waktuScan: string; // TIMENOW
}

export interface LogMinyakJelantah {
  idTransaksi: string; // UNIQUEID
  tanggalWaktu: string; // NOW
  nis: string; // Ref -> Data_Master_Siswa
  namaSiswa?: string;
  kelas?: string;
  jumlahLiter: number;
  petugas: string;
}

export interface LogPelanggaran {
  idPelanggaran: string; // UNIQUEID
  tanggalWaktu: string; // NOW
  nis: string; // Ref -> Data_Master_Siswa
  namaSiswa?: string;
  kelas?: string;
  jenisPelanggaran: string;
  poin: number;
  fotoBukti?: string;
  petugas: string;
}

export interface LogMasaHaid {
  idCatatan: string; // UNIQUEID
  tanggalMulai: string;
  tanggalSelesai: string;
  nis: string; // Ref -> Data_Master_Siswa
  namaSiswa?: string;
  catatan: string;
}

export interface AppSheetExpression {
  id: string;
  kategori: 'Valid_If' | 'Initial Value' | 'Show_If' | 'Ref Lookup' | 'Security Filter' | 'Automation Bot';
  nama: string;
  tabelTarget: string;
  rumus: string;
  penjelasan: string;
  contohPenggunaan: string;
}

export interface AppsScriptCode {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: 'Web App Dashboard' | 'WhatsApp Notification' | 'Google Sheets Custom Function' | 'Auto Archive';
  kode: string;
  petunjukCaraPakai: string;
}

export interface AppSheetErrorCase {
  id: string;
  kodeError: string;
  namaError: string;
  gejala: string;
  penyebabUtama: string;
  solusiLangkahDemiLangkah: string[];
  contohRumusSalah: string;
  contohRumusBenar: string;
}
