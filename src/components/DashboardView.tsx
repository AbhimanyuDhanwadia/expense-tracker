import React, { useMemo } from 'react';
import { Expense, Refund, Payday } from '../types';
import { format, isSameMonth } from 'date-fns';
import { Clock, TrendingDown, TrendingUp } from 'lucide-react';

interface DashboardViewProps {
  expenses: Expense[];
  refunds: Refund[];
  paydays: Payday[];
  formatCurrency: (amount: number) => string;
}

export default function DashboardView({ expenses, refunds, paydays, formatCurrency }: DashboardViewProps) {
  const currentDate = new Date();

  const currentMonthExpenses = useMemo(() => {
    return expenses.filter(e => isSameMonth(new Date(e.date), currentDate));
  }, [expenses, currentDate]);

  const currentMonthPaydays = useMemo(() => {
    return paydays.filter(p => isSameMonth(new Date(p.date), currentDate));
  }, [paydays, currentDate]);

  const totalSpentThisMonth = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncomeThisMonth = currentMonthPaydays.reduce((sum, p) => sum + p.amount, 0);
  const totalPendingRefunds = refunds.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);
  
  const netBalanceThisMonth = totalIncomeThisMonth - totalSpentThisMonth;

  // Recent 5 transactions (expenses + refunds)
  const recentActivity = useMemo(() => {
    const allActivity = [
      ...expenses.map(e => ({ type: 'expense' as const, id: e.id, date: e.date, title: e.heading, amount: e.amount, detail: e.category })),
      ...refunds.filter(r => r.status === 'received').map(r => ({ type: 'refund' as const, id: r.id, date: r.dateCancelled, title: r.item, amount: r.amount, detail: r.vendor }))
    ];
    return allActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);
  }, [expenses, refunds]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm">
           <div className="text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-2">Net Balance (This Month)</div>
           <div className={`text-3xl font-bold tracking-tight ${netBalanceThisMonth >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-500'}`}>
             {netBalanceThisMonth >= 0 ? '+' : ''}{formatCurrency(netBalanceThisMonth)}
           </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm">
           <div className="text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-2">Spent (This Month)</div>
           <div className="text-3xl font-bold tracking-tight text-red-500">
             {formatCurrency(totalSpentThisMonth)}
           </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm">
           <div className="text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-2">Income (This Month)</div>
           <div className="text-3xl font-bold tracking-tight text-emerald-500">
             {formatCurrency(totalIncomeThisMonth)}
           </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm">
           <div className="text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-2">Expected Refunds</div>
           <div className="text-3xl font-bold tracking-tight text-indigo-500">
             {formatCurrency(totalPendingRefunds)}
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[24px] border border-gray-100 dark:border-slate-700/50 shadow-sm p-6 max-w-4xl">
         <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider">Recent Activity</h3>
         {recentActivity.length > 0 ? (
           <div className="space-y-4">
             {recentActivity.map(activity => (
               <div key={`${activity.type}-${activity.id}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${activity.type === 'expense' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    {activity.type === 'expense' ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{activity.title}</p>
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-0.5">{activity.detail} • {format(new Date(activity.date), 'MMM d, yyyy')}</p>
                  </div>
                  <div className={`font-bold text-sm tabular-nums text-right ${activity.type === 'expense' ? 'text-gray-900 dark:text-white' : 'text-emerald-500'}`}>
                    {activity.type === 'expense' ? '-' : '+'}{formatCurrency(activity.amount)}
                  </div>
               </div>
             ))}
           </div>
         ) : (
           <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Clock className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-sm">No recent activity.</p>
           </div>
         )}
      </div>
    </div>
  );
}
