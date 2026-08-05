import {
  Siswa,
  Guru,
  LogAbsensiSiswa,
  LogAbsensiGuru,
  LogMinyakJelantah,
  LogPelanggaran,
  LogMasaHaid,
  AppSheetExpression,
  AppsScriptCode,
  AppSheetErrorCase
} from '../types';

export const INITIAL_SISWA: Siswa[] = [
  { nis: '2024001', nama: 'Ahmad Fauzi', kelas: '7-A', jenisKelamin: 'L', noHp: '081234567891' },
  { nis: '2024002', nama: 'Anisa Rahmawati', kelas: '7-A', jenisKelamin: 'P', noHp: '081234567892' },
  { nis: '2024003', nama: 'Budi Santoso', kelas: '7-B', jenisKelamin: 'L', noHp: '081234567893' },
  { nis: '2024004', nama: 'Citra Dewi', kelas: '7-B', jenisKelamin: 'P', noHp: '081234567894' },
  { nis: '2024005', nama: 'Daffa Pratama', kelas: '8-A', jenisKelamin: 'L', noHp: '081234567895' },
  { nis: '2024006', nama: 'Eka Nurjanah', kelas: '8-A', jenisKelamin: 'P', noHp: '081234567896' },
  { nis: '2024007', nama: 'Fajar Hidayat', kelas: '8-B', jenisKelamin: 'L', noHp: '081234567897' },
  { nis: '2024008', nama: 'Gita Gutawa', kelas: '9-A', jenisKelamin: 'P', noHp: '081234567898' },
  { nis: '2024009', nama: 'Hadi Wijaya', kelas: '9-A', jenisKelamin: 'L', noHp: '081234567899' },
  { nis: '2024010', nama: 'Intan Permata', kelas: '9-B', jenisKelamin: 'P', noHp: '081234567800' },
];

export const INITIAL_GURU: Guru[] = [
  { nip: '198501012010011001', nama: 'Drs. Supriyadi, M.Pd.', jabatan: 'Kepala Sekolah / Bahasa Indonesia', noHp: '081122334455' },
  { nip: '198803152012022002', nama: 'Siti Maryam, S.Pd.', jabatan: 'Guru Matematika / Wali Kelas 7-A', noHp: '081122334456' },
  { nip: '199007202015031003', nama: 'Bambang Irawan, S.Si.', jabatan: 'Guru IPA / Pembina OSIS', noHp: '081122334457' },
  { nip: '199311052018042004', nama: 'Dewi Lestari, S.Pd.', jabatan: 'Guru Bahasa Inggris', noHp: '081122334458' },
  { nip: '199505122020011005', nama: 'Rahmat Hidayat, S.Or.', jabatan: 'Guru PJOK / Kesiswaan', noHp: '081122334459' },
];

// DATA TRANSASI / LOG DIRESET KE 0 (ARRAY KOSONG)
export const INITIAL_LOG_ABSENSI_SISWA: LogAbsensiSiswa[] = [];
export const INITIAL_LOG_ABSENSI_GURU: LogAbsensiGuru[] = [];
export const INITIAL_LOG_JELANTAH: LogMinyakJelantah[] = [];
export const INITIAL_LOG_PELANGGARAN: LogPelanggaran[] = [];
export const INITIAL_LOG_HAID: LogMasaHaid[] = [];

