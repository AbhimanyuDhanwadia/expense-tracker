import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { Download, LayoutDashboard, Search, RefreshCcw, CheckCircle2, Clock, Trash2, Plus, LogOut, Calendar, Wallet } from 'lucide-react';
import { useSyncedState } from '../hooks/useSyncedState';
import { Expense, Refund, Payday } from '../types';
import { exportTrackerData } from '../lib/dataExport';
import { useAuth } from '../contexts/AuthContext';
import LiquidBackground from './LiquidBackground';
import UserProfileMenu from './UserProfileMenu';
import DashboardView from './DashboardView';
import CalendarView from './CalendarView';

const DEFAULT_CATEGORIES = ['Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Healthcare', 'Other'];

export default function Dashboard() {
  const { signOut } = useAuth();
  const [expenses, setExpenses, expensesSync] = useSyncedState<Expense[]>('expenses', []);
  const [refunds, setRefunds, refundsSync] = useSyncedState<Refund[]>('refunds', []);
  const [paydays, setPaydays, paydaysSync] = useSyncedState<Payday[]>('paydays', []);
  const [categories, setCategories, categoriesSync] = useSyncedState<string[]>('categories', DEFAULT_CATEGORIES);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'spending' | 'refunds' | 'calendar'>('dashboard');
  
  // Form State - Expenses
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State - Refunds
  const [refundItem, setRefundItem] = useState('');
  const [refundVendor, setRefundVendor] = useState('');
  const [refundAmount, setRefundAmount] = useState('');

  // Form expansion state (mobile/desktop responsive adding)
  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heading || !amount || !category) return;
    
    if (category && !categories.includes(category)) {
      setCategories((currentCategories) => (
        currentCategories.includes(category) ? currentCategories : [...currentCategories, category]
      ));
    }

    const newExpense: Expense = {
      id: uuidv4(),
      heading,
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString(),
    };

    setExpenses((currentExpenses) => [newExpense, ...currentExpenses]);
    
    setHeading('');
    setDescription('');
    setAmount('');
    setCategory('');
  };

  const handleAddRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundItem || !refundAmount || !refundVendor) return;

    const newRefund: Refund = {
      id: uuidv4(),
      item: refundItem,
      vendor: refundVendor,
      amount: parseFloat(refundAmount),
      dateCancelled: new Date().toISOString(),
      status: 'pending',
    };

    setRefunds((currentRefunds) => [newRefund, ...currentRefunds]);
    setRefundItem('');
    setRefundVendor('');
    setRefundAmount('');
  };

  const handleDeleteExpense = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpenses((currentExpenses) => currentExpenses.filter(exp => exp.id !== id));
  };

  const handleDeleteRefund = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRefunds((currentRefunds) => currentRefunds.filter(r => r.id !== id));
  };

  const handleToggleRefundStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRefunds((currentRefunds) => currentRefunds.map(r => r.id === id ? { ...r, status: r.status === 'pending' ? 'received' : 'pending' } : r));
  };

  const handleExport = () => {
    if (expenses.length === 0 && refunds.length === 0 && paydays.length === 0) {
      return;
    }
    exportTrackerData(expenses, refunds, paydays);
  };

  const isSyncing = expensesSync.loading || refundsSync.loading || paydaysSync.loading || categoriesSync.loading;
  const syncError = expensesSync.error || refundsSync.error || paydaysSync.error || categoriesSync.error;

  const filteredExpenses = expenses.filter(exp => 
    exp.heading.toLowerCase().includes(searchTerm.toLowerCase()) || 
    exp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
  }, [filteredExpenses]);

  const pendingRefundsTotal = useMemo(() => {
    return refunds.filter(r => r.status === 'pending').reduce((sum, item) => sum + item.amount, 0);
  }, [refunds]);

  const currentNetBalance = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const totalIncome = paydays.reduce((sum, item) => sum + item.amount, 0);
    return totalIncome - totalExpenses;
  }, [expenses, paydays]);

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] dark:bg-slate-900 font-['Inter',sans-serif] text-gray-900 dark:text-gray-100 overflow-hidden relative selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300">
      
      <LiquidBackground />

      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white/65 dark:bg-slate-800/65 backdrop-blur-xl border-r border-white/40 dark:border-slate-700/40 flex-col flex-shrink-0 z-10 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="px-6 py-8">
          <Link to="/" className="flex items-center gap-3 group">
             <div className="h-8 w-8 bg-black dark:bg-white rounded-[10px] flex items-center justify-center font-bold text-sm text-white dark:text-black shadow-lg shadow-black/20 group-hover:scale-105 transition-transform">E</div>
            <h1 className="font-bold text-xl tracking-tight text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-gray-200 transition-colors">Expensify</h1>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2 mt-2">Menu</div>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === 'dashboard' ? 'bg-white text-black shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100/50 scale-[1.02]' : 'text-gray-500 hover:bg-white/50 hover:text-gray-900'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('spending')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === 'spending' ? 'bg-white text-black shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100/50 scale-[1.02]' : 'text-gray-500 hover:bg-white/50 hover:text-gray-900'}`}
          >
            <Wallet className="w-4 h-4" />
            Spending
          </button>
          <button 
            onClick={() => setActiveTab('refunds')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === 'refunds' ? 'bg-white text-black shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100/50 scale-[1.02]' : 'text-gray-500 hover:bg-white/50 hover:text-gray-900'}`}
          >
            <RefreshCcw className="w-4 h-4" />
            Refunds
            {refunds.filter(r => r.status === 'pending').length > 0 && (
              <span className="ml-auto bg-black text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {refunds.filter(r => r.status === 'pending').length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === 'calendar' ? 'bg-white text-black shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100/50 scale-[1.02]' : 'text-gray-500 hover:bg-white/50 hover:text-gray-900'}`}
          >
            <Calendar className="w-4 h-4" />
            Manage Calendar
          </button>
          
          <div className="pt-8 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Top Categories</div>
          <div className="space-y-0.5 px-1">
            {categories.slice(0, 8).map(c => (
              <button 
                key={c} 
                onClick={() => {
                  setActiveTab('spending');
                  setSearchTerm(searchTerm === c ? '' : c);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm group transition-colors rounded-xl ${searchTerm === c && activeTab === 'spending' ? 'bg-white text-black font-semibold shadow-sm border border-gray-100/50' : 'text-gray-500 hover:text-gray-900 hover:bg-white/40'}`}
              >
                <span className="truncate pr-2">{c}</span>
                <span className="text-xs text-gray-400 group-hover:text-gray-600 font-medium tabular-nums">{expenses.filter(e => e.category === c).length}</span>
              </button>
            ))}
          </div>
        </nav>


        <div className="p-5 border-t border-gray-100/50 dark:border-slate-700/50 space-y-4">
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-4 border border-white/40 dark:border-slate-700/40 shadow-sm">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Current Balance</div>
            <div className={`text-xl font-bold tracking-tight ${currentNetBalance >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-500'}`}>
               {currentNetBalance >= 0 ? '+' : ''}{formatCurrency(currentNetBalance)}
            </div>
          </div>
          <button 
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden z-10">
        {/* Header */}
        <header className="min-h-20 lg:h-24 flex items-center justify-between px-4 sm:px-6 lg:px-10 shrink-0 gap-4">
          <div className="flex items-center gap-6">
            <h2 className="text-[28px] font-bold text-gray-900 dark:text-white tracking-tight">
              {activeTab === 'spending' ? 'Spending' : activeTab === 'calendar' ? 'Calendar' : activeTab === 'refunds' ? 'Refunds' : 'Dashboard'}
            </h2>
            {activeTab === 'spending' && (
              <div className="relative flex items-center ml-2 hidden md:flex">
                 <Search className="h-4 w-4 text-gray-400 absolute left-4" />
                 <input
                    type="text"
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/80 dark:bg-slate-800/80 border-none shadow-[0_2px_8px_rgba(0,0,0,0.03)] rounded-2xl text-sm pl-11 pr-4 py-3 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:outline-none w-64 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                 />
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-full transition-all shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-transparent text-sm font-semibold h-10">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <UserProfileMenu />
          </div>
        </header>

        <div className="lg:hidden px-4 sm:px-6 pb-4 grid grid-cols-4 gap-2">
          {[
            { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
            { id: 'spending', label: 'Spend', icon: Wallet },
            { id: 'refunds', label: 'Refunds', icon: RefreshCcw },
            { id: 'calendar', label: 'Calendar', icon: Calendar },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                className={`h-14 rounded-2xl flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-all ${isActive ? 'bg-white text-black shadow-sm border border-gray-100' : 'bg-white/50 text-gray-500'}`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 px-4 sm:px-6 lg:px-10 pb-10 overflow-y-auto max-w-6xl w-full">
          {activeTab === 'dashboard' ? (
            <DashboardView 
              expenses={expenses}
              refunds={refunds}
              paydays={paydays}
              formatCurrency={formatCurrency}
            />
          ) : activeTab === 'calendar' ? (
            <CalendarView 
              expenses={expenses} 
              paydays={paydays} 
              onAddPayday={(payday) => setPaydays((currentPaydays) => [...currentPaydays, payday])} 
              formatCurrency={formatCurrency} 
            />
          ) : activeTab === 'spending' ? (
            <div className="space-y-6">
              
              <div className="bg-white dark:bg-slate-800 rounded-[24px] shadow-sm border border-gray-100 dark:border-slate-700/50 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-1">Total Spent</div>
                  <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{formatCurrency(totalAmount)}</div>
                </div>
              </div>

              {/* Desktop Always-On Quick Entry / Mobile Toggleable */}
              <div className="bg-white rounded-[24px] shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-bold text-gray-900">New Transaction</h3>
                  </div>
                  <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    <div className="col-span-1 md:col-span-3">
                      <label htmlFor="heading" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Heading</label>
                      <input required id="heading" value={heading} onChange={(e) => setHeading(e.target.value)} type="text" placeholder="e.g. Cafe Mocha" className="w-full bg-[#F5F7FB] border-none rounded-xl text-sm px-4 py-3 outline-none focus:ring-2 focus:ring-gray-200 transition-all placeholder:text-gray-400 font-medium" />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label htmlFor="category" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                      <input required list="category-suggestions" id="category" value={category} onChange={(e) => setCategory(e.target.value)} type="text" placeholder="Select" className="w-full bg-[#F5F7FB] border-none rounded-xl text-sm px-4 py-3 outline-none focus:ring-2 focus:ring-gray-200 transition-all placeholder:text-gray-400 font-medium" />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label htmlFor="amount" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Amount (₹)</label>
                      <input required id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min="0" step="0.01" placeholder="0.00" className="w-full bg-[#F5F7FB] border-none rounded-xl text-sm px-4 py-3 outline-none focus:ring-2 focus:ring-gray-200 transition-all placeholder:text-gray-400 font-medium" />
                    </div>
                    <div className="col-span-1 md:col-span-3">
                      <label htmlFor="description" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                      <input id="description" value={description} onChange={(e) => setDescription(e.target.value)} type="text" placeholder="Optional notes" className="w-full bg-[#F5F7FB] border-none rounded-xl text-sm px-4 py-3 outline-none focus:ring-2 focus:ring-gray-200 transition-all placeholder:text-gray-400 font-medium" />
                    </div>
                    <div className="col-span-1 md:col-span-2 flex items-end">
                      <button type="submit" className="w-full h-[46px] bg-black text-white rounded-xl text-sm font-bold shadow-[0_6px_20px_rgba(0,0,0,0.18)] hover:scale-[1.02] hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Entry
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Transactions List */}
              <div className="mt-8 space-y-3">
                <div className="px-5 py-2 grid grid-cols-12 gap-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-2">Date</div>
                  <div className="col-span-3">Heading</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-3">Notes</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>

                {filteredExpenses.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-sm font-medium">
                      {searchTerm ? "No entries found matching your search." : "No transactions yet. Start tracking above."}
                    </p>
                  </div>
                ) : (
                  filteredExpenses.map((expense) => (
                    <div 
                      key={expense.id} 
                      className="bg-white rounded-[16px] p-4 px-5 grid grid-cols-12 gap-4 items-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-50 hover:-translate-y-[1px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all group cursor-default"
                    >
                      <div className="col-span-2 text-sm text-gray-500 font-medium">
                         {format(new Date(expense.date), 'MMM d, yyyy')}
                      </div>
                      <div className="col-span-3 text-sm font-bold text-gray-900 truncate pr-2">
                        {expense.heading}
                      </div>
                      <div className="col-span-2">
                        <span className="px-3 py-1.5 rounded-full bg-[#F3F4F6] text-gray-600 text-[11px] font-bold tracking-wide">
                          {expense.category}
                        </span>
                      </div>
                      <div className="col-span-3 text-sm text-gray-500 truncate pr-2" title={expense.description}>
                        {expense.description || '-'}
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-3">
                         <span className="text-sm font-bold text-gray-900 tabular-nums">
                          {formatCurrency(expense.amount)}
                         </span>
                         <button 
                            onClick={(e) => handleDeleteExpense(expense.id, e)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 focus:outline-none"
                            aria-label="Delete expense"
                          >
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : activeTab === 'refunds' ? (
            <div className="space-y-6">

              <div className="bg-white dark:bg-slate-800 rounded-[24px] shadow-sm border border-gray-100 dark:border-slate-700/50 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-1">Expected Refunds</div>
                  <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{formatCurrency(pendingRefundsTotal)}</div>
                </div>
              </div>

              {/* Refunds Quick Entry */}
               <div className="bg-white rounded-[24px] shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 to-amber-500" />
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-bold text-gray-900">Track New Refund</h3>
                  </div>
                  <form onSubmit={handleAddRefund} className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    <div className="col-span-1 md:col-span-4">
                      <label htmlFor="refundItem" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Item / Order ID</label>
                      <input required id="refundItem" value={refundItem} onChange={(e) => setRefundItem(e.target.value)} type="text" placeholder="e.g. Shoes Size 10" className="w-full bg-[#F5F7FB] border-none rounded-xl text-sm px-4 py-3 outline-none focus:ring-2 focus:ring-amber-200 transition-all placeholder:text-gray-400 font-medium" />
                    </div>
                    <div className="col-span-1 md:col-span-4">
                      <label htmlFor="refundVendor" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Vendor / Source</label>
                      <input required id="refundVendor" value={refundVendor} onChange={(e) => setRefundVendor(e.target.value)} type="text" placeholder="e.g. Myntra" className="w-full bg-[#F5F7FB] border-none rounded-xl text-sm px-4 py-3 outline-none focus:ring-2 focus:ring-amber-200 transition-all placeholder:text-gray-400 font-medium" />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label htmlFor="refundAmount" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Value (₹)</label>
                      <input required id="refundAmount" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} type="number" min="0" step="0.01" placeholder="0.00" className="w-full bg-[#F5F7FB] border-none rounded-xl text-sm px-4 py-3 outline-none focus:ring-2 focus:ring-amber-200 transition-all placeholder:text-gray-400 font-medium" />
                    </div>
                    <div className="col-span-1 md:col-span-2 flex items-end">
                      <button type="submit" className="w-full h-[46px] bg-black text-white rounded-xl text-sm font-bold shadow-[0_6px_20px_rgba(0,0,0,0.18)] hover:scale-[1.02] hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />
                        Track
                      </button>
                    </div>
                  </form>
                </div>
              </div>

               {/* Refunds List */}
               <div className="mt-8 space-y-3">
                <div className="px-5 py-2 grid grid-cols-12 gap-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-2">Initiated</div>
                  <div className="col-span-4">Item / Order</div>
                  <div className="col-span-2">Source</div>
                  <div className="col-span-2 text-right">Amount</div>
                  <div className="col-span-2 text-center">Status</div>
                </div>

                {refunds.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-sm font-medium">
                      No refunds currently being tracked.
                    </p>
                  </div>
                ) : (
                  refunds.map((refund) => (
                    <div 
                      key={refund.id} 
                      className="bg-white rounded-[16px] p-4 px-5 grid grid-cols-12 gap-4 items-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-50 hover:-translate-y-[1px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all group cursor-default"
                    >
                      <div className="col-span-2 text-sm text-gray-500 font-medium">
                         {format(new Date(refund.dateCancelled), 'MMM d, yyyy')}
                      </div>
                      <div className="col-span-4 text-sm font-bold text-gray-900 truncate pr-2">
                        {refund.item}
                      </div>
                      <div className="col-span-2">
                        <span className="px-3 py-1.5 rounded-full bg-[#F3F4F6] text-gray-600 text-[11px] font-bold tracking-wide">
                          {refund.vendor}
                        </span>
                      </div>
                      <div className="col-span-2 text-sm font-bold text-gray-900 text-right tabular-nums">
                        {formatCurrency(refund.amount)}
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-2 pr-2">
                         <button
                            onClick={(e) => handleToggleRefundStatus(refund.id, e)}
                            className={`inline-flex items-center justify-center gap-1.5 w-full max-w-[100px] py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border shadow-sm ${
                              refund.status === 'received' 
                                ? 'bg-emerald-50/50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {refund.status === 'received' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Clock className="w-3.5 h-3.5 text-amber-500" />}
                            {refund.status === 'received' ? 'Received' : 'Pending'}
                          </button>
                          
                          <button 
                            onClick={(e) => handleDeleteRefund(refund.id, e)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 focus:outline-none flex-shrink-0"
                            aria-label="Delete refund"
                          >
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>
        
        {/* Datalist for category suggestions needs to stay accessible */}
        <datalist id="category-suggestions">
          {categories.map((c, i) => (
            <option key={i} value={c} />
          ))}
        </datalist>
        {(isSyncing || syncError) && (
          <div className={`fixed bottom-4 right-4 z-50 rounded-xl px-4 py-3 text-xs font-semibold shadow-lg ${syncError ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-white text-gray-500 border border-gray-100'}`}>
            {syncError ? 'Offline changes are saved locally. Sync will retry on the next edit.' : 'Syncing account data...'}
          </div>
        )}
      </main>
    </div>
  );
}
