# 💰 Finance Tracker

Aplikasi catatan keuangan personal — React + Vite + Tailwind + Capacitor.

**by Dncelzie**

---

## ✨ Fitur

- 💰 Catat pemasukan & pengeluaran
- 🏦 Multi akun tak terbatas (bank, e-wallet, tunai, dll)
- 🔄 Transfer antar akun
- 📊 Budget tracker per kategori + warning
- 📈 Statistik & grafik (bar chart, pie chart, heatmap)
- 🤝 Hutang piutang (bayar sebagian, riwayat pembayaran)
- 💹 Portofolio investasi lengkap
- 📷 Foto struk per transaksi
- 💾 Backup & restore ke Excel
- 📤 Import dari wallet lain (Monefy CSV)
- 🌙 Full dark mode
- 📴 100% offline


## 📁 Struktur Project

```
FinanceTrackerApp/
├── .github/
│   └── workflows/
│       └── build-apk.yml     ← GitHub Actions
├── src/
│   ├── context/
│   │   └── AppContext.jsx    ← Global state
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   ├── AddTransaction.jsx
│   │   ├── Budget.jsx
│   │   ├── Statistics.jsx
│   │   ├── Accounts.jsx
│   │   ├── Debts.jsx
│   │   ├── Investments.jsx
│   │   ├── BackupRestore.jsx
│   │   ├── About.jsx
│   │   └── SplashScreen.jsx
│   ├── components/
│   │   ├── BottomNav.jsx
│   │   └── UI.jsx
│   └── utils/
│       └── constants.js
├── index.html
├── vite.config.js
├── tailwind.config.js
├── capacitor.config.js
└── package.json
```

---

## 🛠️ Kustomisasi

- **Warna utama** → `tailwind.config.js` → `colors.primary`
- **Nama app** → `capacitor.config.js` → `appName`
- **Package ID** → `capacitor.config.js` → `appId`
- **Tambah kategori** → `src/utils/constants.js`
- **Watermark** → `src/pages/About.jsx`
