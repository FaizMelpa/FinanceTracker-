<div align="center">

<img src="public/logo_apk.png" width="110" alt="Cash Journal" />

# Cash Journal

Personal finance tracker — offline, ringan, dan bebas iklan.

[![Build](https://github.com/FaizMelpa/FinanceTracker/actions/workflows/build-apk.yml/badge.svg)](https://github.com/FaizMelpa/FinanceTracker/actions)
![Android](https://img.shields.io/badge/Android-3DDC84?logo=android&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?logo=react&logoColor=black)
![Capacitor](https://img.shields.io/badge/Capacitor_5-119EFF?logo=capacitor&logoColor=white)

</div>

---

## Fitur

- **Transaksi** — catat pemasukan, pengeluaran, dan transfer antar akun
- **Multi Akun** — bank, e-wallet, tunai, tabungan, tak terbatas
- **Anggaran** — batas pengeluaran per kategori dengan notifikasi
- **Statistik** — grafik bar, pie chart, dan heatmap aktivitas
- **Hutang & Piutang** — catat, bayar, atau tambah hutang per orang dengan transfer akun
- **Investasi** — portofolio saham, kripto, reksa dana, emas, dan lainnya
- **Backup & Restore** — simpan data ke file `.json` di folder Downloads
- **Import CSV** — migrasi data dari Monefy dan app lain
- **Kalkulator Kekayaan** — jumlahkan akun, porto investasi, dan piutang sesuka lo
- **100% Offline** — tidak ada server, tidak ada iklan, data milik lo sendiri

---

## Build APK

Tidak perlu laptop. Semua build dilakukan via GitHub Actions.

```
1. Upload project ke repo GitHub
2. Actions → Build Android APK → Run workflow
3. Tunggu ~3 menit
4. Download APK dari tab Artifacts
5. Install di HP — izinkan sumber tidak dikenal
```

Build juga otomatis berjalan setiap kali ada commit baru ke branch `main`.

---

## Struktur Project

```
CashJournal/
├── .github/workflows/
│   └── build-apk.yml          CI/CD build APK
├── icons/                     Icon APK semua resolusi Android
│   ├── mipmap-mdpi/           48×48
│   ├── mipmap-hdpi/           72×72
│   ├── mipmap-xhdpi/          96×96
│   ├── mipmap-xxhdpi/         144×144
│   └── mipmap-xxxhdpi/        192×192
├── public/
│   ├── logo_apk.png           Icon APK (beranda HP)
│   └── logo_clean.png         Logo dalam app
├── src/
│   ├── assets/                Logo base64 untuk splash & about
│   ├── components/
│   │   ├── BottomNav.jsx      Navigasi bawah
│   │   └── UI.jsx             Komponen reusable
│   ├── context/
│   │   └── AppContext.jsx     Global state & reducer
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   ├── AddTransaction.jsx
│   │   ├── Accounts.jsx
│   │   ├── Budget.jsx
│   │   ├── Statistics.jsx
│   │   ├── Debts.jsx
│   │   ├── Investments.jsx
│   │   ├── BackupRestore.jsx
│   │   ├── About.jsx
│   │   └── SplashScreen.jsx
│   └── utils/
│       └── constants.js       Kategori, tipe akun, format helpers
├── capacitor.config.js        com.mycashjournal.Fz
├── gen_icons.py               Override icon setelah cap sync
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Stack

| Layer | Tech |
|-------|------|
| UI | React 18 + Vite |
| Styling | Tailwind CSS |
| Native | Capacitor 5 |
| Charts | Recharts |
| Storage | localStorage |
| CI/CD | GitHub Actions |

---

## Kustomisasi

```js
// Warna utama → tailwind.config.js
primary: '#00C896'

// Nama & package → capacitor.config.js
appId: 'com.mycashjournal.Fz'
appName: 'Cash Journal'

// Ganti icon APK → icons/mipmap-*/ic_launcher.png
// Tambah kategori → src/utils/constants.js
```

---

<div align="center">

Built by **Dncelzie**

</div>
