import React, { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import SplashScreen from './pages/SplashScreen'
import BottomNav from './components/BottomNav'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import AddTransaction from './pages/AddTransaction'
import Budget from './pages/Budget'
import Statistics from './pages/Statistics'
import Accounts from './pages/Accounts'
import Debts from './pages/Debts'
import Investments from './pages/Investments'
import BackupRestore from './pages/BackupRestore'
import About from './pages/About'

function AppInner() {
  const { state } = useApp()
  const [page, setPage] = useState('dashboard')
  const [pageParams, setPageParams] = useState({})
  const [showSplash, setShowSplash] = useState(true)

  const navigate = (p, params = {}) => {
    setPage(p)
    setPageParams(params)
  }

  if (showSplash) return <SplashScreen onDone={() => setShowSplash(false)} />

  const TAB_PAGES = ['dashboard', 'transactions', 'budget', 'statistics', 'accounts']

  const renderPage = () => {
    switch (page) {
      case 'dashboard':    return <Dashboard navigate={navigate} />
      case 'transactions': return <Transactions navigate={navigate} />
      case 'add-tx':       return <AddTransaction navigate={navigate} params={pageParams} />
      case 'budget':       return <Budget navigate={navigate} />
      case 'statistics':   return <Statistics navigate={navigate} />
      case 'accounts':     return <Accounts navigate={navigate} />
      case 'debts':        return <Debts navigate={navigate} />
      case 'investments':  return <Investments navigate={navigate} />
      case 'backup':       return <BackupRestore navigate={navigate} />
      case 'about':        return <About navigate={navigate} />
      default:             return <Dashboard navigate={navigate} />
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-bg overflow-hidden">
      {/* Page content */}
      <div className="flex-1 overflow-hidden">
        {renderPage()}
      </div>

      {/* Bottom Nav - only on tab pages */}
      {TAB_PAGES.includes(page) && (
        <BottomNav current={page} navigate={navigate} />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
