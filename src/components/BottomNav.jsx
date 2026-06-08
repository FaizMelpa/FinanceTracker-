import React from 'react'

const TABS = [
  { id: 'dashboard',    icon: '🏠', label: 'Beranda' },
  { id: 'transactions', icon: '📋', label: 'Transaksi' },
  { id: 'budget',       icon: '💼', label: 'Anggaran' },
  { id: 'statistics',   icon: '📊', label: 'Statistik' },
  { id: 'accounts',     icon: '🏦', label: 'Akun' },
]

export default function BottomNav({ current, navigate }) {
  return (
    <div className="flex bg-surface border-t border-border safe-bottom" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}>
      {TABS.map(tab => {
        const active = current === tab.id
        return (
          <button key={tab.id} onClick={() => navigate(tab.id)}
            className="flex-1 flex flex-col items-center gap-1 py-2 card-press"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ fontSize: 20, filter: active ? 'none' : 'grayscale(1) opacity(0.45)' }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: active ? '#00C896' : '#5A6080' }}>{tab.label}</span>
            {active && <div className="w-1 h-1 rounded-full bg-primary" />}
          </button>
        )
      })}
    </div>
  )
}
