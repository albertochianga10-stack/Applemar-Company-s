
import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell
} from 'recharts';
import { 
  Wallet, TrendingUp, TrendingDown, Landmark, 
  ArrowUpRight, ArrowDownLeft, Target, PieChart 
} from 'lucide-react';
import { Transaction, Product } from '../types';

interface Props {
  transactions: Transaction[];
  products: Product[];
}

const Dashboard: React.FC<Props> = ({ transactions, products }) => {
  const [period, setPeriod] = useState<'HOJE' | 'MENSAL' | 'ANUAL'>('MENSAL');
  const [targetSales, setTargetSales] = useState(1000000); // 1 Milhão Kz meta inicial

  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const taxableIva = transactions.reduce((s, t) => s + (t.taxAmount || 0), 0);

  const formatKz = (val: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val).replace('AOA', 'Kz');
  };

  const goalProgress = Math.min(100, Math.round((totalIncome / targetSales) * 100));

  const chartData = [
    { name: 'Jan', income: 450000, expense: 320000 },
    { name: 'Fev', income: 520000, expense: 410000 },
    { name: 'Mar', income: 480000, expense: 390000 },
    { name: 'Abr', income: 610000, expense: 450000 },
    { name: 'Mai', income: totalIncome > 0 ? totalIncome : 300000, expense: totalExpense > 0 ? totalExpense : 200000 },
  ];

  const handleSetTarget = () => {
    const newTarget = prompt('Defina a nova meta mensal de vendas (Kz):', targetSales.toString());
    if (newTarget && !isNaN(parseFloat(newTarget))) {
      setTargetSales(parseFloat(newTarget));
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Consola de Gestão</h2>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest">
            {period} • Applemar Company Business Unit
          </p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
           {(['HOJE', 'MENSAL', 'ANUAL'] as const).map((p) => (
             <button 
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${period === p ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
             >
               {p}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Saldo em Caixa', value: formatKz(balance), icon: Wallet, color: 'text-slate-900', bg: 'bg-[#d4a373]' },
          { label: 'Total de Entradas', value: formatKz(totalIncome), icon: ArrowUpRight, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Despesas Gerais', value: formatKz(totalExpense), icon: ArrowDownLeft, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'IVA a Pagar', value: formatKz(taxableIva), icon: Landmark, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-default">
            <div className={`${stat.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
              <stat.icon className={stat.color} size={28} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className={`text-2xl font-black mt-2 truncate ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black flex items-center space-x-2">
              <TrendingUp className="text-[#d4a373]" />
              <span>Desempenho de Caixa</span>
            </h3>
            <div className="hidden sm:flex items-center space-x-4 text-xs font-bold">
              <div className="flex items-center"><span className="w-3 h-3 bg-slate-900 rounded-full mr-2"></span> Entradas</div>
              <div className="flex items-center"><span className="w-3 h-3 bg-[#d4a373] rounded-full mr-2"></span> Saídas</div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4a373" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#d4a373" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="income" stroke="#0f172a" strokeWidth={4} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#d4a373" strokeWidth={4} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#d4a373] opacity-20 rounded-full -mr-10 -mt-10 blur-3xl transition-transform group-hover:scale-150"></div>
          <h3 className="text-lg font-black mb-8 flex items-center">
            <Target className="mr-3 text-[#d4a373]" /> 
            <span>Objetivo {period}</span>
          </h3>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-xs font-bold mb-3 uppercase tracking-widest text-slate-400">
                <span>Progresso da Meta</span>
                <span className="text-[#d4a373]">{goalProgress}%</span>
              </div>
              <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-[#d4a373] h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(212,163,115,0.4)]"
                  style={{ width: `${goalProgress}%` }}
                ></div>
              </div>
              <p className="text-[10px] mt-2 text-slate-500 font-bold uppercase">ALVO: {formatKz(targetSales)}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Lucro Bruto</p>
                 <p className="text-lg font-bold mt-1 truncate">{formatKz(balance)}</p>
               </div>
               <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Eficiência</p>
                 <p className="text-lg font-bold mt-1 text-emerald-400">+{goalProgress}%</p>
               </div>
            </div>

            <button 
              onClick={handleSetTarget}
              className="w-full py-4 bg-[#d4a373] text-black font-black rounded-2xl text-sm shadow-xl hover:translate-y-[-2px] hover:shadow-[#d4a373]/20 transition-all active:scale-95"
            >
              AJUSTAR METAS
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black mb-6 flex items-center">
            <PieChart className="mr-2 text-indigo-500" /> Distribuição Financeira
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Receitas', val: totalIncome > 0 ? `${Math.round((totalIncome/(totalIncome+totalExpense))*100)}%` : '0%', color: 'bg-emerald-500' },
              { label: 'Custos Fixos', val: totalExpense > 0 ? `${Math.round((totalExpense/(totalIncome+totalExpense))*100)}%` : '0%', color: 'bg-rose-500' },
              { label: 'Impostos (IVA)', val: taxableIva > 0 ? '14%' : '0%', color: 'bg-amber-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center">
                  <div className={`w-3 h-3 ${item.color} rounded-full mr-3 shadow-sm`}></div>
                  <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{item.label}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{item.val}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <h3 className="text-xl font-black mb-6">Próximos Pagamentos</h3>
           <div className="space-y-4">
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex justify-between items-center group cursor-pointer hover:shadow-md transition-all">
                <div>
                  <p className="text-sm font-bold text-slate-900">Fornecedores</p>
                  <p className="text-xs text-rose-500 font-bold uppercase tracking-widest">Vence em 48h</p>
                </div>
                <p className="font-black text-rose-600">120.000 Kz</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center group cursor-pointer hover:shadow-md transition-all">
                <div>
                  <p className="text-sm font-bold text-slate-900">Salários Staff</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Próximo Dia 25</p>
                </div>
                <p className="font-black text-slate-900">450.000 Kz</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
