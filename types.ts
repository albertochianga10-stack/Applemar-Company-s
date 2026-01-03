
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  FINANCIAL = 'FINANCIAL', // Global transactions (Income/Expense)
  EXPENSES = 'EXPENSES',   // Specific operational costs
  INVENTORY = 'INVENTORY',
  CUSTOMERS = 'CUSTOMERS',
  REPORTS = 'REPORTS',
  AI_INSIGHTS = 'AI_INSIGHTS'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  costPrice: number; // Added to calculate profit
  image?: string;
}

export interface Customer {
  id: string;
  name: string;
  nif: string;
  phone: string;
  email: string;
}

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  timestamp: number;
  paymentMethod: 'CASH' | 'MULTICAIXA' | 'TRANSFER';
  isTaxable?: boolean; // For IVA calculation
  taxAmount?: number;
  status: 'PAID' | 'PENDING';
}

export interface Sale extends Transaction {
  items: SaleItem[];
  customerId?: string;
}

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}
