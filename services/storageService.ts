
import { Product, Transaction, Customer } from '../types';

const KEYS = {
  PRODUCTS: 'applemar_products',
  TRANSACTIONS: 'applemar_transactions',
  CUSTOMERS: 'applemar_customers'
};

export const storageService = {
  saveProducts: (products: Product[]) => {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },
  getProducts: (): Product[] => {
    const data = localStorage.getItem(KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },

  saveTransactions: (transactions: Transaction[]) => {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },
  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },

  saveCustomers: (customers: Customer[]) => {
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
  },
  getCustomers: (): Customer[] => {
    const data = localStorage.getItem(KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : [];
  },

  clearAll: () => {
    if (confirm('Atenção: Todos os dados financeiros serão apagados permanentemente. Deseja continuar?')) {
      localStorage.clear();
      window.location.reload();
    }
  }
};
