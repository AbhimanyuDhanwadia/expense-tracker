export interface Expense {
  id: string;
  heading: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Payday {
  id: string;
  source: string;
  amount: number;
  date: string;
}

export interface Refund {
  id: string;
  item: string;
  vendor: string;
  amount: number;
  dateCancelled: string;
  status: 'pending' | 'received';
}
