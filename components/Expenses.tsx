
import React, { useState } from 'react';
import { 
  ArrowDownLeft, Plus, Search, Tag, Calendar, 
  Banknote, CreditCard, Landmark, Trash2 
} from 'lucide-react';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
  onUpdate: (transactions: Transaction[]) => void;
}

const Expenses: React.FC<Props> = ({ transactions, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExp, setNewExp] = useState({
    description: '',
    amount: '',
    category: 'Operacional',
    paymentMethod: 'CASH' as any
  });

  const expenses = transactions.filter(t => t.type === 'EXPENSE');

  const formatKz = (val: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val).replace('AOA', 'Kz');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trans: Transaction = {
      id: `E-${Date.now()}`,
      type: 'EXPENSE',
      category: newExp.category,
      description: newExp.description,
      amount: parseFloat(newExp.amount),
      timestamp: Date.now(),
      paymentMethod: newExp.paymentMethod,
      status: 'PAID'
    };
    onUpdate([trans, ...transactions]);
    setIsModalOpen(false);
    setNewExp({ description: '', amount: '', category: 'Operacional', paymentMethod: 'CASH' });
  };

  const deleteExpense = (id: string) => {
    if(confirm('Eliminar registo de despesa?')) {
      onUpdate(transactions.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Custos</h2>
          <p className="text-slate-500 font-medium">Controlo total de saídas, salários e contas operacionais.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-3 bg-rose-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95"
        >
          <ArrowDownLeft size={22} />
          <span>Registar Saída</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
               <Tag className="text-rose-600" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Custo Total (Mês)</p>
            <p className="text-3xl font-black text-slate-900">{formatKz(expenses.reduce((s,e) => s + e.amount, 0))}</p>
         </div>
         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
               <Calendar className="text-blue-600" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Frequência de Saída</p>
            <p className="text-3xl font-black text-slate-900">{expenses.length} Trans.</p>
         </div>
         <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
               <ArrowDownLeft className="text-[#d4a373]" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Maior Categoria</p>
            <p className="text-2xl font-black">Operacional</p>
         </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Descrição / Motivo</th>
                <th className="px-8 py-6">Categoria</th>
                <th className="px-8 py-6">Data</th>
                <th className="px-8 py-6 text-right">Valor Retirado</th>
                <th className="px-8 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                       <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center mr-4">
                          <ArrowDownLeft size={14} className="text-rose-600" />
                       </div>
                       <span className="font-bold text-slate-800 text-sm">{exp.description}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-400 font-medium">
                    {new Date(exp.timestamp).toLocaleDateString('pt-AO')}
                  </td>
                  <td className="px-8 py-5 text-right font-black text-rose-600">
                    -{formatKz(exp.amount)}
                  </td>
                  <td className="px-8 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => deleteExpense(exp.id)} className="p-2 text-slate-300 hover:text-rose-600">
                       <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center text-slate-300 italic font-medium">
                    Sem registos de despesas até ao momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl">
            <div className="flex items-center space-x-4 mb-8">
               <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
                  <ArrowDownLeft className="text-white" size={24} />
               </div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Nova Despesa</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Descrição do Gasto</label>
                <input required type="text" className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-rose-600 text-sm font-bold" placeholder="Ex: Renda Mensal Applemar" value={newExp.description} onChange={e => setNewExp({...newExp, description: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Valor (Kz)</label>
                   <input required type="number" className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-rose-600 text-sm font-bold" placeholder="0.00" value={newExp.amount} onChange={e => setNewExp({...newExp, amount: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Categoria</label>
                   <select className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-rose-600 text-sm font-bold" value={newExp.category} onChange={e => setNewExp({...newExp, category: e.target.value})}>
                      <option>Salários</option>
                      <option>Renda</option>
                      <option>Logística</option>
                      <option>Marketing</option>
                      <option>Impostos</option>
                      <option>Outros</option>
                   </select>
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Forma de Pagamento</label>
                <div className="grid grid-cols-3 gap-3">
                   {[
                     { id: 'CASH', icon: Banknote, label: 'Kz' },
                     { id: 'MULTICAIXA', icon: CreditCard, label: 'TPA' },
                     { id: 'TRANSFER', icon: Landmark, label: 'Transf' },
                   ].map(method => (
                     <button
                       key={method.id}
                       type="button"
                       onClick={() => setNewExp({...newExp, paymentMethod: method.id})}
                       className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                         newExp.paymentMethod === method.id ? 'bg-rose-600 text-white border-rose-600 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-400'
                       }`}
                     >
                       <method.icon size={20} />
                       <span className="text-[10px] font-black mt-2 uppercase">{method.label}</span>
                     </button>
                   ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 text-sm font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">Voltar</button>
                <button type="submit" className="flex-1 py-5 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl hover:bg-rose-600 transition-all">Registar Gasto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
