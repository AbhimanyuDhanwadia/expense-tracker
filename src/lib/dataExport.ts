import { format } from 'date-fns';
import { Expense, Payday, Refund } from '../types';

type ExportRow = Record<string, string | number>;

function escapeCsvValue(value: string | number) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function toCsv(rows: ExportRow[]) {
  if (rows.length === 0) return '';

  const headers = Object.keys(rows[0]);
  const body = rows.map((row) => headers.map((header) => escapeCsvValue(row[header] ?? '')).join(','));

  return [headers.join(','), ...body].join('\n');
}

export function exportTrackerData(expenses: Expense[], refunds: Refund[], paydays: Payday[]) {
  const rows: ExportRow[] = [
    ...expenses.map((expense) => ({
      Type: 'Expense',
      Date: format(new Date(expense.date), 'yyyy-MM-dd HH:mm'),
      Title: expense.heading,
      Source: expense.category,
      Description: expense.description,
      Amount: expense.amount,
      Status: '',
    })),
    ...refunds.map((refund) => ({
      Type: 'Refund',
      Date: format(new Date(refund.dateCancelled), 'yyyy-MM-dd HH:mm'),
      Title: refund.item,
      Source: refund.vendor,
      Description: '',
      Amount: refund.amount,
      Status: refund.status,
    })),
    ...paydays.map((payday) => ({
      Type: 'Income',
      Date: format(new Date(payday.date), 'yyyy-MM-dd HH:mm'),
      Title: payday.source,
      Source: payday.source,
      Description: '',
      Amount: payday.amount,
      Status: '',
    })),
  ].sort((a, b) => new Date(String(b.Date)).getTime() - new Date(String(a.Date)).getTime());

  const dateStr = format(new Date(), 'yyyy-MM-dd');
  downloadTextFile(`expense-tracker-export-${dateStr}.csv`, toCsv(rows), 'text/csv;charset=utf-8');
}
