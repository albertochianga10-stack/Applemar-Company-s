import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Package, 
  Users, 
  FilePieChart, 
  Sparkles, 
  Menu, 
  X,
  LogOut,
  Bell,
  ArrowDownLeft,
  User,
  Lock,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { AppView, Product, Transaction, Customer } from './types.ts';
import { storageService } from './services/storageService.ts';

// View Components
import Dashboard from './components/Dashboard.tsx';
import FinancialFlow from './components/FinancialFlow.tsx';
import Expenses from './components/Expenses.tsx';
import Inventory from './components/Inventory.tsx';
import Customers from './components/Customers.tsx';
import Reports from './components/Reports.tsx';
import AIInsights from './components/AIInsights.tsx';

const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-magenta-600/20 rounded-full blur-[120px] animate-pulse" style={{ backgroundColor: 'rgba(255, 0, 255, 0.15)' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[100px]" style={{ backgroundColor: 'rgba(212, 163, 115, 0.1)' }}></div>
      
      <div className="relative z-10 w-full max-w-[400px] px-8 py-12 flex flex-col items-center">
        <h1 className="text-4xl font-light tracking-[0.4em] text-white mb-20 italic animate-fade-in">
          APPLEMAR
        </h1>

        <div className="w-full space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="relative border-b border-white/20 pb-2 group focus-within:border-[#d4a373] transition-colors">
            <User className="absolute left-0 bottom-3 text-white/40 group-focus-within:text-[#d4a373]" size={18} />
            <input 
              type="text" 
              placeholder="USERNAME" 
              autoComplete="username"
              className="w-full bg-transparent pl-8 pr-4 py-2 text-white text-xs font-bold tracking-widest outline-none placeholder:text-white/30 uppercase"
            />
          </div>

          <div className="relative border-b border-white/20 pb-2 group focus-within:border-[#d4a373] transition-colors">
            <div className="absolute left-0 bottom-3 w-5 h-5 flex items-center justify-center bg-white/10 rounded-full">
              <Lock className="text-white/60" size={10} />
            </div>
            <input 
              type="password" 
              placeholder="•••••" 
              autoComplete="current-password"
              className="w-full bg-transparent pl-8 pr-4 py-2 text-white text-lg tracking-[0.3em] outline-none placeholder:text-white/30"
            />
          </div>

          <div className="relative border-b border-white/20 pb-2 group cursor-pointer hover:border-white/40 transition-colors">
            <MapPin className="absolute left-0 bottom-3 text-white/40" size={18} />
            <div className="w-full pl-8 pr-4 py-2 flex justify-between items-center">
              <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase">Select Location</span>
              <ChevronDown className="text-white/40" size={14} />
            </div>
          </div>

          <button 
            onClick={onLogin}
            className="w-full bg-white py-4 mt-4 rounded-xl text-black text-xs font-black tracking-[0.2em] uppercase shadow-2xl hover:bg-slate-200 active:scale-95 transition-all"
          >
            LOGIN
          </button>

          <div className="flex flex-col items-center space-y-4 pt-4">
            <button className="text-[10px] text-white/30 font-bold tracking-widest hover:text-white transition-colors">
              Forgot my password?
            </button>
            <div className="text-[10px] font-bold tracking-widest">
              <span className="text-white/30">NOT A MEMBER? </span>
              <button className="text-white hover:text-[#d4a373] transition-colors">REGISTER</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 text-[8px] text-white/10 font-bold tracking-widest uppercase">
        © 2025 Applemar Company Lda • Angola Business Management
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

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
        border-r border-white/5 print:hidden
      `}>
        <div className="p-8 flex flex-col h-full">
          <div className="mb-12 flex items-center justify-between">
            <h1 className="text-2xl font-light tracking-[0.3em] text-white uppercase italic">
              APPLE<span className="text-[#d4a373] font-bold">MAR</span>
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
              onClick={() => setIsLoggedIn(false)}
              className="w-full flex items-center space-x-3 px-5 py-4 text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all"
            >
              <LogOut size={20} />
              <span className="text-sm font-semibold">Sair do Sistema</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between z-10 print:hidden">
          <div className="flex items-center space-x-4">
            <button className="lg:hidden p-2.5 bg-slate-100 rounded-xl text-slate-600" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Unidade Angola</h2>
              <p className="text-slate-900 font-extrabold text-sm uppercase italic tracking-tighter">Applemar Management Console</p>
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

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-10 bg-slate-50 print:bg-white print:p-0">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;