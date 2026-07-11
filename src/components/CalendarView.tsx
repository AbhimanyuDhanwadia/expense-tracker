import React, { useMemo, useState } from 'react';
import { addMonths, addWeeks, endOfWeek, format, isSameMonth, isSameWeek, parseISO, startOfWeek, subMonths, subWeeks } from 'date-fns';
import { Expense, Payday } from '../types';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CalendarViewProps {
  expenses: Expense[];
  paydays: Payday[];
  onAddPayday: (payday: Payday) => void;
  formatCurrency: (amount: number) => string;
}

export default function CalendarView({ expenses, paydays, onAddPayday, formatCurrency }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Payday Form State
  const [showPaydayForm, setShowPaydayForm] = useState(false);
  const [paydaySource, setPaydaySource] = useState('');
  const [paydayAmount, setPaydayAmount] = useState('');
  const [paydayDate, setPaydayDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleNext = () => {
    setCurrentDate(prev => viewMode === 'monthly' ? addMonths(prev, 1) : addWeeks(prev, 1));
  };

  const handlePrev = () => {
    setCurrentDate(prev => viewMode === 'monthly' ? subMonths(prev, 1) : subWeeks(prev, 1));
  };

  const handleAddPayday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paydaySource || !paydayAmount || !paydayDate) return;

    onAddPayday({
      id: uuidv4(),
      source: paydaySource,
      amount: parseFloat(paydayAmount),
      date: parseISO(paydayDate).toISOString()
    });
    setPaydaySource('');
    setPaydayAmount('');
    setPaydayDate(format(new Date(), 'yyyy-MM-dd'));
    setShowPaydayForm(false);
  };

  // Filter items for the selected period
  const periodExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return viewMode === 'monthly' 
        ? isSameMonth(expDate, currentDate) 
        : isSameWeek(expDate, currentDate);
    });
  }, [expenses, currentDate, viewMode]);

  const periodPaydays = useMemo(() => {
    return paydays.filter(pd => {
      const pdDate = new Date(pd.date);
      return viewMode === 'monthly' 
        ? isSameMonth(pdDate, currentDate) 
        : isSameWeek(pdDate, currentDate);
    });
  }, [paydays, currentDate, viewMode]);

  const totalExpenses = periodExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = periodPaydays.reduce((sum, p) => sum + p.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  const periodLabel = viewMode === 'monthly' 
    ? format(currentDate, 'MMMM yyyy')
    : `${format(startOfWeek(currentDate), 'MMM d')} - ${format(endOfWeek(currentDate), 'MMM d, yyyy')}`;

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-[24px] shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-slate-700/50 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center bg-gray-100/50 dark:bg-slate-900/50 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'monthly' ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'weekly' ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            Weekly
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handlePrev} className="p-2 bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all">
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="w-48 text-center flex items-center justify-center gap-2">
            <CalendarIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="font-bold text-gray-900 dark:text-white">{periodLabel}</span>
          </div>
          <button onClick={handleNext} className="p-2 bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all">
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <button 
          onClick={() => setShowPaydayForm(!showPaydayForm)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Payday
        </button>  
      </div>

      {/* Payday Form */}
      {showPaydayForm && (
        <form onSubmit={handleAddPayday} className="bg-white dark:bg-slate-800 rounded-[24px] shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-emerald-100 dark:border-emerald-900 overflow-hidden p-6 md:p-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Record Income / Payday</h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="col-span-1 md:col-span-4">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Source</label>
              <input required value={paydaySource} onChange={(e) => setPaydaySource(e.target.value)} type="text" placeholder="e.g. Salary" className="w-full bg-[#F5F7FB] dark:bg-slate-900 border-none rounded-xl text-sm px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 transition-all text-gray-900 dark:text-white" />
            </div>
            <div className="col-span-1 md:col-span-3">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Amount (₹)</label>
              <input required value={paydayAmount} onChange={(e) => setPaydayAmount(e.target.value)} type="number" min="0" step="0.01" placeholder="0.00" className="w-full bg-[#F5F7FB] dark:bg-slate-900 border-none rounded-xl text-sm px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 transition-all text-gray-900 dark:text-white" />
            </div>
            <div className="col-span-1 md:col-span-3">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Date</label>
              <input required value={paydayDate} onChange={(e) => setPaydayDate(e.target.value)} type="date" className="w-full bg-[#F5F7FB] dark:bg-slate-900 border-none rounded-xl text-sm px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 transition-all text-gray-900 dark:text-white" />
            </div>
            <div className="col-span-1 md:col-span-2 flex items-end">
              <button type="submit" className="w-full h-[46px] bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-[0_6px_20px_rgba(16,185,129,0.2)] transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-1">Total Income</div>
              <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{formatCurrency(totalIncome)}</div>
            </div>
            <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-500">
               <TrendingUp className="w-6 h-6" />
            </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-1">Total Expenses</div>
              <div className="text-2xl font-bold tracking-tight text-red-600 dark:text-red-400">{formatCurrency(totalExpenses)}</div>
            </div>
            <div className="h-12 w-12 bg-red-50 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-red-500">
               <TrendingDown className="w-6 h-6" />
            </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-1">Net Balance</div>
              <div className={`text-2xl font-bold tracking-tight ${netBalance >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'}`}>
                 {netBalance >= 0 ? '+' : ''}{formatCurrency(netBalance)}
              </div>
            </div>
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${netBalance >= 0 ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500' : 'bg-red-50 dark:bg-red-900/30 text-red-500'}`}>
               <Wallet className="w-6 h-6" />
            </div>
        </div>
      </div>

      {/* Detail Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        
        {/* Income Items */}
        <div className="bg-white dark:bg-slate-800 rounded-[24px] border border-gray-100 dark:border-slate-700/50 shadow-sm p-6 overflow-hidden flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Income & Paydays</h3>
          {periodPaydays.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <DollarSign className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-sm font-medium">No income recorded for this period.</p>
            </div>
          ) : (
            <div className="space-y-3">
               {[...periodPaydays].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(payday => (
                 <div key={payday.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{payday.source}</p>
                      <p className="text-[11px] font-bold text-gray-500">{format(new Date(payday.date), 'MMM d, yyyy')}</p>
                    </div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      +{formatCurrency(payday.amount)}
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>

        {/* Expense Items */}
        <div className="bg-white dark:bg-slate-800 rounded-[24px] border border-gray-100 dark:border-slate-700/50 shadow-sm p-6 overflow-hidden flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Top Expenses</h3>
          {periodExpenses.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <TrendingDown className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-sm font-medium">No expenses recorded for this period.</p>
            </div>
          ) : (
            <div className="space-y-3">
               {[...periodExpenses].sort((a,b) => b.amount - a.amount).slice(0, 8).map(exp => (
                 <div key={exp.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{exp.heading}</p>
                      <div className="flex items-center gap-2">
                         <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{exp.category}</span>
                         <span className="text-[11px] text-gray-400">• {format(new Date(exp.date), 'MMM d')}</span>
                      </div>
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white text-sm tabular-nums text-right shrink-0">
                      -{formatCurrency(exp.amount)}
                    </div>
                 </div>
               ))}
               {periodExpenses.length > 8 && (
                 <div className="text-center pt-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase">And {periodExpenses.length - 8} more...</span>
                 </div>
               )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
