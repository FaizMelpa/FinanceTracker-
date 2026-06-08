import React from 'react'

// ── Card ──────────────────────────────────────────────
export function Card({ children, className = '', onClick }) {
  return (
    <div onClick={onClick}
      className={`bg-card rounded-2xl border border-border ${onClick ? 'card-press cursor-pointer' : ''} ${className}`}>
      {children}
    </div>
  )
}

// ── Header ────────────────────────────────────────────
export function PageHeader({ title, onBack, right, navigate }) {
  return (
    <div className="flex items-center justify-between px-4 py-4 safe-top">
      {onBack ? (
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center card-press" style={{ border: 'none', background: '#1A1D27', cursor: 'pointer' }}>
          <span style={{ fontSize: 18 }}>←</span>
        </button>
      ) : <div className="w-9" />}
      <h1 className="text-lg font-bold text-white">{title}</h1>
      {right || <div className="w-9" />}
    </div>
  )
}

// ── Bottom Sheet ──────────────────────────────────────
export function BottomSheet({ show, onClose, children, title }) {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-surface rounded-t-3xl border-t border-border bottom-sheet safe-bottom" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>
        {title && <h2 className="text-center font-bold text-white text-lg pb-3 border-b border-border">{title}</h2>}
        {children}
      </div>
    </div>
  )
}

// ── Input ─────────────────────────────────────────────
export function Input({ label, value, onChange, placeholder, type = 'text', prefix, className = '' }) {
  return (
    <div className={className}>
      {label && <label className="block text-text-sec text-xs font-semibold mb-2">{label}</label>}
      <div className="flex items-center bg-elevated rounded-2xl border border-border px-4 py-3 gap-2">
        {prefix && <span className="text-text-sec text-sm font-semibold">{prefix}</span>}
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="flex-1 bg-transparent text-white text-base outline-none placeholder-text-muted" style={{ minWidth: 0 }} />
      </div>
    </div>
  )
}

// ── Amount Input ──────────────────────────────────────
export function AmountInput({ value, onChange, className = '' }) {
  const display = value ? new Intl.NumberFormat('id-ID').format(parseInt(value) || 0) : ''
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-text-sec text-2xl font-bold">Rp</span>
      <input
        type="text"
        inputMode="numeric"
        value={display}
        onChange={e => onChange(e.target.value.replace(/\D/g, ''))}
        placeholder="0"
        className="flex-1 bg-transparent text-white font-black outline-none placeholder-text-muted"
        style={{ fontSize: 36, minWidth: 0 }}
      />
    </div>
  )
}

// ── Button ────────────────────────────────────────────
export function Button({ children, onClick, variant = 'primary', className = '', disabled = false }) {
  const variants = {
    primary: 'text-white font-bold',
    secondary: 'bg-elevated text-text-sec font-semibold border border-border',
    danger: 'bg-red-500/20 text-expense font-semibold border border-expense/30',
  }
  return (
    <button onClick={onClick} disabled={disabled}
      className={`w-full py-4 rounded-2xl card-press ${variants[variant]} ${disabled ? 'opacity-40' : ''} ${className}`}
      style={variant === 'primary' ? { background: 'linear-gradient(135deg, #00C896, #00A87E)', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer' } : { cursor: 'pointer' }}>
      {children}
    </button>
  )
}

// ── Chip ──────────────────────────────────────────────
export function Chip({ label, active, color, onClick }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1 px-3 py-2 rounded-full border-2 card-press whitespace-nowrap"
      style={{
        borderColor: active ? color : '#2A2D3E',
        backgroundColor: active ? color + '20' : 'transparent',
        color: active ? color : '#A0A8C0',
        fontSize: 12, fontWeight: 600, cursor: 'pointer', background: active ? color + '20' : 'transparent'
      }}>
      {label}
    </button>
  )
}

// ── Empty State ───────────────────────────────────────
export function EmptyState({ emoji, title, subtitle, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <span style={{ fontSize: 56 }}>{emoji}</span>
      <p className="text-white font-bold text-lg mt-4 mb-1">{title}</p>
      {subtitle && <p className="text-text-muted text-sm text-center">{subtitle}</p>}
      {action && (
        <button onClick={onAction} className="mt-6 px-6 py-3 rounded-full font-bold text-sm card-press"
          style={{ background: 'linear-gradient(135deg, #00C896, #00A87E)', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {action}
        </button>
      )}
    </div>
  )
}

// ── Progress Bar ──────────────────────────────────────
export function ProgressBar({ pct, color = '#00C896', height = 8 }) {
  const clamped = Math.min(Math.max(pct, 0), 100)
  return (
    <div className="rounded-full overflow-hidden" style={{ height, background: '#2A2D3E' }}>
      <div className="h-full rounded-full progress-bar" style={{ width: `${clamped}%`, background: color }} />
    </div>
  )
}

// ── Confirm Dialog ────────────────────────────────────
export function ConfirmDialog({ show, title, message, onConfirm, onCancel, danger = false }) {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative bg-surface rounded-3xl border border-border p-6 w-full max-w-sm animate-scale-in">
        <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
        <p className="text-text-sec text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-2xl bg-elevated text-text-sec font-semibold border border-border card-press" style={{ cursor: 'pointer' }}>
            Batal
          </button>
          <button onClick={onConfirm} className={`flex-1 py-3 rounded-2xl font-bold card-press ${danger ? 'bg-expense/20 text-expense' : 'text-white'}`}
            style={!danger ? { background: 'linear-gradient(135deg, #00C896, #00A87E)', border: 'none' } : { cursor: 'pointer' }}>
            Ya
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Toast ─────────────────────────────────────────────
let toastTimeout
export function showToast(msg, type = 'success') {
  const existing = document.getElementById('ft-toast')
  if (existing) existing.remove()
  const el = document.createElement('div')
  el.id = 'ft-toast'
  el.innerText = msg
  el.style.cssText = `
    position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%);
    background: ${type === 'error' ? '#FF6B6B' : '#00C896'}; color: white;
    padding: 10px 20px; border-radius: 999px; font-size: 13px; font-weight: 600;
    z-index: 9999; white-space: nowrap; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    animation: fadeIn 0.2s ease;
  `
  document.body.appendChild(el)
  clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => el.remove(), 2500)
}
