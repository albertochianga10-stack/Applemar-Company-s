
import React, { useState } from 'react';
import { 
  FileText, Download, Search, Calendar, Filter, Trash2, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';
import { Transaction, Product } from '../types';

interface Props {
  transactions: Transaction[];
  products: Product[];
  onUpdate: (transactions: Transaction[]) => void;
}

const Reports: React.FC<Props> = ({ transactions, products, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  const formatKz = (val: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val).replace('AOA', 'Kz');
  };

  const filtered = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((s,t) => s+t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((s,t) => s+t.amount, 0);

  const exportPDF = () => {
    window.print();
  };

  const deleteTransaction = (id: string) => {
    if(confirm('Atenção Applemar: A remoção deste registo irá alterar o saldo global da empresa. Continuar?')) {
      onUpdate(transactions.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 print:hidden">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Central de Relatórios</h2>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest">Auditoria & Balanços Fiscais</p>
        </div>
        <button 
          onClick={exportPDF}
          className="flex items-center space-x-3 bg-[#d4a373] text-black px-8 py-4 rounded-2xl font-black shadow-xl hover:shadow-[#d4a373]/30 transition-all active:scale-95"
        >
          <Download size={20} strokeWidth={2.5} />
          <span>EXPORTAR PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-2">
         {[
           { label: 'Fluxo Bruto', value: formatKz(totalIncome), icon: ArrowUpRight, color: 'text-emerald-600' },
           { label: 'Custos Totais', value: formatKz(totalExpense), icon: ArrowDownLeft, color: 'text-rose-600' },
           { label: 'Saldo de Exercício', value: formatKz(totalIncome - totalExpense), icon: FileText, color: 'text-slate-900' },
           { label: 'IVA Retido', value: formatKz(transactions.reduce((s,t) => s+(t.taxAmount||0), 0)), icon: Calendar, color: 'text-amber-600' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm print:border-slate-300">
             <div className="flex items-center justify-between mb-4">
                <stat.icon className={stat.color} size={20} strokeWidth={3} />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{stat.label}</span>
             </div>
             <p className={`text-2xl font-black truncate ${stat.color}`}>{stat.value}</p>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden print:border-none print:shadow-none">
        <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-6 print:hidden bg-slate-50/50">
           <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic shrink-0">Lançamentos de Diário</h3>
           <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="ID, Descrição, Categoria..." 
                  className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#d4a373] shadow-sm transition-all"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex bg-white border border-slate-200 rounded-2xl p-1 shadow-sm shrink-0">
                 {(['ALL', 'INCOME', 'EXPENSE'] as const).map(type => (
                   <button 
                     key={type}
                     onClick={() => setFilterType(type)}
                     className={`px-4 py-2.5 text-[9px] font-black rounded-xl transition-all uppercase tracking-widest ${filterType === type ? 'bg-black text-white' : 'text-slate-400 hover:text-black'}`}
                   >
                     {type === 'ALL' ? 'Tudo' : type === 'INCOME' ? 'Entradas' : 'Saídas'}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Referência / Lançamento</th>
                <th className="px-8 py-6">Tipo</th>
                <th className="px-8 py-6">Data & Hora</th>
                <th className="px-8 py-6">Pagamento</th>
                <th className="px-8 py-6 text-right">Montante</th>
                <th className="px-8 py-6 text-right print:hidden">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="font-mono text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">#{item.id}</span>
                    <p className="text-sm font-black text-slate-900 mt-1">{item.description}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.category}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      item.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                      {item.type === 'INCOME' ? 'Crédito' : 'Débito'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-[11px] text-slate-500 font-bold">
                    {new Date(item.timestamp).toLocaleString('pt-AO')}
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black text-slate-400 border border-slate-200 px-3 py-1.5 rounded-xl uppercase shadow-sm">
                      {item.paymentMethod}
                    </span>
                  </td>
                  <td className={`px-8 py-5 text-right font-black text-sm ${
                    item.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {item.type === 'INCOME' ? '+' : '-'}{formatKz(item.amount)}
                  </td>
                  <td className="px-8 py-5 text-right print:hidden">
                    <button 
                      onClick={() => deleteTransaction(item.id)} 
                      className="p-2.5 bg-slate-50 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center text-slate-300 font-black uppercase tracking-widest italic animate-pulse">
                    Nenhum registo compatível com a busca.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
