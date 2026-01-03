
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Receipt,
  Package, 
  Users, 
  FilePieChart, 
  Sparkles, 
  Menu, 
  X,
  LogOut,
  Bell,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { AppView, Product, Transaction, Customer, Sale } from './types';
import { storageService } from './services/storageService';

// View Components
import Dashboard from './components/Dashboard';
import FinancialFlow from './components/FinancialFlow';
import Expenses from './components/Expenses';
import Inventory from './components/Inventory';
import Customers from './components/Customers';
import Reports from './components/Reports';
import AIInsights from './components/AIInsights';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    setProducts(storageService.getProducts());
    setTransactions(storageService.getTransactions());
    setCustomers(storageService.getCustomers());
  }, []);

  useEffect(() => storageService.saveProducts(products), [products]);
  useEffect(() => storageService.saveTransactions(transactions), [transactions]);
  useEffect(() => storageService.saveCustomers(customers), [customers]);

  const navItems = [
    { id: AppView.DASHBOARD, label: 'Painel Financeiro', icon: LayoutDashboard },
    { id: AppView.FINANCIAL, label: 'Fluxo de Caixa', icon: Wallet },
    { id: AppView.EXPENSES, label: 'Gestão de Custos', icon: ArrowDownLeft },
    { id: AppView.INVENTORY, label: 'Stock & Logística', icon: Package },
    { id: AppView.CUSTOMERS, label: 'CRM Clientes', icon: Users },
    { id: AppView.REPORTS, label: 'Relatórios & PDF', icon: FilePieChart },
    { id: AppView.AI_INSIGHTS, label: 'Consultoria AI', icon: Sparkles },
  ];

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD: return <Dashboard transactions={transactions} products={products} />;
      case AppView.FINANCIAL: return <FinancialFlow transactions={transactions} customers={customers} products={products} onUpdate={setTransactions} onProductsUpdate={setProducts} />;
      case AppView.EXPENSES: return <Expenses transactions={transactions} onUpdate={setTransactions} />;
      case AppView.INVENTORY: return <Inventory products={products} setProducts={setProducts} />;
      case AppView.CUSTOMERS: return <Customers customers={customers} setCustomers={setCustomers} />;
      case AppView.REPORTS: return <Reports transactions={transactions} products={products} onUpdate={setTransactions} />;
      case AppView.AI_INSIGHTS: return <AIInsights transactions={transactions} products={products} />;
      default: return <Dashboard transactions={transactions} products={products} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-20 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-[#0a0a0a] text-white z-30 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        border-r border-white/5
      `}>
        <div className="p-8 flex flex-col h-full">
          <div className="mb-12 flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              APPLE<span className="text-[#d4a373]">MAR</span>
            </h1>
            <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3.5 px-5 py-4 rounded-2xl transition-all duration-200 ${
                  currentView === item.id 
                    ? 'bg-[#d4a373] text-black font-bold shadow-xl shadow-[#d4a373]/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={20} strokeWidth={2.5} />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10">
            <button 
              onClick={() => storageService.clearAll()}
              className="w-full flex items-center space-x-3 px-5 py-4 text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all"
            >
              <LogOut size={20} />
              <span className="text-sm font-semibold">Sair / Reset</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between z-10">
          <div className="flex items-center space-x-4">
            <button className="lg:hidden p-2.5 bg-slate-100 rounded-xl text-slate-600" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Empresa Ativa</h2>
              <p className="text-slate-900 font-extrabold text-sm">APPLEMAR COMPANY LDA</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
             <div className="hidden lg:flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Status Angola</span>
                <span className="flex items-center text-xs font-bold text-emerald-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                  SISTEMA CERTIFICADO
                </span>
             </div>
            <button className="relative p-2.5 text-slate-400 hover:text-[#d4a373] transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-10 rounded-2xl bg-slate-900 border-2 border-slate-200 flex items-center justify-center text-white font-black text-xs shadow-lg">
              AC
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-10">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