export const APPSHEET_EXPRESSIONS: AppSheetExpression[] = [
  {
    id: 'exp-1',
    kategori: 'Initial Value',
    nama: 'Auto-Generate ID Unik',
    tabelTarget: 'Log_Absensi_Siswa, Log_Absensi_Guru, Log_Minyak_Jelantah, Log_Pelanggaran, Log_Masa_Haid',
    rumus: 'UNIQUEID()',
    penjelasan: 'Menghasilkan string alfanumerik acak 8 karakter yang dijamin unik sebagai Primary Key pada tabel Log/Transaksi.',
    contohPenggunaan: 'Atur di kolom `ID Absen` / `ID Transaksi` -> Initial value: UNIQUEID()'
  },
  {
    id: 'exp-2',
    kategori: 'Initial Value',
    nama: 'Auto-Fill Tanggal & Waktu Scan QR',
    tabelTarget: 'Log_Absensi_Siswa & Log_Absensi_Guru',
    rumus: 'TODAY() (Tanggal) | TIMENOW() (Waktu Scan)',
    penjelasan: 'Mengisi tanggal hari ini dan jam persis saat QR Code discan di perangkat.',
    contohPenggunaan: 'Kolom `Tanggal` -> Initial value: TODAY(). Kolom `Waktu Scan` -> Initial value: TIMENOW()'
  },
  {
    id: 'exp-3',
    kategori: 'Ref Lookup',
    nama: 'Dereference Nama & Kelas dari Ref NIS',
    tabelTarget: 'Tabel Log (Log_Absensi_Siswa, Log_Pelanggaran, dll)',
    rumus: '[NIS].[Nama Siswa] atau [NIS].[Kelas]',
    penjelasan: 'Mengambil secara otomatis Nama Siswa atau Kelas dari tabel Data_Master_Siswa berdasarkan NIS yang di-scan.',
    contohPenggunaan: 'Pada kolom App Formula `Nama Siswa`: [NIS].[Nama Siswa]'
  },
  {
    id: 'exp-4',
    kategori: 'Valid_If',
    nama: 'Cek Absen Ganda Siswa (1x Per Hari)',
    tabelTarget: 'Log_Absensi_Siswa',
    rumus: 'ISBLANK(FILTER("Log_Absensi_Siswa", AND([NIS] = [_THISROW].[NIS], [Tanggal] = TODAY())))',
    penjelasan: 'Mencegah siswa melakukan scan absensi lebih dari 1 kali di tanggal yang sama.',
    contohPenggunaan: 'Letakkan di Valid_If pada kolom NIS tabel Log_Absensi_Siswa'
  },
  {
    id: 'exp-5',
    kategori: 'Security Filter',
    nama: 'Pembatasan Domain Belajar.id (@...belajar.id)',
    tabelTarget: 'Semua Tabel AppSheet Security Filter',
    rumus: 'RIGHT(USEREMAIL(), 15) = "@belajar.id" OR ENDSWITH(USEREMAIL(), ".belajar.id")',
    penjelasan: 'Memastikan hanya akun Google Workspace / Belajar.id resmi sekolah yang dapat login dan mengakses data aplikasi.',
    contohPenggunaan: 'Buka Security -> Security Filters -> Masukkan rumus ini pada Security Filter tabel'
  },
  {
    id: 'exp-6',
    kategori: 'Automation Bot',
    nama: 'Kirim Notifikasi WA / Email Saat Pelanggaran Discan',
    tabelTarget: 'Log_Pelanggaran',
    rumus: 'AND(ISNOTBLANK([NIS]), [Poin] >= 10)',
    penjelasan: 'Kondisi Bot Automation AppSheet yang memicu pengiriman pesan Webhook WhatsApp / Email ke Wali Kelas ketika poin pelanggaran >= 10.',
    contohPenggunaan: 'Buat Event di AppSheet Automation -> Event Condition: [Poin] >= 10'
  }
];

