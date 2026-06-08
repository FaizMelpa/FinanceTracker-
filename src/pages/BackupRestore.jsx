import React, { useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import { PageHeader, Button, ConfirmDialog, showToast } from '../components/UI'
import { formatDate, MONEFY_CAT_MAP } from '../utils/constants'

const DOWNLOAD_PATH = '/storage/emulated/0/Download/FinanceTracker'

export default function BackupRestore({ navigate }) {
  const { state, dispatch } = useApp()
  const fileRef = useRef()
  const monefyRef = useRef()
  const [confirmRestore, setConfirmRestore] = useState(false)
  const [pendingRestore, setPendingRestore] = useState(null)
  const [confirmImport, setConfirmImport] = useState(false)
  const [pendingImport, setPendingImport] = useState(null)
  const [importing, setImporting] = useState(false)

  // ── CSV helpers ──────────────────────────────────────
  const toCSV = (rows, headers) => {
    const escape = v => {
      const s = String(v ?? '')
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
    }
    return [headers.join(','), ...rows.map(r => headers.map(h => escape(r[h])).join(','))].join('\n')
  }

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── BACKUP ────────────────────────────────────────────
  const handleBackup = () => {
    try {
      const now = new Date()
      const stamp = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`

      // Transactions CSV
      const txHeaders = ['ID','Tipe','Jumlah','Kategori','Akun','Catatan','Tanggal','Transfer']
      const txRows = state.transactions.map(t => ({
        'ID': t.id,
        'Tipe': t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        'Jumlah': t.amount,
        'Kategori': t.category,
        'Akun': state.accounts.find(a => a.id === t.accountId)?.name || '',
        'Catatan': t.note || '',
        'Tanggal': formatDate(t.date),
        'Transfer': t.isTransfer ? 'Ya' : 'Tidak',
      }))
      downloadCSV(toCSV(txRows, txHeaders), `FinanceTracker_Transaksi_${stamp}.csv`)

      // Full backup JSON embedded in CSV (for restore)
      const rawContent = `data\n"${JSON.stringify(state).replace(/"/g, '""')}"`
      downloadCSV(rawContent, `FinanceTracker_Backup_${stamp}.csv`)

      showToast('Backup berhasil! Cek folder Downloads.')
    } catch (e) {
      showToast('Gagal backup: ' + e.message, 'error')
    }
  }

  // ── RESTORE ───────────────────────────────────────────
  const handleRestoreFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const text = ev.target.result
        const lines = text.split('\n')
        if (lines[0].trim() !== 'data') { showToast('File backup tidak valid', 'error'); return }
        const jsonStr = lines[1].replace(/^"|"$/g, '').replace(/""/g, '"')
        const parsed = JSON.parse(jsonStr)
        setPendingRestore(parsed)
        setConfirmRestore(true)
      } catch (e) {
        showToast('File tidak bisa dibaca: ' + e.message, 'error')
      }
    }
    reader.readAsText(file, 'UTF-8')
    e.target.value = ''
  }

  const doRestore = () => {
    dispatch({ type: 'RESTORE', payload: { ...pendingRestore, isLoaded: true } })
    setConfirmRestore(false)
    showToast('Data berhasil dipulihkan!')
    navigate('dashboard')
  }

  // ── IMPORT MONEFY CSV ─────────────────────────────────
  const handleMonefyFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImporting(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const text = ev.target.result
        const lines = text.split('\n').filter(l => l.trim())
        const sep = lines[0].includes(';') ? ';' : ','
        const headers = lines[0].split(sep).map(h => h.trim().replace(/"/g, '').toLowerCase())
        const transactions = []
        const accountNames = new Set()

        lines.slice(1).forEach(line => {
          const cols = line.split(sep).map(c => c.trim().replace(/"/g, ''))
          const row = {}
          headers.forEach((h, i) => row[h] = cols[i] || '')

          const dateRaw = row['date'] || row['tanggal'] || ''
          const accountRaw = row['account'] || row['akun'] || ''
          const categoryRaw = (row['category'] || row['kategori'] || '').toLowerCase()
          const amountRaw = row['amount'] || row['jumlah'] || '0'
          const noteRaw = row['description'] || row['catatan'] || row['note'] || ''
          const typeRaw = (row['type'] || row['tipe'] || '').toLowerCase()

          if (!dateRaw || !amountRaw) return
          const amount = parseFloat(amountRaw.replace(',', '.').replace(/[^\d.]/g, ''))
          if (isNaN(amount) || amount === 0) return

          accountNames.add(accountRaw || 'Import')
          const mappedCat = MONEFY_CAT_MAP[categoryRaw] || (amount < 0 ? 'other_exp' : 'other_inc')
          const type = amount < 0 ? 'expense' : (typeRaw.includes('income') || typeRaw.includes('pemasukan') ? 'income' : 'expense')

          let parsedDate
          try { parsedDate = new Date(dateRaw).toISOString(); if (isNaN(new Date(dateRaw))) throw new Error() }
          catch { parsedDate = new Date().toISOString() }

          transactions.push({ id: `monefy_${Date.now()}_${Math.random().toString(36).slice(2)}`, type, amount: Math.abs(amount), category: mappedCat, accountId: accountRaw || 'Import', note: noteRaw, date: parsedDate, createdAt: new Date().toISOString(), importedFrom: 'monefy' })
        })

        setPendingImport({ transactions, accountNames: [...accountNames] })
        setConfirmImport(true)
        setImporting(false)
      } catch (e) {
        showToast('Gagal membaca file CSV', 'error')
        setImporting(false)
      }
    }
    reader.readAsText(file, 'UTF-8')
    e.target.value = ''
  }

  const doImport = () => {
    if (!pendingImport) return
    const existingAccNames = state.accounts.map(a => a.name.toLowerCase())
    pendingImport.accountNames.forEach(name => {
      if (name && !existingAccNames.includes(name.toLowerCase())) {
        dispatch({ type: 'ADD_ACC', payload: { id: `acc_${Date.now()}_${Math.random().toString(36).slice(2)}`, name, type: 'bank', icon: '🏦', color: '#4FC3F7', balance: 0, currency: 'IDR', createdAt: new Date().toISOString() } })
      }
    })
    const allAccounts = [...state.accounts]
    const txsWithIds = pendingImport.transactions.map(tx => {
      const acc = allAccounts.find(a => a.name.toLowerCase() === (tx.accountId || '').toLowerCase())
      return { ...tx, accountId: acc?.id || state.accounts[0]?.id || 'acc1' }
    })
    dispatch({ type: 'BULK_ADD_TX', payload: txsWithIds })
    setConfirmImport(false)
    showToast(`${txsWithIds.length} transaksi berhasil diimpor!`)
    navigate('transactions')
  }

  return (
    <div className="h-full flex flex-col bg-bg">
      <PageHeader title="Backup & Restore" onBack={() => navigate('dashboard')} />

      <div className="flex-1 overflow-y-auto scrollbar-none px-4 pb-6">
        {/* Data Stats */}
        <div className="bg-card rounded-2xl border border-border p-4 mb-5">
          <p className="text-white font-bold text-sm mb-3">📦 Data Tersimpan</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Transaksi', val: state.transactions.length, icon: '📋' },
              { label: 'Akun', val: state.accounts.length, icon: '🏦' },
              { label: 'Anggaran', val: state.budgets.length, icon: '💼' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <p className="text-white font-black text-xl mt-1">{s.val}</p>
                <p className="text-text-muted text-xs">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {[
              { label: 'Hutang', val: state.debts.length, icon: '🤝' },
              { label: 'Investasi', val: state.investments.length, icon: '📈' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <p className="text-white font-black text-xl mt-1">{s.val}</p>
                <p className="text-text-muted text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Backup */}
        <div className="bg-card rounded-2xl border border-border p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(0,200,150,0.15)' }}>
              <span style={{ fontSize: 22 }}>💾</span>
            </div>
            <div>
              <p className="text-white font-bold">Backup Data</p>
              <p className="text-text-muted text-xs">Export ke file CSV</p>
            </div>
          </div>
          <div className="bg-elevated rounded-xl p-3 mb-3">
            <p className="text-text-sec text-xs font-semibold mb-1">📂 Lokasi file:</p>
            <p className="text-text-muted text-xs font-mono">{DOWNLOAD_PATH}/</p>
          </div>
          <p className="text-text-muted text-xs mb-3">
            2 file akan didownload: data transaksi + file backup lengkap untuk restore.
          </p>
          <Button onClick={handleBackup}>💾 Backup Sekarang</Button>
        </div>

        {/* Restore */}
        <div className="bg-card rounded-2xl border border-border p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(79,195,247,0.15)' }}>
              <span style={{ fontSize: 22 }}>📂</span>
            </div>
            <div>
              <p className="text-white font-bold">Restore Data</p>
              <p className="text-text-muted text-xs">Pulihkan dari file backup (.csv)</p>
            </div>
          </div>
          <p className="text-text-muted text-xs mb-3">
            ⚠️ Pilih file <span style={{ color: '#00C896' }}>FinanceTracker_Backup_*.csv</span>. Data saat ini akan <span style={{ color: '#FF6B6B' }}>ditimpa</span>.
          </p>
          <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleRestoreFile} className="hidden" />
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>📂 Pilih File Backup CSV</Button>
        </div>

        {/* Import Monefy */}
        <div className="bg-card rounded-2xl border border-border p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(206,147,216,0.15)' }}>
              <span style={{ fontSize: 22 }}>📤</span>
            </div>
            <div>
              <p className="text-white font-bold">Import dari Wallet Lain</p>
              <p className="text-text-muted text-xs">Monefy, Money Manager, dll (CSV)</p>
            </div>
          </div>
          <div className="bg-elevated rounded-xl p-3 mb-3">
            <p className="text-text-sec text-xs font-semibold mb-1">Cara Export dari Monefy:</p>
            <p className="text-text-muted text-xs">Settings → Export → pilih format CSV → simpan file</p>
          </div>
          <input ref={monefyRef} type="file" accept=".csv,.txt" onChange={handleMonefyFile} className="hidden" />
          <Button variant="secondary" onClick={() => monefyRef.current?.click()} disabled={importing}>
            {importing ? '⏳ Memproses...' : '📤 Pilih File CSV'}
          </Button>
        </div>

        {/* Tips */}
        <div className="bg-elevated rounded-2xl border border-border p-4">
          <p className="text-white font-bold text-sm mb-2">💡 Tips</p>
          <div className="space-y-2">
            {[
              'Backup rutin minimal seminggu sekali',
              'File backup tersimpan di Downloads/FinanceTracker',
              'Gunakan file FinanceTracker_Backup_*.csv untuk restore',
              'Jangan hapus file backup lama, simpan beberapa versi',
            ].map((tip, i) => (
              <div key={i} className="flex gap-2">
                <span style={{ color: '#00C896', fontSize: 12, marginTop: 1 }}>•</span>
                <p className="text-text-muted text-xs">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConfirmDialog show={confirmRestore} title="Restore Data?" message="Data saat ini akan ditimpa dengan data backup. Tindakan ini tidak bisa dibatalkan!" danger onConfirm={doRestore} onCancel={() => setConfirmRestore(false)} />
      <ConfirmDialog show={confirmImport} title={`Import ${pendingImport?.transactions?.length || 0} Transaksi?`} message={`Data dari wallet lain akan ditambahkan ke data yang ada. Akun baru: ${pendingImport?.accountNames?.join(', ') || '-'}`} onConfirm={doImport} onCancel={() => setConfirmImport(false)} />
    </div>
  )
}