export const APPS_SCRIPT_CODES: AppsScriptCode[] = [
  {
    id: 'gas-1',
    judul: 'Web App Dashboard Analitik Presensi & Log (doGet HTML Service)',
    deskripsi: 'Kode Apps Script untuk mempublikasikan Web App Dashboard yang mengambil data langsung dari Google Sheets ke grafik interaktif HTML/CSS/JS.',
    kategori: 'Web App Dashboard',
    kode: `// ===== Kode.gs =====
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Dashboard Analitik Sekolah - QR AppSheet')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getSummaryData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Data Absensi Siswa
  const sheetAbsen = ss.getSheetByName('Log_Absensi_Siswa');
  const dataAbsen = sheetAbsen.getDataRange().getValues();
  dataAbsen.shift(); // Hapus Header
  
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  let hadir = 0, izin = 0, sakit = 0, alpa = 0;
  
  dataAbsen.forEach(row => {
    const tgl = Utilities.formatDate(new Date(row[1]), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    if (tgl === today) {
      const status = String(row[3]).trim();
      if (status === 'Hadir') hadir++;
      else if (status === 'Izin') izin++;
      else if (status === 'Sakit') sakit++;
      else if (status === 'Alpa') alpa++;
    }
  });

  // Data Minyak Jelantah
  const sheetJelantah = ss.getSheetByName('Log_Minyak_Jelantah');
  const dataJelantah = sheetJelantah.getDataRange().getValues();
  dataJelantah.shift();
  let totalLiter = 0;
  dataJelantah.forEach(row => {
    totalLiter += Number(row[3]) || 0;
  });

  return {
    tanggal: today,
    absensi: { hadir, izin, sakit, alpa },
    jelantahTotalLiter: totalLiter
  };
}`,
    petunjukCaraPakai: '1. Di Google Sheets tempat AppSheet terhubung, buka Extensions -> Apps Script.\n2. Paste kode di atas ke Kode.gs.\n3. Buat file Index.html dan masukkan antarmuka HTML.\n4. Klik Deploy -> New Deployment -> Select type: Web App -> Execute as: Me -> Who has access: Anyone with Google account.'
  },
  {
    id: 'gas-2',
    judul: 'Auto WhatsApp Notification Bot via Fonnte / Wablas API',
    deskripsi: 'Script Apps Script yang dipanggil via AppSheet Webhook untuk mengirim WhatsApp otomatis ke No HP Siswa/Orangtua saat absensi atau pelanggaran terdata.',
    kategori: 'WhatsApp Notification',
    kode: `function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    const nis = contents.nis;
    const nama = contents.nama;
    const noHp = contents.noHp;
    const status = contents.status;
    const waktu = contents.waktu;
    
    if (!noHp) return ContentService.createTextOutput("No HP Kosong");

    const token = "TOKEN_FONNTE_ANDA_DISINI"; // Ganti dengan Token Fonnte
    const pesan = \`*INFORMASI PRESENSI SCHOOL QR*\\n\\n\` +
                  \`Nama: \${nama}\\n\` +
                  \`NIS: \${nis}\\n\` +
                  \`Status: *\${status}*\\n\` +
                  \`Waktu Scan: \${waktu}\\n\\n\` +
                  \`Pesan ini dikirim otomatis oleh Sistem Absensi Sekolah.\`;

    const payload = {
      'target': noHp,
      'message': pesan
    };

    const options = {
      'method': 'post',
      'headers': {
        'Authorization': token
      },
      'payload': payload
    };

    UrlFetchApp.fetch('https://api.fonnte.com/send', options);
    return ContentService.createTextOutput("Berhasil Kirim WA");
  } catch(err) {
    return ContentService.createTextOutput("Error: " + err.toString());
  }
}`,
    petunjukCaraPakai: '1. Tambahkan fungsi `doPost` di Apps Script.\n2. Deploy sebagai Web App (Anyone).\n3. Di AppSheet: Buka Automation -> Task -> Call a Webhook -> HTTP POST ke URL Web App Apps Script.'
  },
  {
    id: 'gas-3',
    judul: 'Custom Google Sheets Formula: =GENERATE_QR_CANVA(Text)',
    deskripsi: 'Formula kustom Google Sheets untuk membuat URL QR Code yang kompatibel langsung dengan Canva Bulk Create dan laporan siap cetak.',
    kategori: 'Google Sheets Custom Function',
    kode: `/**
 * Menghasilkan URL gambar QR Code untuk Canva Bulk Create
 * @param {string} data - Nilai NIS atau NIP yang dijadikan QR Code
 * @return URL Gambar QR Code
 * @customfunction
 */
function GENERATE_QR_CANVA(data) {
  if (!data || data === "") return "";
  const encoded = encodeURIComponent(data);
  return "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + encoded;
}`,
    petunjukCaraPakai: 'Paste kode ini di Script Editor Google Sheets. Di sel spreadsheet, ketik `=GENERATE_QR_CANVA(A2)` di mana A2 berisi NIS atau NIP.'
  },
  {
    id: 'gas-4',
    judul: 'Kode Lengkap Backend Apps Script Engine (Full API doPost + doGet)',
    deskripsi: 'Kode Apps Script super lengkap untuk menangkap semua data dari Pemindai QR Web App / AppSheet dan menyimpan otomatis ke Google Sheets.',
    kategori: 'Full Backend Script (Kode.gs)',
    kode: `/**
 * ==============================================================================
 * KODE LENGKAP BACKEND GOOGLE APPS SCRIPT (Kode.gs)
 * EduScan Pro - Sistem Pemindai QR & Database Sekolah Integrated
 * ==============================================================================
 */

// 1. HANDLER HTTP POST (Menerima Data Pemindaian QR Code)
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000); // Mencegah race condition saat banyak QR discan bersamaan

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action || 'absensi_siswa';
    const timestamp = new Date();

    let sheetName = 'Log_Absensi_Siswa';
    let rowData = [];

    switch (action) {
      case 'absensi_siswa':
        sheetName = 'Log_Absensi_Siswa';
        rowData = [
          contents.idAbsen || 'ABS-' + Date.now(),
          contents.tanggal || Utilities.formatDate(timestamp, 'Asia/Jakarta', 'yyyy-MM-dd'),
          contents.nis,
          contents.namaSiswa,
          contents.kelas,
          contents.status || 'Hadir',
          contents.waktuScan || Utilities.formatDate(timestamp, 'Asia/Jakarta', 'HH:mm:ss')
        ];
        break;

      case 'absensi_guru':
        sheetName = 'Log_Absensi_Guru';
        rowData = [
          contents.idAbsen || 'ABG-' + Date.now(),
          contents.tanggal || Utilities.formatDate(timestamp, 'Asia/Jakarta', 'yyyy-MM-dd'),
          contents.nip,
          contents.namaGuru,
          contents.tipeAbsen || 'Masuk',
          contents.waktuScan || Utilities.formatDate(timestamp, 'Asia/Jakarta', 'HH:mm:ss')
        ];
        break;

      case 'jelantah':
        sheetName = 'Log_Minyak_Jelantah';
        rowData = [
          contents.idTransaksi || 'JEL-' + Date.now(),
          contents.tanggalWaktu || Utilities.formatDate(timestamp, 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss'),
          contents.nis,
          contents.namaSiswa,
          contents.kelas,
          Number(contents.jumlahLiter) || 0,
          contents.petugas || 'Operator'
        ];
        break;

      case 'pelanggaran':
        sheetName = 'Log_Pelanggaran';
        rowData = [
          contents.idPelanggaran || 'PLG-' + Date.now(),
          contents.tanggalWaktu || Utilities.formatDate(timestamp, 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss'),
          contents.nis,
          contents.namaSiswa,
          contents.kelas,
          contents.jenisPelanggaran,
          Number(contents.poin) || 5,
          contents.petugas || 'Tim BK'
        ];
        break;

      case 'haid':
        sheetName = 'Log_Masa_Haid';
        rowData = [
          contents.idCatatan || 'HAD-' + Date.now(),
          contents.tanggalMulai || Utilities.formatDate(timestamp, 'Asia/Jakarta', 'yyyy-MM-dd'),
          contents.tanggalSelesai || '',
          contents.nis,
          contents.namaSiswa,
          contents.catatan || 'Masa Haid / Dispen Sholat'
        ];
        break;

      default:
        throw new Error('Aksi tidak dikenal: ' + action);
    }

    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      // Auto create header
      if (action === 'absensi_siswa') sheet.appendRow(['ID Absen', 'Tanggal', 'NIS', 'Nama Siswa', 'Kelas', 'Status', 'Waktu Scan']);
      else if (action === 'absensi_guru') sheet.appendRow(['ID Absen', 'Tanggal', 'NIP', 'Nama Guru', 'Tipe Absen', 'Waktu Scan']);
      else if (action === 'jelantah') sheet.appendRow(['ID Transaksi', 'Tanggal Waktu', 'NIS', 'Nama Siswa', 'Kelas', 'Jumlah Liter', 'Petugas']);
      else if (action === 'pelanggaran') sheet.appendRow(['ID Pelanggaran', 'Tanggal Waktu', 'NIS', 'Nama Siswa', 'Kelas', 'Jenis Pelanggaran', 'Poin', 'Petugas']);
      else if (action === 'haid') sheet.appendRow(['ID Catatan', 'Tanggal Mulai', 'Tanggal Selesai', 'NIS', 'Nama Siswa', 'Catatan']);
    }

    sheet.appendRow(rowData);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Data berhasil disimpan', sheet: sheetName, row: rowData }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// 2. HANDLER HTTP GET (Mengambil Data Real-Time ke Dashboard Web / AppSheet)
function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ['Log_Absensi_Siswa', 'Log_Absensi_Guru', 'Log_Minyak_Jelantah', 'Log_Pelanggaran', 'Log_Masa_Haid'];
  const result = {};

  sheets.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (sheet) {
      const values = sheet.getDataRange().getValues();
      const headers = values.shift() || [];
      result[name] = values.map(row => {
        const obj = {};
        headers.forEach((h, i) => obj[h] = row[i]);
        return obj;
      });
    } else {
      result[name] = [];
    }
  });

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success', timestamp: new Date().toISOString(), data: result }))
    .setMimeType(ContentService.MimeType.JSON);
}`,
    petunjukCaraPakai: '1. Buka Google Sheets tempat data disimpan.\n2. Klik Ekstensi -> Apps Script.\n3. Hapus semua kode default dan PASTE kode di atas ke file Kode.gs.\n4. Klik Terapkan (Deploy) -> Terapkan Sebagai Aplikasi Web (New Deployment -> Web App).\n5. Set Akses: "Siapa Saja" (Anyone) -> Klik Terapkan dan salin URL Web App yang dihasilkan.'
  }
];

export const APPSHEET_ERROR_CASES: AppSheetErrorCase[] = [
  {
    id: 'err-1',
    kodeError: 'Cyclical Reference Error',
    namaError: 'Circular Dependency in App Formula / Valid_If',
    gejala: 'AppSheet menampilkan pesan error merah "Cyclical reference detected" saat menyimpan kolom atau menyinkronkan aplikasi.',
    penyebabUtama: 'Kolom A merujuk ke Kolom B dalam App Formula-nya, sedangkan Kolom B juga merujuk kembali ke Kolom A, atau sebuah kolom merujuk ke rumus dirinya sendiri.',
    solusiLangkahDemiLangkah: [
      'Identifikasi nama kolom yang disebutkan dalam pesan error AppSheet.',
      'Buka AppSheet Editor -> Data -> Columns -> Pilih tabel terkait.',
      'Periksa bagian `App Formula` dan `Valid_If` pada kolom tersebut.',
      'Pindahkan perhitungan yang menyebabkan circular dependency ke `Initial Value` jika nilai hanya perlu diisi sekali saat pembuatan baris.',
      'Untuk dereference (Ref), pastikan menggunakan `[NIS].[Nama Siswa]` di mana NIS adalah Key tunggal tanpa mengacu balik ke tabel Log.'
    ],
    contohRumusSalah: 'Di kolom Status: IF([Status] = "Hadir", "Hadir", "Absen")',
    contohRumusBenar: 'Gunakan Initial Value: "Hadir" atau Valid_If: LIST("Hadir", "Izin", "Sakit", "Alpa")'
  },
  {
    id: 'err-2',
    kodeError: 'Schema Out of Sync / Missing Column',
    namaError: 'Column structure mismatched between Sheets and AppSheet',
    gejala: 'Data yang discan atau diisi di AppSheet tidak muncul di Google Sheets, atau muncul error "Column X was not found in table Y".',
    penyebabUtama: 'Header kolom di Google Sheets diubah, dihapus, atau ditambah urutannya secara manual tanpa melakukan regenerate structure di AppSheet.',
    solusiLangkahDemiLangkah: [
      'Buka Google Sheets dan pastikan baris pertama (Row 1) memuat nama header yang bersih tanpa spasi ganda atau karakter aneh.',
      'Buka AppSheet Editor -> Data -> Columns.',
      'Klik tombol `Regenerate Structure` di pojok kanan atas tabel.',
      'Periksa tipe data kembali (NIS/NIP = Text, Ref = Ref ke Data_Master_Siswa).',
      'Save aplikasi.'
    ],
    contohRumusSalah: 'Header Sheet: "N I S " (ada spasi tersembunyi)',
    contohRumusBenar: 'Header Sheet: "NIS"'
  },
  {
    id: 'err-3',
    kodeError: 'Duplicate Key Error',
    namaError: 'Key value is not unique',
    gejala: 'User gagal menambah data log absensi / pelanggaran baru dengan pesan error "Key already exists".',
    penyebabUtama: 'Kolom Key pada tabel Log diset ke `NIS` atau `Tanggal` yang nilainya berulang (bukan unik), alih-alih menggunakan `ID Absen` / `ID Transaksi`.',
    solusiLangkahDemiLangkah: [
      'Di AppSheet Columns, pastikan checkbox `Key` HANYA diaktifkan pada kolom ID tunggal seperti `ID Absen` atau `ID Transaksi`.',
      'Kolom `NIS` atau `NIP` pada tabel Log HARUS berupa `Ref` (bukan Key).',
      'Pastikan `Initial Value` pada kolom Key diisi dengan `UNIQUEID()`.',
      'Regenerate structure jika perlu.'
    ],
    contohRumusSalah: 'Tabel Log_Absensi_Siswa: Key = NIS',
    contohRumusBenar: 'Tabel Log_Absensi_Siswa: Key = ID Absen (Initial Value: UNIQUEID()), NIS = Ref'
  },
  {
    id: 'err-4',
    kodeError: 'Ref Scannable Not Working',
    namaError: 'Barcode/QR Code scanner does not open on mobile',
    gejala: 'Tombol ikon QR Code tidak muncul di samping input NIS/NIP saat menginput data absensi atau transaksi di HP.',
    penyebabUtama: 'Properti `Scannable` pada atribut kolom Ref belum dicentang di AppSheet Editor.',
    solusiLangkahDemiLangkah: [
      'Buka AppSheet -> Data -> Columns -> Tabel Log (misal Log_Absensi_Siswa).',
      'Klik ikon Pensil (Edit) di samping kolom `NIS`.',
      'Scroll ke bawah ke bagian `Other Settings`.',
      'Centang opsi `Scannable` (Searchable & Scannable).',
      'Save & Sync.'
    ],
    contohRumusSalah: 'Kolom NIS: Type = Ref, Scannable = Unchecked',
    contohRumusBenar: 'Kolom NIS: Type = Ref (Source table: Data_Master_Siswa), Scannable = Checked'
  }
];
